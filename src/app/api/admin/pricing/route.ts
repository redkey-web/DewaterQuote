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
    const { productIds, action, promotionPrice, promotionStartDate, promotionEndDate } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    if (!action || !['set-promotion', 'clear-promotion'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Build update based on action
    let updateData: Partial<{
      promotionPrice: string | null;
      promotionStartDate: Date | null;
      promotionEndDate: Date | null;
      promotionId: string | null;
    }>;

    switch (action) {
      case 'set-promotion':
        if (!promotionPrice) {
          return NextResponse.json(
            { error: 'Promotion price is required' },
            { status: 400 }
          );
        }
        updateData = {
          promotionPrice: promotionPrice.toString(),
          promotionStartDate: promotionStartDate ? new Date(promotionStartDate) : new Date(),
          promotionEndDate: promotionEndDate ? new Date(promotionEndDate) : null,
          promotionId: `PROMO-${Date.now()}`,
        };
        break;
      case 'clear-promotion':
        updateData = {
          promotionPrice: null,
          promotionStartDate: null,
          promotionEndDate: null,
          promotionId: null,
        };
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
    console.error('Pricing bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}
