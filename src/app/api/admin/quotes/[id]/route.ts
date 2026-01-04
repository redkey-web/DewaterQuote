import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
