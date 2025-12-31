import { db } from '@/db';
import { products, productStock, categories, brands } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { InventoryTable } from '@/components/admin/InventoryTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { Package, AlertTriangle, Ban, MessageSquare, CheckCircle } from 'lucide-react';

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
  category: { name: string } | null;
  brand: { name: string } | null;
  stock: {
    id: number;
    qtyInStock: number | null;
    incomingQty: number | null;
    preorderQty: number | null;
    reorderPoint: number | null;
    expectedArrival: Date | null;
  } | null;
}

async function getInventoryData(): Promise<InventoryProduct[]> {
  try {
    const result = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
        stock: true,
      },
      orderBy: [desc(products.updatedAt)],
    });

    // Transform the result to flatten stock data (get first stock record per product)
    return result.map((p) => ({
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
      category: p.category,
      brand: p.brand,
      stock: p.stock?.[0] ? {
        id: p.stock[0].id,
        qtyInStock: p.stock[0].qtyInStock,
        incomingQty: p.stock[0].incomingQty,
        preorderQty: p.stock[0].preorderQty,
        reorderPoint: p.stock[0].reorderPoint,
        expectedArrival: p.stock[0].expectedArrival,
      } : null,
    }));
  } catch (error) {
    console.error('Failed to get inventory data:', error);
    return [];
  }
}

function calculateStats(inventory: InventoryProduct[]) {
  const total = inventory.length;
  const inStock = inventory.filter(
    (p) => !p.isSuspended && !p.isQuoteOnly && (p.stock?.qtyInStock ?? 0) > (p.stock?.reorderPoint ?? 5)
  ).length;
  const lowStock = inventory.filter(
    (p) => !p.isSuspended && !p.isQuoteOnly && (p.stock?.qtyInStock ?? 0) > 0 && (p.stock?.qtyInStock ?? 0) <= (p.stock?.reorderPoint ?? 5)
  ).length;
  const quoteOnly = inventory.filter((p) => p.isQuoteOnly && !p.isSuspended).length;
  const suspended = inventory.filter((p) => p.isSuspended).length;

  return { total, inStock, lowStock, quoteOnly, suspended };
}

export default async function InventoryPage() {
  const inventory = await getInventoryData();
  const stats = calculateStats(inventory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Track stock levels and product availability</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Products"
          value={stats.total}
          icon={Package}
          variant="default"
        />
        <StatsCard
          title="In Stock"
          value={stats.inStock}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Quote Only"
          value={stats.quoteOnly}
          icon={MessageSquare}
          variant="info"
        />
        <StatsCard
          title="Suspended"
          value={stats.suspended}
          icon={Ban}
          variant="error"
        />
      </div>

      {/* Inventory Table */}
      <InventoryTable inventory={inventory} />
    </div>
  );
}
