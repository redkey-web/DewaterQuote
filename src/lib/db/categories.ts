/**
 * Category Data Access Layer
 *
 * Query functions for fetching categories from the database.
 * Falls back to catalog.ts if database is unavailable.
 */

import { db } from '@/db';
import { categories, subcategories, brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  categories as catalogCategories,
  subcategories as catalogSubcategories,
  getCategoryBySlug as getCatalogCategoryBySlug,
  getSubcategoryBySlug as getCatalogSubcategoryBySlug,
  getSubcategoriesByCategory as getCatalogSubcategoriesByCategory,
} from '@/data/catalog';

/**
 * Get all categories
 */
export async function getAllCategories() {
  try {
    return await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.displayOrder)],
    });
  } catch (error) {
    console.error('DB error in getAllCategories, falling back to catalog:', error);
    return catalogCategories;
  }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string) {
  try {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
      with: {
        subcategories: {
          orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
        },
      },
    });
  } catch (error) {
    console.error('DB error in getCategoryBySlug, falling back to catalog:', error);
    return getCatalogCategoryBySlug(slug);
  }
}

/**
 * Get all subcategories
 */
export async function getAllSubcategories() {
  try {
    return await db.query.subcategories.findMany({
      with: {
        category: true,
      },
      orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
    });
  } catch (error) {
    console.error('DB error in getAllSubcategories, falling back to catalog:', error);
    return catalogSubcategories;
  }
}

/**
 * Get a single subcategory by slug
 */
export async function getSubcategoryBySlug(slug: string) {
  try {
    return await db.query.subcategories.findFirst({
      where: eq(subcategories.slug, slug),
      with: {
        category: true,
      },
    });
  } catch (error) {
    console.error('DB error in getSubcategoryBySlug, falling back to catalog:', error);
    return getCatalogSubcategoryBySlug(slug);
  }
}

/**
 * Get subcategories by category slug
 */
export async function getSubcategoriesByCategory(categorySlug: string) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      return getCatalogSubcategoriesByCategory(categorySlug);
    }

    return await db.query.subcategories.findMany({
      where: eq(subcategories.categoryId, category.id),
      orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
    });
  } catch (error) {
    console.error('DB error in getSubcategoriesByCategory, falling back to catalog:', error);
    return getCatalogSubcategoriesByCategory(categorySlug);
  }
}

/**
 * Get all brands
 */
export async function getAllBrands() {
  try {
    return await db.query.brands.findMany({
      orderBy: (brands, { asc }) => [asc(brands.name)],
    });
  } catch (error) {
    console.error('DB error in getAllBrands, falling back to catalog:', error);
    // Extract unique brands from catalog
    const uniqueBrands = [...new Set(
      (await import('@/data/catalog')).products.map(p => p.brand)
    )];
    return uniqueBrands.map(name => ({
      id: 0,
      slug: name.toLowerCase(),
      name,
      description: null,
      createdAt: new Date(),
    }));
  }
}

/**
 * Get a single brand by slug
 */
export async function getBrandBySlug(slug: string) {
  try {
    return await db.query.brands.findFirst({
      where: eq(brands.slug, slug),
    });
  } catch (error) {
    console.error('DB error in getBrandBySlug, falling back to catalog:', error);
    // Extract from catalog
    const { products } = await import('@/data/catalog');
    const product = products.find(p => p.brand.toLowerCase() === slug.toLowerCase());
    if (product) {
      return {
        id: 0,
        slug: product.brand.toLowerCase(),
        name: product.brand,
        description: null,
        createdAt: new Date(),
      };
    }
    return undefined;
  }
}

/**
 * Get all category slugs (for static generation)
 */
export async function getAllCategorySlugs() {
  try {
    const result = await db
      .select({ slug: categories.slug })
      .from(categories);

    return result.map(r => r.slug);
  } catch (error) {
    console.error('DB error in getAllCategorySlugs, falling back to catalog:', error);
    return catalogCategories.map(c => c.slug);
  }
}

/**
 * Get all brand slugs (for static generation)
 */
export async function getAllBrandSlugs() {
  try {
    const result = await db
      .select({ slug: brands.slug })
      .from(brands);

    return result.map(r => r.slug);
  } catch (error) {
    console.error('DB error in getAllBrandSlugs, falling back to catalog:', error);
    const { products } = await import('@/data/catalog');
    return [...new Set(products.map(p => p.brand.toLowerCase()))];
  }
}
