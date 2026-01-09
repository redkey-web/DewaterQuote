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

// Define fonts (using built-in Roboto)
const fonts = {
  Roboto: {
    normal: "node_modules/pdfmake/build/vfs_fonts.js",
    bold: "node_modules/pdfmake/build/vfs_fonts.js",
    italics: "node_modules/pdfmake/build/vfs_fonts.js",
    bolditalics: "node_modules/pdfmake/build/vfs_fonts.js",
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
          {
            ul: [
              `This quote is valid until ${validUntilStr}.`,
              "Payment terms: 14 days from invoice date.",
              "All prices are in Australian Dollars (AUD).",
              "Prices shown exclude GST unless otherwise stated.",
              "Free road freight to metro areas. Regional/remote delivery quoted separately.",
              "Lead times shown per item above (subject to stock availability).",
              "To accept this quote, reply to this email or call 1300 271 290.",
            ],
            fontSize: 8,
            color: "#666",
          },
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
