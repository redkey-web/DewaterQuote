import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function PATCH(
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

    const updateData: Record<string, unknown> = {};

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'reviewed' && !data.reviewedAt) {
        updateData.reviewedAt = new Date();
      }
    }

    if (data.shippingCost !== undefined) {
      updateData.shippingCost = data.shippingCost;
    }

    if (data.shippingNotes !== undefined) {
      updateData.shippingNotes = data.shippingNotes;
    }

    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }

    const [updated] = await db
      .update(quotes)
      .set(updateData)
      .where(eq(quotes.id, quoteId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error('Failed to update quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

export async function GET(
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

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Failed to get quote:', error);
    return NextResponse.json({ error: 'Failed to get quote' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const quoteId = parseInt(id);

  if (isNaN(quoteId)) {
    return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
  }

  try {
    // First get the quote to check if it has a stored PDF
    const existing = await db.query.quotes.findFirst({
      where: eq(quotes.id, quoteId),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Delete the PDF from Vercel Blob if it exists
    if (existing.pdfUrl) {
      try {
        await del(existing.pdfUrl);
      } catch (blobError) {
        console.error('Failed to delete PDF from blob:', blobError);
        // Continue with soft delete even if blob deletion fails
      }
    }

    // Soft delete the quote
    const [deleted] = await db
      .update(quotes)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: session.user.email,
      })
      .where(eq(quotes.id, quoteId))
      .returning();

    // Revalidate dashboard and quotes pages to update counts
    revalidatePath('/admin');
    revalidatePath('/admin/quotes');

    return NextResponse.json({ success: true, quote: deleted });
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
}
