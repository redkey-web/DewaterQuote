import { db } from '@/db';
import { products, productStock } from '@/db/schema';
import { desc, inArray } from 'drizzle-orm';
import { InventoryManagementTable } from '@/components/admin/InventoryManagementTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VariationStock {
  qtyInStock: number | null;
  incomingQty: number | null;
  preorderQty: number | null;
}

interface InventoryProduct {
  id: number;
  sku: string;
  name: string;
  shortName: string | null;
  isActive: boolean;
  isQuoteOnly: boolean;
  isSuspended: boolean;
  suspendedReason: string | null;
  handlingTimeDays: number | null;
  leadTimeText: string | null;
  basePrice: string | null;
  priceVaries: boolean;
  category: { name: string } | null;
  brand: { name: string } | null;
  stock: {
    qtyInStock: number | null;
    incomingQty: number | null;
    preorderQty: number | null;
    reorderPoint: number | null;
    expectedArrival: Date | null;
  } | null;
  variations: {
    id: number;
    size: string;
    label: string | null;
    price: string | null;
    sku: string | null;
    stock: VariationStock | null;
  }[];
}

async function getInventoryData(): Promise<InventoryProduct[]> {
  try {
    const result = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
        stock: true,
        variations: {
          columns: {
            id: true,
            size: true,
            label: true,
            price: true,
            sku: true,
          },
          orderBy: (variations, { asc }) => [asc(variations.displayOrder)],
        },
      },
      orderBy: [desc(products.updatedAt)],
    });

    // Get all product IDs to fetch variation-level stock
    const productIds = result.map((p) => p.id);

    // Fetch all stock records (including variation-level ones)
    const allStock = productIds.length > 0
      ? await db
          .select()
          .from(productStock)
          .where(inArray(productStock.productId, productIds))
      : [];

    // Create a map of variationId -> stock record
    const variationStockMap = new Map<number, typeof allStock[0]>();
    const productStockMap = new Map<number, typeof allStock[0]>();

    for (const stock of allStock) {
      if (stock.variationId) {
        variationStockMap.set(stock.variationId, stock);
      } else {
        // Parent-level stock (no variationId)
        productStockMap.set(stock.productId, stock);
      }
    }

    return result.map((p) => {
      // Get parent-level stock (for products without variations)
      const parentStock = productStockMap.get(p.id);

      // For products with variations, calculate aggregate stock from variations
      const variationsWithStock = (p.variations || []).map((v) => {
        const vStock = variationStockMap.get(v.id);
        return {
          ...v,
          stock: vStock
            ? {
                qtyInStock: vStock.qtyInStock,
                incomingQty: vStock.incomingQty,
                preorderQty: vStock.preorderQty,
              }
            : null,
        };
      });

      // Calculate aggregate stock from variations (for display/status)
      const aggregateStock =
        variationsWithStock.length > 0
          ? variationsWithStock.reduce(
              (acc, v) => {
                if (v.stock) {
                  acc.qtyInStock += v.stock.qtyInStock ?? 0;
                  acc.incomingQty += v.stock.incomingQty ?? 0;
                  acc.preorderQty += v.stock.preorderQty ?? 0;
                }
                return acc;
              },
              { qtyInStock: 0, incomingQty: 0, preorderQty: 0 }
            )
          : null;

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        shortName: p.shortName,
        isActive: p.isActive ?? true,
        isQuoteOnly: p.isQuoteOnly ?? false,
        isSuspended: p.isSuspended ?? false,
        suspendedReason: p.suspendedReason,
        handlingTimeDays: p.handlingTimeDays,
        leadTimeText: p.leadTimeText,
        basePrice: p.basePrice,
        priceVaries: p.priceVaries ?? false,
        category: p.category,
        brand: p.brand,
        // Use parent stock if no variations, otherwise use aggregate from variations
        stock:
          variationsWithStock.length > 0 && aggregateStock
            ? {
                qtyInStock: aggregateStock.qtyInStock,
                incomingQty: aggregateStock.incomingQty,
                preorderQty: aggregateStock.preorderQty,
                reorderPoint: 5, // Default for aggregate
                expectedArrival: null,
              }
            : parentStock
              ? {
                  qtyInStock: parentStock.qtyInStock,
                  incomingQty: parentStock.incomingQty,
                  preorderQty: parentStock.preorderQty,
                  reorderPoint: parentStock.reorderPoint,
                  expectedArrival: parentStock.expectedArrival,
                }
              : null,
        variations: variationsWithStock,
      };
    });
  } catch (error) {
    console.error('Failed to get inventory data:', error);
    return [];
  }
}

function calculateStats(inventory: InventoryProduct[]) {
  const total = inventory.length;
  const active = inventory.filter((p) => p.isActive && !p.isSuspended).length;
  const quoteOnly = inventory.filter((p) => p.isQuoteOnly && !p.isSuspended).length;
  const suspended = inventory.filter((p) => p.isSuspended).length;

  // Stock stats
  const inStock = inventory.filter(
    (p) => !p.isSuspended && !p.isQuoteOnly && (p.stock?.qtyInStock ?? 0) > 0
  ).length;
  const lowStock = inventory.filter(
    (p) => !p.isSuspended && !p.isQuoteOnly &&
           (p.stock?.qtyInStock ?? 0) > 0 &&
           (p.stock?.qtyInStock ?? 0) <= (p.stock?.reorderPoint ?? 5)
  ).length;
  const hasIncoming = inventory.filter((p) => (p.stock?.incomingQty ?? 0) > 0).length;

  const totalVariations = inventory.reduce((sum, p) => sum + p.variations.length, 0);

  return { total, active, quoteOnly, suspended, inStock, lowStock, hasIncoming, totalVariations };
}

export default async function InventoryPage() {
  const inventory = await getInventoryData();
  const stats = calculateStats(inventory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">
            Manage products, pricing, stock levels, and availability
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/api/admin/export/inventory" download>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Products"
          value={stats.total}
          icon="package"
          variant="default"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon="check-circle"
          variant="success"
        />
        <StatsCard
          title="In Stock"
          value={stats.inStock}
          icon="check-circle"
          variant={stats.inStock > 0 ? 'success' : 'default'}
        />
        <StatsCard
          title="Quote Only"
          value={stats.quoteOnly}
          icon="message-square"
          variant="info"
        />
        <StatsCard
          title="Suspended"
          value={stats.suspended}
          icon="ban"
          variant={stats.suspended > 0 ? 'error' : 'default'}
        />
        <StatsCard
          title="Size Variations"
          value={stats.totalVariations}
          icon="layers"
          variant="default"
        />
      </div>

      {/* Inventory Management Table */}
      <InventoryManagementTable products={inventory} />
    </div>
  );
}
