import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { products, productStock, productVariations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface ProductUpdate {
  qtyInStock?: number;
  incomingQty?: number;
  leadTimeText?: string;
  basePrice?: string;
}

interface VariationUpdate {
  qtyInStock?: number;
  incomingQty?: number;
  price?: string;
}

interface BatchUpdateRequest {
  productUpdates?: Record<string, ProductUpdate>;
  variationUpdates?: Record<string, VariationUpdate>;
  // Legacy support
  updates?: Record<string, ProductUpdate>;
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BatchUpdateRequest = await request.json();
    // Support both new format and legacy format
    const productUpdatesMap = body.productUpdates || body.updates || {};
    const variationUpdatesMap = body.variationUpdates || {};

    const hasProductUpdates = Object.keys(productUpdatesMap).length > 0;
    const hasVariationUpdates = Object.keys(variationUpdatesMap).length > 0;

    if (!hasProductUpdates && !hasVariationUpdates) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    let productsUpdated = 0;
    let variationsUpdated = 0;
    const errors: string[] = [];

    // Process product updates
    for (const [productIdStr, update] of Object.entries(productUpdatesMap)) {
      const productId = parseInt(productIdStr, 10);
      if (isNaN(productId)) {
        errors.push(`Invalid product ID: ${productIdStr}`);
        continue;
      }

      try {
        // Update product fields (leadTimeText, basePrice)
        const productFieldUpdates: Partial<{
          leadTimeText: string | null;
          basePrice: string | null;
          updatedAt: Date;
        }> = {
          updatedAt: new Date(),
        };

        if (update.leadTimeText !== undefined) {
          productFieldUpdates.leadTimeText = update.leadTimeText || null;
        }

        if (update.basePrice !== undefined) {
          productFieldUpdates.basePrice = update.basePrice || null;
        }

        // Update products table if there are product-level changes
        if (update.leadTimeText !== undefined || update.basePrice !== undefined) {
          await db
            .update(products)
            .set(productFieldUpdates)
            .where(eq(products.id, productId));
        }

        // Update stock fields (qtyInStock, incomingQty) - parent-level stock (no variationId)
        if (update.qtyInStock !== undefined || update.incomingQty !== undefined) {
          // Check if parent-level stock record exists (variationId is null)
          const existingStock = await db.query.productStock.findFirst({
            where: and(
              eq(productStock.productId, productId),
              // Need to check for null variationId - but Drizzle doesn't have isNull in this syntax
            ),
          });

          // Find existing stock without variationId
          const allProductStock = await db
            .select()
            .from(productStock)
            .where(eq(productStock.productId, productId));
          const parentLevelStock = allProductStock.find((s) => s.variationId === null);

          if (parentLevelStock) {
            // Update existing stock record
            const stockUpdates: Partial<{
              qtyInStock: number;
              incomingQty: number;
              lastUpdatedAt: Date;
            }> = {
              lastUpdatedAt: new Date(),
            };

            if (update.qtyInStock !== undefined) {
              stockUpdates.qtyInStock = update.qtyInStock;
            }
            if (update.incomingQty !== undefined) {
              stockUpdates.incomingQty = update.incomingQty;
            }

            await db
              .update(productStock)
              .set(stockUpdates)
              .where(eq(productStock.id, parentLevelStock.id));
          } else {
            // Create new parent-level stock record
            await db.insert(productStock).values({
              productId,
              variationId: null,
              qtyInStock: update.qtyInStock ?? 0,
              incomingQty: update.incomingQty ?? 0,
              preorderQty: 0,
              reorderPoint: 5,
            });
          }
        }

        productsUpdated++;
      } catch (err) {
        console.error(`Error updating product ${productId}:`, err);
        errors.push(`Failed to update product ${productId}`);
      }
    }

    // Process variation updates
    for (const [variationIdStr, update] of Object.entries(variationUpdatesMap)) {
      const variationId = parseInt(variationIdStr, 10);
      if (isNaN(variationId)) {
        errors.push(`Invalid variation ID: ${variationIdStr}`);
        continue;
      }

      try {
        // Get the variation to find its productId
        const variation = await db.query.productVariations.findFirst({
          where: eq(productVariations.id, variationId),
        });

        if (!variation) {
          errors.push(`Variation not found: ${variationId}`);
          continue;
        }

        // Update variation price if provided
        if (update.price !== undefined) {
          await db
            .update(productVariations)
            .set({ price: update.price || null })
            .where(eq(productVariations.id, variationId));
        }

        // Update variation-level stock
        if (update.qtyInStock !== undefined || update.incomingQty !== undefined) {
          // Check if variation-level stock record exists
          const existingStock = await db.query.productStock.findFirst({
            where: eq(productStock.variationId, variationId),
          });

          if (existingStock) {
            // Update existing stock record
            const stockUpdates: Partial<{
              qtyInStock: number;
              incomingQty: number;
              lastUpdatedAt: Date;
            }> = {
              lastUpdatedAt: new Date(),
            };

            if (update.qtyInStock !== undefined) {
              stockUpdates.qtyInStock = update.qtyInStock;
            }
            if (update.incomingQty !== undefined) {
              stockUpdates.incomingQty = update.incomingQty;
            }

            await db
              .update(productStock)
              .set(stockUpdates)
              .where(eq(productStock.variationId, variationId));
          } else {
            // Create new variation-level stock record
            await db.insert(productStock).values({
              productId: variation.productId,
              variationId,
              qtyInStock: update.qtyInStock ?? 0,
              incomingQty: update.incomingQty ?? 0,
              preorderQty: 0,
              reorderPoint: 2,
            });
          }
        }

        variationsUpdated++;
      } catch (err) {
        console.error(`Error updating variation ${variationId}:`, err);
        errors.push(`Failed to update variation ${variationId}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${productsUpdated} product(s) and ${variationsUpdated} variation(s)`,
      productsUpdated,
      variationsUpdated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch update' },
      { status: 500 }
    );
  }
}
