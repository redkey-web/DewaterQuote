import { db } from '@/db';
import { categories, subcategories, products } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, FolderTree, Package } from 'lucide-react';

async function getCategoriesWithCounts() {
  try {
    const categoriesWithData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        displayOrder: categories.displayOrder,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .orderBy(categories.displayOrder, categories.name);

    // Get subcategory counts
    const subcategoryCounts = await db
      .select({
        categoryId: subcategories.categoryId,
        count: sql<number>`count(*)::int`,
      })
      .from(subcategories)
      .groupBy(subcategories.categoryId);

    // Get product counts
    const productCounts = await db
      .select({
        categoryId: products.categoryId,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .groupBy(products.categoryId);

    // Map counts to categories
    return categoriesWithData.map((cat) => ({
      ...cat,
      subcategoryCount: subcategoryCounts.find((s) => s.categoryId === cat.id)?.count || 0,
      productCount: productCounts.find((p) => p.categoryId === cat.id)?.count || 0,
    }));
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
}

export default async function CategoriesListPage() {
  const categoryList = await getCategoriesWithCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Manage product categories and subcategories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Subcategories</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            ) : (
              categoryList.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-sm text-gray-500">
                    {category.displayOrder ?? 0}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      {category.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FolderTree className="h-4 w-4 text-gray-400" />
                      <span>{category.subcategoryCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{category.productCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/categories/${category.id}`}>
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
