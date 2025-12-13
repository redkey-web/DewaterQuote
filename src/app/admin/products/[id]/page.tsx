import { db } from '@/db';
import { products, brands, categories, subcategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';

async function getProduct(id: string) {
  const productId = parseInt(id, 10);
  if (isNaN(productId)) return null;

  try {
    return await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        brand: true,
        category: true,
        subcategory: true,
        productCategories: {
          with: { category: true },
          orderBy: (pc, { asc }) => [asc(pc.displayOrder)],
        },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        downloads: true,
        features: { orderBy: (f, { asc }) => [asc(f.displayOrder)] },
        specifications: { orderBy: (s, { asc }) => [asc(s.displayOrder)] },
        applications: { orderBy: (a, { asc }) => [asc(a.displayOrder)] },
      },
    });
  } catch (error) {
    console.error('Failed to get product:', error);
    return null;
  }
}

async function getBrands() {
  try {
    return await db.select().from(brands).orderBy(brands.name);
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(categories.name);
  } catch {
    return [];
  }
}

async function getSubcategories() {
  try {
    return await db.select().from(subcategories).orderBy(subcategories.name);
  } catch {
    return [];
  }
}

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brandsList, categoriesList, subcategoriesList] = await Promise.all([
    getProduct(id),
    getBrands(),
    getCategories(),
    getSubcategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500">{product.name}</p>
      </div>

      <ProductForm
        product={product}
        brands={brandsList}
        categories={categoriesList}
        subcategories={subcategoriesList}
      />
    </div>
  );
}
