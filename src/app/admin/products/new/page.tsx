import { db } from '@/db';
import { brands, categories, subcategories } from '@/db/schema';
import { ProductFormNew } from '@/components/admin/ProductFormNew';

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

export default async function ProductNewPage() {
  const [brandsList, categoriesList, subcategoriesList] = await Promise.all([
    getBrands(),
    getCategories(),
    getSubcategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500">Create a new product for your catalog</p>
      </div>

      <ProductFormNew
        brands={brandsList}
        categories={categoriesList}
        subcategories={subcategoriesList}
      />
    </div>
  );
}
