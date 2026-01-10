import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductsTable } from '@/components/admin/ProductsTable';

async function getProducts() {
  try {
    return await db.query.products.findMany({
      with: {
        brand: true,
        category: true,
        images: {
          columns: { url: true, alt: true, isPrimary: true },
          orderBy: (images, { asc }) => [asc(images.displayOrder)],
        },
        variations: {
          columns: { price: true },
        },
        downloads: {
          columns: { url: true, label: true, fileType: true },
        },
      },
      orderBy: [desc(products.updatedAt)],
    });
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
}

export default async function ProductsListPage() {
  const productList = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Pages</h1>
          <p className="text-gray-500">Manage your product catalog and page content</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsTable products={productList} />
    </div>
  );
}
