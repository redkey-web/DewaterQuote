'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  default: {
    bg: 'bg-gray-50',
    icon: 'text-gray-600',
    value: 'text-gray-900',
  },
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    value: 'text-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    value: 'text-yellow-700',
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    value: 'text-red-700',
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
};

export function StatsCard({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('rounded-lg border p-4', styles.bg)}>
      <div className="flex items-center gap-3">
        <Icon className={cn('h-8 w-8', styles.icon)} />
        <div>
          <p className={cn('text-2xl font-bold', styles.value)}>{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}
