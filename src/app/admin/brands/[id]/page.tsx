import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BrandFormEdit } from '@/components/admin/BrandForm';

async function getBrand(id: string) {
  const brandId = parseInt(id, 10);
  if (isNaN(brandId)) return null;

  try {
    return await db.query.brands.findFirst({
      where: eq(brands.id, brandId),
    });
  } catch (error) {
    console.error('Failed to get brand:', error);
    return null;
  }
}

export default async function BrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
        <p className="text-gray-500">{brand.name}</p>
      </div>

      <BrandFormEdit brand={brand} />
    </div>
  );
}
