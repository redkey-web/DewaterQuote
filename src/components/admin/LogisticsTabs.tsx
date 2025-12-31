'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, MoreHorizontal, Search, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface LogisticsTabsProps {
  logisticsData: LogisticsProduct[];
}

function formatNumber(value: string | null, decimals = 2): string {
  if (!value) return '--';
  const num = parseFloat(value);
  return isNaN(num) ? '--' : num.toFixed(decimals);
}

function formatPrice(value: string | null): string {
  if (!value) return '--';
  const num = parseFloat(value);
  return isNaN(num) ? '--' : `$${num.toFixed(2)}`;
}

export function LogisticsTabs({ logisticsData }: LogisticsTabsProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('shipping');

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return logisticsData;

    const searchLower = search.toLowerCase();
    return logisticsData.filter(
      (p) =>
        p.sku.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.shortName?.toLowerCase().includes(searchLower) ?? false)
    );
  }, [logisticsData, search]);

  // Export to CSV
  const handleExport = () => {
    let headers: string[];
    let rows: string[][];

    if (activeTab === 'shipping') {
      headers = ['SKU', 'Name', 'Weight (kg)', 'H (cm)', 'W (cm)', 'L (cm)', 'Volume (m³)', 'Category', 'Pick Zone', 'UOM'];
      rows = filteredData.map((p) => [
        p.sku,
        p.name,
        p.shipping?.weightKg || '',
        p.shipping?.heightCm || '',
        p.shipping?.widthCm || '',
        p.shipping?.lengthCm || '',
        p.shipping?.cubicM3 || '',
        p.shipping?.shippingCategory || '',
        p.shipping?.pickZone || '',
        p.shipping?.unitOfMeasure || '',
      ]);
    } else {
      headers = ['SKU', 'Name', 'Supplier', 'Supplier SKU', 'Supplier Product Name', 'Purchase Price'];
      rows = filteredData.map((p) => [
        p.sku,
        p.name,
        p.supplier?.primarySupplier || '',
        p.supplier?.supplierItemCode || '',
        p.supplier?.supplierProductName || '',
        p.supplier?.purchasePrice || '',
      ]);
    }

    const csv = [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <TabsList>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <div className="flex gap-2 items-center">
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

      {/* Shipping Tab */}
      <TabsContent value="shipping">
        <div className="border rounded-lg bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
                <TableHead className="text-right">H (cm)</TableHead>
                <TableHead className="text-right">W (cm)</TableHead>
                <TableHead className="text-right">L (cm)</TableHead>
                <TableHead className="text-right">Vol (m³)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pick Zone</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                    No products found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <p className="font-medium truncate max-w-[200px]">
                        {product.shortName || product.name}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(product.shipping?.weightKg ?? null, 3)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(product.shipping?.heightCm ?? null)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(product.shipping?.widthCm ?? null)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(product.shipping?.lengthCm ?? null)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(product.shipping?.cubicM3 ?? null, 4)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-sm',
                        product.shipping?.shippingCategory ? 'text-gray-900' : 'text-gray-400'
                      )}>
                        {product.shipping?.shippingCategory || '--'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-sm',
                        product.shipping?.pickZone ? 'text-gray-900' : 'text-gray-400'
                      )}>
                        {product.shipping?.pickZone || '--'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {product.shipping?.unitOfMeasure || 'ea'}
                      </span>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Suppliers Tab */}
      <TabsContent value="suppliers">
        <div className="border rounded-lg bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier SKU</TableHead>
                <TableHead>Supplier Product Name</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No products found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <p className="font-medium truncate max-w-[200px]">
                        {product.shortName || product.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        product.supplier?.primarySupplier ? 'text-gray-900 font-medium' : 'text-gray-400'
                      )}>
                        {product.supplier?.primarySupplier || '--'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.supplier?.supplierItemCode || '--'}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {product.supplier?.supplierProductName || '--'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(product.supplier?.purchasePrice ?? null)}
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {logisticsData.length} products
      </div>
    </Tabs>
  );
}
