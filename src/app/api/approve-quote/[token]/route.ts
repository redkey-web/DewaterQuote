import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/client"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import {
  generateApprovedQuoteEmailHtml,
  generateApprovedQuoteEmailText,
  type ApprovedQuoteEmailData,
  type QuoteItemEmail,
} from "@/lib/email/approved-quote-email"
import { isTokenExpired } from "@/lib/tokens"
import { format } from "date-fns"
import { getQuoteExpiry } from "@/lib/quote"

interface SendQuoteBody {
  shippingCost?: number
  shippingNotes?: string
  preparedBy?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body: SendQuoteBody = await request.json()

    // Fetch quote by approval token
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.approvalToken, token))
      .limit(1)

    if (!quote) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    // Check if token expired
    if (isTokenExpired(quote.approvalTokenExpiresAt)) {
      return NextResponse.json({ error: "Token expired" }, { status: 403 })
    }

    // Check if already sent
    if (quote.status === 'forwarded') {
      return NextResponse.json(
        { error: "Quote already sent to customer" },
        { status: 400 }
      )
    }

    // Build address objects from separate columns
    const deliveryAddress = {
      street: quote.deliveryStreet || '',
      suburb: quote.deliverySuburb || '',
      state: quote.deliveryState || '',
      postcode: quote.deliveryPostcode || '',
    }
    const billingAddress = {
      street: quote.billingStreet || quote.deliveryStreet || '',
      suburb: quote.billingSuburb || quote.deliverySuburb || '',
      state: quote.billingState || quote.deliveryState || '',
      postcode: quote.billingPostcode || quote.deliveryPostcode || '',
    }

    // Fetch quote items
    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quote.id))
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

    // Prepare items for PDF/email
    const pdfItems: QuoteItemPDF[] = items.map((item) => ({
      sku: item.variationSku || item.sku,
      name: item.name,
      brand: item.brand,
      size: item.size || undefined,
      sizeLabel: item.sizeLabel || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
      lineTotal: item.lineTotal ? parseFloat(item.lineTotal) : null,
      quotedPrice: item.quotedPrice ? parseFloat(item.quotedPrice) : null,
      quotedNotes: item.quotedNotes || undefined,
      materialTestCert: item.materialTestCert || false,
    }))

    const emailItems: QuoteItemEmail[] = pdfItems

    // Build data objects
    const pdfData: QuotePDFData = {
      quoteNumber: quote.quoteNumber,
      quoteDate,
      validUntil,
      companyName: quote.companyName,
      contactName: quote.contactName,
      email: quote.email,
      phone: quote.phone,
      deliveryAddress,
      billingAddress,
      items: pdfItems,
      subtotal,
      savings,
      certFee,
      certCount,
      shippingCost,
      shippingNotes: body.shippingNotes,
      gst,
      total,
      hasUnpricedItems: quote.hasUnpricedItems || false,
      notes: quote.notes || undefined,
      preparedBy: body.preparedBy,
    }

    const emailData: ApprovedQuoteEmailData = {
      ...pdfData,
      websiteUrl: process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au",
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))

    // Check SMTP configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Generate email content
    const htmlContent = generateApprovedQuoteEmailHtml(emailData)
    const textContent = generateApprovedQuoteEmailText(emailData)

    // Send email with PDF attachment
    const replyTo = (process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au").split(",")[0].trim()

    // Convert PDF to Buffer for nodemailer
    const pdfBufferForEmail = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer
      : Buffer.from(pdfBuffer)

    await sendEmail({
      to: quote.email,
      subject: 'Your Quote ' + quote.quoteNumber + ' from Dewater Products',
      html: htmlContent,
      text: textContent,
      replyTo,
      attachments: [
        {
          filename: quote.quoteNumber + '.pdf',
          content: pdfBufferForEmail,
          contentType: "application/pdf",
        },
      ],
    })

    // Update quote status
    await db
      .update(quotes)
      .set({
        status: "forwarded",
        forwardedAt: new Date(),
        shippingCost: body.shippingCost?.toString(),
        shippingNotes: body.shippingNotes,
      })
      .where(eq(quotes.id, quote.id))

    return NextResponse.json({
      success: true,
      message: `Quote sent to ${quote.email}`,
      quoteNumber: quote.quoteNumber,
    })
  } catch (error) {
    console.error("Approve quote error:", error)
    return NextResponse.json(
      { error: "Failed to send quote. Please try again." },
      { status: 500 }
    )
  }
}
