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
import { Pencil, RefreshCw, MoreHorizontal, ChevronDown, Search } from 'lucide-react';
import { StockStatusBadge, StockQtyBadge, getStockStatus, StockStatus } from './StockStatusBadge';
import { cn } from '@/lib/utils';

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

interface InventoryTableProps {
  inventory: InventoryProduct[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreColumns, setShowMoreColumns] = useState(false);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    inventory.forEach((p) => {
      if (p.category?.name) cats.add(p.category.name);
    });
    return Array.from(cats).sort();
  }, [inventory]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((p) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.shortName?.toLowerCase().includes(searchLower) ?? false);

      // Status filter
      const status = getStockStatus(
        p.isActive,
        p.isSuspended,
        p.isQuoteOnly,
        p.stock?.qtyInStock ?? null,
        p.stock?.reorderPoint ?? null
      );
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === 'all' || p.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [inventory, search, statusFilter, categoryFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInventory.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInventory.map((p) => p.id)));
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

  // Bulk actions
  const handleBulkAction = async (action: 'quote-only' | 'suspend' | 'activate' | 'unsuspend') => {
    if (selectedIds.size === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: Array.from(selectedIds),
          action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update products');
      }

      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Failed to update products. Please try again.');
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
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="quote-only">Quote Only</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
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
          {/* Show More Columns Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMoreColumns(!showMoreColumns)}
          >
            {showMoreColumns ? 'Show Less' : 'Show More'}
            <ChevronDown className={cn('ml-1 h-4 w-4 transition-transform', showMoreColumns && 'rotate-180')} />
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
              onClick={() => handleBulkAction('quote-only')}
              disabled={isLoading}
            >
              Set Quote Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('suspend')}
              disabled={isLoading}
            >
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('activate')}
              disabled={isLoading}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('unsuspend')}
              disabled={isLoading}
            >
              Unsuspend
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
                    filteredInventory.length > 0 &&
                    selectedIds.size === filteredInventory.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Incoming</TableHead>
              <TableHead>Status</TableHead>
              {showMoreColumns && (
                <>
                  <TableHead className="text-center">Preorder</TableHead>
                  <TableHead className="text-center">Reorder Pt</TableHead>
                  <TableHead>Lead Time</TableHead>
                </>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showMoreColumns ? 10 : 7}
                  className="text-center py-8 text-gray-500"
                >
                  No products found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((product) => {
                const status = getStockStatus(
                  product.isActive,
                  product.isSuspended,
                  product.isQuoteOnly,
                  product.stock?.qtyInStock ?? null,
                  product.stock?.reorderPoint ?? null
                );

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
                        {product.shortName && (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {product.name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <StockQtyBadge
                        qty={product.stock?.qtyInStock ?? null}
                        reorderPoint={product.stock?.reorderPoint ?? null}
                        isSuspended={product.isSuspended}
                        isQuoteOnly={product.isQuoteOnly}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {product.isSuspended || product.isQuoteOnly ? (
                        <span className="text-gray-400">--</span>
                      ) : (
                        <span className={cn(
                          (product.stock?.incomingQty ?? 0) > 0 ? 'text-blue-600' : 'text-gray-400'
                        )}>
                          {product.stock?.incomingQty ?? 0}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StockStatusBadge status={status} />
                    </TableCell>
                    {showMoreColumns && (
                      <>
                        <TableCell className="text-center">
                          {product.stock?.preorderQty ?? 0}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.stock?.reorderPoint ?? 5}
                        </TableCell>
                        <TableCell>
                          {product.leadTimeText || (
                            product.handlingTimeDays
                              ? `${product.handlingTimeDays} days`
                              : <span className="text-gray-400">--</span>
                          )}
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
                              handleBulkAction(product.isQuoteOnly ? 'activate' : 'quote-only');
                            }}
                          >
                            {product.isQuoteOnly ? 'Remove Quote Only' : 'Set Quote Only'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedIds(new Set([product.id]));
                              handleBulkAction(product.isSuspended ? 'unsuspend' : 'suspend');
                            }}
                          >
                            {product.isSuspended ? 'Unsuspend' : 'Suspend'}
                          </DropdownMenuItem>
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
        Showing {filteredInventory.length} of {inventory.length} products
      </div>
    </div>
  );
}
