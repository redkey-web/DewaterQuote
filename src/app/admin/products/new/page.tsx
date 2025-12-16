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

  // Debug logging
  console.log('Brands:', JSON.stringify(brandsList.map(b => ({ id: b.id, name: b.name }))));
  console.log('Categories:', JSON.stringify(categoriesList.map(c => ({ id: c.id, name: c.name }))));
  console.log('Subcategories:', JSON.stringify(subcategoriesList.map(s => ({ id: s.id, name: s.name }))));

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
