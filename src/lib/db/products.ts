/**
 * Product Data Access Layer
 *
 * Query functions for fetching products from the database.
 * Database errors are thrown (not silently handled) so issues are visible.
 */

import { db } from '@/db';
import { products, brands, categories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Type for product with relations
export type ProductWithRelations = Awaited<ReturnType<typeof getProductBySlug>>;

/**
 * Get a single product by slug with all relations
 */
export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      brand: true,
      category: true,
      subcategory: true,
      variations: {
        orderBy: (variations, { asc }) => [asc(variations.displayOrder)],
      },
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
      downloads: true,
      features: {
        orderBy: (features, { asc }) => [asc(features.displayOrder)],
      },
      specifications: {
        orderBy: (specs, { asc }) => [asc(specs.displayOrder)],
      },
      applications: {
        orderBy: (apps, { asc }) => [asc(apps.displayOrder)],
      },
    },
  });

  return product;
}

/**
 * Get all active products
 */
export async function getAllProducts() {
  return await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: {
      brand: true,
      category: true,
      images: {
        where: eq(products.isActive, true),
        limit: 1,
      },
      variations: true,
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string) {
  // First get the category ID
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!category) {
    return [];
  }

  return await db.query.products.findMany({
    where: and(
      eq(products.categoryId, category.id),
      eq(products.isActive, true)
    ),
    with: {
      brand: true,
      category: true,
      images: {
        limit: 1,
      },
      variations: true,
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get products by brand slug
 */
export async function getProductsByBrand(brandSlug: string) {
  const brand = await db.query.brands.findFirst({
    where: eq(brands.slug, brandSlug),
  });

  if (!brand) {
    return [];
  }

  return await db.query.products.findMany({
    where: and(
      eq(products.brandId, brand.id),
      eq(products.isActive, true)
    ),
    with: {
      brand: true,
      category: true,
      images: {
        limit: 1,
      },
      variations: true,
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get all product slugs (for static generation)
 */
export async function getAllProductSlugs() {
  const result = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isActive, true));

  return result.map(r => r.slug);
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string) {
  const allProducts = await getAllProducts();
  const lowerQuery = query.toLowerCase();

  return allProducts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery)
  );
}
