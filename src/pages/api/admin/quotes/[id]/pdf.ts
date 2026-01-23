import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import { format } from "date-fns"
import { getQuoteExpiry } from "@/lib/quote"
import { authOptions } from "@/lib/auth/config"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
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

    // Get query params for optional overrides
    const isDraft = req.query.draft === "true"
    const shippingCost = parseFloat((req.query.shipping as string) || "0")
    const shippingNotes = (req.query.shippingNotes as string) || undefined
    const preparedBy = (req.query.preparedBy as string) || undefined

    // Fetch quote with items
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1)

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" })
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

    const subtotalAfterDiscount = Number(subtotal - savings + certFee + shippingCost) || 0
    const gst = Number(subtotalAfterDiscount * 0.1) || 0
    const total = Number(subtotalAfterDiscount + gst) || 0

    // Format dates - ensure they're strings
    const quoteDate = String(format(quote.createdAt, "d MMMM yyyy"))
    const validUntil = String(format(getQuoteExpiry(quote.createdAt), "d MMMM yyyy"))

    // Prepare items for PDF - ensure all values are primitives (not objects)
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

    // Build PDF data - ensure all string values are primitives (not objects)
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
      shippingNotes: shippingNotes ? String(shippingNotes) : undefined,
      gst,
      total,
      hasUnpricedItems: Boolean(quote.hasUnpricedItems),
      notes: quote.notes ? String(quote.notes) : undefined,
      preparedBy: preparedBy ? String(preparedBy) : undefined,
      isDraft: Boolean(isDraft),
    }

    // Generate PDF using Pages Router (compatible with react-pdf)
    const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))

    // Return PDF
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${quote.quoteNumber}.pdf"`
    )
    res.send(Buffer.from(pdfBuffer))
  } catch (error) {
    console.error("PDF generation error:", error)
    return res.status(500).json({ error: "Failed to generate PDF" })
  }
}
