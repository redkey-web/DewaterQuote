import PdfPrinter from "pdfmake"
import type { TDocumentDefinitions, Content, ContentTable } from "pdfmake/interfaces"

interface QuoteItem {
  name: string
  sku: string
  brand: string
  quantity: number
  materialTestCert?: boolean
  leadTime?: string // e.g., "2-3 weeks", "In Stock", "7 weeks FRO"
  variation?: {
    sku: string
    sizeLabel: string
    price?: number
  }
}

// Helper to get quote expiry date (end of next month)
function getQuoteExpiry(date: Date = new Date()): Date {
  // Go to next month
  const expiry = new Date(date.getFullYear(), date.getMonth() + 2, 0) // Day 0 = last day of previous month
  return expiry
}

interface Address {
  street: string
  suburb: string
  state: string
  postcode: string
}

interface QuotePDFData {
  quoteNumber: string
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: Address
  billingAddress: Address
  items: QuoteItem[]
  totals: {
    itemCount: number
    pricedTotal: number
    savings: number
    hasUnpricedItems: boolean
    certFee?: number
    certCount?: number
  }
  notes?: string
  deliveryNote?: string // "Free metro delivery" or "Delivery to be confirmed"
}

// Use Helvetica - standard PDF font that doesn't require external files
// This works in all environments including Vercel serverless
const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

// Helper to format currency
const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return "POA"
  return `$${amount.toFixed(2)}`
}

