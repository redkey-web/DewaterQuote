import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import sgMail from "@sendgrid/mail"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { put, del } from "@vercel/blob"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import {
  generateApprovedQuoteEmailHtml,
  generateApprovedQuoteEmailText,
  type ApprovedQuoteEmailData,
  type QuoteItemEmail,
} from "@/lib/email/approved-quote-email"
import { format } from "date-fns"
import { getQuoteExpiry } from "@/lib/quote"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface SendQuoteBody {
  shippingCost?: number
  shippingNotes?: string
  internalNotes?: string
  preparedBy?: string
  customMessage?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const quoteId = parseInt(id, 10)

    if (isNaN(quoteId)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 })
    }

    const body: SendQuoteBody = await request.json()

    // Fetch quote with items
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1)

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    // Build address objects from separate columns - ensure all values are primitives
    const deliveryAddress = {
      street: String(quote.deliveryStreet || ""),
      suburb: String(quote.deliverySuburb || ""),
      state: String(quote.deliveryState || ""),
      postcode: String(quote.deliveryPostcode || ""),
    }
    const billingAddress = {
      street: String(quote.billingStreet || quote.deliveryStreet || ""),
      suburb: String(quote.billingSuburb || quote.deliverySuburb || ""),
      state: String(quote.billingState || quote.deliveryState || ""),
      postcode: String(quote.billingPostcode || quote.deliveryPostcode || ""),
    }

    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quoteId))
      .orderBy(quoteItems.displayOrder)

    // Calculate totals
    const subtotal = parseFloat(quote.pricedTotal || "0")
    const savings = parseFloat(quote.savings || "0")
    const certFee = parseFloat(quote.certFee || "0")
    const certCount = quote.certCount || 0
    const shippingCost = body.shippingCost ?? 0

    const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost
    const gst = subtotalAfterDiscount * 0.1
    const total = subtotalAfterDiscount + gst

    // Format dates
    const quoteDate = format(quote.createdAt, "d MMMM yyyy")
    const validUntil = format(getQuoteExpiry(quote.createdAt), "d MMMM yyyy")

    // Prepare items for PDF/email - ensure all values are primitives (not objects)
    const pdfItems: QuoteItemPDF[] = items.map((item) => ({
      sku: String(item.variationSku || item.sku || ""),
      name: String(item.name || ""),
      brand: String(item.brand || ""),
      size: item.size ? String(item.size) : undefined,
      sizeLabel: item.sizeLabel ? String(item.sizeLabel) : undefined,
      quantity: Number(item.quantity) || 1,
      unitPrice: item.unitPrice ? parseFloat(String(item.unitPrice)) : null,
      lineTotal: item.lineTotal ? parseFloat(String(item.lineTotal)) : null,
      quotedPrice: item.quotedPrice ? parseFloat(String(item.quotedPrice)) : null,
      quotedNotes: item.quotedNotes ? String(item.quotedNotes) : undefined,
      materialTestCert: Boolean(item.materialTestCert),
    }))

    const emailItems: QuoteItemEmail[] = pdfItems

    // Build data objects - ensure all string values are primitives (not objects)
    const pdfData: QuotePDFData = {
      quoteNumber: String(quote.quoteNumber || ""),
      quoteDate,
      validUntil,
      companyName: String(quote.companyName || ""),
      contactName: String(quote.contactName || ""),
      email: String(quote.email || ""),
      phone: String(quote.phone || ""),
      deliveryAddress,
      billingAddress,
      items: pdfItems,
      subtotal,
      savings,
      certFee,
      certCount,
      shippingCost,
      shippingNotes: body.shippingNotes ? String(body.shippingNotes) : undefined,
      gst,
      total,
      hasUnpricedItems: Boolean(quote.hasUnpricedItems),
      notes: quote.notes ? String(quote.notes) : undefined,
      preparedBy: body.preparedBy ? String(body.preparedBy) : undefined,
    }

    const emailData: ApprovedQuoteEmailData = {
      ...pdfData,
      websiteUrl: process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au",
    }

    // Generate PDF
    console.log("[Quote " + quote.quoteNumber + "] PDF data:", JSON.stringify(pdfData, null, 2).slice(0, 1000))
    let pdfBuffer: Uint8Array
    try {
      pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
    } catch (pdfError) {
      console.error("[Quote " + quote.quoteNumber + "] PDF generation failed:", pdfError)
      console.error("[Quote " + quote.quoteNumber + "] PDF data items:", JSON.stringify(pdfItems, null, 2))
      throw pdfError
    }

    // Convert to base64 - handle both Buffer and Uint8Array
    const pdfBase64 = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer.toString("base64")
      : Buffer.from(pdfBuffer).toString("base64")

    console.log("[Quote " + quote.quoteNumber + "] PDF generated: " + pdfBase64.length + " bytes base64")

    // Store/update PDF in Vercel Blob
    let newPdfUrl = quote.pdfUrl
    let newPdfVersion = quote.pdfVersion || 1
    try {
      // Delete old PDF if exists
      if (quote.pdfUrl) {
        try {
          await del(quote.pdfUrl)
          console.log("[Quote " + quote.quoteNumber + "] Deleted old PDF from blob")
        } catch (deleteError) {
          console.error("[Quote " + quote.quoteNumber + "] Failed to delete old PDF:", deleteError)
          // Continue anyway - old blob will be orphaned
        }
      }

      // Increment version
      newPdfVersion = (quote.pdfVersion || 0) + 1

      // Upload new PDF to Vercel Blob
      const blobPath = "quotes/" + quote.quoteNumber + "/quote-v" + newPdfVersion + ".pdf"
      const pdfBufferForBlob = Buffer.isBuffer(pdfBuffer)
        ? pdfBuffer
        : Buffer.from(pdfBuffer)

      const blob = await put(blobPath, pdfBufferForBlob, {
        contentType: "application/pdf",
        access: "public",
        cacheControlMaxAge: 31536000, // 1 year cache
      })

      newPdfUrl = blob.url
      console.log("[Quote " + quote.quoteNumber + "] PDF stored in blob: " + blob.url)
    } catch (blobError) {
      console.error("[Quote " + quote.quoteNumber + "] Failed to store PDF in blob:", blobError)
      // Continue with email sending - blob storage is non-critical
    }

    // Check SendGrid configuration
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Generate email content
    const htmlContent = generateApprovedQuoteEmailHtml(emailData)
    const textContent = generateApprovedQuoteEmailText(emailData)

    // Send email with PDF attachment
    const fromEmail = process.env.FROM_EMAIL || "noreply@dewaterproducts.com.au"

    const emailPayload = {
      to: quote.email,
      from: fromEmail,
      replyTo: process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au",
      subject: "Your Quote " + quote.quoteNumber + " from Dewater Products",
      html: htmlContent,
      text: textContent,
      attachments: [
        {
          content: pdfBase64,
          filename: quote.quoteNumber + ".pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    }

    console.log("[Quote " + quote.quoteNumber + "] Sending email to: " + quote.email)
    console.log("[Quote " + quote.quoteNumber + "] Attachment size: " + pdfBase64.length + " chars")
    console.log("[Quote " + quote.quoteNumber + "] SendGrid API key configured: " + !!process.env.SENDGRID_API_KEY)

    await sgMail.send(emailPayload)
    console.log("[Quote " + quote.quoteNumber + "] Email sent successfully")

    // Update quote status and PDF info
    await db
      .update(quotes)
      .set({
        status: "forwarded",
        forwardedAt: new Date(),
        shippingCost: body.shippingCost?.toString(),
        shippingNotes: body.shippingNotes,
        internalNotes: body.internalNotes || quote.internalNotes,
        pdfUrl: newPdfUrl,
        pdfGeneratedAt: new Date(),
        pdfVersion: newPdfVersion,
      })
      .where(eq(quotes.id, quoteId))

    return NextResponse.json({
      success: true,
      message: "Quote sent to " + quote.email,
      quoteNumber: quote.quoteNumber,
    })
  } catch (error) {
    console.error("Send quote error:", error)
    return NextResponse.json(
      { error: "Failed to send quote. Please try again." },
      { status: 500 }
    )
  }
}
