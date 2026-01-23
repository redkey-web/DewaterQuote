import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import { format } from "date-fns"
import { authOptions } from "@/lib/auth/config"
import { getQuoteExpiry } from "@/lib/quote"
import { checkShippingZone } from "@/lib/shipping/metro-postcodes"

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

    // Build address objects from separate columns
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

    // Calculate totals including auto-calculated shipping
    const subtotal = parseFloat(String(quote.pricedTotal || "0")) || 0
    const savings = parseFloat(String(quote.savings || "0")) || 0
    const certFee = parseFloat(String(quote.certFee || "0")) || 0
    const certCount = Number(quote.certCount) || 0

    // Auto-calculate shipping based on delivery postcode
    const shippingZone = checkShippingZone(deliveryAddress.postcode)
    const shippingCost = shippingZone.shippingCost || 0
    const shippingNotes = shippingZone.zone === "major_regional"
      ? "Regional delivery to " + shippingZone.region
      : shippingZone.zone === "metro"
        ? "Free metro delivery"
        : undefined

    const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost
    const gst = subtotalAfterDiscount * 0.1
    const total = subtotalAfterDiscount + gst

    // Format dates
    const quoteDate = String(format(quote.createdAt, "d MMMM yyyy"))
    const validUntil = String(format(getQuoteExpiry(quote.createdAt), "d MMMM yyyy"))

    // Prepare items for PDF - ensure all values are primitives
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

    // Build PDF data
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
      shippingNotes,
      gst,
      total,
      hasUnpricedItems: Boolean(quote.hasUnpricedItems),
      notes: quote.notes ? String(quote.notes) : undefined,
      preparedBy,
      isDraft,
    }

    // Generate PDF using Pages Router (compatible with react-pdf)
    const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))

    // Return PDF
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      "inline; filename=\"" + quote.quoteNumber + ".pdf\""
    )
    res.send(Buffer.from(pdfBuffer))
  } catch (error) {
    console.error("PDF generation error:", error)
    return res.status(500).json({ error: "Failed to generate PDF" })
  }
}
