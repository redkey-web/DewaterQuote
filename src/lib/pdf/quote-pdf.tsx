import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer"

// Register fonts for better typography
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottom: "2 solid #0ea5e9",
    paddingBottom: 20,
  },
  logo: {
    width: 180,
    height: 50,
  },
  headerRight: {
    textAlign: "right",
  },
  quoteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0ea5e9",
    marginBottom: 4,
  },
  quoteNumber: {
    fontSize: 12,
    color: "#666666",
  },
  quoteDate: {
    fontSize: 10,
    color: "#888888",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  addressBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    padding: 8,
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    padding: 8,
    minHeight: 36,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    padding: 8,
    backgroundColor: "#f9fafb",
    minHeight: 36,
  },
  colSku: { width: "12%", fontSize: 9 },
  colProduct: { width: "38%", fontSize: 9 },
  colQty: { width: "10%", textAlign: "center", fontSize: 9 },
  colUnit: { width: "15%", textAlign: "right", fontSize: 9 },
  colTotal: { width: "15%", textAlign: "right", fontSize: 9 },
  colCert: { width: "10%", textAlign: "center", fontSize: 8 },
  productName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 8,
    color: "#666666",
  },
  certBadge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "2 4",
    borderRadius: 2,
    fontSize: 7,
    marginTop: 2,
  },
  totalsSection: {
    marginTop: 20,
    marginLeft: "auto",
    width: 250,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottom: "1 solid #f3f4f6",
  },
  totalLabel: {
    fontSize: 10,
    color: "#666666",
  },
  totalValue: {
    fontSize: 10,
    color: "#1a1a1a",
    textAlign: "right",
  },
  savingsValue: {
    fontSize: 10,
    color: "#dc2626",
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: "#0ea5e9",
    padding: 10,
    borderRadius: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "right",
  },
  terms: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    borderLeft: "4 solid #0ea5e9",
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  termItem: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: "#888888",
  },
  footerCompany: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  adminNotes: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#fef9c3",
    borderRadius: 4,
    borderLeft: "4 solid #eab308",
  },
  adminNotesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 4,
  },
  adminNotesText: {
    fontSize: 9,
    color: "#78350f",
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "15%",
    fontSize: 60,
    color: "#f3f4f6",
    transform: "rotate(-30deg)",
    fontWeight: "bold",
    opacity: 0.3,
  },
})

interface Address {
  street: string
  suburb: string
  state: string
  postcode: string
}

export interface QuoteItemPDF {
  sku: string
  name: string
  brand: string
  size?: string
  sizeLabel?: string
  quantity: number
  unitPrice?: number | null
  lineTotal?: number | null
  quotedPrice?: number | null
  quotedNotes?: string | null
  materialTestCert?: boolean
}

export interface QuotePDFData {
  quoteNumber: string
  quoteDate: string
  validUntil: string
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: Address
  billingAddress?: Address
  items: QuoteItemPDF[]
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
  internalNotes?: string
  preparedBy?: string
  isDraft?: boolean
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "POA"
  return `$${amount.toFixed(2)}`
}

function formatAddress(addr: Address): string {
  return `${addr.street}\n${addr.suburb} ${addr.state} ${addr.postcode}`
}

