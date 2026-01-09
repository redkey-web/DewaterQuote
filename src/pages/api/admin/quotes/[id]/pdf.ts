import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import { format, addDays } from "date-fns"
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

    // Calculate totals
    const subtotal = parseFloat(quote.pricedTotal || "0")
    const savings = parseFloat(quote.savings || "0")
    const certFee = parseFloat(quote.certFee || "0")
    const certCount = quote.certCount || 0

    const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost
    const gst = subtotalAfterDiscount * 0.1
    const total = subtotalAfterDiscount + gst

    // Format dates
    const quoteDate = format(quote.createdAt, "d MMMM yyyy")
    const validUntil = format(addDays(quote.createdAt, 30), "d MMMM yyyy")

    // Prepare items for PDF
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

    // Build address objects from separate columns
    const deliveryAddress = {
      street: quote.deliveryStreet || "",
      suburb: quote.deliverySuburb || "",
      state: quote.deliveryState || "",
      postcode: quote.deliveryPostcode || "",
    }

    const billingAddress = {
      street: quote.billingStreet || quote.deliveryStreet || "",
      suburb: quote.billingSuburb || quote.deliverySuburb || "",
      state: quote.billingState || quote.deliveryState || "",
      postcode: quote.billingPostcode || quote.deliveryPostcode || "",
    }

    // Build PDF data
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
      shippingNotes,
      gst,
      total,
      hasUnpricedItems: quote.hasUnpricedItems || false,
      notes: quote.notes || undefined,
      preparedBy,
      isDraft,
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
