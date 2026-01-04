/**
 * Merge Legacy Orbit Brand Slugs
 *
 * Merges products from:
 * - orbit-couplings
 * - orbit-pipe-repair-clamp-55mm-wide
 * - orbit-pipe-repair-clamp-200mm-wide
 * - combo-lock
 *
 * Into the main "orbit" brand, then deletes the legacy brands.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const { drizzle } = await import('drizzle-orm/neon-http');
  const { neon } = await import('@neondatabase/serverless');
  const schema = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const { products, brands } = schema;

  console.log('\n=== MERGE LEGACY ORBIT BRANDS ===\n');

  // Get all brands
  const allBrands = await db.query.brands.findMany();
  console.log('Current brands:');
  for (const b of allBrands) {
    console.log(`  ${b.id}: ${b.slug} - ${b.name}`);
  }

  // Find the main Orbit brand
  const orbitBrand = allBrands.find(b => b.slug === 'orbit');
  if (!orbitBrand) {
    console.error('Main orbit brand not found!');
    process.exit(1);
  }
  console.log(`\nMain Orbit brand ID: ${orbitBrand.id}`);

  // Legacy brands to merge
  const legacySlugs = [
    'orbit-couplings',
    'orbit-pipe-repair-clamp-55mm-wide',
    'orbit-pipe-repair-clamp-200mm-wide',
    'combo-lock',
  ];

  const legacyBrands = allBrands.filter(b => legacySlugs.includes(b.slug));
  console.log(`\nLegacy brands to merge: ${legacyBrands.map(b => b.slug).join(', ')}`);

  if (legacyBrands.length === 0) {
    console.log('No legacy brands found - already merged?');
    process.exit(0);
  }

  // Get products under legacy brands
  for (const legacy of legacyBrands) {
    const legacyProducts = await db.query.products.findMany({
      where: eq(products.brandId, legacy.id),
    });

    console.log(`\n${legacy.slug} (${legacyProducts.length} products):`);
    for (const p of legacyProducts) {
      console.log(`  - ${p.sku}: ${p.name}`);
    }

    if (legacyProducts.length > 0) {
      // Update products to use main Orbit brand
      await db
        .update(products)
        .set({ brandId: orbitBrand.id })
        .where(eq(products.brandId, legacy.id));
      console.log(`  → Updated ${legacyProducts.length} products to use main Orbit brand`);
    }

    // Delete the legacy brand
    await db.delete(brands).where(eq(brands.id, legacy.id));
    console.log(`  → Deleted legacy brand: ${legacy.slug}`);
  }

  console.log('\n=== MERGE COMPLETE ===\n');

  // Verify
  const remainingBrands = await db.query.brands.findMany();
  console.log('Remaining brands:');
  for (const b of remainingBrands) {
    console.log(`  ${b.id}: ${b.slug} - ${b.name}`);
  }

  process.exit(0);
}

main().catch(console.error);
