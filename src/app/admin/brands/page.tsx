import { db } from '@/db';
import { brands, products } from '@/db/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Package } from 'lucide-react';

async function getBrandsWithCounts() {
  try {
    const brandsWithData = await db
      .select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        createdAt: brands.createdAt,
      })
      .from(brands)
      .orderBy(brands.name);

    // Get product counts
    const productCounts = await db
      .select({
        brandId: products.brandId,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .groupBy(products.brandId);

    // Map counts to brands
    return brandsWithData.map((brand) => ({
      ...brand,
      productCount: productCounts.find((p) => p.brandId === brand.id)?.count || 0,
    }));
  } catch (error) {
    console.error('Failed to get brands:', error);
    return [];
  }
}

export default async function BrandsListPage() {
  const brandList = await getBrandsWithCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500">Manage product brands</p>
        </div>
        <Link href="/admin/brands/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brandList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No brands found. Add your first brand to get started.
                </TableCell>
              </TableRow>
            ) : (
              brandList.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      {brand.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{brand.slug}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{brand.productCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/brands/${brand.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
