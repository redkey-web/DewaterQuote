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
  colSku: { width: "10%", fontSize: 9 },
  colProduct: { width: "30%", fontSize: 9 },
  colQty: { width: "8%", textAlign: "center", fontSize: 9 },
  colLeadTime: { width: "12%", textAlign: "center", fontSize: 8 },
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
  leadTime?: string | null // e.g., "2-3 weeks", "In Stock"
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
  overallLeadTime?: string // Longest lead time across all items
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
              <Text style={styles.colLeadTime}>Lead Time</Text>
              <Text style={styles.colCert}>Cert</Text>
              <Text style={styles.colUnit}>Unit (ex GST)</Text>
              <Text style={styles.colTotal}>Total (ex GST)</Text>
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
                  <Text style={styles.colLeadTime}>{item.leadTime || "-"}</Text>
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

        {/* Overall Lead Time */}
        {data.overallLeadTime && (
          <View style={{
            marginTop: 15,
            padding: 12,
            backgroundColor: "#fef3c7",
            borderRadius: 4,
            borderLeft: "4 solid #f59e0b",
          }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "#92400e" }}>
              Estimated Lead Time: {data.overallLeadTime}
            </Text>
            <Text style={{ fontSize: 8, color: "#78350f", marginTop: 4 }}>
              Lead times are estimates and may vary based on stock availability.
            </Text>
          </View>
        )}

        {/* Terms & Conditions */}
        <View style={styles.terms}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>

          {/* Payment */}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>
            Payment
          </Text>
          <Text style={styles.termItem}>
            1. If a deposit is required as stated on the quotation, then the deposit
            amount needs to be paid in full before Dewater Products Pty Ltd, will
            either dispatch the goods if Ex Stock, or before manufacturing can occur.
            The percentage of the deposit will be specified eg, 50%.
          </Text>
          <Text style={styles.termItem}>
            2. If you do not have a trading account with Dewater Products Pty Ltd,
            then payment in full will need to be made, before Dewater Products Pty Ltd
            will either dispatch the goods, or proceed with manufacturing. Made to
            order goods will generally need to be paid in advance.
          </Text>

          {/* Lead time */}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>
            Lead time
          </Text>
          <Text style={styles.termItem}>
            3. The quotation should detail the lead time to supply the goods, Ex Works
            in Perth, Western Australia. If the quotation does not detail the product
            as "Ex Stock", then a lead time will apply. This lead time should be quoted
            with the goods.
          </Text>
          <Text style={styles.termItem}>
            4. Currently COVID-19 is causing unpredictable lead time extensions and
            when ordering you agree to a possible lead time extension, which is outside
            of the control of Dewater Products Pty Ltd.
          </Text>

          {/* Delivery */}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>
            Delivery
          </Text>
          <Text style={styles.termItem}>
            5. The quotation should detail how the good(s) quoted will be delivered.
          </Text>
          <Text style={styles.termItem}>
            6. Dewater Products Pty Ltd will always try to offer free delivery via road
            freight to customers although this is not possible if the delivery address
            is in a remote location resulting in our freight company charging us extra
            fees such as a remote delivery fee. This would be discussed with the
            customer if it occurs. An extra charge may be quoted and will depend on the
            weight and size of the goods, and the remote location.
          </Text>
          <Text style={styles.termItem}>
            7. You should allow extra days for delivery to occur on top of the lead
            time stated.
          </Text>
          <Text style={styles.termItem}>
            8. Delivery via road freight is outside of the control of Dewater Products
            Pty Ltd, and any freight matters should be dealt with the freight company,
            once Dewater Products Pty Ltd advises the Freight company and the
            consignment number or tracking number.
          </Text>
          <Text style={styles.termItem}>
            9. Dewater Products Pty Ltd will try and obtain a delivery date from the
            freight company but does not have any input or management power over the
            road freight once it has left our warehouse.
          </Text>
          <Text style={styles.termItem}>
            10. You as the customer and receiver should ensure that you provide Dewater
            Products Pty Ltd with the correct delivery address at the time of ordering,
            to ensure there are no delays.
          </Text>
          <Text style={styles.termItem}>
            11. Other freight types such as Air freight can be quoted when requested.
          </Text>

          {/* Order Cancellations and Returns */}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>
            Order Cancellations and Returns
          </Text>
          <Text style={styles.termItem}>
            12. You can only cancel an Order if the goods you ordered were quoted as Ex
            Stock and were Ex Stock at the time they were ordered or paid for. This
            must also occur within 7 days.
          </Text>
          <Text style={styles.termItem}>
            13. You cannot return goods to us, once 7 days has passed from receiving
            the goods, which were Ex Stock, at the time they were quoted, ordered and
            paid for. No refund will be approved.
          </Text>
          <Text style={styles.termItem}>
            14. You cannot cancel an Order, or return goods if a lead time applies, and
            manufacturing has begun. Most products we sell, are bespoke products and
            made to order. Charges will apply.
          </Text>

          {/* No Returns */}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>
            No Returns - Purchase Order cannot be cancelled
          </Text>
          <Text style={styles.termItem}>
            15. If you choose to cancel the Purchase Order, once manufacturing has
            started, you will need to pay for all of the costs up to the date of
            cancelling. Such as materials, labour and freight costs.
          </Text>
          <Text style={styles.termItem}>
            16. The costs to be paid to us could be a very high percentage of the order
            value such as 90%. This should be considered by you the customer before
            cancelling a Purchase Order.
          </Text>
          <Text style={styles.termItem}>
            17. All costs will be minimised where possible, but would be difficult with
            bespoke made to order products.
          </Text>
          <Text style={styles.termItem}>
            18. If you choose to amend the Purchase Order, once manufacturing has
            started such as reducing the quantity, you will need to pay us all costs
            associated with the unwanted goods which could potentially be up to 90% of
            the sale price. Such as materials, labour and freight costs. All costs will
            be minimised where possible, but would be difficult with bespoke made to
            order products.
          </Text>
          <Text style={styles.termItem}>
            19. Manufacturing will generally start the following day after payment has
            been received, or if you have a trading account, the following day is
            generally when manufacturing begins.
          </Text>
          <Text style={styles.termItem}>
            20. Therefore it is important that your Purchase Order is correct, that you
            have ordered the correct quantity, size, model, brand and any other product
            specific details.
          </Text>
          <Text style={styles.termItem}>
            21. We want our customers to order the correct parts, so that orders are
            not cancelled or amended. You must also consider the lead time quoted and
            not use it as an excuse to cancel.
          </Text>
          <Text style={styles.termItem}>
            22. Price - Pricing Quoted - The quoted price for a specific product and
            size is specific to the Quantity quoted. We reserve the right to reject a
            Purchase Order, when the quantity ordered, does not match the quantity
            quoted.
          </Text>

          {/* Credit card surcharge */}
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "#d97706",
              marginTop: 10,
            }}
          >
            Credit Card Payments incur 1.9% Surcharge
          </Text>

          {/* Acceptance */}
          <Text
            style={{
              fontSize: 8,
              color: "#0ea5e9",
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            This quote is valid until {data.validUntil}. To accept this quote, reply
            to this email or call 1300 271 290.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerCompany}>Dewater Products Pty Ltd</Text>
            <Text style={styles.footerText}>ABN: 98 622 681 663</Text>
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
