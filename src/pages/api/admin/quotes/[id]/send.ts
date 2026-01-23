import type { NextApiRequest, NextApiResponse } from "next"
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
import { authOptions } from "@/lib/auth/config"
import { getQuoteExpiry } from "@/lib/quote"
import { checkShippingZone } from "@/lib/shipping/metro-postcodes"

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { id } = req.query
    const quoteId = parseInt(id as string, 10)

    if (isNaN(quoteId)) {
      return res.status(400).json({ error: "Invalid quote ID" })
    }

    const body: SendQuoteBody = req.body

    // Fetch quote with items
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1)

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" })
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

    // Calculate totals - ensure all values are primitive numbers
    const subtotal = parseFloat(String(quote.pricedTotal || "0")) || 0
    const savings = parseFloat(String(quote.savings || "0")) || 0
    const certFee = parseFloat(String(quote.certFee || "0")) || 0
    const certCount = Number(quote.certCount) || 0

    // Calculate shipping based on delivery postcode zone
    const shippingZone = checkShippingZone(deliveryAddress.postcode)
    const shippingCost = shippingZone.shippingCost || 0
    const shippingNotes = shippingZone.zone === "major_regional"
      ? "Regional delivery to " + shippingZone.region
      : shippingZone.zone === "metro"
        ? "Free metro delivery"
        : undefined

    const subtotalAfterDiscount = Number(subtotal - savings + certFee + shippingCost) || 0
    const gst = Number(subtotalAfterDiscount * 0.1) || 0
    const total = Number(subtotalAfterDiscount + gst) || 0

    // Format dates - ensure they're strings
    const quoteDate = String(format(quote.createdAt, "d MMMM yyyy"))
    const validUntil = String(format(getQuoteExpiry(quote.createdAt), "d MMMM yyyy"))

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
      quotedNotes: item.quotedNotes ? String(item.quotedNotes) : null,
      materialTestCert: Boolean(item.materialTestCert),
      leadTime: null,
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
      shippingNotes: shippingNotes,
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
    console.log("[Quote " + quote.quoteNumber + "] Generating PDF...")
    let pdfBuffer: Uint8Array
    try {
      pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
    } catch (pdfError) {
      const errorMsg = pdfError instanceof Error ? pdfError.message : String(pdfError)
      console.error("[Quote " + quote.quoteNumber + "] PDF generation failed:", errorMsg)
      throw pdfError
    }

    // Convert to base64
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
        cacheControlMaxAge: 31536000,
      })

      newPdfUrl = blob.url
      console.log("[Quote " + quote.quoteNumber + "] PDF stored in blob: " + blob.url)
    } catch (blobError) {
      console.error("[Quote " + quote.quoteNumber + "] Failed to store PDF in blob:", blobError)
    }

    // Check SendGrid configuration
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({ error: "Email service not configured" })
    }

    // Generate email content
    const htmlContent = generateApprovedQuoteEmailHtml(emailData)
    const textContent = generateApprovedQuoteEmailText(emailData)

    // Send email with PDF attachment
    // SendGrid requires sender identity to match verified sender exactly
    const fromEmail = process.env.FROM_EMAIL || "sales@dewaterproducts.com.au"
    const fromName = process.env.FROM_NAME || "Dewater Products"

    const emailPayload = {
      to: quote.email,
      from: {
        email: fromEmail,
        name: fromName,
      },
      replyTo: process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au",
      subject: "Your Quote " + quote.quoteNumber + " from Dewater Products",
      html: htmlContent,
      text: textContent,
      attachments: [
        {
          content: pdfBase64,
          filename: quote.quoteNumber + ".pdf",
          type: "application/pdf",
          disposition: "attachment" as const,
        },
      ],
    }

    console.log("[Quote " + quote.quoteNumber + "] Sending email to: " + quote.email)

    try {
      await sgMail.send(emailPayload)
      console.log("[Quote " + quote.quoteNumber + "] Email sent successfully")
    } catch (emailError: unknown) {
      const err = emailError as { response?: { body?: unknown }, message?: string, code?: number }
      console.error("[Quote " + quote.quoteNumber + "] SendGrid email error:", err.message || emailError)
      if (err.response?.body) {
        console.error("[Quote " + quote.quoteNumber + "] SendGrid response body:", JSON.stringify(err.response.body, null, 2))
      }
      throw emailError
    }

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

    return res.status(200).json({
      success: true,
      message: "Quote sent to " + quote.email,
      quoteNumber: quote.quoteNumber,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Send quote error:", errorMsg)
    return res.status(500).json({ error: "Failed to send quote: " + errorMsg })
  }
}
