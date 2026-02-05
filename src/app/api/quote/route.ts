import { NextRequest, NextResponse } from "next/server"
import { sendEmailSafe } from "@/lib/email/client"
import { logEmailResult } from "@/lib/email/logger"
import { escapeHtml, escapeEmailHref, escapeTelHref } from "@/lib/sanitize"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { generateApprovalToken, getTokenExpiration } from "@/lib/tokens"
import { renderToBuffer } from "@react-pdf/renderer"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import { format } from "date-fns"
import { classifyDelivery } from "@/lib/postcode"
import { getDiscountPercentage, getQuoteExpiry } from "@/lib/quote"
import { detectExceptions, generateFlagsHtml, generateFlagsText } from "@/lib/quote-flags"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { put } from "@vercel/blob"
import { eq } from "drizzle-orm"

// Lead time priority order (higher index = longer time)
const LEAD_TIME_ORDER = [
  "In Stock",
  "1 week",
  "1-2 weeks",
  "2-3 weeks",
  "2-4 weeks",
  "3-4 weeks",
  "4-6 weeks",
  "6-8 weeks",
  "8+ weeks",
]

/**
 * Calculate the overall lead time for a quote (longest item wins)
 * Returns the longest lead time across all items
 */
function calculateOverallLeadTime(items: QuoteItem[]): string | undefined {
  let longestIndex = -1
  let longestLeadTime: string | undefined

  for (const item of items) {
    if (!item.leadTime) continue

    // Find the index in our priority order
    const idx = LEAD_TIME_ORDER.findIndex((lt) =>
      item.leadTime?.toLowerCase().includes(lt.toLowerCase())
    )

    if (idx > longestIndex) {
      longestIndex = idx
      longestLeadTime = item.leadTime
    } else if (idx === -1 && !longestLeadTime) {
      // If lead time doesn't match known patterns, still use it if nothing else
      longestLeadTime = item.leadTime
    }
  }

  return longestLeadTime
}

// ============================================
// DEV MODE BYPASS
// ============================================
// IMPORTANT: These checks are ONLY for local development.
// In production (NODE_ENV !== 'development'), all security
// features (Turnstile, email) are REQUIRED.
// ============================================
const IS_DEV = process.env.NODE_ENV === "development"

// Generate quote number: QR-YYYYMMDD-XXX
function generateQuoteNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `QR-${date}-${random}`
}

interface CustomSpecs {
  pipeOd: string
  rubberMaterial: 'EPDM' | 'NBR' | 'Viton'
  pressure: string
  notes?: string
}

interface CustomSizeRequest {
  requestedSize: string
  additionalSpecs?: string
  isCustomRequest: true
}

interface QuoteItem {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  quantity: number
  materialTestCert?: boolean
  variation?: {
    sku: string
    sizeLabel: string
    price?: number
  }
  customSpecs?: CustomSpecs
  customSizeRequest?: CustomSizeRequest
  leadTime?: string // e.g., "2-3 weeks", "In Stock"
}

interface Address {
  street: string
  suburb: string
  state: string
  postcode: string
}

interface QuoteFormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: Address
  billingAddress: Address
  notes?: string
  items: QuoteItem[]
  totals: {
    itemCount: number
    pricedTotal: number
    savings: number
    hasUnpricedItems: boolean
    certFee?: number
    certCount?: number
  }
  turnstileToken?: string
  // Custom/Non-Standard Request Flag
  requiresReview?: boolean
  customRequestNotes?: string
}

function getItemSKU(item: QuoteItem): string {
  return item.variation?.sku || item.sku
}

/**
 * Generate the review alert HTML for custom/non-standard requests
 */
function generateReviewAlertHtml(customNotes?: string): string {
  const notesHtml = customNotes
    ? '<div style="margin-top: 12px; padding: 12px; background: #fee2e2; border-radius: 4px;">' +
      '<strong style="color: #991b1b;">Customer Notes:</strong>' +
      '<p style="margin: 8px 0 0; color: #7f1d1d; white-space: pre-wrap;">' + escapeHtml(customNotes) + '</p>' +
      '</div>'
    : ""

  return '<div style="background: #fef2f2; border: 3px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 24px;">' +
    '<p style="margin: 0 0 8px 0; font-weight: 700; color: #dc2626; font-size: 18px;">' +
    'REQUIRES MANUAL REVIEW - CUSTOMER NOT AUTO-EMAILED' +
    '</p>' +
    '<p style="margin: 0; color: #991b1b; font-size: 14px;">' +
    'Customer selected "Custom / Non-Standard / Unsure" - please review and send quote manually.' +
    '</p>' +
    notesHtml +
    '</div>'
}

