import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';
import { escapeHtml } from '@/lib/sanitize';
import { renderToBuffer } from '@react-pdf/renderer';
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from '@/lib/pdf/quote-pdf';
import { format } from 'date-fns';
import { getQuoteExpiry } from '@/lib/quote';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

type Address = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

type QuoteItem = {
  id: number;
  sku: string;
  variationSku: string | null;
  name: string;
  brand: string;
  size: string | null;
  quantity: number;
  sizeLabel: string | null;
  unitPrice: string | null;
  lineTotal: string | null;
  quotedPrice: string | null;
  quotedNotes: string | null;
  materialTestCert: boolean | null;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const quoteId = parseInt(id);

  if (isNaN(quoteId)) {
    return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    const { shippingCost, shippingNotes } = data;

    // Get the quote with items
    const quote = await db.query.quotes.findFirst({
      where: eq(quotes.id, quoteId),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Build address objects from separate columns
    const deliveryAddress = {
      street: quote.deliveryStreet || '',
      suburb: quote.deliverySuburb || '',
      state: quote.deliveryState || '',
      postcode: quote.deliveryPostcode || '',
    };
    const billingAddress = {
      street: quote.billingStreet || quote.deliveryStreet || '',
      suburb: quote.billingSuburb || quote.deliverySuburb || '',
      state: quote.billingState || quote.deliveryState || '',
      postcode: quote.billingPostcode || quote.deliveryPostcode || '',
    };

    // Update quote with shipping and mark as forwarded
    await db
      .update(quotes)
      .set({
        shippingCost: shippingCost || null,
        shippingNotes: shippingNotes || null,
        status: 'forwarded',
        forwardedAt: new Date(),
      })
      .where(eq(quotes.id, quoteId));

    // Calculate totals
    const subtotal = parseFloat(quote.pricedTotal || '0');
    const savings = parseFloat(quote.savings || '0');
    const certFee = parseFloat(quote.certFee || '0');
    const shipping = parseFloat(shippingCost || '0');
    const subtotalAfterDiscount = subtotal - savings + certFee + shipping;
    const gst = subtotalAfterDiscount * 0.1;
    const total = subtotalAfterDiscount + gst;

    const formatAddress = (addr: Address) =>
      `${addr.street}, ${addr.suburb} ${addr.state} ${addr.postcode}`;

    // Generate PDF
    const quoteDate = format(quote.createdAt, 'd MMMM yyyy');
    const validUntil = format(getQuoteExpiry(quote.createdAt), 'd MMMM yyyy');

    const pdfItems: QuoteItemPDF[] = quote.items.map((item: QuoteItem) => ({
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
    }));

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
      certCount: quote.certCount || 0,
      shippingCost: shipping,
      shippingNotes: shippingNotes,
      gst,
      total,
      hasUnpricedItems: quote.hasUnpricedItems || false,
      notes: quote.notes || undefined,
    };

    const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }));

    // Convert to base64 - handle both Buffer and Uint8Array
    const pdfBase64 = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer.toString('base64')
      : Buffer.from(pdfBuffer).toString('base64');

    console.log(`[Quote ${quote.quoteNumber}] PDF generated: ${pdfBase64.length} bytes base64`);

    // Build items table for email
    const itemsTableRows = quote.items
      .map((item: QuoteItem) => {
        const price = item.unitPrice ? parseFloat(item.unitPrice) : null;
        const priceDisplay = price ? `$${price.toFixed(2)}` : 'POA';
        const lineTotal = item.lineTotal
          ? `$${parseFloat(item.lineTotal).toFixed(2)}`
          : 'POA';

        const certBadge = item.materialTestCert
          ? `<br /><span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-top: 4px;">+ Material Cert</span>`
          : '';

        return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(item.sku)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <strong>${escapeHtml(item.name)}</strong><br />
            <span style="color: #666; font-size: 12px;">${escapeHtml(item.brand)}</span>
            ${item.sizeLabel ? `<br /><span style="color: #666; font-size: 12px;">Size: ${escapeHtml(item.sizeLabel)}</span>` : ''}
            ${certBadge}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${priceDisplay}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${lineTotal}</td>
        </tr>
      `;
      })
      .join('');

    const fromEmail =
      process.env.FROM_EMAIL || 'noreply@dewaterproducts.com.au';

    // Send quote to customer
    const customerEmail = {
      to: quote.email,
      from: fromEmail,
      subject: `Your Quote from Dewater Products - ${quote.quoteNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Dewater Products</h1>
            <p style="margin: 5px 0 0;">Industrial Pipe Fittings & Accessories</p>
          </div>

          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Quote ${escapeHtml(quote.quoteNumber)}</h2>

            <p>Dear ${escapeHtml(quote.contactName)},</p>
            <p>Thank you for your quote request. Please find your detailed quote below.</p>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Delivery Address:</strong><br />
              ${escapeHtml(formatAddress(deliveryAddress))}
            </div>

            <h3 style="color: #333;">Items</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">SKU</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
              <table style="width: 100%;">
                ${
                  subtotal > 0
                    ? `
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td style="text-align: right;">$${subtotal.toFixed(2)}</td>
                </tr>
                ${
                  savings > 0
                    ? `
                <tr>
                  <td><strong>Bulk Discount:</strong></td>
                  <td style="text-align: right; color: #16a34a;">-$${savings.toFixed(2)}</td>
                </tr>
                `
                    : ''
                }
                ${
                  certFee > 0
                    ? `
                <tr>
                  <td><strong>Material Certificates (${quote.certCount}):</strong></td>
                  <td style="text-align: right;">$${certFee.toFixed(2)}</td>
                </tr>
                `
                    : ''
                }
                ${
                  shipping > 0
                    ? `
                <tr>
                  <td><strong>Shipping${shippingNotes ? ` (${escapeHtml(shippingNotes)})` : ''}:</strong></td>
                  <td style="text-align: right;">$${shipping.toFixed(2)}</td>
                </tr>
                `
                    : ''
                }
                <tr style="border-top: 1px solid #ddd;">
                  <td style="padding-top: 10px;"><strong>Subtotal (ex GST):</strong></td>
                  <td style="text-align: right; padding-top: 10px;">$${subtotalAfterDiscount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>GST (10%):</strong></td>
                  <td style="text-align: right;">$${gst.toFixed(2)}</td>
                </tr>
                <tr style="background: #e0f2fe;">
                  <td style="padding: 10px;"><strong style="font-size: 1.2em;">Total (inc GST):</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong style="font-size: 1.2em;">$${total.toFixed(2)}</strong></td>
                </tr>
                `
                    : ''
                }
                ${
                  quote.hasUnpricedItems
                    ? `
                <tr>
                  <td colspan="2" style="color: #d97706; padding-top: 10px;">
                    Note: Some items require confirmation - we will be in touch shortly.
                  </td>
                </tr>
                `
                    : ''
                }
              </table>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 5px; border-left: 4px solid #0ea5e9;">
              <h3 style="margin-top: 0; color: #0369a1;">Quote Terms</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Quote valid for 30 days</li>
                <li>All prices exclude GST unless stated</li>
                <li>Payment terms: 30 days from invoice</li>
                <li>Warranty: Up to 5 years on Orbit/Straub couplings, 12 months on other products</li>
              </ul>
            </div>

            <p style="margin-top: 30px;">To proceed with this order or if you have any questions, please reply to this email or contact us directly.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p style="color: #666; font-size: 14px;">
              <strong>Dewater Products Pty Ltd</strong><br />
              Phone: <a href="tel:1300271290" style="color: #0ea5e9;">1300 271 290</a><br />
              Email: <a href="mailto:sales@dewaterproducts.com.au" style="color: #0ea5e9;">sales@dewaterproducts.com.au</a><br />
              Perth, Western Australia
            </p>
          </div>

          <div style="background: #1a1a1a; color: #999; padding: 15px; text-align: center; font-size: 12px;">
            ABN: 98 622 681 663 | © ${new Date().getFullYear()} Dewater Products Pty Ltd
          </div>
        </div>
      `,
      attachments: [
        {
          content: pdfBase64,
          filename: `${quote.quoteNumber}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    console.log(`[Quote ${quote.quoteNumber}] Sending email to: ${quote.email}`);
    console.log(`[Quote ${quote.quoteNumber}] Attachment size: ${pdfBase64.length} chars`);

    await sgMail.send(customerEmail);
    console.log(`[Quote ${quote.quoteNumber}] Email sent successfully`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to forward quote:', error);
    return NextResponse.json(
      { error: 'Failed to forward quote' },
      { status: 500 }
    );
  }
}
