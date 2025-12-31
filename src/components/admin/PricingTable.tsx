'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Download, MoreHorizontal, ChevronDown, Search, Tag, RefreshCw } from 'lucide-react';
import { MarginBadge, formatPrice, calculateMargin } from './MarginBadge';
import { cn } from '@/lib/utils';

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

interface PricingTableProps {
  pricingData: PricingProduct[];
}

export function PricingTable({ pricingData }: PricingTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [marginFilter, setMarginFilter] = useState<string>('all');
  const [showTierPricing, setShowTierPricing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [promotionData, setPromotionData] = useState({
    price: '',
    startDate: '',
    endDate: '',
  });

  // Filter pricing data
  const filteredData = useMemo(() => {
    return pricingData.filter((p) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.shortName?.toLowerCase().includes(searchLower) ?? false);

      // Margin filter
      const cost = p.costPrice ? parseFloat(p.costPrice) : null;
      let sell: number | null = null;
      if (p.priceVaries && p.variations.length > 0) {
        const firstWithPrice = p.variations.find((v) => v.price);
        if (firstWithPrice) sell = parseFloat(firstWithPrice.price!);
      } else if (p.basePrice) {
        sell = parseFloat(p.basePrice);
      }
      const margin = calculateMargin(cost, sell);

      let matchesMargin = true;
      if (marginFilter === 'low') {
        matchesMargin = margin !== null && margin < 20;
      } else if (marginFilter === 'medium') {
        matchesMargin = margin !== null && margin >= 20 && margin < 30;
      } else if (marginFilter === 'high') {
        matchesMargin = margin !== null && margin >= 30;
      } else if (marginFilter === 'missing') {
        matchesMargin = cost === null;
      }

      return matchesSearch && matchesMargin;
    });
  }, [pricingData, search, marginFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['SKU', 'Name', 'Cost', 'RRP', 'Sell', 'Margin %', 'Promo Price'];
    const rows = filteredData.map((p) => {
      const cost = p.costPrice ? parseFloat(p.costPrice) : null;
      let sell: number | null = null;
      if (p.priceVaries && p.variations.length > 0) {
        const firstWithPrice = p.variations.find((v) => v.price);
        if (firstWithPrice) sell = parseFloat(firstWithPrice.price!);
      } else if (p.basePrice) {
        sell = parseFloat(p.basePrice);
      }
      const margin = calculateMargin(cost, sell);

      return [
        p.sku,
        p.name,
        p.costPrice || '',
        p.rrp || '',
        sell?.toString() || '',
        margin?.toFixed(1) || '',
        p.promotionPrice || '',
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Set promotion for selected products
  const handleSetPromotion = async () => {
    if (selectedIds.size === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: Array.from(selectedIds),
          action: 'set-promotion',
          promotionPrice: promotionData.price,
          promotionStartDate: promotionData.startDate,
          promotionEndDate: promotionData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set promotion');
      }

      setSelectedIds(new Set());
      setPromotionDialogOpen(false);
      setPromotionData({ price: '', startDate: '', endDate: '' });
      router.refresh();
    } catch (error) {
      console.error('Set promotion failed:', error);
      alert('Failed to set promotion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear promotion for selected products
  const handleClearPromotion = async () => {
    if (selectedIds.size === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: Array.from(selectedIds),
          action: 'clear-promotion',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear promotion');
      }

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error('Clear promotion failed:', error);
      alert('Failed to clear promotion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Margin Filter */}
          <Select value={marginFilter} onValueChange={setMarginFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Margin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Margins</SelectItem>
              <SelectItem value="low">🔴 Below 20%</SelectItem>
              <SelectItem value="medium">🟡 20-30%</SelectItem>
              <SelectItem value="high">🟢 Above 30%</SelectItem>
              <SelectItem value="missing">Missing Cost</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Show Tier Pricing Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTierPricing(!showTierPricing)}
          >
            {showTierPricing ? 'Hide Tiers' : 'Show Tiers'}
            <ChevronDown className={cn('ml-1 h-4 w-4 transition-transform', showTierPricing && 'rotate-180')} />
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          {/* Refresh Button */}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-800">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPromotionDialogOpen(true)}
              disabled={isLoading}
            >
              <Tag className="h-4 w-4 mr-1" />
              Set Promotion
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearPromotion}
              disabled={isLoading}
            >
              Clear Promotion
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    filteredData.length > 0 &&
                    selectedIds.size === filteredData.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">RRP</TableHead>
              <TableHead className="text-right">Sell</TableHead>
              <TableHead className="text-center">Margin</TableHead>
              <TableHead className="text-right">Promo</TableHead>
              {showTierPricing && (
                <>
                  <TableHead className="text-right">A</TableHead>
                  <TableHead className="text-right">B</TableHead>
                  <TableHead className="text-right">C</TableHead>
                  <TableHead className="text-right">D</TableHead>
                  <TableHead className="text-right">E</TableHead>
                  <TableHead className="text-right">F</TableHead>
                </>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showTierPricing ? 15 : 9}
                  className="text-center py-8 text-gray-500"
                >
                  No products found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((product) => {
                const cost = product.costPrice ? parseFloat(product.costPrice) : null;
                let sell: number | null = null;
                if (product.priceVaries && product.variations.length > 0) {
                  const firstWithPrice = product.variations.find((v) => v.price);
                  if (firstWithPrice) sell = parseFloat(firstWithPrice.price!);
                } else if (product.basePrice) {
                  sell = parseFloat(product.basePrice);
                }
                const margin = calculateMargin(cost, sell);

                // Check if promotion is active
                const now = new Date();
                const hasActivePromo =
                  product.promotionPrice &&
                  product.promotionStartDate &&
                  product.promotionEndDate &&
                  new Date(product.promotionStartDate) <= now &&
                  new Date(product.promotionEndDate) >= now;

                return (
                  <TableRow
                    key={product.id}
                    className={cn(selectedIds.has(product.id) && 'bg-blue-50')}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.shortName || product.name}</p>
                        {product.priceVaries && (
                          <p className="text-xs text-gray-500">
                            {product.variations.length} sizes
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(product.costPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(product.rrp)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(sell)}
                    </TableCell>
                    <TableCell className="text-center">
                      <MarginBadge margin={margin} />
                    </TableCell>
                    <TableCell className="text-right">
                      {hasActivePromo ? (
                        <span className="text-green-600 font-medium">
                          {formatPrice(product.promotionPrice)}
                        </span>
                      ) : product.promotionPrice ? (
                        <span className="text-gray-400">
                          {formatPrice(product.promotionPrice)}
                        </span>
                      ) : (
                        <span className="text-gray-300">--</span>
                      )}
                    </TableCell>
                    {showTierPricing && (
                      <>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceA)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceB)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceC)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceD)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceE)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {formatPrice(product.priceF)}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedIds(new Set([product.id]));
                              setPromotionDialogOpen(true);
                            }}
                          >
                            <Tag className="mr-2 h-4 w-4" />
                            Set Promotion
                          </DropdownMenuItem>
                          {product.promotionPrice && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedIds(new Set([product.id]));
                                handleClearPromotion();
                              }}
                            >
                              Clear Promotion
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {pricingData.length} products
      </div>

      {/* Promotion Dialog */}
      <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Promotion</DialogTitle>
            <DialogDescription>
              Set a promotional price for {selectedIds.size} selected product(s).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="promo-price" className="text-right">
                Promo Price
              </Label>
              <Input
                id="promo-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={promotionData.price}
                onChange={(e) => setPromotionData({ ...promotionData, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="promo-start" className="text-right">
                Start Date
              </Label>
              <Input
                id="promo-start"
                type="date"
                value={promotionData.startDate}
                onChange={(e) => setPromotionData({ ...promotionData, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="promo-end" className="text-right">
                End Date
              </Label>
              <Input
                id="promo-end"
                type="date"
                value={promotionData.endDate}
                onChange={(e) => setPromotionData({ ...promotionData, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromotionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetPromotion} disabled={isLoading || !promotionData.price}>
              {isLoading ? 'Saving...' : 'Set Promotion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