function getItemPrice(item: QuoteItem): number | undefined {
  return item.variation?.price
}

export async function POST(request: NextRequest) {
  // Check rate limit first
  const ip = getClientIp(request)
  const rateLimitResponse = await checkRateLimit(ip)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const data: QuoteFormData = await request.json()

    // Validate required fields
    if (!data.companyName || !data.contactName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Company name, contact name, email, and phone are required" },
        { status: 400 }
      )
    }

    if (!data.deliveryAddress?.street || !data.deliveryAddress?.suburb ||
        !data.deliveryAddress?.state || !data.deliveryAddress?.postcode) {
      return NextResponse.json(
        { error: "Complete delivery address is required" },
        { status: 400 }
      )
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      )
    }

    // Verify Turnstile token (if configured)
    if (process.env.TURNSTILE_SECRET_KEY && !IS_DEV) {
      if (!data.turnstileToken) {
        return NextResponse.json(
          { error: "Please complete the verification challenge" },
          { status: 400 }
        )
      }

      const verification = await verifyTurnstileToken(data.turnstileToken, ip)
      if (!verification.success) {
        return NextResponse.json(
          { error: verification.error || "Verification failed" },
          { status: 400 }
        )
      }
    } else if (IS_DEV) {
      console.log("⚠️ DEV MODE: Skipping Turnstile verification")
    }

    // Check for email configuration (Resend API)
    // DEV BYPASS: Allow quote submission without email in development
    const emailConfigured = !!process.env.RESEND_API_KEY
    const skipEmail = IS_DEV && !emailConfigured
    if (!emailConfigured && !IS_DEV) {
      console.error("Email not configured (RESEND_API_KEY required)")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    } else if (skipEmail) {
      console.log("⚠️ DEV MODE: Email sending will be skipped (no RESEND_API_KEY)")
    }

    // Save quote to database
    const quoteNumber = generateQuoteNumber()
    const approvalToken = generateApprovalToken()
    const approvalTokenExpiresAt = getTokenExpiration(7) // 7 days
    let savedQuoteId: number | undefined

    try {
      const [savedQuote] = await db.insert(quotes).values({
        quoteNumber,
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        deliveryStreet: data.deliveryAddress.street,
        deliverySuburb: data.deliveryAddress.suburb,
        deliveryState: data.deliveryAddress.state,
        deliveryPostcode: data.deliveryAddress.postcode,
        billingStreet: data.billingAddress.street,
        billingSuburb: data.billingAddress.suburb,
        billingState: data.billingAddress.state,
        billingPostcode: data.billingAddress.postcode,
        notes: data.notes,
        itemCount: data.totals.itemCount,
        pricedTotal: data.totals.pricedTotal?.toString(),
        savings: data.totals.savings?.toString(),
        certFee: data.totals.certFee?.toString(),
        certCount: data.totals.certCount,
        hasUnpricedItems: data.totals.hasUnpricedItems,
        clientIp: ip,
        approvalToken,
        approvalTokenExpiresAt,
        // Custom/Non-Standard Request Flag
        requiresReview: data.requiresReview || false,
        customRequestNotes: data.customRequestNotes,
      }).returning({ id: quotes.id })

      savedQuoteId = savedQuote.id

      // Save quote items
      await db.insert(quoteItems).values(
        data.items.map((item, index) => ({
          quoteId: savedQuote.id,
          sku: item.variation?.sku || item.sku,
          name: item.name,
          brand: item.brand,
          category: item.category || 'Unknown', // Required field
          quantity: item.quantity,
          size: item.variation?.sizeLabel,
          sizeLabel: item.variation?.sizeLabel,
          variationSku: item.variation?.sku,
          unitPrice: item.variation?.price?.toString(),
          lineTotal: item.variation?.price
            ? (item.variation.price * item.quantity).toString()
            : undefined,
          materialTestCert: item.materialTestCert,
          // Custom specs for Straub/Teekay products
          customPipeOd: item.customSpecs?.pipeOd,
          customRubberMaterial: item.customSpecs?.rubberMaterial,
          customPressure: item.customSpecs?.pressure,
          customNotes: item.customSpecs?.notes,
          // Custom size request (for sizes not in selector)
          customSizeRequested: item.customSizeRequest?.requestedSize,
          customSizeNotes: item.customSizeRequest?.additionalSpecs,
          isCustomSizeRequest: item.customSizeRequest?.isCustomRequest ?? false,
          displayOrder: index,
        }))
      )
    } catch (dbError) {
      console.error("Failed to save quote to database:", dbError)
      // Continue with email even if DB save fails
    }

    // Business receives quote notifications
    const toEmails = ["sales@dewaterproducts.com.au"]
    // Email sender configuration
    const fromEmail = process.env.FROM_EMAIL || "sales@dewaterproducts.com.au"
    const fromName = process.env.FROM_NAME || "Dewater Products"

    // Sanitize user inputs for HTML context
    const safeCompanyName = escapeHtml(data.companyName)
    const safeContactName = escapeHtml(data.contactName)
    const safeEmail = escapeHtml(data.email)
    const safeEmailHref = escapeEmailHref(data.email)
    const safePhone = escapeHtml(data.phone)
    const safePhoneHref = escapeTelHref(data.phone)
    const safeNotes = data.notes ? escapeHtml(data.notes) : ""

    // Sanitize addresses
    const safeDeliveryAddress = {
      street: escapeHtml(data.deliveryAddress.street),
      suburb: escapeHtml(data.deliveryAddress.suburb),
      state: escapeHtml(data.deliveryAddress.state),
      postcode: escapeHtml(data.deliveryAddress.postcode),
    }
    const safeBillingAddress = {
      street: escapeHtml(data.billingAddress.street),
      suburb: escapeHtml(data.billingAddress.suburb),
      state: escapeHtml(data.billingAddress.state),
      postcode: escapeHtml(data.billingAddress.postcode),
    }

    // Format address for display
    const formatAddress = (addr: typeof safeDeliveryAddress) =>
      `${addr.street}, ${addr.suburb} ${addr.state} ${addr.postcode}`

    // Build items table
    const itemsTableRows = data.items.map((item) => {
      const price = getItemPrice(item)
      const priceDisplay = price ? `$${price.toFixed(2)}` : "POA"
      const lineTotal = price ? `$${(price * item.quantity).toFixed(2)}` : "POA"

      // Sanitize item data (from database, but could be manipulated)
      const safeItemSku = escapeHtml(getItemSKU(item))
      const safeItemName = escapeHtml(item.name)
      const safeItemBrand = escapeHtml(item.brand)
      const safeVariationLabel = item.variation ? escapeHtml(item.variation.sizeLabel) : ""

      const certBadge = item.materialTestCert
        ? `<br /><span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-top: 4px;">+ Material Cert</span>`
        : ""

      // Custom specs for Straub/Teekay products
      const customSpecsHtml = item.customSpecs
        ? `<br /><div style="background: #f5f5f5; padding: 6px; border-radius: 4px; margin-top: 4px; font-size: 11px; color: #333;">
            <strong>Pipe OD:</strong> ${escapeHtml(item.customSpecs.pipeOd)} |
            <strong>Material:</strong> ${escapeHtml(item.customSpecs.rubberMaterial)} |
            <strong>Pressure:</strong> ${escapeHtml(item.customSpecs.pressure)}
            ${item.customSpecs.notes ? `<br /><em style="color: #666;">${escapeHtml(item.customSpecs.notes)}</em>` : ""}
          </div>`
        : ""

      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${safeItemSku}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <strong>${safeItemName}</strong><br />
            <span style="color: #666; font-size: 12px;">${safeItemBrand}</span>
            ${safeVariationLabel ? `<br /><span style="color: #666; font-size: 12px;">Size: ${safeVariationLabel}</span>` : ""}
            ${customSpecsHtml}
            ${certBadge}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${priceDisplay}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${lineTotal}</td>
        </tr>
      `
    }).join("")

    // Build plain text items list
    const itemsText = data.items.map((item) => {
      const price = getItemPrice(item)
      const certNote = item.materialTestCert ? " [+ Material Cert]" : ""
      const customSpecsText = item.customSpecs
        ? ` | Specs: OD=${item.customSpecs.pipeOd}, Mat=${item.customSpecs.rubberMaterial}, Press=${item.customSpecs.pressure}`
        : ""
      const customSizeText = item.customSizeRequest
        ? ` | Custom Size: ${item.customSizeRequest.requestedSize}${item.customSizeRequest.additionalSpecs ? ` (${item.customSizeRequest.additionalSpecs})` : ""}`
        : ""
      return `- ${getItemSKU(item)} | ${item.name} | Qty: ${item.quantity} | ${price ? `$${price.toFixed(2)} ea` : "POA"}${customSpecsText}${customSizeText}${certNote}`
    }).join("\n")

    // Check if billing address is different from delivery
    const billingIsDifferent = formatAddress(safeDeliveryAddress) !== formatAddress(safeBillingAddress)

    // Classify delivery zone early so we can detect exceptions
    const fullAddress = `${data.deliveryAddress.street} ${data.deliveryAddress.suburb}`
    const deliveryClassification = classifyDelivery(data.deliveryAddress.postcode, fullAddress)

    // Detect exception conditions for business email flags
    const exceptionFlags = detectExceptions(data.items, deliveryClassification)
    const flagsHtml = generateFlagsHtml(exceptionFlags)

    // Generate review alert HTML for custom/non-standard requests
    const reviewAlertHtml = data.requiresReview ? generateReviewAlertHtml(data.customRequestNotes) : ""

    // Email to business (supports multiple recipients)
    const businessEmail = {
      to: toEmails,
      from: {
        email: fromEmail,
        name: fromName,
      },
      replyTo: data.email,
      subject: `[${quoteNumber}] Quote Request: ${data.companyName} - ${data.contactName} (${data.items.length} items)`,
      html: `
        <h2>New Quote Request</h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          Quote Reference: <strong>${quoteNumber}</strong>
          ${savedQuoteId ? ` | <a href="${process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au"}/admin/quotes/${savedQuoteId}">View in Admin</a>` : ""}
        </p>

        ${flagsHtml}
        ${reviewAlertHtml}
        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-weight: 600; color: #0369a1;">Quick Actions:</p>
          <a href="${process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au"}/approve-quote/${approvalToken}"
             style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 12px;">
            📧 Re-send Quote
          </a>
          ${savedQuoteId ? `<a href="${process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au"}/admin/quotes/${savedQuoteId}"
             style="display: inline-block; background: #64748b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            ⚙️ Full Admin Panel
          </a>` : ""}
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b;">Customer already received quote automatically. Use Re-send if needed. Link expires in 7 days.</p>
        </div>

        ${(() => {
          const discountPct = getDiscountPercentage(data.totals.itemCount)
          if (discountPct > 0) {
            const discountColor = discountPct >= 15 ? '#dc2626' : discountPct >= 10 ? '#ea580c' : '#ca8a04'
            const discountBg = discountPct >= 15 ? '#fef2f2' : discountPct >= 10 ? '#fff7ed' : '#fefce8'
            const discountBorder = discountPct >= 15 ? '#fecaca' : discountPct >= 10 ? '#fed7aa' : '#fef08a'
            return `
        <div style="background: ${discountBg}; border: 2px solid ${discountBorder}; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-weight: 600; color: ${discountColor}; font-size: 16px;">
            📊 Customer qualifies for <strong>${discountPct}% bulk discount</strong> (${data.totals.itemCount} items total)
          </p>
          ${data.totals.hasUnpricedItems ? `
          <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">
            ⚠️ <strong>Action required:</strong> Apply ${discountPct}% discount to manually priced items (POA) to match.
          </p>
          ` : ''}
        </div>`
          }
          return ''
        })()}

        <h3>Company Details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 140px;">Company</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeCompanyName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeContactName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${safeEmailHref}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${safePhoneHref}">${safePhone}</a></td>
          </tr>
        </table>

        <h3 style="margin-top: 20px;">Delivery Address</h3>
        <div style="padding: 15px; background: #f0f9ff; border-radius: 5px; border-left: 4px solid #0ea5e9;">
          ${safeDeliveryAddress.street}<br />
          ${safeDeliveryAddress.suburb} ${safeDeliveryAddress.state} ${safeDeliveryAddress.postcode}
        </div>

        ${billingIsDifferent ? `
        <h3 style="margin-top: 20px;">Billing Address</h3>
        <div style="padding: 15px; background: #fef9c3; border-radius: 5px; border-left: 4px solid #eab308;">
          ${safeBillingAddress.street}<br />
          ${safeBillingAddress.suburb} ${safeBillingAddress.state} ${safeBillingAddress.postcode}
        </div>
        ` : ""}

        <h3 style="margin-top: 30px;">Requested Items (${data.items.length})</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">SKU</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Unit (ex GST)</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total (ex GST)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <table style="width: 100%;">
            <tr>
              <td><strong>Total Items:</strong></td>
              <td style="text-align: right;">${data.totals.itemCount}</td>
            </tr>
            ${data.totals.pricedTotal > 0 ? `
            <tr>
              <td><strong>Listed Price Total:</strong></td>
              <td style="text-align: right;">$${data.totals.pricedTotal.toFixed(2)}</td>
            </tr>
            ` : ""}
            ${data.totals.savings > 0 ? `
            <tr>
              <td><strong>Bulk Discount:</strong></td>
              <td style="text-align: right; color: #dc2626;">-$${data.totals.savings.toFixed(2)}</td>
            </tr>
            ` : ""}
            ${data.totals.certFee && data.totals.certFee > 0 ? `
            <tr>
              <td><strong>Material Certificates (${data.totals.certCount}):</strong></td>
              <td style="text-align: right;">$${data.totals.certFee.toFixed(2)}</td>
            </tr>
            ` : ""}
            ${data.totals.pricedTotal > 0 ? `
            <tr style="border-top: 2px solid #ddd;">
              <td style="padding-top: 10px;"><strong>Subtotal (ex GST):</strong></td>
              <td style="text-align: right; padding-top: 10px;">$${(data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)).toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>GST (10%):</strong></td>
              <td style="text-align: right;">$${((data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)) * 0.1).toFixed(2)}</td>
            </tr>
            <tr style="background: #e0f2fe;">
              <td style="padding: 8px;"><strong style="font-size: 1.1em;">Total (inc GST):</strong></td>
              <td style="text-align: right; padding: 8px;"><strong style="font-size: 1.1em;">$${((data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)) * 1.1).toFixed(2)}</strong></td>
            </tr>
            ` : ""}
            ${data.totals.hasUnpricedItems ? `
            <tr>
              <td colspan="2" style="color: #d97706; padding-top: 10px;">
                ⚠️ Some items require manual pricing
              </td>
            </tr>
            ` : ""}
            ${data.totals.certCount && data.totals.certCount > 0 ? `
            <tr>
              <td colspan="2" style="color: #0369a1; padding-top: 10px;">
                📋 ${data.totals.certCount} item(s) require material test certificates - may extend lead time
              </td>
            </tr>
            ` : ""}
          </table>
        </div>

        ${safeNotes ? `
        <h3 style="margin-top: 30px;">Additional Notes</h3>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap;">${safeNotes}</div>
        ` : ""}

        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Sent from Dewater Products website quote form
        </p>
      `,
      text: `
NEW QUOTE REQUEST
Quote Reference: ${quoteNumber}


${generateFlagsText(exceptionFlags)}
Company Details
===============
Company: ${data.companyName}
Contact: ${data.contactName}
Email: ${data.email}
Phone: ${data.phone}

Delivery Address
================
${data.deliveryAddress.street}
${data.deliveryAddress.suburb} ${data.deliveryAddress.state} ${data.deliveryAddress.postcode}
${billingIsDifferent ? `
Billing Address
===============
${data.billingAddress.street}
${data.billingAddress.suburb} ${data.billingAddress.state} ${data.billingAddress.postcode}
` : ""}
Requested Items (${data.items.length})
================
${itemsText}

Total Items: ${data.totals.itemCount}
${data.totals.pricedTotal > 0 ? `Listed Price Total: $${data.totals.pricedTotal.toFixed(2)}` : ""}
${data.totals.savings > 0 ? `Bulk Discount: -$${data.totals.savings.toFixed(2)}` : ""}
${data.totals.certFee && data.totals.certFee > 0 ? `Material Certificates (${data.totals.certCount}): $${data.totals.certFee.toFixed(2)}` : ""}
${data.totals.pricedTotal > 0 ? `
Subtotal (ex GST): $${(data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)).toFixed(2)}
GST (10%): $${((data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)) * 0.1).toFixed(2)}
TOTAL (inc GST): $${((data.totals.pricedTotal - data.totals.savings + (data.totals.certFee || 0)) * 1.1).toFixed(2)}` : ""}
${data.totals.hasUnpricedItems ? "Note: Some items require manual pricing" : ""}
${data.totals.certCount && data.totals.certCount > 0 ? `Note: ${data.totals.certCount} item(s) require material test certificates - may extend lead time` : ""}

${data.notes ? `Additional Notes:\n${data.notes}` : ""}
      `.trim(),
    }


    // Calculate totals for customer email
    const subtotal = data.totals.pricedTotal
    const savings = data.totals.savings
    const certFee = data.totals.certFee || 0
    const certCount = data.totals.certCount || 0
    const subtotalAfterDiscount = subtotal - savings + certFee
    const gst = subtotalAfterDiscount * 0.1
    const grandTotal = subtotalAfterDiscount + gst

    // Confirmation email to customer - FULL DETAILED VERSION
    const customerEmail = {
      to: data.email,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: 'Your Quote ' + quoteNumber + ' - Dewater Products',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Dewater Products</h1>
            <p style="margin: 5px 0 0;">Industrial Pipe Fittings & Accessories</p>
          </div>

          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Quote ${quoteNumber}</h2>

            <p>Dear ${safeContactName},</p>
            <p>Thank you for your quote request. Please find your detailed quote below.</p>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Delivery Address:</strong><br />
              ${safeDeliveryAddress.street}<br />
              ${safeDeliveryAddress.suburb} ${safeDeliveryAddress.state} ${safeDeliveryAddress.postcode}
            </div>

            <h3 style="color: #333;">Items</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">SKU</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Unit (ex GST)</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total (ex GST)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
              <table style="width: 100%;">
                ${subtotal > 0 ? `
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td style="text-align: right;">$${subtotal.toFixed(2)}</td>
                </tr>
                ${savings > 0 ? `
                <tr>
                  <td><strong>Bulk Discount:</strong></td>
                  <td style="text-align: right; color: #16a34a;">-$${savings.toFixed(2)}</td>
                </tr>
                ` : ""}
                ${certFee > 0 ? `
                <tr>
                  <td><strong>Material Certificates (${certCount}):</strong></td>
                  <td style="text-align: right;">$${certFee.toFixed(2)}</td>
                </tr>
                ` : ""}
                <tr>
                  <td><strong>Delivery:</strong></td>
                  <td style="text-align: right;">${deliveryClassification.deliveryNote || "Free metro delivery"}</td>
                </tr>
                <tr style="border-top: 1px solid #ddd;">
                  <td style="padding-top: 10px;"><strong>Subtotal (ex GST):</strong></td>
                  <td style="text-align: right; padding-top: 10px;">$${subtotalAfterDiscount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>GST (10%):</strong></td>
                  <td style="text-align: right;">$${gst.toFixed(2)}</td>
                </tr>
                <tr style="background: #e0f2fe;">
                  <td style="padding: 10px;"><strong style="font-size: 1.2em;">Total (inc GST):</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong style="font-size: 1.2em;">$${grandTotal.toFixed(2)}</strong></td>
                </tr>
                ` : ""}
                ${data.totals.hasUnpricedItems ? `
                <tr>
                  <td colspan="2" style="color: #d97706; padding-top: 10px;">
                    Note: Some items require confirmation - we will be in touch shortly.
                  </td>
                </tr>
                ` : ""}
              </table>
            </div>


            ${(() => {
              const overallLeadTime = calculateOverallLeadTime(data.items)
              if (overallLeadTime) {
                return `
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
              <strong style="color: #92400e;">Estimated Lead Time: ${overallLeadTime}</strong>
              <p style="margin: 8px 0 0; font-size: 13px; color: #78350f;">
                Lead times are estimates and may vary based on stock availability.${data.totals.certCount && data.totals.certCount > 0 ? " Material test certificates will extend lead times." : ""}
              </p>
            </div>`
              }
              return ""
            })()}
            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 5px; border-left: 4px solid #0ea5e9;">
              <h3 style="margin-top: 0; color: #0369a1;">Quote Terms</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Quote valid for 30 days</li>
                <li>All prices exclude GST unless stated</li>
                <li>Payment terms: 30 days from invoice</li>
                <li>Warranty: Up to 5 years on Orbit/Straub couplings, 12 months on other products</li>
              </ul>
            </div>

            <p style="margin-top: 30px;">To proceed with this order or if you have any questions, please email <a href="mailto:sales@dewaterproducts.com.au" style="color: #0ea5e9;">sales@dewaterproducts.com.au</a></p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p style="color: #666; font-size: 14px;">
              <strong>Dewater Products Pty Ltd</strong><br />
              Phone: <a href="tel:1300271290" style="color: #0ea5e9;">1300 271 290</a><br />
              Email: <a href="mailto:sales@dewaterproducts.com.au" style="color: #0ea5e9;">sales@dewaterproducts.com.au</a><br />
              Perth, Western Australia
            </p>
          </div>

          <div style="background: #1a1a1a; color: #999; padding: 15px; text-align: center; font-size: 12px;">
            ABN: 98 622 681 663 | © ${new Date().getFullYear()} Dewater Products Pty Ltd
          </div>
        </div>
      `,
    }

    // Generate PDF attachment for customer email using @react-pdf/renderer
    let pdfBuffer: Buffer | null = null
    try {
      console.log(`[Quote ${quoteNumber}] Starting PDF generation with @react-pdf/renderer...`)

      // Map submission items to PDF format
      const pdfItems: QuoteItemPDF[] = data.items.map((item) => ({
        sku: item.variation?.sku || item.sku,
        name: item.name,
        brand: item.brand,
        sizeLabel: item.variation?.sizeLabel,
        quantity: item.quantity,
        unitPrice: item.variation?.price ?? null,
        lineTotal: item.variation?.price ? item.variation.price * item.quantity : null,
        materialTestCert: item.materialTestCert || false,
        leadTime: item.leadTime || null,
        customSizeRequest: item.customSizeRequest ? {
          requestedSize: item.customSizeRequest.requestedSize,
          additionalSpecs: item.customSizeRequest.additionalSpecs,
        } : null,
      }))

      // Calculate overall lead time (longest lead time across all items)
      const overallLeadTime = calculateOverallLeadTime(data.items)

      // Build PDF data matching QuotePDFData interface
      const pdfData: QuotePDFData = {
        quoteNumber,
        quoteDate: format(new Date(), "d MMMM yyyy"),
        validUntil: format(getQuoteExpiry(), "d MMMM yyyy"),
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        deliveryAddress: data.deliveryAddress,
        billingAddress: data.billingAddress,
        items: pdfItems,
        subtotal,
        savings,
        certFee,
        certCount,
        shippingCost: 0,
        shippingNotes: deliveryClassification.deliveryNote || "Free metro delivery",
        gst,
        total: grandTotal,
        hasUnpricedItems: data.totals.hasUnpricedItems,
        notes: data.notes,
        overallLeadTime,
      }

      // Use renderToBuffer (proven working in admin PDF route)
      const pdfArrayBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
      pdfBuffer = Buffer.from(pdfArrayBuffer)

      console.log(`[Quote ${quoteNumber}] PDF buffer size: ${pdfBuffer.length} bytes`)

      // Store PDF in Vercel Blob if quote was saved to database
      if (savedQuoteId && pdfBuffer) {
        try {
          const blobPath = `quotes/${quoteNumber}/quote-v1.pdf`
          const blob = await put(blobPath, pdfBuffer, {
            contentType: 'application/pdf',
            access: 'public',
            cacheControlMaxAge: 31536000, // 1 year cache
          })
          console.log(`[Quote ${quoteNumber}] PDF stored in blob: ${blob.url}`)

          // Update quote record with PDF info
          await db
            .update(quotes)
            .set({
              pdfUrl: blob.url,
              pdfGeneratedAt: new Date(),
              pdfVersion: 1,
            })
            .where(eq(quotes.id, savedQuoteId))
        } catch (blobError) {
          console.error(`[Quote ${quoteNumber}] Failed to store PDF in blob:`, blobError)
          // Continue anyway - PDF will still be emailed, just not stored
        }
      }
    } catch (pdfError) {
      const pdfErrorMsg = pdfError instanceof Error ? pdfError.message : "Unknown PDF error"
      console.error("[Quote " + quoteNumber + "] Failed to generate PDF:", pdfError)
      // Log PDF failure to email_logs for visibility
      await logEmailResult({
        quoteNumber,
        recipient: "N/A",
        subject: "PDF Generation Failed",
        status: "failed",
        errorMessage: pdfErrorMsg,
        route: "/api/quote",
      })
      // Continue without PDF attachment - email will still go out
    }

    // Log PDF status
    if (pdfBuffer) {
      console.log(`[Quote ${quoteNumber}] PDF generated: ${pdfBuffer.length} bytes`)
    } else {
      console.log(`[Quote ${quoteNumber}] WARNING: No PDF generated`)
    }

    // Send emails with proper error tracking
    // DEV BYPASS: Skip email sending if no email config in development
    if (skipEmail) {
      console.log("⚠️ DEV MODE: Emails NOT sent. Quote saved to database.")
      console.log("   Quote Number: " + quoteNumber)
      console.log("   Quote ID: " + savedQuoteId)
      console.log("   View at: /admin/quotes/" + savedQuoteId)
    } else {
      // Prepare PDF attachment
      const pdfAttachment = pdfBuffer ? {
        filename: quoteNumber + "-Quote.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      } : undefined

      // Track email results
      let businessEmailResult: { success: boolean; error?: string } = { success: false, error: "Not attempted" }
      let customerEmailResult: { success: boolean; error?: string } | null = null

      // Send business notification (always)
      businessEmailResult = await sendEmailSafe({
        to: businessEmail.to,
        subject: businessEmail.subject,
        html: businessEmail.html,
        text: businessEmail.text,
        replyTo: data.email,
        attachments: pdfAttachment ? [pdfAttachment] : undefined,
      })

      // Log business email result
      await logEmailResult({
        quoteNumber,
        recipient: Array.isArray(businessEmail.to) ? businessEmail.to.join(", ") : businessEmail.to,
        subject: businessEmail.subject,
        status: businessEmailResult.success ? "sent" : "failed",
        errorMessage: businessEmailResult.error,
        route: "/api/quote",
      })

      // Send customer email only if NOT flagged for manual review
      if (!data.requiresReview) {
        customerEmailResult = await sendEmailSafe({
          to: customerEmail.to,
          subject: customerEmail.subject,
          html: customerEmail.html,
          attachments: pdfAttachment ? [pdfAttachment] : undefined,
        })

        // Log customer email result
        await logEmailResult({
          quoteNumber,
          recipient: customerEmail.to,
          subject: customerEmail.subject,
          status: customerEmailResult.success ? "sent" : "failed",
          errorMessage: customerEmailResult.error,
          route: "/api/quote",
        })
      } else {
        console.log("[Quote " + quoteNumber + "] Customer email SKIPPED - requires manual review")
      }

      // Update quotes table with email delivery timestamps
      const emailUpdate: Record<string, unknown> = {}
      const failures: string[] = []

      if (businessEmailResult.success) {
        emailUpdate.businessEmailSentAt = new Date()
      } else {
        failures.push("Business: " + (businessEmailResult.error || "Unknown error"))
      }

      if (customerEmailResult) {
        if (customerEmailResult.success) {
          emailUpdate.customerEmailSentAt = new Date()
        } else {
          failures.push("Customer: " + (customerEmailResult.error || "Unknown error"))
        }
      }

      if (failures.length > 0) {
        emailUpdate.emailFailureReason = failures.join("; ")
      }

      // Update quote record with email status
      if (savedQuoteId && Object.keys(emailUpdate).length > 0) {
        try {
          await db.update(quotes).set(emailUpdate).where(eq(quotes.id, savedQuoteId))
        } catch (updateErr) {
          console.error("[Quote " + quoteNumber + "] Failed to update email status:", updateErr)
        }
      }

      // Determine response based on email results
      const allFailed = !businessEmailResult.success && (!customerEmailResult || !customerEmailResult.success)
      const anyFailed = !businessEmailResult.success || (customerEmailResult && !customerEmailResult.success)

      if (allFailed) {
        // All emails failed - return error
        console.error("[Quote " + quoteNumber + "] All emails failed")
        return NextResponse.json({
          success: false,
          error: "Quote saved but all emails failed to send. Our team has been notified.",
          quoteNumber,
          quoteId: savedQuoteId,
        }, { status: 500 })
      }

      if (anyFailed) {
        // Some emails failed - return success with warning
        const failedEmail = !businessEmailResult.success ? "business notification" : "customer confirmation"
        console.warn("[Quote " + quoteNumber + "] Partial email failure: " + failedEmail)
        return NextResponse.json({
          success: true,
          quoteNumber,
          quoteId: savedQuoteId,
          emailWarning: "Your quote was received but the " + failedEmail + " email may be delayed.",
        })
      }
    }

    return NextResponse.json({
      success: true,
      quoteNumber,
      quoteId: savedQuoteId,
      // DEV: Include extra info in dev mode
      ...(IS_DEV && { devMode: true, emailSkipped: skipEmail }),
    })
  } catch (error) {
    console.error("Quote form error:", error)
    // Return more specific error message if available
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Quote form error details:", errorMessage)
    return NextResponse.json(
      { error: "Failed to submit quote request. Please try again." },
      { status: 500 }
    )
  }
}
