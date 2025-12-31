'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  Pencil,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Search,
  Download,
  Save,
  X,
} from 'lucide-react';
import { StockStatusBadge, StockQtyBadge, getStockStatus } from './StockStatusBadge';
import { cn } from '@/lib/utils';

interface VariationStock {
  qtyInStock: number | null;
  incomingQty: number | null;
  preorderQty: number | null;
}

interface ProductVariation {
  id: number;
  size: string;
  label: string | null;
  price: string | null;
  sku: string | null;
  stock: VariationStock | null;
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
  variations: ProductVariation[];
}

interface InventoryManagementTableProps {
  products: InventoryProduct[];
}

interface EditedProduct {
  qtyInStock?: number;
  incomingQty?: number;
  leadTimeText?: string;
  basePrice?: string;
}

interface EditedVariation {
  qtyInStock?: number;
  incomingQty?: number;
  price?: string;
}

type EditedProducts = Record<number, EditedProduct>;
type EditedVariations = Record<number, EditedVariation>;

function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '--';
  return `$${num.toFixed(2)}`;
}

export function InventoryManagementTable({ products }: InventoryManagementTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProducts, setEditedProducts] = useState<EditedProducts>({});
  const [editedVariations, setEditedVariations] = useState<EditedVariations>({});

  // Check if there are unsaved changes
  const hasProductChanges = Object.keys(editedProducts).length > 0;
  const hasVariationChanges = Object.keys(editedVariations).length > 0;
  const hasChanges = hasProductChanges || hasVariationChanges;
  const changeCount = Object.keys(editedProducts).length + Object.keys(editedVariations).length;

  // Get unique brands and categories for filters
  const brands = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.name) unique.add(p.brand.name);
    });
    return Array.from(unique).sort();
  }, [products]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name) unique.add(p.category.name);
    });
    return Array.from(unique).sort();
  }, [products]);

  // Get effective value (edited or original)
  const getEffectiveValue = useCallback(
    <K extends keyof EditedProduct>(
      productId: number,
      field: K,
      originalValue: EditedProduct[K]
    ): EditedProduct[K] => {
      const edited = editedProducts[productId];
      if (edited && field in edited) {
        return edited[field] as EditedProduct[K];
      }
      return originalValue;
    },
    [editedProducts]
  );

  // Handle field edit
  const handleFieldEdit = useCallback(
    (productId: number, field: keyof EditedProduct, value: string | number) => {
      setEditedProducts((prev) => {
        const existing = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...existing,
            [field]: value,
          },
        };
      });
    },
    []
  );

  // Get effective variation value (edited or original)
  const getEffectiveVariationValue = useCallback(
    <K extends keyof EditedVariation>(
      variationId: number,
      field: K,
      originalValue: EditedVariation[K]
    ): EditedVariation[K] => {
      const edited = editedVariations[variationId];
      if (edited && field in edited) {
        return edited[field] as EditedVariation[K];
      }
      return originalValue;
    },
    [editedVariations]
  );

  // Handle variation field edit
  const handleVariationEdit = useCallback(
    (variationId: number, field: keyof EditedVariation, value: string | number) => {
      setEditedVariations((prev) => {
        const existing = prev[variationId] || {};
        return {
          ...prev,
          [variationId]: {
            ...existing,
            [field]: value,
          },
        };
      });
    },
    []
  );

  // Discard all changes
  const handleDiscardChanges = useCallback(() => {
    setEditedProducts({});
    setEditedVariations({});
  }, []);

  // Save all changes
  const handleSaveChanges = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/inventory/batch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productUpdates: editedProducts,
          variationUpdates: editedVariations,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setEditedProducts({});
      setEditedVariations({});
      router.refresh();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [editedProducts, editedVariations, hasChanges, router]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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

      // Brand filter
      const matchesBrand = brandFilter === 'all' || p.brand?.name === brandFilter;

      // Category filter
      const matchesCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
    });
  }, [products, search, statusFilter, brandFilter, categoryFilter]);

  // Toggle product expansion
  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedProducts(newExpanded);
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
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

  // Export to CSV
  const handleExport = () => {
    const headers = ['SKU', 'Name', 'Brand', 'Category', 'Status', 'Stock', 'Incoming', 'Lead Time', 'Price', 'Sizes'];
    const rows = filteredProducts.map((p) => {
      const status = getStockStatus(
        p.isActive,
        p.isSuspended,
        p.isQuoteOnly,
        p.stock?.qtyInStock ?? null,
        p.stock?.reorderPoint ?? null
      );
      return [
        p.sku,
        `"${p.name.replace(/"/g, '""')}"`,
        p.brand?.name || '',
        p.category?.name || '',
        status,
        p.stock?.qtyInStock?.toString() || '0',
        p.stock?.incomingQty?.toString() || '0',
        p.leadTimeText || '',
        getDisplayPrice(p),
        p.variations.length.toString(),
      ];
    });

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  // Get display price for a product
  const getDisplayPrice = (product: InventoryProduct): string => {
    if (product.isQuoteOnly) return 'Quote Only';
    if (product.priceVaries && product.variations.length > 0) {
      const prices = product.variations
        .map((v) => (v.price ? parseFloat(v.price) : null))
        .filter((p): p is number => p !== null);
      if (prices.length === 0) return 'POA';
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return formatPrice(min);
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    }
    // Check for edited base price
    const editedPrice = editedProducts[product.id]?.basePrice;
    if (editedPrice !== undefined) {
      return formatPrice(editedPrice);
    }
    return formatPrice(product.basePrice);
  };

  return (
    <div className="space-y-4">
      {/* Sticky Header with Filters and Actions - top-16 accounts for 64px AdminHeader */}
      <div className="sticky top-16 z-30 bg-white -mx-6 px-6 py-3 border-b border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white">
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

            {/* Brand Filter */}
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] bg-white">
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
                className="pl-9 w-[200px] bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* Save/Discard buttons - show when there are changes */}
            {hasChanges && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Saving...' : `Save (${changeCount})`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscardChanges}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Discard
                </Button>
              </>
            )}

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
      <div className="border rounded-lg bg-white">
        <Table containerClassName="overflow-visible">
          <TableHeader>
            <TableRow className="border-b-2 border-gray-300">
              <TableHead className="w-[40px] sticky top-[116px] bg-gray-100 z-20">
                <Checkbox
                  checked={
                    filteredProducts.length > 0 &&
                    selectedIds.size === filteredProducts.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[40px] sticky top-[116px] bg-gray-100 z-20"></TableHead>
              <TableHead className="sticky top-[116px] bg-gray-100 z-20">SKU</TableHead>
              <TableHead className="sticky top-[116px] bg-gray-100 z-20">Name</TableHead>
              <TableHead className="sticky top-[116px] bg-gray-100 z-20">Brand</TableHead>
              <TableHead className="text-center sticky top-[116px] bg-gray-100 z-20">Status</TableHead>
              <TableHead className="text-center w-[80px] sticky top-[116px] bg-gray-100 z-20">Stock</TableHead>
              <TableHead className="text-center w-[80px] sticky top-[116px] bg-gray-100 z-20">Incoming</TableHead>
              <TableHead className="w-[120px] sticky top-[116px] bg-gray-100 z-20">Lead Time</TableHead>
              <TableHead className="text-right w-[100px] sticky top-[116px] bg-gray-100 z-20">Price</TableHead>
              <TableHead className="text-center sticky top-[116px] bg-gray-100 z-20">Sizes</TableHead>
              <TableHead className="text-right sticky top-[116px] bg-gray-100 z-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                  No products found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const isEdited = !!editedProducts[product.id];
                const status = getStockStatus(
                  product.isActive,
                  product.isSuspended,
                  product.isQuoteOnly,
                  getEffectiveValue(product.id, 'qtyInStock', product.stock?.qtyInStock ?? 0) as number,
                  product.stock?.reorderPoint ?? null
                );

                return (
                  <React.Fragment key={product.id}>
                    <TableRow
                      className={cn(
                        'hover:bg-gray-50',
                        selectedIds.has(product.id) && 'bg-blue-50',
                        isEdited && 'bg-yellow-50'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {product.priceVaries && product.variations.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleExpand(product.id)}
                          >
                            {expandedProducts.has(product.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <p className="font-medium">{product.shortName || product.name}</p>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {product.brand?.name || '--'}
                      </TableCell>
                      <TableCell className="text-center">
                        <StockStatusBadge status={status} />
                      </TableCell>
                      <TableCell className="text-center">
                        {product.priceVaries && product.variations.length > 0 ? (
                          // Show aggregate total for products with variations (read-only)
                          <span className="text-sm font-medium text-gray-700">
                            {product.stock?.qtyInStock ?? 0}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            className={cn(
                              "w-16 h-8 text-center text-sm",
                              editedProducts[product.id]?.qtyInStock !== undefined && "border-yellow-400 bg-yellow-50"
                            )}
                            value={getEffectiveValue(product.id, 'qtyInStock', product.stock?.qtyInStock ?? 0)}
                            onChange={(e) => handleFieldEdit(product.id, 'qtyInStock', parseInt(e.target.value) || 0)}
                            disabled={product.isSuspended || product.isQuoteOnly}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.priceVaries && product.variations.length > 0 ? (
                          // Show aggregate total for products with variations (read-only)
                          <span className="text-sm font-medium text-gray-700">
                            {product.stock?.incomingQty ?? 0}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            className={cn(
                              "w-16 h-8 text-center text-sm",
                              editedProducts[product.id]?.incomingQty !== undefined && "border-yellow-400 bg-yellow-50"
                            )}
                            value={getEffectiveValue(product.id, 'incomingQty', product.stock?.incomingQty ?? 0)}
                            onChange={(e) => handleFieldEdit(product.id, 'incomingQty', parseInt(e.target.value) || 0)}
                            disabled={product.isSuspended || product.isQuoteOnly}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          className={cn(
                            "w-full h-8 text-sm",
                            editedProducts[product.id]?.leadTimeText !== undefined && "border-yellow-400 bg-yellow-50"
                          )}
                          placeholder="e.g. 2-3 weeks"
                          value={getEffectiveValue(product.id, 'leadTimeText', product.leadTimeText ?? '') as string}
                          onChange={(e) => handleFieldEdit(product.id, 'leadTimeText', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {product.priceVaries ? (
                          <span className="font-mono text-sm">{getDisplayPrice(product)}</span>
                        ) : (
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className={cn(
                              "w-24 h-8 text-right text-sm font-mono",
                              editedProducts[product.id]?.basePrice !== undefined && "border-yellow-400 bg-yellow-50"
                            )}
                            value={getEffectiveValue(product.id, 'basePrice', product.basePrice ?? '') as string}
                            onChange={(e) => handleFieldEdit(product.id, 'basePrice', e.target.value)}
                            disabled={product.isQuoteOnly}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.priceVaries ? (
                          <span className="text-sm text-gray-600">
                            {product.variations.length}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </TableCell>
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
                    {/* Expanded variations */}
                    {expandedProducts.has(product.id) &&
                      product.variations.map((variation) => {
                        const isVariationEdited = !!editedVariations[variation.id];
                        return (
                          <TableRow
                            key={`${product.id}-${variation.id}`}
                            className={cn(
                              'bg-gray-50/50',
                              isVariationEdited && 'bg-yellow-50/70'
                            )}
                          >
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="font-mono text-xs text-gray-500 pl-4">
                              {variation.sku || '--'}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {variation.label || variation.size}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                className={cn(
                                  'w-16 h-7 text-center text-xs',
                                  editedVariations[variation.id]?.qtyInStock !== undefined &&
                                    'border-yellow-400 bg-yellow-50'
                                )}
                                value={getEffectiveVariationValue(
                                  variation.id,
                                  'qtyInStock',
                                  variation.stock?.qtyInStock ?? 0
                                )}
                                onChange={(e) =>
                                  handleVariationEdit(
                                    variation.id,
                                    'qtyInStock',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={product.isSuspended || product.isQuoteOnly}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                className={cn(
                                  'w-16 h-7 text-center text-xs',
                                  editedVariations[variation.id]?.incomingQty !== undefined &&
                                    'border-yellow-400 bg-yellow-50'
                                )}
                                value={getEffectiveVariationValue(
                                  variation.id,
                                  'incomingQty',
                                  variation.stock?.incomingQty ?? 0
                                )}
                                onChange={(e) =>
                                  handleVariationEdit(
                                    variation.id,
                                    'incomingQty',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={product.isSuspended || product.isQuoteOnly}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className={cn(
                                  'w-20 h-7 text-right text-xs font-mono',
                                  editedVariations[variation.id]?.price !== undefined &&
                                    'border-yellow-400 bg-yellow-50'
                                )}
                                value={getEffectiveVariationValue(
                                  variation.id,
                                  'price',
                                  variation.price ?? ''
                                )}
                                onChange={(e) =>
                                  handleVariationEdit(variation.id, 'price', e.target.value)
                                }
                                disabled={product.isQuoteOnly}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
        {hasChanges && (
          <span className="ml-2 text-yellow-600">
            ({changeCount} unsaved change{changeCount !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
}
