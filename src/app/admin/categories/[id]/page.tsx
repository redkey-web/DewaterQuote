import { db } from '@/db';
import { categories, subcategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryFormEdit } from '@/components/admin/CategoryForm';

async function getCategory(id: string) {
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) return null;

  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) return null;

    const categorySubcategories = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .orderBy(subcategories.displayOrder, subcategories.name);

    return {
      ...category,
      subcategories: categorySubcategories,
    };
  } catch (error) {
    console.error('Failed to get category:', error);
    return null;
  }
}

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-500">{category.name}</p>
      </div>

      <CategoryFormEdit category={category} />
    </div>
  );
}
