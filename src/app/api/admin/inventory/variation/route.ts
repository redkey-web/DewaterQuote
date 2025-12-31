import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { products, productVariations, productStock } from '@/db/schema';
import { eq, max, and } from 'drizzle-orm';

interface CreateVariationRequest {
  productId: number;
  size: string;
  label?: string | null;
  sku?: string | null;
  price?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateVariationRequest = await request.json();

    // Validate required fields
    if (!body.productId || !body.size?.trim()) {
      return NextResponse.json(
        { error: 'productId and size are required' },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, body.productId),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get the max displayOrder for this product's variations
    const maxOrderResult = await db
      .select({ maxOrder: max(productVariations.displayOrder) })
      .from(productVariations)
      .where(eq(productVariations.productId, body.productId));

    const nextDisplayOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    // Create the variation
    const [newVariation] = await db
      .insert(productVariations)
      .values({
        productId: body.productId,
        size: body.size.trim(),
        label: body.label?.trim() || body.size.trim(),
        sku: body.sku?.trim() || null,
        price: body.price?.trim() || null,
        source: 'manual',
        displayOrder: nextDisplayOrder,
      })
      .returning();

    // Create initial stock record for the variation
    await db.insert(productStock).values({
      productId: body.productId,
      variationId: newVariation.id,
      qtyInStock: 0,
      incomingQty: 0,
      preorderQty: 0,
      reorderPoint: 2,
    });

    // Update the product's priceVaries flag if not already set
    if (!product.priceVaries) {
      await db
        .update(products)
        .set({ priceVaries: true, updatedAt: new Date() })
        .where(eq(products.id, body.productId));
    }

    return NextResponse.json({
      success: true,
      variation: newVariation,
      message: 'Variation created successfully',
    });
  } catch (error) {
    console.error('Create variation error:', error);
    return NextResponse.json(
      { error: 'Failed to create variation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const variationId = searchParams.get('id');

    if (!variationId) {
      return NextResponse.json(
        { error: 'Variation ID is required' },
        { status: 400 }
      );
    }

    const id = parseInt(variationId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid variation ID' },
        { status: 400 }
      );
    }

    // Check variation exists
    const variation = await db.query.productVariations.findFirst({
      where: eq(productVariations.id, id),
    });

    if (!variation) {
      return NextResponse.json(
        { error: 'Variation not found' },
        { status: 404 }
      );
    }

    // Delete associated stock record first (cascade should handle this, but be explicit)
    await db
      .delete(productStock)
      .where(eq(productStock.variationId, id));

    // Delete the variation
    await db
      .delete(productVariations)
      .where(eq(productVariations.id, id));

    // Check if product still has variations, if not, set priceVaries to false
    const remainingVariations = await db.query.productVariations.findMany({
      where: eq(productVariations.productId, variation.productId),
    });

    if (remainingVariations.length === 0) {
      await db
        .update(products)
        .set({ priceVaries: false, updatedAt: new Date() })
        .where(eq(products.id, variation.productId));
    }

    return NextResponse.json({
      success: true,
      message: 'Variation deleted successfully',
    });
  } catch (error) {
    console.error('Delete variation error:', error);
    return NextResponse.json(
      { error: 'Failed to delete variation' },
      { status: 500 }
    );
  }
}
