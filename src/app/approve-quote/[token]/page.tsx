import { notFound } from 'next/navigation'
import { db } from '@/db'
import { quotes, quoteItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { isTokenExpired } from '@/lib/tokens'
import { ApproveQuoteClient } from './ApproveQuoteClient'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ApproveQuotePage({ params }: PageProps) {
  const { token } = await params

  // Fetch quote by approval token
  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.approvalToken, token))
    .limit(1)

  if (!quote) {
    notFound()
  }

  // Check if token expired
  if (isTokenExpired(quote.approvalTokenExpiresAt)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p className="text-gray-600 mb-6">
              This approval link has expired. Please log into the admin panel to approve this quote.
            </p>
            <a
              href="/admin/login"
              className="inline-block bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Check if already forwarded
  if (quote.status === 'forwarded') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Sent</h1>
            <p className="text-gray-600 mb-2">
              Quote <strong>{quote.quoteNumber}</strong> has already been sent to the customer.
            </p>
            <p className="text-sm text-gray-500">
              Sent to: {quote.email}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch quote items
  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quote.id))
    .orderBy(quoteItems.displayOrder)

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

  return (
    <ApproveQuoteClient
      quote={{
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        companyName: quote.companyName,
        contactName: quote.contactName,
        email: quote.email,
        phone: quote.phone,
        deliveryAddress,
        billingAddress,
        notes: quote.notes,
        itemCount: quote.itemCount,
        pricedTotal: quote.pricedTotal,
        savings: quote.savings,
        certFee: quote.certFee,
        certCount: quote.certCount,
        hasUnpricedItems: quote.hasUnpricedItems,
        shippingCost: quote.shippingCost,
        shippingNotes: quote.shippingNotes,
        status: quote.status,
        createdAt: quote.createdAt.toISOString(),
      }}
      items={items}
      token={token}
    />
  )
}
