import { db } from '@/db';
import { products, productVariations } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import { PricingTable } from '@/components/admin/PricingTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { DollarSign, TrendingUp, Tag, AlertTriangle } from 'lucide-react';

interface PricingProduct {
  id: number;
  sku: string;
  name: string;
  shortName: string | null;
  costPrice: string | null;
  rrp: string | null;
  basePrice: string | null;
  promotionPrice: string | null;
  promotionStartDate: Date | null;
  promotionEndDate: Date | null;
  promotionId: string | null;
  priceA: string | null;
  priceB: string | null;
  priceC: string | null;
  priceD: string | null;
  priceE: string | null;
  priceF: string | null;
  taxFree: boolean;
  taxCategory: string | null;
  priceVaries: boolean;
  category: { name: string } | null;
  brand: { name: string } | null;
  variations: {
    id: number;
    size: string;
    price: string | null;
  }[];
}

async function getPricingData(): Promise<PricingProduct[]> {
  try {
    const result = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
        variations: {
          columns: {
            id: true,
            size: true,
            price: true,
          },
        },
      },
      orderBy: [desc(products.updatedAt)],
    });

    return result.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      shortName: p.shortName,
      costPrice: p.costPrice,
      rrp: p.rrp,
      basePrice: p.basePrice,
      promotionPrice: p.promotionPrice,
      promotionStartDate: p.promotionStartDate,
      promotionEndDate: p.promotionEndDate,
      promotionId: p.promotionId,
      priceA: p.priceA,
      priceB: p.priceB,
      priceC: p.priceC,
      priceD: p.priceD,
      priceE: p.priceE,
      priceF: p.priceF,
      taxFree: p.taxFree ?? false,
      taxCategory: p.taxCategory,
      priceVaries: p.priceVaries ?? false,
      category: p.category,
      brand: p.brand,
      variations: p.variations || [],
    }));
  } catch (error) {
    console.error('Failed to get pricing data:', error);
    return [];
  }
}

function calculateMargin(cost: number | null, sell: number | null): number | null {
  if (!cost || !sell || cost === 0) return null;
  return ((sell - cost) / sell) * 100;
}

function calculateStats(pricingData: PricingProduct[]) {
  let totalMargin = 0;
  let marginCount = 0;
  let onPromotion = 0;
  let belowTarget = 0;
  let missingCost = 0;

  const now = new Date();

  pricingData.forEach((p) => {
    const cost = p.costPrice ? parseFloat(p.costPrice) : null;

    // Get effective sell price (first variation or base price)
    let sell: number | null = null;
    if (p.priceVaries && p.variations.length > 0) {
      const firstWithPrice = p.variations.find((v) => v.price);
      if (firstWithPrice) sell = parseFloat(firstWithPrice.price!);
    } else if (p.basePrice) {
      sell = parseFloat(p.basePrice);
    }

    // Calculate margin
    const margin = calculateMargin(cost, sell);
    if (margin !== null) {
      totalMargin += margin;
      marginCount++;
      if (margin < 20) belowTarget++;
    }

    // Check if on active promotion
    if (
      p.promotionPrice &&
      p.promotionStartDate &&
      p.promotionEndDate &&
      new Date(p.promotionStartDate) <= now &&
      new Date(p.promotionEndDate) >= now
    ) {
      onPromotion++;
    }

    // Check for missing cost
    if (!cost) missingCost++;
  });

  const avgMargin = marginCount > 0 ? totalMargin / marginCount : 0;

  return {
    avgMargin: avgMargin.toFixed(1),
    onPromotion,
    belowTarget,
    missingCost,
  };
}

export default async function PricingPage() {
  const pricingData = await getPricingData();
  const stats = calculateStats(pricingData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-500">Manage product pricing, margins, and promotions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Avg Margin"
          value={`${stats.avgMargin}%`}
          icon={TrendingUp}
          variant={parseFloat(stats.avgMargin) >= 30 ? 'success' : parseFloat(stats.avgMargin) >= 20 ? 'warning' : 'error'}
        />
        <StatsCard
          title="On Promotion"
          value={stats.onPromotion}
          icon={Tag}
          variant="info"
        />
        <StatsCard
          title="Below 20% Margin"
          value={stats.belowTarget}
          icon={AlertTriangle}
          variant={stats.belowTarget > 0 ? 'error' : 'success'}
        />
        <StatsCard
          title="Missing Cost"
          value={stats.missingCost}
          icon={DollarSign}
          variant={stats.missingCost > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Pricing Table */}
      <PricingTable pricingData={pricingData} />
    </div>
  );
}
