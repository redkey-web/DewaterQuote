/**
 * Update BFLYW316 prices to match Neto
 * Run with: npx tsx scripts/update-bflyw316-prices.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Correct prices from Neto
const CORRECT_PRICES: Record<string, number> = {
  'BFLYW316-50': 400,
  'BFLYW316-65': 500,
  'BFLYW316-80': 550,
  'BFLYW316-100': 600,
  'BFLYW316-125': 800,
  'BFLYW316-150': 900,
  'BFLYW316-200': 1499,
  'BFLYW316-250': 2100,
  'BFLYW316-300': 2999,
};

async function updatePrices() {
  console.log('Updating BFLYW316 prices...\n');

  // Get the product ID for BFLYW316
  const product = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.sku, 'BFLYW316'))
    .limit(1);

  if (!product.length) {
    console.error('Product BFLYW316 not found!');
    process.exit(1);
  }

  const productId = product[0].id;
  console.log(`Found product ID: ${productId}`);

  // Update each variation
  for (const [sku, price] of Object.entries(CORRECT_PRICES)) {
    const result = await db
      .update(productVariations)
      .set({ price: String(price) })
      .where(eq(productVariations.sku, sku))
      .returning({ id: productVariations.id, sku: productVariations.sku });

    if (result.length) {
      console.log(`  Updated ${sku}: $${price}`);
    } else {
      console.log(`  Not found: ${sku}`);
    }
  }

  console.log('\nDone!');
}

updatePrices();
