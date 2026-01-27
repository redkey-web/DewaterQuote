/**
 * Resend quotes to customers
 * Usage: npx tsx scripts/resend-quotes.ts [quote_ids...]
 * Example: npx tsx scripts/resend-quotes.ts 12 13 14 15
 */

import React from "react"
import { sendEmail } from "../src/lib/email/client"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "../src/db"
import { quotes, quoteItems } from "../src/db/schema"
import { eq } from "drizzle-orm"
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from "../src/lib/pdf/quote-pdf"
import {
  generateApprovedQuoteEmailHtml,
  generateApprovedQuoteEmailText,
  type ApprovedQuoteEmailData,
} from "../src/lib/email/approved-quote-email"
import { format } from "date-fns"
import { getQuoteExpiry } from "../src/lib/quote"

// Check SMTP configuration
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("SMTP_USER and SMTP_PASS are required")
  process.exit(1)
}

const REPLY_TO = process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au"

async function resendQuote(quoteId: number) {
  console.log("\n--- Processing Quote ID: " + quoteId + " ---")

  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, quoteId))
    .limit(1)

  if (!quote) {
    console.error("Quote " + quoteId + " not found")
    return false
  }

  console.log("Quote: " + quote.quoteNumber)
  console.log("Customer: " + quote.contactName + " <" + quote.email + ">")
  console.log("Company: " + quote.companyName)

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

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId))
    .orderBy(quoteItems.displayOrder)

  console.log("Items: " + items.length)

  const subtotal = parseFloat(quote.pricedTotal || "0")
  const savings = parseFloat(quote.savings || "0")
  const certFee = parseFloat(quote.certFee || "0")
  const certCount = quote.certCount || 0
  const shippingCost = 0

  const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost
  const gst = subtotalAfterDiscount * 0.1
  const total = subtotalAfterDiscount + gst

  const quoteDate = format(quote.createdAt, "d MMMM yyyy")
  const validUntil = format(getQuoteExpiry(quote.createdAt), "d MMMM yyyy")

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
    gst,
    total,
    hasUnpricedItems: quote.hasUnpricedItems || false,
    notes: quote.notes || undefined,
  }

  const emailData: ApprovedQuoteEmailData = {
    ...pdfData,
    websiteUrl: "https://dewaterproducts.com.au",
  }

  console.log("Generating PDF...")
  const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
  const pdfBase64 = Buffer.isBuffer(pdfBuffer)
    ? pdfBuffer.toString("base64")
    : Buffer.from(pdfBuffer).toString("base64")

  console.log("PDF size: " + pdfBase64.length + " chars base64")

  const htmlContent = generateApprovedQuoteEmailHtml(emailData)
  const textContent = generateApprovedQuoteEmailText(emailData)

  // Convert base64 to Buffer for nodemailer
  const pdfBufferForEmail = Buffer.from(pdfBase64, "base64")

  console.log("Sending to: " + quote.email + "...")
  try {
    await sendEmail({
      to: quote.email,
      subject: "Your Quote " + quote.quoteNumber + " from Dewater Products",
      html: htmlContent,
      text: textContent,
      replyTo: REPLY_TO,
      attachments: [
        {
          filename: quote.quoteNumber + ".pdf",
          content: pdfBufferForEmail,
          contentType: "application/pdf",
        },
      ],
    })
    console.log("✅ Sent successfully to " + quote.email)
  } catch (sendError: unknown) {
    const err = sendError as { message?: string }
    console.error("Email error:", err.message || sendError)
    throw sendError
  }

  return true
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log("Usage: npx tsx scripts/resend-quotes.ts [quote_ids...]")
    console.log("Example: npx tsx scripts/resend-quotes.ts 12 13 14 15")
    process.exit(1)
  }

  const quoteIds = args.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id))

  console.log("Resending " + quoteIds.length + " quotes: " + quoteIds.join(", "))

  let success = 0
  let failed = 0

  for (const id of quoteIds) {
    try {
      const result = await resendQuote(id)
      if (result) success++
      else failed++
    } catch (error) {
      console.error("❌ Failed to send quote " + id + ":", error)
      failed++
    }
  }

  console.log("\n=== Summary ===")
  console.log("Sent: " + success)
  console.log("Failed: " + failed)

  process.exit(failed > 0 ? 1 : 0)
}

main()
