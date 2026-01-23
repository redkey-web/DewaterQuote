import { escapeHtml } from "@/lib/sanitize"

interface Address {
  street: string
  suburb: string
  state: string
  postcode: string
}

export interface QuoteItemEmail {
  sku: string
  name: string
  brand: string
  sizeLabel?: string
  quantity: number
  unitPrice?: number | null
  lineTotal?: number | null
  quotedPrice?: number | null
  quotedNotes?: string | null
  materialTestCert?: boolean
  leadTime?: string | null
}

export interface ApprovedQuoteEmailData {
  quoteNumber: string
  quoteDate: string
  validUntil: string
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: Address
  billingAddress?: Address
  items: QuoteItemEmail[]
  subtotal: number
  savings: number
  certFee: number
  certCount: number
  shippingCost?: number
  shippingNotes?: string
  gst: number
  total: number
  hasUnpricedItems: boolean
  notes?: string
  preparedBy?: string
  acceptUrl?: string
  websiteUrl?: string
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "POA"
  return `$${amount.toFixed(2)}`
}

function formatAddress(addr: Address): string {
  return `${addr.street}, ${addr.suburb} ${addr.state} ${addr.postcode}`
}

export function generateApprovedQuoteEmailHtml(data: ApprovedQuoteEmailData): string {
  const safeCompanyName = escapeHtml(data.companyName)
  const safeContactName = escapeHtml(data.contactName)
  const websiteUrl = data.websiteUrl || "https://dewaterproducts.com.au"

  const showBilling =
    data.billingAddress &&
    formatAddress(data.billingAddress) !== formatAddress(data.deliveryAddress)

  // Build items table rows
  const itemsTableRows = data.items
    .map((item) => {
      const unitPrice = item.quotedPrice ?? item.unitPrice
      const lineTotal =
        unitPrice != null ? unitPrice * item.quantity : item.lineTotal

      const safeName = escapeHtml(item.name)
      const safeBrand = escapeHtml(item.brand)
      const safeSku = escapeHtml(item.sku)
      const safeSize = item.sizeLabel ? escapeHtml(item.sizeLabel) : ""
      const safeNotes = item.quotedNotes ? escapeHtml(item.quotedNotes) : ""
      const safeLeadTime = item.leadTime ? escapeHtml(item.leadTime) : ""

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #666;">
            ${safeSku}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #1a1a1a;">${safeName}</strong><br />
            <span style="font-size: 12px; color: #666;">${safeBrand}</span>
            ${safeSize ? "<br /><span style=\"font-size: 12px; color: #666;\">" + safeSize + "</span>" : ""}
            ${item.materialTestCert ? '<br /><span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-top: 4px;">+ Material Cert</span>' : ""}
            ${safeLeadTime ? "<br /><span style=\"font-size: 11px; color: #666;\">Lead time: " + safeLeadTime + "</span>" : ""}
            ${safeNotes ? "<br /><span style=\"font-size: 11px; color: #92400e; font-style: italic;\">Note: " + safeNotes + "</span>" : ""}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${formatCurrency(unitPrice)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
            ${formatCurrency(lineTotal)}
          </td>
        </tr>
      `
    })
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote from Dewater Products - ${data.quoteNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700;"><span style="color: #ffffff;">DEWATER</span> <span style="color: #94a3b8;">PRODUCTS</span></h1>
              <p style="margin: 5px 0 0 0; color: #bae6fd; font-size: 12px; letter-spacing: 2px;">AUSTRALIA</p>
              <p style="margin: 8px 0 0 0; color: #bae6fd; font-size: 10px;">ABN: 98 622 681 663</p>
            </td>
          </tr>

          <!-- Quote Badge -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f0f9ff; border-bottom: 2px solid #0ea5e9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">Quotation</span>
                  </td>
                  <td style="text-align: right;">
                    <strong style="color: #1a1a1a; font-size: 16px;">${data.quoteNumber}</strong><br />
                    <span style="font-size: 12px; color: #666;">Date: ${data.quoteDate}</span><br />
                    <span style="font-size: 12px; color: #666;">Valid until: ${data.validUntil}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 20px;">Hi ${safeContactName},</h2>
              <p style="margin: 0; color: #4b5563; line-height: 1.6;">
                Thank you for your quote request. We're pleased to provide you with the following quotation for ${safeCompanyName}.
                Please review the details below and let us know if you have any questions.
              </p>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #0ea5e9;">
                    <strong style="display: block; color: #1a1a1a; margin-bottom: 8px;">Delivery Address</strong>
                    <span style="color: #4b5563; font-size: 14px;">
                      ${escapeHtml(data.deliveryAddress.street)}<br />
                      ${escapeHtml(data.deliveryAddress.suburb)} ${escapeHtml(data.deliveryAddress.state)} ${escapeHtml(data.deliveryAddress.postcode)}
                    </span>
                    ${
                      showBilling && data.billingAddress
                        ? `
                    <br /><br />
                    <strong style="display: block; color: #1a1a1a; margin-bottom: 8px;">Billing Address</strong>
                    <span style="color: #4b5563; font-size: 14px;">
                      ${escapeHtml(data.billingAddress.street)}<br />
                      ${escapeHtml(data.billingAddress.suburb)} ${escapeHtml(data.billingAddress.state)} ${escapeHtml(data.billingAddress.postcode)}
                    </span>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                Quoted Items (${data.items.length})
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #0ea5e9;">
                    <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 12px; font-weight: 600;">SKU</th>
                    <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 12px; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 12px; font-weight: 600;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; font-weight: 600;">Unit</th>
                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTableRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="280" cellpadding="0" cellspacing="0" align="right" style="background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #666;">Subtotal</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    ${formatCurrency(data.subtotal)}
                  </td>
                </tr>
                ${
                  data.savings > 0
                    ? `
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #059669;">Bulk Discount</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #dc2626;">
                    -${formatCurrency(data.savings)}
                  </td>
                </tr>
                `
                    : ""
                }
                ${
                  data.certFee > 0
                    ? `
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #666;">Material Certs (${data.certCount})</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    ${formatCurrency(data.certFee)}
                  </td>
                </tr>
                `
                    : ""
                }
                ${
                  data.shippingCost != null && data.shippingCost > 0
                    ? `
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #666;">Shipping${data.shippingNotes ? ` (${escapeHtml(data.shippingNotes)})` : ""}</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    ${formatCurrency(data.shippingCost)}
                  </td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #666;">GST (10%)</span>
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    ${formatCurrency(data.gst)}
                  </td>
                </tr>
                <tr style="background-color: #0ea5e9;">
                  <td style="padding: 15px;">
                    <strong style="color: #ffffff; font-size: 14px;">Total (inc GST)</strong>
                  </td>
                  <td style="padding: 15px; text-align: right;">
                    <strong style="color: #ffffff; font-size: 18px;">${formatCurrency(data.total)}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.hasUnpricedItems
              ? `
          <!-- POA Notice -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background-color: #fef9c3; padding: 15px; border-radius: 6px; border-left: 4px solid #eab308;">
                <strong style="color: #92400e;">Note:</strong>
                <span style="color: #78350f;"> Some items marked as POA require price confirmation. Please contact us for final pricing.</span>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 12px 0; color: #065f46; font-size: 14px;">Ready to order?</h4>
                <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.6;">
                  Just email your purchase order to
                  <a href="mailto:sales@dewaterproducts.com.au" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">sales@dewaterproducts.com.au</a>
                  along with a copy of this email or attached PDF.
                </p>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">
                  Questions? Call us on <a href="tel:1300271290" style="color: #0ea5e9; text-decoration: none;">1300 271 290</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Terms -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; border-left: 4px solid #0ea5e9;">
                <h4 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 14px;">Terms & Conditions</h4>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.8;">
                  <li>Quote valid for 30 days from date of issue</li>
                  <li>All prices in AUD, GST included where shown</li>
                  <li>Payment: 30 days from invoice for approved accounts</li>
                  <li>Free metro delivery for orders over $500 (ex GST)</li>
                  <li>Material certificates will extend lead times</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600; font-size: 18px;">Dewater Products Pty Ltd</p>
              <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 13px;">ABN: 98 622 681 663</p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 13px;">Perth, Western Australia</p>
              <p style="margin: 0 0 8px 0;">
                <a href="tel:1300271290" style="color: #60a5fa; text-decoration: none; font-size: 20px; font-weight: 600;">1300 271 290</a>
              </p>
              <p style="margin: 0 0 8px 0;">
                <a href="mailto:sales@dewaterproducts.com.au" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">sales@dewaterproducts.com.au</a>
              </p>
              <p style="margin: 15px 0 0 0;">
                <a href="${websiteUrl}" style="color: #60a5fa; text-decoration: none; font-size: 13px;">${websiteUrl.replace("https://", "")}</a>
              </p>
              ${data.preparedBy ? '<p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">Quote prepared by: ${escapeHtml(data.preparedBy)}</p>' : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function generateApprovedQuoteEmailText(data: ApprovedQuoteEmailData): string {
  const showBilling =
    data.billingAddress &&
    formatAddress(data.billingAddress) !== formatAddress(data.deliveryAddress)

  const itemsList = data.items
    .map((item) => {
      const unitPrice = item.quotedPrice ?? item.unitPrice
      const lineTotal =
        unitPrice != null ? unitPrice * item.quantity : item.lineTotal
      const certNote = item.materialTestCert ? " [+ Material Cert]" : ""
      const notes = item.quotedNotes ? ` - Note: ${item.quotedNotes}` : ""

      return `  - ${item.sku} | ${item.name} | Qty: ${item.quantity} | ${formatCurrency(unitPrice)} ea | ${formatCurrency(lineTotal)}${certNote}${notes}`
    })
    .join("\n")

  return `
DEWATER PRODUCTS AUSTRALIA
===========================

QUOTATION: ${data.quoteNumber}
Date: ${data.quoteDate}
Valid Until: ${data.validUntil}

---

Hi ${data.contactName},

Thank you for your quote request. We're pleased to provide you with the following quotation for ${data.companyName}.

DELIVERY ADDRESS
----------------
${data.deliveryAddress.street}
${data.deliveryAddress.suburb} ${data.deliveryAddress.state} ${data.deliveryAddress.postcode}
${
  showBilling && data.billingAddress
    ? `
BILLING ADDRESS
---------------
${data.billingAddress.street}
${data.billingAddress.suburb} ${data.billingAddress.state} ${data.billingAddress.postcode}
`
    : ""
}

QUOTED ITEMS (${data.items.length})
----------------------------------
${itemsList}

TOTALS
------
Subtotal:           ${formatCurrency(data.subtotal)}
${data.savings > 0 ? `Bulk Discount:      -${formatCurrency(data.savings)}\n` : ""}${data.certFee > 0 ? `Material Certs (${data.certCount}): ${formatCurrency(data.certFee)}\n` : ""}${data.shippingCost != null && data.shippingCost > 0 ? `Shipping:           ${formatCurrency(data.shippingCost)}${data.shippingNotes ? ` (${data.shippingNotes})` : ""}\n` : ""}GST (10%):          ${formatCurrency(data.gst)}
--------------------------
TOTAL (inc GST):    ${formatCurrency(data.total)}

${data.hasUnpricedItems ? "Note: Some items marked as POA require price confirmation.\n" : ""}

TERMS & CONDITIONS
------------------
- Quote valid for 30 days from date of issue
- All prices in AUD, GST included where shown
- Payment: 30 days from invoice for approved accounts
- Free metro delivery for orders over $500 (ex GST)
- Material certificates will extend lead times

---

Ready to order? Just email your purchase order to sales@dewaterproducts.com.au along with a copy of this email or attached PDF.

---

Dewater Products Pty Ltd
ABN: 98 622 681 663
Perth, Western Australia
Phone: 1300 271 290
Email: sales@dewaterproducts.com.au
Web: dewaterproducts.com.au
${data.preparedBy ? `\nQuote prepared by: ${data.preparedBy}` : ""}
  `.trim()
}