export async function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
  const pdfMakePrinter = new PdfPrinter(fonts)

  const formatAddress = (addr: Address) =>
    `${addr.street}\n${addr.suburb} ${addr.state} ${addr.postcode}`

  // Calculate pricing
  const subtotal = data.totals.pricedTotal
  const discount = data.totals.savings
  const certFee = data.totals.certFee || 0
  const subtotalAfterDiscount = subtotal - discount + certFee
  const gst = subtotalAfterDiscount * 0.1
  const grandTotal = subtotalAfterDiscount + gst
  const discountPercentage = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0

  // Validity date (end of next month)
  const validUntil = getQuoteExpiry()
  const validUntilStr = validUntil.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })

  // Build items table with pricing
  const itemsTableBody: Content[][] = [
    [
      { text: "SKU", style: "tableHeader" },
      { text: "Product", style: "tableHeader" },
      { text: "Qty", style: "tableHeader", alignment: "center" },
      { text: "Unit Price", style: "tableHeader", alignment: "right" },
      { text: "Total", style: "tableHeader", alignment: "right" },
    ],
  ]

  data.items.forEach((item) => {
    const sku = item.variation?.sku || item.sku
    const unitPrice = item.variation?.price
    const lineTotal = unitPrice ? unitPrice * item.quantity : undefined

    itemsTableBody.push([
      { text: sku, fontSize: 9 },
      {
        stack: [
          { text: item.name, fontSize: 9 },
          ...(item.variation?.sizeLabel ? [{ text: `Size: ${item.variation.sizeLabel}`, fontSize: 8, color: "#666" }] : []),
          ...(item.leadTime ? [{ text: `Lead time: ${item.leadTime}`, fontSize: 8, italics: true, color: "#666" }] : []),
          ...(item.materialTestCert ? [{ text: "+ Material Test Cert", fontSize: 8, color: "#0ea5e9" }] : []),
        ],
      },
      { text: item.quantity.toString(), alignment: "center", fontSize: 9 },
      { text: formatCurrency(unitPrice), alignment: "right", fontSize: 9 },
      { text: formatCurrency(lineTotal), alignment: "right", fontSize: 9 },
    ])
  })

  // Build totals section
  const totalsRows: Content[][] = []

  // Subtotal (before discount)
  if (subtotal > 0) {
    totalsRows.push([
      { text: "Subtotal:", alignment: "right", bold: true },
      { text: formatCurrency(subtotal), alignment: "right" },
    ])
  }

  // Discount (if any)
  if (discount > 0) {
    totalsRows.push([
      { text: `Bulk Discount (${discountPercentage}%):`, alignment: "right", color: "#16a34a" },
      { text: `-${formatCurrency(discount)}`, alignment: "right", color: "#16a34a" },
    ])
  }

  // Material certificates (if any)
  if (certFee > 0 && data.totals.certCount) {
    totalsRows.push([
      { text: `Material Test Certificates (${data.totals.certCount}):`, alignment: "right" },
      { text: formatCurrency(certFee), alignment: "right" },
    ])
  }

  // Delivery
  const deliveryNote = data.deliveryNote || "Free metro delivery"
  totalsRows.push([
    { text: "Delivery:", alignment: "right" },
    { text: deliveryNote, alignment: "right", fontSize: 9 },
  ])

  // Subtotal after discount
  if (subtotal > 0) {
    totalsRows.push([
      { text: "Net Total (ex GST):", alignment: "right", bold: true },
      { text: formatCurrency(subtotalAfterDiscount), alignment: "right", bold: true },
    ])

    // GST
    totalsRows.push([
      { text: "GST (10%):", alignment: "right" },
      { text: formatCurrency(gst), alignment: "right" },
    ])

    // Grand Total
    totalsRows.push([
      { text: "TOTAL (inc GST):", alignment: "right", bold: true, fontSize: 12 },
      { text: formatCurrency(grandTotal), alignment: "right", bold: true, fontSize: 12 },
    ])
  }

  // POA note if applicable
  if (data.totals.hasUnpricedItems) {
    totalsRows.push([
      { text: "", alignment: "right" },
      { text: "* Some items priced on application (POA)", alignment: "right", fontSize: 8, color: "#d97706" },
    ])
  }

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          {
            text: "DEWATER PRODUCTS",
            style: "companyName",
            width: "*",
          },
          {
            text: [
              { text: "QUOTE\n", style: "documentTitle" },
              { text: data.quoteNumber, style: "quoteNumber" },
            ],
            alignment: "right",
            width: "auto",
          },
        ],
      },
      {
        text: "Australia's Industrial Pipe Fittings Specialists",
        style: "tagline",
        margin: [0, 0, 0, 5],
      },
      {
        columns: [
          { text: `Date: ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`, fontSize: 9 },
          { text: `Valid until: ${validUntilStr}`, fontSize: 9, alignment: "right", color: "#666" },
        ],
        margin: [0, 0, 0, 20],
      },

      // Customer & Delivery Info
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: "CUSTOMER", style: "sectionHeader" },
              { text: data.companyName, bold: true, margin: [0, 5, 0, 0] },
              { text: data.contactName },
              { text: data.email },
              { text: data.phone },
            ],
          },
          {
            width: "*",
            stack: [
              { text: "DELIVERY ADDRESS", style: "sectionHeader" },
              { text: formatAddress(data.deliveryAddress), margin: [0, 5, 0, 0] },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Items Table
      { text: "QUOTED ITEMS", style: "sectionHeader", margin: [0, 10, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: [60, "*", 35, 65, 65],
          body: itemsTableBody,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#ddd",
          vLineColor: () => "#ddd",
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#f0f9ff" : null),
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
      },

      // Totals Section
      {
        margin: [250, 20, 0, 0],
        table: {
          widths: ["*", 80],
          body: totalsRows,
        },
        layout: {
          hLineWidth: (i: number, node: ContentTable) => (i === node.table.body.length - (data.totals.hasUnpricedItems ? 2 : 1) ? 1 : 0),
          vLineWidth: () => 0,
          hLineColor: () => "#0ea5e9",
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
      },

      // Notes
      ...(data.notes
        ? [
            { text: "NOTES", style: "sectionHeader", margin: [0, 25, 0, 8] } as Content,
            { text: data.notes, fontSize: 9, margin: [0, 0, 0, 15] } as Content,
          ]
        : []),

      // Terms & Conditions
      {
        margin: [0, 25, 0, 0],
        stack: [
          { text: "TERMS & CONDITIONS", style: "sectionHeader", margin: [0, 0, 0, 8] },

          // Payment
          { text: "Payment", fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
          {
            ol: [
              "If a deposit is required as stated on the quotation, then the deposit amount needs to be paid in full before Dewater Products Pty Ltd, will either dispatch the goods if Ex Stock, or before manufacturing can occur. The percentage of the deposit will be specified eg, 50%.",
              "If you do not have a trading account with Dewater Products Pty Ltd, then payment in full will need to be made, before Dewater Products Pty Ltd will either dispatch the goods, or proceed with manufacturing. Made to order goods will generally need to be paid in advance.",
            ],
            fontSize: 7,
            color: "#666",
            margin: [0, 0, 0, 8],
          },

          // Lead time
          { text: "Lead time", fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
          {
            ol: [
              "The quotation should detail the lead time to supply the goods, Ex Works in Perth, Western Australia. If the quotation does not detail the product as \"Ex Stock\", then a lead time will apply. This lead time should be quoted with the goods.",
              "Currently COVID-19 is causing unpredictable lead time extensions and when ordering you agree to a possible lead time extension, which is outside of the control of Dewater Products Pty Ltd.",
            ],
            fontSize: 7,
            color: "#666",
            margin: [0, 0, 0, 8],
            start: 3,
          },

          // Delivery
          { text: "Delivery", fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
          {
            ol: [
              "The quotation should detail how the good(s) quoted will be delivered.",
              "Dewater Products Pty Ltd will always try to offer free delivery via road freight to customers although this is not possible if the delivery address is in a remote location resulting in our freight company charging us extra fees such as a remote delivery fee. This would be discussed with the customer if it occurs. An extra charge may be quoted and will depend on the weight and size of the goods, and the remote location.",
              "You should allow extra days for delivery to occur on top of the lead time stated.",
              "Delivery via road freight is outside of the control of Dewater Products Pty Ltd, and any freight matters should be dealt with the freight company, once Dewater Products Pty Ltd advises the Freight company and the consignment number or tracking number.",
              "Dewater Products Pty Ltd will try and obtain a delivery date from the freight company but does not have any input or management power over the road freight once it has left our warehouse.",
              "You as the customer and receiver should ensure that you provide Dewater Products Pty Ltd with the correct delivery address at the time of ordering, to ensure there are no delays.",
              "Other freight types such as Air freight can be quoted when requested.",
            ],
            fontSize: 7,
            color: "#666",
            margin: [0, 0, 0, 8],
            start: 5,
          },

          // Order Cancellations and Returns
          { text: "Order Cancellations and Returns", fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
          {
            ol: [
              "You can only cancel an Order if the goods you ordered were quoted as Ex Stock and were Ex Stock at the time they were ordered or paid for. This must also occur within 7 days.",
              "You cannot return goods to us, once 7 days has passed from receiving the goods, which were Ex Stock, at the time they were quoted, ordered and paid for. No refund will be approved.",
              "You cannot cancel an Order, or return goods if a lead time applies, and manufacturing has begun. Most products we sell, are bespoke products and made to order. Charges will apply.",
            ],
            fontSize: 7,
            color: "#666",
            margin: [0, 0, 0, 8],
            start: 12,
          },

          // No Returns
          { text: "No Returns - Purchase Order cannot be cancelled", fontSize: 9, bold: true, margin: [0, 5, 0, 3] },
          {
            ol: [
              "If you choose to cancel the Purchase Order, once manufacturing has started, you will need to pay for all of the costs up to the date of cancelling. Such as materials, labour and freight costs.",
              "The costs to be paid to us could be a very high percentage of the order value such as 90%. This should be considered by you the customer before cancelling a Purchase Order.",
              "All costs will be minimised where possible, but would be difficult with bespoke made to order products.",
              "If you choose to amend the Purchase Order, once manufacturing has started such as reducing the quantity, you will need to pay us all costs associated with the unwanted goods which could potentially be up to 90% of the sale price. Such as materials, labour and freight costs. All costs will be minimised where possible, but would be difficult with bespoke made to order products.",
              "Manufacturing will generally start the following day after payment has been received, or if you have a trading account, the following day is generally when manufacturing begins.",
              "Therefore it is important that your Purchase Order is correct, that you have ordered the correct quantity, size, model, brand and any other product specific details.",
              "We want our customers to order the correct parts, so that orders are not cancelled or amended. You must also consider the lead time quoted and not use it as an excuse to cancel.",
              "Price - Pricing Quoted - The quoted price for a specific product and size is specific to the Quantity quoted. We reserve the right to reject a Purchase Order, when the quantity ordered, does not match the quantity quoted.",
            ],
            fontSize: 7,
            color: "#666",
            margin: [0, 0, 0, 8],
            start: 15,
          },

          // Credit card notice
          { text: "Credit Card Payments incur 1.9% Surcharge", fontSize: 8, bold: true, color: "#d97706", margin: [0, 10, 0, 5] },

          // Contact
          { text: `Quote valid until ${validUntilStr}. To accept this quote, reply to this email or call 1300 271 290.`, fontSize: 8, color: "#0ea5e9", margin: [0, 5, 0, 0] },
        ],
      },

      // Footer
      {
        margin: [0, 30, 0, 0],
        stack: [
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#ddd" }] },
          {
            columns: [
              {
                stack: [
                  { text: "Dewater Products Pty Ltd", fontSize: 9, bold: true, color: "#333" },
                  { text: "ABN: 98 622 681 663", fontSize: 8, color: "#666" },
                ],
                margin: [0, 10, 0, 0],
              },
              {
                stack: [
                  { text: "1300 271 290", fontSize: 9, alignment: "center" },
                  { text: "Perth, Western Australia", fontSize: 8, color: "#666", alignment: "center" },
                ],
                margin: [0, 10, 0, 0],
              },
              {
                stack: [
                  { text: "sales@dewaterproducts.com.au", fontSize: 9, alignment: "right" },
                  { text: "dewaterproducts.com.au", fontSize: 8, color: "#666", alignment: "right" },
                ],
                margin: [0, 10, 0, 0],
              },
            ],
          },
        ],
      },
    ],
    styles: {
      companyName: {
        fontSize: 20,
        bold: true,
        color: "#0ea5e9",
      },
      tagline: {
        fontSize: 10,
        color: "#666",
      },
      documentTitle: {
        fontSize: 16,
        bold: true,
      },
      quoteNumber: {
        fontSize: 11,
        color: "#666",
      },
      sectionHeader: {
        fontSize: 10,
        bold: true,
        color: "#0ea5e9",
      },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: "#0c4a6e",
      },
    },
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 10,
    },
  }

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = pdfMakePrinter.createPdfKitDocument(docDefinition)
      const chunks: Buffer[] = []

      pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk))
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)))
      pdfDoc.on("error", reject)

      pdfDoc.end()
    } catch (error) {
      reject(error)
    }
  })
}
