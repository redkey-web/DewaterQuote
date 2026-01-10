import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { quotes, quoteItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { renderToBuffer } from '@react-pdf/renderer';
import { QuotePDF, type QuotePDFData, type QuoteItemPDF } from '@/lib/pdf/quote-pdf';
import { format } from 'date-fns';
import { getQuoteExpiry } from '@/lib/quote';

/**
 * POST /api/admin/quotes/[id]/store-pdf
 *
 * Generates or regenerates the quote PDF and stores it in Vercel Blob.
 * Updates the quote record with the new PDF URL and metadata.
 */
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
    // Fetch quote with items
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

    // Calculate totals
    const subtotal = parseFloat(quote.pricedTotal || '0');
    const savings = parseFloat(quote.savings || '0');
    const certFee = parseFloat(quote.certFee || '0');
    const certCount = quote.certCount || 0;
    const shippingCost = parseFloat(quote.shippingCost || '0');

    const subtotalAfterDiscount = subtotal - savings + certFee + shippingCost;
    const gst = subtotalAfterDiscount * 0.1;
    const total = subtotalAfterDiscount + gst;

    // Format dates
    const quoteDate = format(quote.createdAt, 'd MMMM yyyy');
    const validUntil = format(getQuoteExpiry(quote.createdAt), 'd MMMM yyyy');

    // Prepare items for PDF
    const pdfItems: QuoteItemPDF[] = quote.items.map((item) => ({
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

    // Build PDF data
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
      certCount,
      shippingCost,
      shippingNotes: quote.shippingNotes || undefined,
      gst,
      total,
      hasUnpricedItems: quote.hasUnpricedItems || false,
      notes: quote.notes || undefined,
    };

    // Generate PDF buffer
    console.log('[Quote ${quote.quoteNumber}] Generating PDF...');
    const pdfArrayBuffer = await renderToBuffer(QuotePDF({ data: pdfData }));
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    console.log('[Quote ${quote.quoteNumber}] PDF buffer: ${pdfBuffer.length} bytes');

    // Delete old PDF if exists
    if (quote.pdfUrl) {
      try {
        await del(quote.pdfUrl);
        console.log('[Quote ${quote.quoteNumber}] Deleted old PDF from blob');
      } catch (deleteError) {
        console.error('[Quote ${quote.quoteNumber}] Failed to delete old PDF:', deleteError);
        // Continue anyway - old blob will be orphaned but we can still upload new one
      }
    }

    // Calculate new version number
    const newVersion = (quote.pdfVersion || 0) + 1;

    // Upload to Vercel Blob
    const blobPath = 'quotes/${quote.quoteNumber}/quote-v${newVersion}.pdf';
    const blob = await put(blobPath, pdfBuffer, {
      contentType: 'application/pdf',
      access: 'public',
      cacheControlMaxAge: 31536000, // 1 year cache
    });

    console.log('[Quote ${quote.quoteNumber}] PDF uploaded to: ${blob.url}');

    // Update quote record with PDF info
    const now = new Date();
    const [updated] = await db
      .update(quotes)
      .set({
        pdfUrl: blob.url,
        pdfGeneratedAt: now,
        pdfVersion: newVersion,
      })
      .where(eq(quotes.id, quoteId))
      .returning();

    return NextResponse.json({
      success: true,
      pdfUrl: blob.url,
      pdfGeneratedAt: now.toISOString(),
      pdfVersion: newVersion,
      size: pdfBuffer.length,
    });
  } catch (error) {
    console.error('Failed to store PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate and store PDF' },
      { status: 500 }
    );
  }
}
