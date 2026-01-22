/**
 * Add missing D-Series Encapsulating Clamp variations
 *
 * From Wayback archive: "Available in sizes 87.0mm to 219.1mm OD.
 * Being 88.9mm, 114.3mm, 168.3mm, 219.1mm OD pipe."
 *
 * Pricing based on OCRC (Orbit Repair Clamp) with 2.11x multiplier
 * D-Series 88.9mm = $643.50, OCRC 88.9mm = $305 → ratio = 2.11
 *
 * Run with: npx tsx scripts/add-d-series-variations.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

// Sizes from Wayback archive with estimated prices
// Based on OCRC prices * 2.11 multiplier
const VARIATIONS = [
  { size: '88.9mm', price: '643.50', sku: 'D-SERIESENCAP_88.9' },   // Already exists
  { size: '114.3mm', price: '684.00', sku: 'D-SERIESENCAP_114.3' }, // OCRC $324 * 2.11
  { size: '168.3mm', price: '870.00', sku: 'D-SERIESENCAP_168.3' }, // OCRC $412 * 2.11
  { size: '219.1mm', price: '1093.00', sku: 'D-SERIESENCAP_219.1' }, // OCRC $518 * 2.11
];

async function addVariations() {
  console.log('Finding D-Series Encapsulating Clamp product...');

  const [prod] = await db
    .select()
    .from(products)
    .where(eq(products.sku, 'D-SERIESENCAP'));

  if (!prod) {
    console.error('Product D-SERIESENCAP not found!');
    process.exit(1);
  }

  console.log('Found: ' + prod.name + ' (ID: ' + prod.id + ')');

  // Get existing variations
  const existing = await db
    .select()
    .from(productVariations)
    .where(eq(productVariations.productId, prod.id));

  const existingSizes = new Set(existing.map(v => v.size));
  console.log('Existing sizes: ' + Array.from(existingSizes).join(', '));

  // Add missing variations
  let added = 0;
  let displayOrder = (existing.length + 1) * 100;

  for (const v of VARIATIONS) {
    if (existingSizes.has(v.size)) {
      console.log('  Skipping ' + v.size + ' (already exists)');
      continue;
    }

    console.log('  Adding ' + v.size + ' @ $' + v.price);

    await db.insert(productVariations).values({
      productId: prod.id,
      size: v.size,
      label: v.size + ' Pipe OD',
      price: v.price,
      sku: v.sku,
      source: 'manual',
      displayOrder: displayOrder,
    });

    added++;
    displayOrder += 100;
  }

  console.log('\nAdded ' + added + ' variations to D-Series Encapsulating Clamp');

  // Update displayOrder for proper sorting
  console.log('Updating display order for proper size sorting...');

  const allVars = await db
    .select()
    .from(productVariations)
    .where(eq(productVariations.productId, prod.id));

  // Sort by numeric size
  allVars.sort((a, b) => {
    const numA = parseFloat(a.size.replace('mm', ''));
    const numB = parseFloat(b.size.replace('mm', ''));
    return numA - numB;
  });

  for (let i = 0; i < allVars.length; i++) {
    await db
      .update(productVariations)
      .set({ displayOrder: (i + 1) * 100 })
      .where(eq(productVariations.id, allVars[i].id));
  }

  console.log('Done! D-Series now has ' + allVars.length + ' variations.');
  process.exit(0);
}

addVariations().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
