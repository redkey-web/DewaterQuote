'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pencil,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Package,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeleteProductButton } from '@/app/admin/products/DeleteProductButton';

interface ProductWithRelations {
  id: number;
  name: string;
  shortName: string | null;
  slug: string;
  sku: string;
  isActive: boolean | null;
  basePrice: string | null;
  priceVaries: boolean | null;
  brand: { name: string } | null;
  category: { name: string } | null;
  images: { url: string; alt: string; isPrimary: boolean | null }[];
  variations: { price: string | null }[];
  downloads?: { url: string; label: string; fileType: string | null }[];
}

interface ProductsTableProps {
  products: ProductWithRelations[];
}

type SortKey = 'name' | 'sku' | 'brand' | 'category' | 'status' | 'price';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'POA';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'POA';
  return `$${num.toFixed(2)}`;
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

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

  // Handle sort toggle
  const handleSort = useCallback((key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Sortable header component
  const SortableHeader = useCallback(
    ({ sortKey, children, className }: { sortKey: SortKey; children: React.ReactNode; className?: string }) => {
      const isActive = sortConfig.key === sortKey;
      return (
        <button
          type="button"
          onClick={() => handleSort(sortKey)}
          className={cn(
            'flex items-center gap-1 hover:text-gray-900 transition-colors font-medium',
            isActive ? 'text-gray-900' : 'text-gray-600',
            className
          )}
        >
          {children}
          {isActive ? (
            sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </button>
      );
    },
    [sortConfig, handleSort]
  );

  // Get display price for a product
  const getDisplayPrice = (product: ProductWithRelations): string => {
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
    return formatPrice(product.basePrice);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.shortName?.toLowerCase().includes(searchLower) ?? false);

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.isActive) ||
        (statusFilter === 'inactive' && !p.isActive);

      // Brand filter
      const matchesBrand = brandFilter === 'all' || p.brand?.name === brandFilter;

      // Category filter
      const matchesCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const { key, direction } = sortConfig;
      const multiplier = direction === 'asc' ? 1 : -1;

      let aVal: string | number;
      let bVal: string | number;

      switch (key) {
        case 'name':
          aVal = (a.shortName || a.name).toLowerCase();
          bVal = (b.shortName || b.name).toLowerCase();
          break;
        case 'sku':
          aVal = a.sku.toLowerCase();
          bVal = b.sku.toLowerCase();
          break;
        case 'brand':
          aVal = (a.brand?.name || '').toLowerCase();
          bVal = (b.brand?.name || '').toLowerCase();
          break;
        case 'category':
          aVal = (a.category?.name || '').toLowerCase();
          bVal = (b.category?.name || '').toLowerCase();
          break;
        case 'status':
          aVal = a.isActive ? 1 : 0;
          bVal = b.isActive ? 1 : 0;
          break;
        case 'price': {
          const getMinPrice = (p: ProductWithRelations): number => {
            if (p.priceVaries && p.variations.length > 0) {
              const prices = p.variations
                .map((v) => (v.price ? parseFloat(v.price) : null))
                .filter((x): x is number => x !== null);
              return prices.length > 0 ? Math.min(...prices) : 0;
            }
            return p.basePrice ? parseFloat(p.basePrice) : 0;
          };
          aVal = getMinPrice(a);
          bVal = getMinPrice(b);
          break;
        }
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }
      return ((aVal as number) - (bVal as number)) * multiplier;
    });

    return sorted;
  }, [products, search, brandFilter, categoryFilter, statusFilter, sortConfig]);

  // Get primary image for product
  const getPrimaryImage = (product: ProductWithRelations): string | null => {
    const primary = product.images.find((img) => img.isPrimary);
    if (primary) return primary.url;
    return product.images[0]?.url || null;
  };

  // Get datasheet PDF URL if available
  const getDatasheetUrl = (product: ProductWithRelations): string | null => {
    if (!product.downloads) return null;
    const datasheet = product.downloads.find(
      (d) => d.label.toLowerCase().includes('datasheet') || d.fileType === 'pdf'
    );
    return datasheet?.url || null;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

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

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Results count */}
        <span className="text-sm text-gray-500 ml-auto">
          {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>
                <SortableHeader sortKey="name">Product</SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader sortKey="sku">SKU</SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader sortKey="price">Price</SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader sortKey="brand">Brand</SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader sortKey="category">Category</SortableHeader>
              </TableHead>
              <TableHead className="w-[80px]">
                <SortableHeader sortKey="status">Status</SortableHeader>
              </TableHead>
              <TableHead className="w-[80px] text-center">Datasheet</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No products found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const imageUrl = getPrimaryImage(product);
                return (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-medium hover:text-blue-600 hover:underline"
                        >
                          {product.shortName || product.name}
                        </Link>
                        {product.shortName && (
                          <p className="text-xs text-gray-500 truncate max-w-[300px]">{product.name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-mono text-sm">{getDisplayPrice(product)}</TableCell>
                    <TableCell>{product.brand?.name || '-'}</TableCell>
                    <TableCell>{product.category?.name || '-'}</TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const datasheetUrl = getDatasheetUrl(product);
                        return datasheetUrl ? (
                          <a
                            href={datasheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                            title="View Datasheet"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" title="View on site">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
