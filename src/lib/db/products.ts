/**
 * Product Data Access Layer
 *
 * Query functions for fetching products from the database.
 * Database errors are thrown (not silently handled) so issues are visible.
 *
 * IMPORTANT: All public-facing queries filter out:
 * - Products where isActive = false
 * - Products where isSuspended = true
 * - Variations where isSuspended = true
 */

import { db } from '@/db';
import { products, brands, categories, productVariations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Type for product with relations
export type ProductWithRelations = Awaited<ReturnType<typeof getProductBySlug>>;

/**
 * Get a single product by slug with all relations
 * Returns null if product is inactive or suspended (effectively 404s the page)
 */
export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
      eq(products.isActive, true),
      eq(products.isSuspended, false)
    ),
    with: {
      brand: true,
      category: true,
      subcategory: true,
      variations: {
        where: eq(productVariations.isSuspended, false),
        orderBy: (variations, { asc }) => [asc(variations.sizeRank), asc(variations.displayOrder)],
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
 * Get all active, non-suspended products
 */
export async function getAllProducts() {
  return await db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      eq(products.isSuspended, false)
    ),
    with: {
      brand: true,
      category: true,
      images: {
        limit: 1,
      },
      variations: {
        where: eq(productVariations.isSuspended, false),
      },
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get products by category slug (excluding suspended)
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
      eq(products.isActive, true),
      eq(products.isSuspended, false)
    ),
    with: {
      brand: true,
      category: true,
      images: {
        limit: 1,
      },
      variations: {
        where: eq(productVariations.isSuspended, false),
      },
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get products by brand slug (excluding suspended)
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
      eq(products.isActive, true),
      eq(products.isSuspended, false)
    ),
    with: {
      brand: true,
      category: true,
      images: {
        limit: 1,
      },
      variations: {
        where: eq(productVariations.isSuspended, false),
      },
    },
    orderBy: (products, { asc }) => [asc(products.name)],
  });
}

/**
 * Get all product slugs (for static generation)
 * Excludes suspended products so they won't be pre-rendered
 */
export async function getAllProductSlugs() {
  const result = await db
    .select({ slug: products.slug })
    .from(products)
    .where(and(
      eq(products.isActive, true),
      eq(products.isSuspended, false)
    ));

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
