import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/db"
import { quotes, quoteItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import {
  generateApprovedQuoteEmailHtml,
  type ApprovedQuoteEmailData,
  type QuoteItemEmail,
} from "@/lib/email/approved-quote-email"
import { format, addDays } from "date-fns"

export async function GET(
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

    // Get query params for optional overrides
    const url = new URL(request.url)
    const shippingCost = parseFloat(url.searchParams.get("shipping") || "0")
    const shippingNotes = url.searchParams.get("shippingNotes") || undefined
    const preparedBy = url.searchParams.get("preparedBy") || undefined

    // Fetch quote with items
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1)

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
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

    // Prepare items for email
    const emailItems: QuoteItemEmail[] = items.map((item) => ({
      sku: item.variationSku || item.sku,
      name: item.name,
      brand: item.brand,
      sizeLabel: item.sizeLabel || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
      lineTotal: item.lineTotal ? parseFloat(item.lineTotal) : null,
      quotedPrice: item.quotedPrice ? parseFloat(item.quotedPrice) : null,
      quotedNotes: item.quotedNotes || undefined,
      materialTestCert: item.materialTestCert || false,
    }))

    // Build email data
    const emailData: ApprovedQuoteEmailData = {
      quoteNumber: quote.quoteNumber,
      quoteDate,
      validUntil,
      companyName: quote.companyName,
      contactName: quote.contactName,
      email: quote.email,
      phone: quote.phone,
      deliveryAddress,
      billingAddress,
      items: emailItems,
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
      websiteUrl: process.env.NEXT_PUBLIC_URL || "https://dewaterproducts.com.au",
    }

    // Generate email HTML
    const html = generateApprovedQuoteEmailHtml(emailData)

    // Return HTML
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Email preview error:", error)
    return NextResponse.json(
      { error: "Failed to generate email preview" },
      { status: 500 }
    )
  }
}
