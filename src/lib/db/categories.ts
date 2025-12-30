/**
 * Category Data Access Layer
 *
 * Query functions for fetching categories from the database.
 * Database errors are thrown (not silently handled) so issues are visible.
 */

import { db } from '@/db';
import { categories, subcategories, brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get all categories
 */
export async function getAllCategories() {
  return await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.displayOrder)],
  });
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      subcategories: {
        orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
      },
    },
  });
}

/**
 * Get all subcategories
 */
export async function getAllSubcategories() {
  return await db.query.subcategories.findMany({
    with: {
      category: true,
    },
    orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
  });
}

/**
 * Get a single subcategory by slug
 */
export async function getSubcategoryBySlug(slug: string) {
  return await db.query.subcategories.findFirst({
    where: eq(subcategories.slug, slug),
    with: {
      category: true,
    },
  });
}

/**
 * Get subcategories by category slug
 */
export async function getSubcategoriesByCategory(categorySlug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!category) {
    return [];
  }

  return await db.query.subcategories.findMany({
    where: eq(subcategories.categoryId, category.id),
    orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
  });
}

/**
 * Get all brands
 */
export async function getAllBrands() {
  return await db.query.brands.findMany({
    orderBy: (brands, { asc }) => [asc(brands.name)],
  });
}

/**
 * Get a single brand by slug
 */
export async function getBrandBySlug(slug: string) {
  return await db.query.brands.findFirst({
    where: eq(brands.slug, slug),
  });
}

/**
 * Get all category slugs (for static generation)
 */
export async function getAllCategorySlugs() {
  const result = await db
    .select({ slug: categories.slug })
    .from(categories);

  return result.map(r => r.slug);
}

/**
 * Get all brand slugs (for static generation)
 */
export async function getAllBrandSlugs() {
  const result = await db
    .select({ slug: brands.slug })
    .from(brands);

  return result.map(r => r.slug);
}
