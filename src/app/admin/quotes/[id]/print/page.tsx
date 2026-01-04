import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

type Address = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

async function getQuote(id: number) {
  try {
    const quote = await db.query.quotes.findFirst({
      where: eq(quotes.id, id),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
        },
      },
    });
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error);
    return null;
  }
}

export default async function QuotePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quoteId = parseInt(id);

  if (isNaN(quoteId)) {
    notFound();
  }

  const quote = await getQuote(quoteId);

  if (!quote) {
    notFound();
  }

  const formatAddress = (addr: Address) =>
    `${addr.street}, ${addr.suburb} ${addr.state} ${addr.postcode}`;

  // Calculate totals
  const subtotal = parseFloat(quote.pricedTotal || '0');
  const savings = parseFloat(quote.savings || '0');
  const certFee = parseFloat(quote.certFee || '0');
  const shipping = parseFloat(quote.shippingCost || '0');
  const subtotalAfterDiscount = subtotal - savings + certFee + shipping;
  const gst = subtotalAfterDiscount * 0.1;
  const total = subtotalAfterDiscount + gst;

  return (
    <html>
      <head>
        <title>Quote {quote.quoteNumber} - Dewater Products</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #0ea5e9;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0ea5e9;
          }
          .logo-sub {
            font-size: 10px;
            color: #666;
          }
          .quote-info {
            text-align: right;
          }
          .quote-number {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          .quote-date {
            color: #666;
            font-size: 10px;
          }
          .addresses {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
          }
          .address-block {
            flex: 1;
          }
          .address-block h3 {
            font-size: 11px;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          .address-block p {
            font-size: 12px;
          }
          .customer-info {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .customer-info h3 {
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .customer-grid div {
            font-size: 11px;
          }
          .customer-grid strong {
            display: block;
            font-size: 10px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #0ea5e9;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
          }
          th.right {
            text-align: right;
          }
          th.center {
            text-align: center;
          }
          td {
            padding: 8px;
            border-bottom: 1px solid #eee;
            font-size: 11px;
            vertical-align: top;
          }
          td.right {
            text-align: right;
          }
          td.center {
            text-align: center;
          }
          .product-name {
            font-weight: bold;
          }
          .product-brand {
            font-size: 10px;
            color: #666;
          }
          .product-size {
            font-size: 10px;
            color: #666;
          }
          .cert-badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            margin-top: 3px;
          }
          .totals {
            float: right;
            width: 280px;
            margin-bottom: 20px;
          }
          .totals table {
            margin-bottom: 0;
          }
          .totals td {
            padding: 6px 8px;
            border: none;
          }
          .totals tr.discount td {
            color: #16a34a;
          }
          .totals tr.subtotal td {
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .totals tr.total {
            background: #0ea5e9;
          }
          .totals tr.total td {
            color: white;
            font-weight: bold;
            font-size: 13px;
            padding: 10px 8px;
          }
          .terms {
            clear: both;
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .terms h3 {
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .terms ul {
            margin: 0;
            padding-left: 20px;
            font-size: 10px;
            color: #666;
          }
          .terms li {
            margin-bottom: 3px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="header">
          <div>
            <div className="logo">Dewater Products</div>
            <div className="logo-sub">Industrial Pipe Fittings & Accessories</div>
          </div>
          <div className="quote-info">
            <div className="quote-number">{quote.quoteNumber}</div>
            <div className="quote-date">
              {format(new Date(quote.createdAt), 'dd MMMM yyyy')}
            </div>
          </div>
        </div>

        <div className="customer-info">
          <h3>Customer</h3>
          <div className="customer-grid">
            <div>
              <strong>Company</strong>
              {quote.companyName}
            </div>
            <div>
              <strong>Contact</strong>
              {quote.contactName}
            </div>
            <div>
              <strong>Email</strong>
              {quote.email}
            </div>
            <div>
              <strong>Phone</strong>
              {quote.phone}
            </div>
          </div>
        </div>

        <div className="addresses">
          <div className="address-block">
            <h3>Delivery Address</h3>
            <p>{formatAddress(quote.deliveryAddress as Address)}</p>
          </div>
          <div className="address-block">
            <h3>Billing Address</h3>
            <p>{formatAddress(quote.billingAddress as Address)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>SKU</th>
              <th>Product</th>
              <th className="center" style={{ width: '50px' }}>
                Qty
              </th>
              <th className="right" style={{ width: '80px' }}>
                Unit Price
              </th>
              <th className="right" style={{ width: '90px' }}>
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                  {item.sku}
                </td>
                <td>
                  <div className="product-name">{item.name}</div>
                  <div className="product-brand">{item.brand}</div>
                  {item.sizeLabel && (
                    <div className="product-size">Size: {item.sizeLabel}</div>
                  )}
                  {item.materialTestCert && (
                    <span className="cert-badge">+ Material Cert</span>
                  )}
                </td>
                <td className="center">{item.quantity}</td>
                <td className="right">
                  {item.unitPrice
                    ? `$${parseFloat(item.unitPrice).toFixed(2)}`
                    : 'POA'}
                </td>
                <td className="right">
                  {item.lineTotal
                    ? `$${parseFloat(item.lineTotal).toFixed(2)}`
                    : 'POA'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <table>
            <tbody>
              {subtotal > 0 && (
                <>
                  <tr>
                    <td>Listed Price Total:</td>
                    <td className="right">${subtotal.toFixed(2)}</td>
                  </tr>
                  {savings > 0 && (
                    <tr className="discount">
                      <td>Bulk Discount:</td>
                      <td className="right">-${savings.toFixed(2)}</td>
                    </tr>
                  )}
                  {certFee > 0 && (
                    <tr>
                      <td>Material Certs ({quote.certCount}):</td>
                      <td className="right">${certFee.toFixed(2)}</td>
                    </tr>
                  )}
                  {shipping > 0 && (
                    <tr>
                      <td>
                        Shipping
                        {quote.shippingNotes && ` (${quote.shippingNotes})`}:
                      </td>
                      <td className="right">${shipping.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="subtotal">
                    <td>
                      <strong>Subtotal (ex GST):</strong>
                    </td>
                    <td className="right">
                      <strong>${subtotalAfterDiscount.toFixed(2)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>GST (10%):</td>
                    <td className="right">${gst.toFixed(2)}</td>
                  </tr>
                  <tr className="total">
                    <td>Total (inc GST):</td>
                    <td className="right">${total.toFixed(2)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="terms">
          <h3>Quote Terms</h3>
          <ul>
            <li>Quote valid for 30 days from date of issue</li>
            <li>All prices exclude GST unless stated otherwise</li>
            <li>Payment terms: 30 days from invoice date</li>
            <li>
              Warranty: Up to 5 years on Orbit/Straub pipe couplings, 12 months on
              other products (including repair clamps)
            </li>
            <li>
              Free metro delivery. Regional shipping costs confirmed prior to
              dispatch.
            </li>
          </ul>
        </div>

        <div className="footer">
          <strong>Dewater Products Pty Ltd</strong>
          <br />
          Phone: 1300 271 290 | Email: sales@dewaterproducts.com.au | Perth,
          Western Australia
          <br />
          ABN: 98 622 681 663
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.onload = function() {
            window.print();
          }
        `,
          }}
        />
      </body>
    </html>
  );
}
