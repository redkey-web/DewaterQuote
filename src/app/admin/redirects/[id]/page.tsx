import { db } from '@/db';
import { redirects, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { RedirectFormEdit } from '@/components/admin/RedirectForm';

async function getRedirect(id: string) {
  const redirectId = parseInt(id, 10);
  if (isNaN(redirectId)) return null;

  try {
    return await db.query.redirects.findFirst({
      where: eq(redirects.id, redirectId),
    });
  } catch (error) {
    console.error('Failed to get redirect:', error);
    return null;
  }
}

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

export default async function RedirectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [redirect, productList] = await Promise.all([
    getRedirect(id),
    getProducts(),
  ]);

  if (!redirect) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Redirect</h1>
        <p className="text-gray-500 font-mono">{redirect.fromPath}</p>
      </div>

      <RedirectFormEdit redirect={redirect} products={productList} />
    </div>
  );
}
