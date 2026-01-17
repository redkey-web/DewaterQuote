import { db } from '@/db';
import { products } from '@/db/schema';
import { RedirectFormNew } from '@/components/admin/RedirectForm';

async function getProducts() {
  try {
    return await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
      })
      .from(products)
      .orderBy(products.name);
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
}

export default async function RedirectNewPage() {
  const productList = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Redirect</h1>
        <p className="text-gray-500">Create a URL redirect</p>
      </div>

      <RedirectFormNew products={productList} />
    </div>
  );
}
