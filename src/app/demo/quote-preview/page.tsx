"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"

// Sample data for demonstration
const sampleQuoteData = {
  quoteNumber: "QR-20250108-001",
  quoteDate: format(new Date(), "d MMMM yyyy"),
  validUntil: format(addDays(new Date(), 30), "d MMMM yyyy"),
  companyName: "ABC Mining Supplies",
  contactName: "John Smith",
  email: "john.smith@abcmining.com.au",
  phone: "0412 345 678",
  deliveryAddress: {
    street: "45 Industrial Drive",
    suburb: "Kewdale",
    state: "WA",
    postcode: "6105",
  },
  billingAddress: {
    street: "PO Box 123",
    suburb: "Perth",
    state: "WA",
    postcode: "6000",
  },
  items: [
    {
      sku: "OCFG-L-48.3",
      name: "Orbit Flex-Grip Coupling (Long)",
      brand: "Orbit Couplings",
      sizeLabel: "48.3mm Pipe Outside Diameter",
      quantity: 10,
      unitPrice: 45.5,
      materialTestCert: true,
    },
    {
      sku: "BFLYW-316-100",
      name: "Butterfly Valve CF8M 316SS",
      brand: "Defender Valves",
      sizeLabel: "DN100",
      quantity: 4,
      unitPrice: 285.0,
      materialTestCert: false,
    },
    {
      sku: "OCML-S-60.3",
      name: "Orbit Metal Lock Coupling (Short)",
      brand: "Orbit Couplings",
      sizeLabel: "60.3mm Pipe Outside Diameter",
      quantity: 6,
      unitPrice: 52.0,
      materialTestCert: true,
    },
    {
      sku: "YS-316-80",
      name: "Y-Strainer 316 Stainless Steel",
      brand: "Defender Strainers",
      sizeLabel: "DN80",
      quantity: 2,
      unitPrice: null, // POA item
      materialTestCert: false,
    },
  ],
  notes: "Please include delivery confirmation. Site requires 24hr notice for deliveries.",
  hasUnpricedItems: true,
  certCount: 2,
  preparedBy: "Sales Team",
}

// Calculate totals
function calculateTotals(items: typeof sampleQuoteData.items, certCount: number) {
  const pricedItems = items.filter((item) => item.unitPrice !== null)
  const subtotal = pricedItems.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
    0
  )

  // Bulk discount (10% for 5+ items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const discountRate = totalItems >= 10 ? 0.15 : totalItems >= 5 ? 0.1 : totalItems >= 2 ? 0.05 : 0
  const savings = subtotal * discountRate

  // Material cert fee ($350 each)
  const certFee = certCount * 350

  // Shipping
  const shippingCost = 75

  const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost
  const gst = subtotalAfterDiscount * 0.1
  const total = subtotalAfterDiscount + gst

  return { subtotal, savings, certFee, shippingCost, gst, total }
}