export function QuotePDF({ data }: { data: QuotePDFData }) {
  const showBilling =
    data.billingAddress &&
    formatAddress(data.billingAddress) !== formatAddress(data.deliveryAddress)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Draft Watermark */}
        {data.isDraft && <Text style={styles.watermark}>DRAFT</Text>}

        {/* Header */}
        <View style={styles.header}>
          <View>
            {/* Logo placeholder - using text for now */}
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0ea5e9" }}>
              DEWATER
            </Text>
            <Text style={{ fontSize: 10, color: "#666666" }}>
              PRODUCTS AUSTRALIA
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteTitle}>QUOTATION</Text>
            <Text style={styles.quoteNumber}>{data.quoteNumber}</Text>
            <Text style={styles.quoteDate}>Date: {data.quoteDate}</Text>
            <Text style={styles.quoteDate}>Valid Until: {data.validUntil}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.row}>
            <View style={[styles.column, styles.addressBox]}>
              <Text style={styles.label}>Company</Text>
              <Text style={[styles.value, { fontWeight: "bold" }]}>
                {data.companyName}
              </Text>
              <Text style={styles.label}>Contact</Text>
              <Text style={styles.value}>{data.contactName}</Text>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{data.email}</Text>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{data.phone}</Text>
            </View>
            <View style={[styles.column, styles.addressBox]}>
              <Text style={styles.label}>Delivery Address</Text>
              <Text style={styles.value}>{formatAddress(data.deliveryAddress)}</Text>
              {showBilling && data.billingAddress && (
                <>
                  <Text style={[styles.label, { marginTop: 8 }]}>
                    Billing Address
                  </Text>
                  <Text style={styles.value}>
                    {formatAddress(data.billingAddress)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quoted Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colSku}>SKU</Text>
              <Text style={styles.colProduct}>Product</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colCert}>Cert</Text>
              <Text style={styles.colUnit}>Unit Price</Text>
              <Text style={styles.colTotal}>Line Total</Text>
            </View>

            {/* Table Rows */}
            {data.items.map((item, index) => {
              const unitPrice = item.quotedPrice ?? item.unitPrice
              const lineTotal =
                unitPrice != null ? unitPrice * item.quantity : item.lineTotal

              return (
                <View
                  key={index}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.colSku}>{item.sku}</Text>
                  <View style={styles.colProduct}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productMeta}>{item.brand}</Text>
                    {item.sizeLabel && (
                      <Text style={styles.productMeta}>{item.sizeLabel}</Text>
                    )}
                    {item.quotedNotes && (
                      <Text style={[styles.productMeta, { fontStyle: "italic" }]}>
                        Note: {item.quotedNotes}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colCert}>
                    {item.materialTestCert ? "Yes" : "-"}
                  </Text>
                  <Text style={styles.colUnit}>{formatCurrency(unitPrice)}</Text>
                  <Text style={styles.colTotal}>{formatCurrency(lineTotal)}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          {data.savings > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Bulk Discount</Text>
              <Text style={styles.savingsValue}>
                -{formatCurrency(data.savings)}
              </Text>
            </View>
          )}
          {data.certFee > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Material Certs ({data.certCount})
              </Text>
              <Text style={styles.totalValue}>{formatCurrency(data.certFee)}</Text>
            </View>
          )}
          {data.shippingCost != null && data.shippingCost > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Shipping{data.shippingNotes ? ` (${data.shippingNotes})` : ""}
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.shippingCost)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (10%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.gst)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total (inc GST)</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(data.total)}
            </Text>
          </View>
          {data.hasUnpricedItems && (
            <Text
              style={{
                fontSize: 9,
                color: "#d97706",
                marginTop: 8,
                textAlign: "right",
              }}
            >
              * Some items require confirmation - pricing to be confirmed
            </Text>
          )}
        </View>

        {/* Notes from Customer */}
        {data.notes && (
          <View style={styles.adminNotes}>
            <Text style={styles.adminNotesTitle}>Customer Notes</Text>
            <Text style={styles.adminNotesText}>{data.notes}</Text>
          </View>
        )}

        {/* Terms & Conditions */}
        <View style={styles.terms}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termItem}>
            - This quote is valid for 30 days from the date of issue
          </Text>
          <Text style={styles.termItem}>
            - All prices are in AUD and exclude GST unless stated otherwise
          </Text>
          <Text style={styles.termItem}>
            - Payment terms: 30 days from invoice date for approved accounts
          </Text>
          <Text style={styles.termItem}>
            - Free metro delivery included for orders over $500 (ex GST)
          </Text>
          <Text style={styles.termItem}>
            - Lead times may vary depending on stock availability
          </Text>
          <Text style={styles.termItem}>
            - Material test certificates add 2-3 business days to lead time
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerCompany}>Dewater Products Pty Ltd</Text>
            <Text style={styles.footerText}>ABN: 12 345 678 901</Text>
            <Text style={styles.footerText}>Perth, Western Australia</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.footerText}>Phone: 1300 271 290</Text>
            <Text style={styles.footerText}>sales@dewaterproducts.com.au</Text>
            <Text style={styles.footerText}>www.dewaterproducts.com.au</Text>
          </View>
          {data.preparedBy && (
            <View style={{ textAlign: "right" }}>
              <Text style={styles.footerText}>Prepared by:</Text>
              <Text style={styles.footerText}>{data.preparedBy}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
