'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MarginBadgeProps {
  margin: number | null;
  className?: string;
}

export function MarginBadge({ margin, className }: MarginBadgeProps) {
  if (margin === null) {
    return (
      <span className={cn('text-gray-400 text-sm', className)}>--</span>
    );
  }

  let colorClass = 'bg-green-100 text-green-800';
  let icon = '🟢';

  if (margin < 20) {
    colorClass = 'bg-red-100 text-red-800';
    icon = '🔴';
  } else if (margin < 30) {
    colorClass = 'bg-yellow-100 text-yellow-800';
    icon = '🟡';
  }

  return (
    <Badge className={cn(colorClass, 'hover:opacity-90', className)}>
      {icon} {margin.toFixed(0)}%
    </Badge>
  );
}

// Format price as currency
export function formatPrice(price: string | number | null): string {
  if (price === null || price === undefined || price === '') {
    return '--';
  }
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '--';
  return `$${num.toFixed(2)}`;
}

// Calculate margin percentage
export function calculateMargin(cost: number | null, sell: number | null): number | null {
  if (!cost || !sell || cost === 0 || sell === 0) return null;
  return ((sell - cost) / sell) * 100;
}
