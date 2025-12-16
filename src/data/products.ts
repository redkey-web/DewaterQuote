/**
 * Product Data Layer
 *
 * This is the primary data access layer for products.
 * Queries the database and transforms to catalog-compatible shape.
 *
 * Server Components should import from here instead of catalog.ts
 */

import { db } from '@/db';
import { products, brands, categories, subcategories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Product, Category, Subcategory } from '@/types';

// Fallback to catalog for error cases
import {
  products as catalogProducts,
  categories as catalogCategories,
  subcategories as catalogSubcategories,
  getProductBySlug as getCatalogProductBySlug,
  getProductsByCategory as getCatalogProductsByCategory,
  getProductsBySubcategory as getCatalogProductsBySubcategory,
} from './catalog';

// Type for raw DB product with relations
type DBProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof db.query.products.findFirst<{
    with: {
      brand: true;
      category: true;
      subcategory: true;
      features: true;
      specifications: true;
      images: true;
      downloads: true;
      variations: true;
      applications: true;
    };
  }>>>
>;

/**
 * Transform DB product to catalog-compatible shape
 */
function transformProduct(dbProduct: DBProductWithRelations): Product {
  return {
    id: dbProduct.sku,
    slug: dbProduct.slug,
    sku: dbProduct.sku,
    name: dbProduct.name,
    shortName: dbProduct.shortName || undefined,
    brand: dbProduct.brand.name,
    category: dbProduct.category.slug,
    subcategory: dbProduct.subcategory?.slug,
    description: dbProduct.description,
    features: dbProduct.features.map(f => f.feature),
    specifications: dbProduct.specifications.map(s => ({
      label: s.label,
      value: s.value,
    })),
    certifications: dbProduct.certifications || undefined,
    sizeOptions: dbProduct.variations.length > 0
      ? dbProduct.variations.map(v => ({
          value: v.size,
          label: v.label,
          price: v.price ? parseFloat(v.price) : undefined,
          sku: v.sku || undefined,
        }))
      : undefined,
    images: dbProduct.images.map(img => ({
      url: img.url,
      alt: img.alt,
      type: img.type as 'image' | 'video' | undefined,
    })),
    downloads: dbProduct.downloads.length > 0
      ? dbProduct.downloads.map(dl => ({
          url: dl.url,
          label: dl.label,
        }))
      : undefined,
    video: dbProduct.video || undefined,
    leadTime: dbProduct.leadTime || undefined,
    materials: (dbProduct.materials || { body: '' }) as Product['materials'],
    pressureRange: dbProduct.pressureRange || '',
    temperature: dbProduct.temperature || undefined,
    sizeFrom: dbProduct.sizeFrom || undefined,
    priceVaries: dbProduct.priceVaries ?? undefined,
    priceNote: dbProduct.priceNote || undefined,
    applications: dbProduct.applications.length > 0
      ? dbProduct.applications.map(a => a.application)
      : undefined,
    straubEquivalent: dbProduct.straubEquivalent || undefined,
  };
}

/**
 * Transform DB product to list item shape (fewer fields)
 */
function transformProductListItem(dbProduct: {
  id: number;
  slug: string;
  sku: string;
  name: string;
  shortName: string | null;
  description: string;
  sizeFrom: string | null;
  pressureRange: string | null;
  materials: unknown;
  brand: { name: string };
  category: { slug: string };
  images: Array<{ url: string; alt: string }>;
  variations: Array<{ size: string; label: string; price: string | null; sku: string | null }>;
}): Product {
  return {
    id: dbProduct.sku,
    slug: dbProduct.slug,
    sku: dbProduct.sku,
    name: dbProduct.name,
    shortName: dbProduct.shortName || undefined,
    brand: dbProduct.brand.name,
    category: dbProduct.category.slug,
    description: dbProduct.description,
    sizeFrom: dbProduct.sizeFrom || undefined,
    pressureRange: dbProduct.pressureRange || '',
    materials: (dbProduct.materials || { body: '' }) as Product['materials'],
    images: dbProduct.images.map(img => ({
      url: img.url,
      alt: img.alt,
    })),
    sizeOptions: dbProduct.variations.length > 0
      ? dbProduct.variations.map(v => ({
          value: v.size,
          label: v.label,
          price: v.price ? parseFloat(v.price) : undefined,
          sku: v.sku || undefined,
        }))
      : undefined,
    // Required fields with defaults
    features: [],
    specifications: [],
  };
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const dbProduct = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        brand: true,
        category: true,
        subcategory: true,
        features: { orderBy: (f, { asc }) => [asc(f.displayOrder)] },
        specifications: { orderBy: (s, { asc }) => [asc(s.displayOrder)] },
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        downloads: true,
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
        applications: { orderBy: (a, { asc }) => [asc(a.displayOrder)] },
      },
    });

    if (!dbProduct) return undefined;

    return transformProduct(dbProduct);
  } catch (error) {
    console.error('DB error in getProductBySlug, falling back to catalog:', error);
    return getCatalogProductBySlug(slug);
  }
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      return getCatalogProductsByCategory(categorySlug);
    }

    const dbProducts = await db.query.products.findMany({
      where: and(
        eq(products.categoryId, category.id),
        eq(products.isActive, true)
      ),
      with: {
        brand: true,
        category: true,
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
      },
      orderBy: (products, { asc }) => [asc(products.name)],
    });

    return dbProducts.map(transformProductListItem);
  } catch (error) {
    console.error('DB error in getProductsByCategory, falling back to catalog:', error);
    return getCatalogProductsByCategory(categorySlug);
  }
}

