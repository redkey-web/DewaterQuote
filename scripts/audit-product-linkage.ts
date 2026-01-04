/**
 * Product Linkage Audit Script
 *
 * Checks:
 * 1. All active products have accessible pages
 * 2. All products are linked from at least one category/subcategory/brand page
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  // Dynamic import after dotenv loads
  const { drizzle } = await import('drizzle-orm/neon-http');
  const { neon } = await import('@neondatabase/serverless');
  const schema = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const { products, categories, subcategories, brands } = schema;

  console.log('\n=== PRODUCT LINKAGE AUDIT ===\n');

  // Get all active products
  const allProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: {
      brand: true,
      category: true,
      subcategory: true,
    },
    orderBy: (p, { asc }) => [asc(p.name)],
  });

  console.log(`Total active products: ${allProducts.length}\n`);

  // Get all categories, subcategories, and brands
  const allCategories = await db.query.categories.findMany();
  const allSubcategories = await db.query.subcategories.findMany();
  const allBrands = await db.query.brands.findMany();

  // Known listing pages (flat URLs)
  const categoryPages = new Set([
    'pipe-couplings',
    'pipe-repair',
    'flange-adaptors',
    'rubber-expansion-joints',
    'valves', // old nested route, may not exist
    'strainers',
  ]);

  // Flat subcategory pages (these exist as their own routes)
  const subcategoryPages = new Set([
    'butterfly-valves',
    'check-valves',
    'gate-valves',
    'ball-valves',
    'float-valves',
    'foot-valves',
    'single-sphere-expansion-joints',
    'twin-sphere-expansion-joints',
    'single-arch-expansion-joints',
    'double-arch-expansion-joints',
    'reducing-expansion-joints',
    'triple-arch-expansion-joints',
    'quadruple-arch-expansion-joints',
    'ptfe-lined-expansion-joints',
    'y-strainers',
    'basket-strainers',
  ]);

  // Brand pages that exist
  const brandPages = new Set([
    'straub',
    'orbit',
    'teekay',
    'bore-flex-rubber',
    'defender-valves',
    'defender-strainers',
  ]);

  // Also include specialty pages that list products
  const specialtyPages = new Set([
    'industrial-valves', // parent for valve subcategories
    'expansion-joints',  // parent for expansion joint subcategories
    'bore-flex',         // bore-flex brand/category page
    'pipe-repair-clamps',
  ]);

  // Analyze each product
  const orphaned: typeof allProducts = [];
  const noSubcategory: typeof allProducts = [];
  const noBrandPage: typeof allProducts = [];

  for (const product of allProducts) {
    const categorySlug = product.category?.slug;
    const subcategorySlug = product.subcategory?.slug;
    const brandSlug = product.brand?.slug;

    let isLinked = false;
    let linkSources: string[] = [];

    // Check if category has a page
    if (categorySlug && categoryPages.has(categorySlug)) {
      isLinked = true;
      linkSources.push(`category:${categorySlug}`);
    }

    // Check if subcategory has a flat page
    if (subcategorySlug) {
      // Map subcategory slugs to flat page names
      const flatPageMap: Record<string, string> = {
        'butterfly-valve': 'butterfly-valves',
        'check-valve': 'check-valves',
        'swing-check-valve': 'check-valves',
        'duckbill-check-valve': 'check-valves',
        'ball-check-valve': 'ball-valves',
        'gate-valve': 'gate-valves',
        'ball-valve': 'ball-valves',
        'float-valve': 'float-valves',
        'foot-valve': 'foot-valves',
        'single-sphere': 'single-sphere-expansion-joints',
        'twin-sphere': 'twin-sphere-expansion-joints',
        'single-arch': 'single-arch-expansion-joints',
        'double-arch': 'double-arch-expansion-joints',
        'reducing': 'reducing-expansion-joints',
        'triple-arch': 'triple-arch-expansion-joints',
        'quadruple-arch': 'quadruple-arch-expansion-joints',
        'ptfe-lined': 'ptfe-lined-expansion-joints',
        'y-strainer': 'y-strainers',
        'simplex-basket-strainer': 'basket-strainers',
        'duplex-basket-strainer': 'basket-strainers',
        'flanged-suction-strainer': 'basket-strainers',
      };

      const flatPage = flatPageMap[subcategorySlug] || subcategorySlug;
      if (subcategoryPages.has(flatPage)) {
        isLinked = true;
        linkSources.push(`subcategory:${flatPage}`);
      }
    }

    // Check if brand has a page
    if (brandSlug && brandPages.has(brandSlug)) {
      isLinked = true;
      linkSources.push(`brand:${brandSlug}`);
    }

    // Check specialty pages
    if (categorySlug === 'valves' || subcategorySlug?.includes('valve')) {
      isLinked = true;
      linkSources.push('specialty:industrial-valves');
    }
    if (categorySlug === 'rubber-expansion-joints') {
      isLinked = true;
      linkSources.push('specialty:expansion-joints');
    }

    if (!isLinked) {
      orphaned.push(product);
    }

    if (!subcategorySlug) {
      noSubcategory.push(product);
    }

    if (!brandSlug || !brandPages.has(brandSlug)) {
      noBrandPage.push(product);
    }
  }

  // Report
  console.log('=== ORPHANED PRODUCTS (not linked from any category/subcategory/brand page) ===\n');
  if (orphaned.length === 0) {
    console.log('✅ None! All products are linked.\n');
  } else {
    console.log(`❌ Found ${orphaned.length} orphaned products:\n`);
    for (const p of orphaned) {
      console.log(`  - ${p.sku}: ${p.name}`);
      console.log(`    Category: ${p.category?.slug || 'NONE'}`);
      console.log(`    Subcategory: ${p.subcategory?.slug || 'NONE'}`);
      console.log(`    Brand: ${p.brand?.slug || 'NONE'}`);
      console.log('');
    }
  }

  console.log('=== PRODUCTS WITHOUT SUBCATEGORY ===\n');
  if (noSubcategory.length === 0) {
    console.log('✅ All products have subcategories.\n');
  } else {
    console.log(`⚠️  ${noSubcategory.length} products have no subcategory (may still be linked via category or brand):\n`);
    for (const p of noSubcategory) {
      console.log(`  - ${p.sku}: ${p.name} (category: ${p.category?.slug}, brand: ${p.brand?.slug})`);
    }
    console.log('');
  }

  console.log('=== PRODUCTS WITHOUT BRAND PAGE ===\n');
  const uniqueBrandsWithoutPage = new Set(
    noBrandPage.filter(p => p.brand?.slug && !brandPages.has(p.brand.slug)).map(p => p.brand?.slug)
  );
  if (uniqueBrandsWithoutPage.size === 0) {
    console.log('✅ All products have brands with pages.\n');
  } else {
    console.log(`⚠️  Brands without dedicated pages: ${[...uniqueBrandsWithoutPage].join(', ')}\n`);
  }

  // Summary by category
  console.log('=== PRODUCTS BY CATEGORY ===\n');
  const byCat = new Map<string, number>();
  for (const p of allProducts) {
    const cat = p.category?.slug || 'NONE';
    byCat.set(cat, (byCat.get(cat) || 0) + 1);
  }
  for (const [cat, count] of [...byCat.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count} products`);
  }

  // Summary by subcategory
  console.log('\n=== PRODUCTS BY SUBCATEGORY ===\n');
  const bySubcat = new Map<string, number>();
  for (const p of allProducts) {
    const subcat = p.subcategory?.slug || 'NONE';
    bySubcat.set(subcat, (bySubcat.get(subcat) || 0) + 1);
  }
  for (const [subcat, count] of [...bySubcat.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${subcat}: ${count} products`);
  }

  // Summary by brand
  console.log('\n=== PRODUCTS BY BRAND ===\n');
  const byBrand = new Map<string, number>();
  for (const p of allProducts) {
    const brand = p.brand?.slug || 'NONE';
    byBrand.set(brand, (byBrand.get(brand) || 0) + 1);
  }
  for (const [brand, count] of [...byBrand.entries()].sort((a, b) => b[1] - a[1])) {
    const hasPage = brandPages.has(brand) ? '✅' : '❌';
    console.log(`  ${hasPage} ${brand}: ${count} products`);
  }

  console.log('\n=== AUDIT COMPLETE ===\n');

  process.exit(0);
}

main().catch(console.error);
