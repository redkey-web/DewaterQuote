import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { put, del } from "@vercel/blob"
import { renderToBuffer } from "@react-pdf/renderer"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "@/lib/pdf/quote-pdf"
import { format } from "date-fns"
import { getQuoteExpiry } from "@/lib/quote"
import { checkShippingZone } from "@/lib/shipping/metro-postcodes"

/**
 * POST /api/admin/quotes/[id]/store-pdf
 *
 * Generates or regenerates the quote PDF and stores it in Vercel Blob.
 * Updates the quote record with the new PDF URL and metadata.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.query
  const quoteId = parseInt(id as string, 10)

  if (isNaN(quoteId)) {
    return res.status(400).json({ error: "Invalid quote ID" })
  }

  try {
    // Fetch quote with items
    const quote = await db.query.quotes.findFirst({
      where: eq(quotes.id, quoteId),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
        },
      },
    })

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" })
    }

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

    // Calculate totals
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
    const pdfItems: QuoteItemPDF[] = quote.items.map((item) => ({
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

    // Build PDF data - ensure all values are primitives to prevent React Error #31
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
    }

    // Generate PDF buffer
    console.log("[Quote " + quote.quoteNumber + "] Generating PDF...")
    const pdfArrayBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
    const pdfBuffer = Buffer.from(pdfArrayBuffer)
    console.log("[Quote " + quote.quoteNumber + "] PDF buffer: " + pdfBuffer.length + " bytes")

    // Delete old PDF if exists
    if (quote.pdfUrl) {
      try {
        await del(quote.pdfUrl)
        console.log("[Quote " + quote.quoteNumber + "] Deleted old PDF from blob")
      } catch (deleteError) {
        console.error("[Quote " + quote.quoteNumber + "] Failed to delete old PDF:", deleteError)
        // Continue anyway - old blob will be orphaned but we can still upload new one
      }
    }

    // Calculate new version number
    const newVersion = (quote.pdfVersion || 0) + 1

    // Upload to Vercel Blob
    const blobPath = "quotes/" + quote.quoteNumber + "/quote-v" + newVersion + ".pdf"
    const blob = await put(blobPath, pdfBuffer, {
      contentType: "application/pdf",
      access: "public",
      cacheControlMaxAge: 31536000, // 1 year cache
    })

    console.log("[Quote " + quote.quoteNumber + "] PDF uploaded to: " + blob.url)

    // Update quote record with PDF info
    const now = new Date()
    await db
      .update(quotes)
      .set({
        pdfUrl: blob.url,
        pdfGeneratedAt: now,
        pdfVersion: newVersion,
      })
      .where(eq(quotes.id, quoteId))

    return res.status(200).json({
      success: true,
      pdfUrl: blob.url,
      pdfGeneratedAt: now.toISOString(),
      pdfVersion: newVersion,
      size: pdfBuffer.length,
    })
  } catch (error) {
    console.error("Failed to store PDF:", error)
    return res.status(500).json({ error: "Failed to generate and store PDF" })
  }
}
