/**
 * Audit Product Variations
 *
 * Compares products that should have size variations with actual variation records in DB.
 * Run with: npx tsx scripts/audit-variations.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

// Import schema - note: src/db not src/lib/db
import {
  brands,
  categories,
  products,
  productVariations,
} from '../src/db/schema';

// Create database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not set in .env.local');
}

const sqlClient = neon(connectionString);
const db = drizzle(sqlClient);

async function audit() {
  console.log('Connecting to database...\n');

  // Get all products with their variation counts
  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  const allVariations = await db.select().from(productVariations);
  const allBrands = await db.select().from(brands);
  const allCategories = await db.select().from(categories);

  const brandMap = Object.fromEntries(allBrands.map(b => [b.id, b.name]));
  const categoryMap = Object.fromEntries(allCategories.map(c => [c.id, c.name]));

  // Count variations per product
  const variationCounts: Record<number, number> = {};
  const variationsByProduct: Record<number, typeof allVariations> = {};

  for (const v of allVariations) {
    variationCounts[v.productId] = (variationCounts[v.productId] || 0) + 1;
    if (!variationsByProduct[v.productId]) variationsByProduct[v.productId] = [];
    variationsByProduct[v.productId].push(v);
  }

  console.log('=== PRODUCT VARIATION AUDIT ===\n');

  // Group products
  const noVariations = allProducts.filter(p => (variationCounts[p.id] || 0) === 0 && p.priceVaries);
  const withVariations = allProducts.filter(p => (variationCounts[p.id] || 0) > 0);
  const fixedPrice = allProducts.filter(p => !p.priceVaries);

  // PROBLEM PRODUCTS
  console.log('PRODUCTS WITH priceVaries=true BUT NO VARIATIONS (PROBLEM):');
  console.log('================================================================');
  if (noVariations.length === 0) {
    console.log('  None found - all good!\n');
  } else {
    noVariations.forEach(p => {
      const brand = brandMap[p.brandId] || 'Unknown';
      const category = categoryMap[p.categoryId] || 'Unknown';
      console.log('  ' + p.name);
      console.log('     SKU: ' + p.sku + ' | Brand: ' + brand + ' | Category: ' + category);
      console.log('     Slug: /' + p.slug);
      console.log('');
    });
  }

  // PRODUCTS WITH VARIATIONS BY CATEGORY
  console.log('\nPRODUCTS WITH VARIATIONS (by category):');
  console.log('===========================================');

  const byCategory: Record<string, typeof withVariations> = {};
  withVariations.forEach(p => {
    const catName = categoryMap[p.categoryId] || 'Uncategorized';
    if (!byCategory[catName]) byCategory[catName] = [];
    byCategory[catName].push(p);
  });

  for (const [catName, prods] of Object.entries(byCategory).sort()) {
    console.log('\n' + catName.toUpperCase());
    console.log('-'.repeat(50));
    prods
      .sort((a, b) => (variationCounts[b.id] || 0) - (variationCounts[a.id] || 0))
      .forEach(p => {
        const count = variationCounts[p.id] || 0;
        const brand = brandMap[p.brandId] || '?';
        console.log('  ' + count.toString().padStart(3) + ' sizes: ' + p.name + ' (' + brand + ')');
        console.log('          SKU: ' + p.sku + ' | slug: /' + p.slug);
      });
  }

  // FIXED PRICE PRODUCTS
  console.log('\n\nFIXED PRICE PRODUCTS (no variations expected):');
  console.log('==================================================');
  fixedPrice.forEach(p => {
    const count = variationCounts[p.id] || 0;
    const brand = brandMap[p.brandId] || '?';
    const warning = count > 0 ? ' WARNING: HAS ' + count + ' variations in DB!' : '';
    console.log('  - ' + p.name + ' (' + brand + ')' + warning);
  });

  // SUMMARY
  console.log('\n\nSUMMARY');
  console.log('==========');
  console.log('Total active products: ' + allProducts.length);
  console.log('Products with variations: ' + withVariations.length);
  console.log('Fixed price products: ' + fixedPrice.length);
  console.log('PROBLEM - priceVaries but no variations: ' + noVariations.length);
  console.log('\nTotal variations in database: ' + allVariations.length);

  // Detailed breakdown by brand
  console.log('\n\nVARIATIONS BY BRAND:');
  console.log('=======================');
  const byBrand: Record<string, { products: number; variations: number }> = {};

  for (const p of allProducts) {
    const brandName = brandMap[p.brandId] || 'Unknown';
    if (!byBrand[brandName]) byBrand[brandName] = { products: 0, variations: 0 };
    byBrand[brandName].products++;
    byBrand[brandName].variations += variationCounts[p.id] || 0;
  }

  for (const [brand, stats] of Object.entries(byBrand).sort((a, b) => b[1].variations - a[1].variations)) {
    console.log('  ' + brand + ': ' + stats.products + ' products, ' + stats.variations + ' total variations');
  }

  process.exit(0);
}

audit().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
