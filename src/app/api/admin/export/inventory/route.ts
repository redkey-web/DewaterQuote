import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { products, productStock } from '@/db/schema';
import { desc, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all products with stock data
    const result = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
        variations: {
          columns: {
            id: true,
            size: true,
            sku: true,
            price: true,
          },
          orderBy: (variations, { asc }) => [asc(variations.displayOrder)],
        },
      },
      orderBy: [desc(products.updatedAt)],
    });

    // Get all stock records
    const productIds = result.map((p) => p.id);
    const allStock = productIds.length > 0
      ? await db
          .select()
          .from(productStock)
          .where(inArray(productStock.productId, productIds))
      : [];

    // Create stock maps
    const variationStockMap = new Map<number, typeof allStock[0]>();
    const productStockMap = new Map<number, typeof allStock[0]>();

    for (const stock of allStock) {
      if (stock.variationId) {
        variationStockMap.set(stock.variationId, stock);
      } else {
        productStockMap.set(stock.productId, stock);
      }
    }

    // Build CSV rows
    const rows: string[][] = [];

    // Header row
    rows.push([
      'SKU',
      'Product Name',
      'Size',
      'Category',
      'Brand',
      'Price',
      'Qty In Stock',
      'Incoming Qty',
      'Preorder Qty',
      'Reorder Point',
      'Status',
      'Quote Only',
      'Suspended',
      'Lead Time',
    ]);

    // Data rows - one per variation (or one per product if no variations)
    for (const product of result) {
      const parentStock = productStockMap.get(product.id);

      const getStatus = () => {
        if (product.isSuspended) return 'Suspended';
        if (!product.isActive) return 'Inactive';
        if (product.isQuoteOnly) return 'Quote Only';
        return 'Active';
      };

      if (product.variations && product.variations.length > 0) {
        // One row per variation
        for (const variation of product.variations) {
          const vStock = variationStockMap.get(variation.id);
          rows.push([
            variation.sku || product.sku,
            product.name,
            variation.size,
            product.category?.name || '',
            product.brand?.name || '',
            variation.price || product.basePrice || '',
            String(vStock?.qtyInStock ?? ''),
            String(vStock?.incomingQty ?? ''),
            String(vStock?.preorderQty ?? ''),
            String(vStock?.reorderPoint ?? ''),
            getStatus(),
            product.isQuoteOnly ? 'Yes' : 'No',
            product.isSuspended ? 'Yes' : 'No',
            product.leadTimeText || '',
          ]);
        }
      } else {
        // One row for product without variations
        rows.push([
          product.sku,
          product.name,
          '', // No size
          product.category?.name || '',
          product.brand?.name || '',
          product.basePrice || '',
          String(parentStock?.qtyInStock ?? ''),
          String(parentStock?.incomingQty ?? ''),
          String(parentStock?.preorderQty ?? ''),
          String(parentStock?.reorderPoint ?? ''),
          getStatus(),
          product.isQuoteOnly ? 'Yes' : 'No',
          product.isSuspended ? 'Yes' : 'No',
          product.leadTimeText || '',
        ]);
      }
    }

    // Convert to CSV string
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      )
      .join('\n');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const filename = `dewater-inventory-${date}.csv`;

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export inventory' },
      { status: 500 }
    );
  }
}
