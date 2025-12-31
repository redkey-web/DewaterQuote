import { db } from '@/db';
import { products, productShipping, productSupplier } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { LogisticsTabs } from '@/components/admin/LogisticsTabs';
import { StatsCard } from '@/components/admin/StatsCard';

interface LogisticsProduct {
  id: number;
  sku: string;
  name: string;
  shortName: string | null;
  category: { name: string } | null;
  brand: { name: string } | null;
  shipping: {
    id: number;
    weightKg: string | null;
    heightCm: string | null;
    widthCm: string | null;
    lengthCm: string | null;
    cubicM3: string | null;
    shippingCategory: string | null;
    pickZone: string | null;
    unitOfMeasure: string | null;
  } | null;
  supplier: {
    id: number;
    primarySupplier: string | null;
    supplierItemCode: string | null;
    supplierProductName: string | null;
    purchasePrice: string | null;
  } | null;
}

async function getLogisticsData(): Promise<LogisticsProduct[]> {
  try {
    const result = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
        shipping: true,
        supplier: true,
      },
      orderBy: [desc(products.updatedAt)],
    });

    return result.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      shortName: p.shortName,
      category: p.category,
      brand: p.brand,
      shipping: p.shipping?.[0] ? {
        id: p.shipping[0].id,
        weightKg: p.shipping[0].weightKg,
        heightCm: p.shipping[0].heightCm,
        widthCm: p.shipping[0].widthCm,
        lengthCm: p.shipping[0].lengthCm,
        cubicM3: p.shipping[0].cubicM3,
        shippingCategory: p.shipping[0].shippingCategory,
        pickZone: p.shipping[0].pickZone,
        unitOfMeasure: p.shipping[0].unitOfMeasure,
      } : null,
      supplier: p.supplier ? {
        id: p.supplier.id,
        primarySupplier: p.supplier.primarySupplier,
        supplierItemCode: p.supplier.supplierItemCode,
        supplierProductName: p.supplier.supplierProductName,
        purchasePrice: p.supplier.purchasePrice,
      } : null,
    }));
  } catch (error) {
    console.error('Failed to get logistics data:', error);
    return [];
  }
}

function calculateStats(logisticsData: LogisticsProduct[]) {
  const total = logisticsData.length;
  const hasWeight = logisticsData.filter((p) => p.shipping?.weightKg).length;
  const hasDimensions = logisticsData.filter(
    (p) => p.shipping?.heightCm && p.shipping?.widthCm && p.shipping?.lengthCm
  ).length;
  const hasSupplier = logisticsData.filter((p) => p.supplier?.primarySupplier).length;

  // Get unique suppliers
  const suppliers = new Set<string>();
  logisticsData.forEach((p) => {
    if (p.supplier?.primarySupplier) {
      suppliers.add(p.supplier.primarySupplier);
    }
  });

  return {
    total,
    hasWeight,
    hasDimensions,
    hasSupplier,
    uniqueSuppliers: suppliers.size,
  };
}

export default async function LogisticsPage() {
  const logisticsData = await getLogisticsData();
  const stats = calculateStats(logisticsData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics & Shipping</h1>
          <p className="text-gray-500">Manage product shipping dimensions and supplier information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={stats.total}
          icon="package"
          variant="default"
        />
        <StatsCard
          title="With Weight"
          value={stats.hasWeight}
          icon="scale"
          variant={stats.hasWeight === stats.total ? 'success' : 'warning'}
        />
        <StatsCard
          title="With Dimensions"
          value={stats.hasDimensions}
          icon="truck"
          variant={stats.hasDimensions === stats.total ? 'success' : 'warning'}
        />
        <StatsCard
          title="Unique Suppliers"
          value={stats.uniqueSuppliers}
          icon="building"
          variant="info"
        />
      </div>

      {/* Logistics Tabs */}
      <LogisticsTabs logisticsData={logisticsData} />
    </div>
  );
}
