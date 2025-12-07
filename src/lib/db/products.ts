/**
 * Product Data Access Layer
 *
 * Query functions for fetching products from the database.
 * Falls back to catalog.ts if database is unavailable.
 */

import { db } from '@/db';
import { products, brands, categories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  products as catalogProducts,
  getProductBySlug as getCatalogProductBySlug,
  getProductsByCategory as getCatalogProductsByCategory,
} from '@/data/catalog';

// Type for product with relations
export type ProductWithRelations = Awaited<ReturnType<typeof getProductBySlug>>;

/**
 * Get a single product by slug with all relations
 */
export async function getProductBySlug(slug: string) {
  try {
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
  } catch (error) {
    console.error('DB error in getProductBySlug, falling back to catalog:', error);
    return getCatalogProductBySlug(slug);
  }
}

/**
 * Get all active products
 */
export async function getAllProducts() {
  try {
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
  } catch (error) {
    console.error('DB error in getAllProducts, falling back to catalog:', error);
    return catalogProducts;
  }
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string) {
  try {
    // First get the category ID
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      return getCatalogProductsByCategory(categorySlug);
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
  } catch (error) {
    console.error('DB error in getProductsByCategory, falling back to catalog:', error);
    return getCatalogProductsByCategory(categorySlug);
  }
}

/**
 * Get products by brand slug
 */
export async function getProductsByBrand(brandSlug: string) {
  try {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.slug, brandSlug),
    });

    if (!brand) {
      // Fallback: filter catalog by brand name
      return catalogProducts.filter(
        p => p.brand.toLowerCase() === brandSlug.toLowerCase()
      );
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
  } catch (error) {
    console.error('DB error in getProductsByBrand, falling back to catalog:', error);
    return catalogProducts.filter(
      p => p.brand.toLowerCase() === brandSlug.toLowerCase()
    );
  }
}

/**
 * Get all product slugs (for static generation)
 */
export async function getAllProductSlugs() {
  try {
    const result = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.isActive, true));

    return result.map(r => r.slug);
  } catch (error) {
    console.error('DB error in getAllProductSlugs, falling back to catalog:', error);
    return catalogProducts.map(p => p.slug);
  }
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string) {
  try {
    // For now, use simple filtering - upgrade to full-text search later
    const allProducts = await getAllProducts();
    const lowerQuery = query.toLowerCase();

    return allProducts.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('DB error in searchProducts, falling back to catalog:', error);
    const lowerQuery = query.toLowerCase();
    return catalogProducts.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
}
