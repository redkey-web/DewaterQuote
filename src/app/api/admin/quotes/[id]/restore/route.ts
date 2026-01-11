import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function POST(
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
    // Find the quote
    const existing = await db.query.quotes.findFirst({
      where: eq(quotes.id, quoteId),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!existing.isDeleted) {
      return NextResponse.json({ error: 'Quote is not deleted' }, { status: 400 });
    }

    // Restore the quote - keep deletion info for audit trail but mark as not deleted
    const [restored] = await db
      .update(quotes)
      .set({
        isDeleted: false,
        // Keep deletedAt and deletedBy for audit purposes
        // This allows showing "was deleted on X by Y, then restored"
      })
      .where(eq(quotes.id, quoteId))
      .returning();

    // Revalidate dashboard and quotes pages to update counts
    revalidatePath('/admin');
    revalidatePath('/admin/quotes');

    return NextResponse.json({
      success: true,
      quote: restored,
      message: 'Quote ${restored.quoteNumber} has been restored'
    });
  } catch (error) {
    console.error('Failed to restore quote:', error);
    return NextResponse.json(
      { error: 'Failed to restore quote' },
      { status: 500 }
    );
  }
}
