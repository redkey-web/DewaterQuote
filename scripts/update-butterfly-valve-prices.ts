/**
 * Update all butterfly valve prices to match Neto
 * Run with: npx tsx scripts/update-butterfly-valve-prices.ts
 *
 * Products updated:
 * - BFLYLE316 (Lugged CF8M Butterfly Valve)
 * - PTFELBFLYW (PTFE Lined Butterfly Valve)
 *
 * Note: CF8MWEBFVL only has 100mm on Neto ($585) which matches our catalog
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { productVariations } from '../src/db/schema';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Correct prices from Neto (Ex GST)
const CORRECT_PRICES: Record<string, number> = {
  // BFLYLE316 - Lugged CF8M Butterfly Valve
  'BFLYLE316-50': 776,
  'BFLYLE316-65': 829,
  'BFLYLE316-80': 1011,
  'BFLYLE316-100': 1146,
  'BFLYLE316-125': 1619,
  'BFLYLE316-150': 1754,
  'BFLYLE316-200': 2660,
  'BFLYLE316-250': 4046,
  'BFLYLE316-300': 5396,

  // PTFELBFLYW - PTFE Lined Butterfly Valve
  'PTFELBFLYW-50': 1214,
  'PTFELBFLYW-80': 1456,
  'PTFELBFLYW-100': 1993,
  'PTFELBFLYW-150': 3031,
  'PTFELBFLYW-200': 4398,
};

async function updatePrices() {
  console.log('Updating butterfly valve prices to match Neto...\n');

  let updated = 0;
  let notFound = 0;

  for (const [sku, price] of Object.entries(CORRECT_PRICES)) {
    const result = await db
      .update(productVariations)
      .set({ price: String(price) })
      .where(eq(productVariations.sku, sku))
      .returning({ id: productVariations.id, sku: productVariations.sku });

    if (result.length) {
      console.log(`  ✓ Updated ${sku}: $${price}`);
      updated++;
    } else {
      console.log(`  ✗ Not found: ${sku}`);
      notFound++;
    }
  }

  console.log('\n========================================');
  console.log(`Updated: ${updated} variations`);
  if (notFound > 0) {
    console.log(`Not found: ${notFound} variations`);
  }
  console.log('Done!');
}

updatePrices();
