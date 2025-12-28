import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"
import { escapeHtml, escapeEmailHref, escapeTelHref } from "@/lib/sanitize"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface QuoteItem {
  id: string
  name: string
  sku: string
  brand: string
  quantity: number
  variation?: {
    sku: string
    sizeLabel: string
    price?: number
  }
}

interface QuoteFormData {
  name: string
  email: string
  phone: string
  company?: string
  message?: string
  items: QuoteItem[]
  totals: {
    itemCount: number
    pricedTotal: number
    savings: number
    hasUnpricedItems: boolean
  }
  turnstileToken?: string
}

function getItemSKU(item: QuoteItem): string {
  return item.variation?.sku || item.sku
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
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
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
    if (process.env.TURNSTILE_SECRET_KEY) {
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
    }

    // Check for SendGrid API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Support multiple recipients (comma-separated)
    const toEmails = (process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
    const fromEmail = process.env.FROM_EMAIL || "noreply@dewaterproducts.com.au"

    // Sanitize user inputs for HTML context
    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safeEmailHref = escapeEmailHref(data.email)
    const safePhone = escapeHtml(data.phone)
    const safePhoneHref = escapeTelHref(data.phone)
    const safeCompany = data.company ? escapeHtml(data.company) : ""
    const safeMessage = data.message ? escapeHtml(data.message) : ""

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

      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${safeItemSku}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <strong>${safeItemName}</strong><br />
            <span style="color: #666; font-size: 12px;">${safeItemBrand}</span>
            ${safeVariationLabel ? `<br /><span style="color: #666; font-size: 12px;">Size: ${safeVariationLabel}</span>` : ""}
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
      return `- ${getItemSKU(item)} | ${item.name} | Qty: ${item.quantity} | ${price ? `$${price.toFixed(2)} ea` : "POA"}`
    }).join("\n")

    // Email to business (supports multiple recipients)
    const businessEmail = {
      to: toEmails,
      from: fromEmail,
      replyTo: data.email,
      subject: `Quote Request: ${data.name}${data.company ? ` - ${data.company}` : ""} (${data.items.length} items)`,
      html: `
        <h2>New Quote Request</h2>

        <h3>Customer Details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${safeEmailHref}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${safePhoneHref}">${safePhone}</a></td>
          </tr>
          ${safeCompany ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeCompany}</td>
          </tr>
          ` : ""}
        </table>

        <h3 style="margin-top: 30px;">Requested Items (${data.items.length})</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">SKU</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Line Total</th>
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
              <td><strong>Volume Discount:</strong></td>
              <td style="text-align: right; color: #dc2626;">-$${data.totals.savings.toFixed(2)}</td>
            </tr>
            ` : ""}
            ${data.totals.hasUnpricedItems ? `
            <tr>
              <td colspan="2" style="color: #d97706; padding-top: 10px;">
                ⚠️ Some items require manual pricing
              </td>
            </tr>
            ` : ""}
          </table>
        </div>

        ${safeMessage ? `
        <h3 style="margin-top: 30px;">Additional Requirements</h3>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</div>
        ` : ""}

        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Sent from Dewater Products website quote form
        </p>
      `,
      text: `
NEW QUOTE REQUEST

Customer Details
================
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
${data.company ? `Company: ${data.company}` : ""}

Requested Items (${data.items.length})
================
${itemsText}

Total Items: ${data.totals.itemCount}
${data.totals.pricedTotal > 0 ? `Listed Price Total: $${data.totals.pricedTotal.toFixed(2)}` : ""}
${data.totals.savings > 0 ? `Volume Discount: -$${data.totals.savings.toFixed(2)}` : ""}
${data.totals.hasUnpricedItems ? "Note: Some items require manual pricing" : ""}

${data.message ? `Additional Requirements:\n${data.message}` : ""}
      `.trim(),
    }

    // Confirmation email to customer
    const customerItemsList = data.items.map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      </tr>
    `).join("")

    const customerEmail = {
      to: data.email,
      from: fromEmail,
      subject: "Your Quote Request - Dewater Products",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for your quote request</h2>
          <p>Hi ${safeName},</p>
          <p>We've received your quote request for ${data.items.length} item${data.items.length !== 1 ? "s" : ""}. Our team will review your requirements and send you a detailed quote within <strong>1-2 business days</strong>.</p>

          <h3 style="color: #666; margin-top: 30px;">Items Requested</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${customerItemsList}
            </tbody>
          </table>

          <p style="margin-top: 20px;">If you have any questions or need to make changes to your request, please don't hesitate to contact us.</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #666; font-size: 14px;">
            <strong>Dewater Products Pty Ltd</strong><br />
            Phone: (08) 9271 2577<br />
            Email: sales@dewaterproducts.com.au<br />
            Perth, Western Australia
          </p>
        </div>
      `,
    }

    // Send both emails
    await Promise.all([
      sgMail.send(businessEmail),
      sgMail.send(customerEmail),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Quote form error:", error)
    return NextResponse.json(
      { error: "Failed to submit quote request. Please try again." },
      { status: 500 }
    )
  }
}
