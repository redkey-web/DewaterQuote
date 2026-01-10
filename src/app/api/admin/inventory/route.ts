import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { products } from '@/db/schema';
import { inArray } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productIds, action } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    if (!action || !['quote-only', 'suspend', 'activate', 'unsuspend', 'set-lead-time'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Build update based on action
    let updateData: Partial<{
      isQuoteOnly: boolean;
      isSuspended: boolean;
      isActive: boolean;
      suspendedReason: string | null;
      leadTime: string | null;
    }>;

    switch (action) {
      case 'quote-only':
        updateData = { isQuoteOnly: true };
        break;
      case 'suspend':
        updateData = { isSuspended: true, suspendedReason: 'Suspended via bulk action' };
        break;
      case 'activate':
        updateData = { isActive: true, isQuoteOnly: false, isSuspended: false, suspendedReason: null };
        break;
      case 'unsuspend':
        updateData = { isSuspended: false, suspendedReason: null };
        break;
      case 'set-lead-time':
        const { leadTime } = body;
        if (leadTime === undefined) {
          return NextResponse.json({ error: 'Lead time value required' }, { status: 400 });
        }
        updateData = { leadTime: leadTime || null };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update products
    await db
      .update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(inArray(products.id, productIds));

    return NextResponse.json({
      success: true,
      message: `Updated ${productIds.length} products`,
      action,
    });
  } catch (error) {
    console.error('Inventory bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}
