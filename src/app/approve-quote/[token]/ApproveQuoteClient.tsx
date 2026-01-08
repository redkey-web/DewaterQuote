'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send, Loader2, CheckCircle2, Eye, FileText } from 'lucide-react'

type Address = {
  street: string
  suburb: string
  state: string
  postcode: string
}

type QuoteItem = {
  id: number
  sku: string
  name: string
  brand: string
  quantity: number
  sizeLabel: string | null
  unitPrice: string | null
  lineTotal: string | null
  materialTestCert: boolean | null
}

type Quote = {
  id: number
  quoteNumber: string
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: Address
  billingAddress: Address
  notes: string | null
  itemCount: number
  pricedTotal: string | null
  savings: string | null
  certFee: string | null
  certCount: number | null
  hasUnpricedItems: boolean | null
  shippingCost: string | null
  shippingNotes: string | null
  status: string | null
  createdAt: string
}

interface ApproveQuoteClientProps {
  quote: Quote
  items: QuoteItem[]
  token: string
}

export function ApproveQuoteClient({ quote, items, token }: ApproveQuoteClientProps) {
  const [shippingCost, setShippingCost] = useState(quote.shippingCost || '')
  const [shippingNotes, setShippingNotes] = useState(quote.shippingNotes || '')
  const [preparedBy, setPreparedBy] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const subtotal = parseFloat(quote.pricedTotal || '0')
  const savings = parseFloat(quote.savings || '0')
  const certFee = parseFloat(quote.certFee || '0')
  const shipping = parseFloat(shippingCost || '0')
  const subtotalAfterDiscount = subtotal - savings + certFee + shipping
  const gst = subtotalAfterDiscount * 0.1
  const total = subtotalAfterDiscount + gst

  const handlePreviewPdf = () => {
    const params = new URLSearchParams()
    if (shippingCost) params.set('shipping', shippingCost)
    if (shippingNotes) params.set('shippingNotes', shippingNotes)
    if (preparedBy) params.set('preparedBy', preparedBy)
    params.set('draft', 'true')

    window.open(
      `/api/admin/quotes/${quote.id}/pdf?${params.toString()}`,
      '_blank'
    )
  }

  const handlePreviewEmail = () => {
    const params = new URLSearchParams()
    if (shippingCost) params.set('shipping', shippingCost)
    if (shippingNotes) params.set('shippingNotes', shippingNotes)
    if (preparedBy) params.set('preparedBy', preparedBy)

    window.open(
      `/api/admin/quotes/${quote.id}/email-preview?${params.toString()}`,
      '_blank'
    )
  }

  const handleApproveAndSend = async () => {
    if (!confirm(`Send quote ${quote.quoteNumber} to ${quote.email}?`)) {
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(`/api/approve-quote/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingCost: shippingCost ? parseFloat(shippingCost) : undefined,
          shippingNotes: shippingNotes || undefined,
          preparedBy: preparedBy || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send quote')
      }

      setSuccess(true)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send quote')
    } finally {
      setIsSending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Sent Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Quote <strong>{quote.quoteNumber}</strong> has been sent to:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-900">{quote.contactName}</p>
              <p className="text-gray-600">{quote.companyName}</p>
              <p className="text-sky-600">{quote.email}</p>
            </div>
            <p className="text-sm text-gray-500">
              The customer will receive a professional quote with PDF attachment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quick Approve Quote
              </h1>
              <p className="text-gray-600">
                Quote <strong>{quote.quoteNumber}</strong> • Received{' '}
                {format(new Date(quote.createdAt), 'PPp')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviewEmail}>
                <Eye className="h-4 w-4 mr-1" />
                Preview Email
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreviewPdf}>
                <FileText className="h-4 w-4 mr-1" />
                Preview PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Quote details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="font-semibold text-lg mb-4">Customer Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">{quote.companyName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium">{quote.contactName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-sky-600">{quote.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{quote.phone}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Items ({items.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Unit Price</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.brand}</div>
                          {item.sizeLabel && (
                            <div className="text-xs text-gray-500">{item.sizeLabel}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">
                          {item.unitPrice ? `$${parseFloat(item.unitPrice).toFixed(2)}` : 'POA'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.lineTotal ? `$${parseFloat(item.lineTotal).toFixed(2)}` : 'POA'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column - Actions */}
          <div className="space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <h2 className="font-semibold">Shipping & Details</h2>
              <div>
                <Label htmlFor="shipping">Shipping Cost (ex GST)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="shipping"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="shipping-notes">Shipping Notes</Label>
                <Textarea
                  id="shipping-notes"
                  placeholder="e.g., Road freight to Perth metro"
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="prepared-by">Prepared By</Label>
                <Input
                  id="prepared-by"
                  placeholder="Your name"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-3">
              <h2 className="font-semibold">Quote Total</h2>
              {subtotal > 0 && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  {certFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Material Certs</span>
                      <span>${certFee.toFixed(2)}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-500">GST (10%)</span>
                    <span>${gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-base">
                    <span>Total (inc GST)</span>
                    <span className="text-sky-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button
              onClick={handleApproveAndSend}
              disabled={isSending}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white h-12 text-base"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending Quote...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Approve & Send to Customer
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Quote will be sent to {quote.email} with PDF attachment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