export default function QuotePreviewDemo() {
  const [activeTab, setActiveTab] = useState<"email" | "pdf">("email")
  const totals = calculateTotals(sampleQuoteData.items, sampleQuoteData.certCount)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Quote Preview Demo
          </h1>
          <p className="text-gray-600 mt-1">
            Preview how approved quotes appear to customers (PDF and Email)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "email"
                ? "bg-sky-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Email Preview
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "pdf"
                ? "bg-sky-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            PDF Preview (Info)
          </button>
        </div>

        {/* Sample Quote Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-2">Sample Quote Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Quote #:</span>{" "}
              <span className="font-medium">{sampleQuoteData.quoteNumber}</span>
            </div>
            <div>
              <span className="text-gray-500">Company:</span>{" "}
              <span className="font-medium">{sampleQuoteData.companyName}</span>
            </div>
            <div>
              <span className="text-gray-500">Items:</span>{" "}
              <span className="font-medium">{sampleQuoteData.items.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>{" "}
              <span className="font-medium text-sky-600">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "email" ? (
          <EmailPreview data={sampleQuoteData} totals={totals} />
        ) : (
          <PDFInfo data={sampleQuoteData} totals={totals} />
        )}
      </div>
    </div>
  )
}

// Email Preview Component (inline rendered)
function EmailPreview({
  data,
  totals,
}: {
  data: typeof sampleQuoteData
  totals: ReturnType<typeof calculateTotals>
}) {
  const formatCurrency = (amount: number | null) =>
    amount === null ? "POA" : `$${amount.toFixed(2)}`

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <div className="bg-white max-w-[600px] mx-auto rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div
          className="text-center py-8"
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          }}
        >
          <h1 className="text-3xl font-bold text-white">DEWATER</h1>
          <p className="text-sky-200 text-xs tracking-widest">
            PRODUCTS AUSTRALIA
          </p>
        </div>

        {/* Quote Badge */}
        <div className="bg-sky-50 px-6 py-4 border-b-2 border-sky-500 flex justify-between items-center">
          <span className="bg-sky-500 text-white px-3 py-1 rounded text-xs font-semibold uppercase">
            Quotation
          </span>
          <div className="text-right">
            <p className="font-bold text-gray-900">{data.quoteNumber}</p>
            <p className="text-sm text-gray-600">Date: {data.quoteDate}</p>
            <p className="text-sm text-gray-600">Valid until: {data.validUntil}</p>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Hi {data.contactName},
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Thank you for your quote request. We&apos;re pleased to provide you with
            the following quotation for {data.companyName}. Please review the
            details below and let us know if you have any questions.
          </p>
        </div>

        {/* Delivery Address */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-sky-500">
            <p className="font-semibold text-gray-900 mb-2">Delivery Address</p>
            <p className="text-gray-600 text-sm">
              {data.deliveryAddress.street}
              <br />
              {data.deliveryAddress.suburb} {data.deliveryAddress.state}{" "}
              {data.deliveryAddress.postcode}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
            Quoted Items ({data.items.length})
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sky-500 text-white">
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Unit</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-2 text-gray-500 text-xs">{item.sku}</td>
                  <td className="p-2">
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">{item.brand}</span>
                    {item.sizeLabel && (
                      <>
                        <br />
                        <span className="text-xs text-gray-500">
                          {item.sizeLabel}
                        </span>
                      </>
                    )}
                    {item.materialTestCert && (
                      <>
                        <br />
                        <span className="inline-block bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs mt-1">
                          + Material Cert
                        </span>
                      </>
                    )}
                  </td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="p-2 text-right font-medium">
                    {item.unitPrice
                      ? formatCurrency(item.unitPrice * item.quantity)
                      : "POA"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden w-64 ml-auto">
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.savings > 0 && (
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span className="text-green-600">Bulk Discount</span>
                <span className="text-red-600">
                  -{formatCurrency(totals.savings)}
                </span>
              </div>
            )}
            {totals.certFee > 0 && (
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span className="text-gray-600">
                  Material Certs ({data.certCount})
                </span>
                <span>{formatCurrency(totals.certFee)}</span>
              </div>
            )}
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(totals.shippingCost)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">GST (10%)</span>
              <span>{formatCurrency(totals.gst)}</span>
            </div>
            <div className="flex justify-between p-4 bg-sky-500 text-white">
              <span className="font-semibold">Total (inc GST)</span>
              <span className="font-bold text-lg">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>
        </div>

        {/* POA Notice */}
        {data.hasUnpricedItems && (
          <div className="px-6 pb-4">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <span className="font-semibold text-yellow-800">Note:</span>
              <span className="text-yellow-700">
                {" "}
                Some items marked as POA require price confirmation. Please
                contact us for final pricing.
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600 mb-4">
            Ready to proceed? Reply to this email or give us a call to confirm
            your order.
          </p>
          <a
            href="#"
            className="inline-block bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition"
          >
            Accept This Quote
          </a>
          <p className="mt-3 text-sm text-gray-400">
            Or call us on{" "}
            <span className="text-sky-500">1300 271 290</span>
          </p>
        </div>

        {/* Terms */}
        <div className="px-6 pb-6">
          <div className="bg-sky-50 p-4 rounded-lg border-l-4 border-sky-500">
            <h4 className="font-semibold text-gray-900 mb-2">
              Terms & Conditions
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Quote valid for 30 days from date of issue</li>
              <li>All prices in AUD, GST included where shown</li>
              <li>Payment: 30 days from invoice for approved accounts</li>
              <li>Free metro delivery for orders over $500 (ex GST)</li>
              <li>Material certificates may extend lead time by 2-3 days</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-6 text-center">
          <p className="text-white font-semibold">Dewater Products Pty Ltd</p>
          <p className="text-gray-400 text-sm">ABN: 12 345 678 901</p>
          <p className="text-gray-400 text-sm">Perth, Western Australia</p>
          <p className="mt-3">
            <span className="text-sky-400 text-sm">1300 271 290</span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-sky-400 text-sm">
              sales@dewaterproducts.com.au
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

// PDF Info Component
function PDFInfo({
  data,
  totals,
}: {
  data: typeof sampleQuoteData
  totals: ReturnType<typeof calculateTotals>
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">PDF Quote Features</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Features */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Included in PDF:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Professional A4 layout with company branding
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Quote number, date, and 30-day validity
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Customer company and contact details
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Delivery and billing addresses
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Itemized product table with SKUs
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Size/variation details per item
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Material certificate indicators
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Bulk discount calculations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Shipping costs and notes
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              GST breakdown and final total
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Terms & conditions section
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Footer with company contact info
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">&#10003;</span>
              Optional DRAFT watermark for previews
            </li>
          </ul>
        </div>

        {/* Right Column - Sample Totals */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Sample Quote Breakdown:</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal (priced items)</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Bulk Discount (15%)</span>
              <span className="text-red-600">-${totals.savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Material Certs (2)</span>
              <span>${totals.certFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span>${totals.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-gray-200">
              <span className="text-gray-600">GST (10%)</span>
              <span>${totals.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-4 bg-sky-500 text-white">
              <span className="font-semibold">Total (inc GST)</span>
              <span className="font-bold text-lg">${totals.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How to Generate PDFs:</h4>
            <p className="text-blue-800 text-sm">
              The PDF is generated server-side using <code className="bg-blue-100 px-1 rounded">@react-pdf/renderer</code>.
              Access via the admin panel at:
            </p>
            <code className="block mt-2 text-xs bg-blue-100 p-2 rounded text-blue-900">
              /api/admin/quotes/[id]/pdf
            </code>
            <p className="text-blue-800 text-sm mt-2">
              Add <code className="bg-blue-100 px-1 rounded">?draft=true</code> for draft watermark.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