/**
 * Get products by subcategory
 */
export async function getProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
): Promise<Product[]> {
  try {
    const subcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.slug, subcategorySlug),
    });

    if (!subcategory) {
      return getCatalogProductsBySubcategory(categorySlug, subcategorySlug);
    }

    const dbProducts = await db.query.products.findMany({
      where: and(
        eq(products.subcategoryId, subcategory.id),
        eq(products.isActive, true)
      ),
      with: {
        brand: true,
        category: true,
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
      },
      orderBy: (products, { asc }) => [asc(products.name)],
    });

    return dbProducts.map(transformProductListItem);
  } catch (error) {
    console.error('DB error in getProductsBySubcategory, falling back to catalog:', error);
    return getCatalogProductsBySubcategory(categorySlug, subcategorySlug);
  }
}

/**
 * Get products by brand slug
 */
export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  try {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.slug, brandSlug),
    });

    if (!brand) {
      return catalogProducts.filter(
        p => p.brand.toLowerCase() === brandSlug.toLowerCase()
      );
    }

    const dbProducts = await db.query.products.findMany({
      where: and(
        eq(products.brandId, brand.id),
        eq(products.isActive, true)
      ),
      with: {
        brand: true,
        category: true,
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
      },
      orderBy: (products, { asc }) => [asc(products.name)],
    });

    return dbProducts.map(transformProductListItem);
  } catch (error) {
    console.error('DB error in getProductsByBrand, falling back to catalog:', error);
    return catalogProducts.filter(
      p => p.brand.toLowerCase() === brandSlug.toLowerCase()
    );
  }
}

/**
 * Get all active products (for sitemap, etc.)
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        brand: true,
        category: true,
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
      },
      orderBy: (products, { asc }) => [asc(products.name)],
    });

    return dbProducts.map(transformProductListItem);
  } catch (error) {
    console.error('DB error in getAllProducts, falling back to catalog:', error);
    return catalogProducts;
  }
}

/**
 * Get all product slugs (for static generation)
 */
export async function getAllProductSlugs(): Promise<string[]> {
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
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const dbCategories = await db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.displayOrder)],
    });

    return dbCategories.map(c => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      description: c.description || '',
      longDescription: c.longDescription || undefined,
      image: c.image || undefined,
    }));
  } catch (error) {
    console.error('DB error in getAllCategories, falling back to catalog:', error);
    return catalogCategories;
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const dbCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });

    if (!dbCategory) return undefined;

    return {
      id: dbCategory.slug,
      slug: dbCategory.slug,
      name: dbCategory.name,
      description: dbCategory.description || '',
      longDescription: dbCategory.longDescription || undefined,
      image: dbCategory.image || undefined,
    };
  } catch (error) {
    console.error('DB error in getCategoryBySlug, falling back to catalog:', error);
    return catalogCategories.find(c => c.slug === slug);
  }
}

/**
 * Get subcategories by category slug
 */
export async function getSubcategoriesByCategory(categorySlug: string): Promise<Subcategory[]> {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      return catalogSubcategories.filter(s => s.category === categorySlug);
    }

    const dbSubcategories = await db.query.subcategories.findMany({
      where: eq(subcategories.categoryId, category.id),
      orderBy: (s, { asc }) => [asc(s.displayOrder)],
    });

    return dbSubcategories.map(s => ({
      id: s.slug,
      slug: s.slug,
      name: s.name,
      description: s.description || '',
      category: categorySlug,
      image: s.image || undefined,
    }));
  } catch (error) {
    console.error('DB error in getSubcategoriesByCategory, falling back to catalog:', error);
    return catalogSubcategories.filter(s => s.category === categorySlug);
  }
}

/**
 * Get all subcategories (for sitemap)
 */
export async function getAllSubcategories(): Promise<Subcategory[]> {
  try {
    const dbSubcategories = await db.query.subcategories.findMany({
      with: {
        category: true,
      },
      orderBy: (s, { asc }) => [asc(s.displayOrder)],
    });

    return dbSubcategories.map(s => ({
      id: s.slug,
      slug: s.slug,
      name: s.name,
      description: s.description || '',
      category: s.category.slug,
      image: s.image || undefined,
    }));
  } catch (error) {
    console.error('DB error in getAllSubcategories, falling back to catalog:', error);
    return catalogSubcategories;
  }
}

/**
 * Get products by SKUs (for industry pages)
 */
export async function getProductsBySkus(skus: string[]): Promise<Product[]> {
  try {
    const dbProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        brand: true,
        category: true,
        images: { orderBy: (i, { asc }) => [asc(i.displayOrder)] },
        variations: { orderBy: (v, { asc }) => [asc(v.displayOrder)] },
      },
    });

    // Filter by SKU list, preserving order
    const skuSet = new Set(skus);
    const matched = dbProducts
      .filter(p => skuSet.has(p.sku))
      .map(transformProductListItem);

    return matched;
  } catch (error) {
    console.error('DB error in getProductsBySkus, falling back to catalog:', error);
    return catalogProducts.filter(p => skus.includes(p.id));
  }
}
