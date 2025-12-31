'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'quote-only' | 'suspended' | 'inactive';

interface StockStatusBadgeProps {
  status: StockStatus;
  className?: string;
}

const statusConfig: Record<StockStatus, { label: string; className: string }> = {
  'in-stock': {
    label: 'In Stock',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  'low-stock': {
    label: 'Low Stock',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  'quote-only': {
    label: 'Quote Only',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  'suspended': {
    label: 'Suspended',
    className: 'bg-gray-200 text-gray-700 hover:bg-gray-200',
  },
  'inactive': {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
  },
};

export function getStockStatus(
  isActive: boolean,
  isSuspended: boolean,
  isQuoteOnly: boolean,
  qtyInStock: number | null,
  reorderPoint: number | null
): StockStatus {
  if (!isActive) return 'inactive';
  if (isSuspended) return 'suspended';
  if (isQuoteOnly) return 'quote-only';

  const qty = qtyInStock ?? 0;
  const threshold = reorderPoint ?? 5;

  if (qty === 0) return 'out-of-stock';
  if (qty <= threshold) return 'low-stock';
  return 'in-stock';
}

export function StockStatusBadge({ status, className }: StockStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

// Stock quantity badge with color based on level
interface StockQtyBadgeProps {
  qty: number | null;
  reorderPoint: number | null;
  isSuspended?: boolean;
  isQuoteOnly?: boolean;
}

export function StockQtyBadge({ qty, reorderPoint, isSuspended, isQuoteOnly }: StockQtyBadgeProps) {
  if (isSuspended || isQuoteOnly) {
    return <span className="text-gray-400">--</span>;
  }

  const quantity = qty ?? 0;
  const threshold = reorderPoint ?? 5;

  let colorClass = 'text-green-600';
  let icon = '🟢';

  if (quantity === 0) {
    colorClass = 'text-red-600';
    icon = '🔴';
  } else if (quantity <= threshold) {
    colorClass = 'text-yellow-600';
    icon = '🟡';
  }

  return (
    <span className={cn('font-medium', colorClass)}>
      {icon} {quantity}
    </span>
  );
}
