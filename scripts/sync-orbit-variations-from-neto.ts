/**
 * Sync missing Orbit variations from Neto CSV
 *
 * Products identified with missing sizes (non-Straub/Teekay):
 * - DB-1 (32 sizes)
 * - FSFREJ (17 sizes)
 * - FVGALV (13 sizes)
 * - OCFG-S (47 sizes)
 * - CF8MWEBFVL (1 size)
 * - OCFG-L (1 size)
 * - OCRC55 (4 sizes)
 * - PTFELBFLYW (5 sizes)
 *
 * Run with: npx tsx scripts/sync-orbit-variations-from-neto.ts
 * Dry run by default. Set DO_IMPORT=true to actually import.
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { eq, and, inArray } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

// Target SKUs - all Orbit products that might have missing variations
const TARGET_SKUS = [
  'DB-1',
  'FSFREJ',
  'FVGALV',
  'OCFG-S',
  'CF8MWEBFVL',
  'OCFG-L',
  'OCRC55',
  'PTFELBFLYW',
  // Additional Orbit products
  'OCFPC',
  'ENCAPRC-SS',
  'FlexGrip2PLong',
  'OCFLAD',
  'OCRC100wide',
  'OCRC200',
  'OCRC300',
  'OCRC400',
];

// Clean up size string for consistency
function normalizeSize(sizeStr: string): string {
  // Extract the numeric size and mm suffix
  let size = sizeStr.trim();

  // Remove common suffixes like "Pipe Outside Diameter sizing", "Nominal Bore sizing"
  size = size.replace(/\s*Pipe Outside Diameter.*$/i, '');
  size = size.replace(/\s*Nominal Bore.*$/i, '');
  size = size.replace(/\s*sizing$/i, '');
  size = size.replace(/DN\d+\s*\([^)]+\)\s*/i, ''); // Remove DN50 (2") etc
  size = size.trim();

  // Ensure mm suffix
  if (!size.toLowerCase().endsWith('mm') && /^\d/.test(size)) {
    size = size + 'mm';
  }

  return size;
}

async function sync() {
  console.log('Loading Neto CSV...');
  const csvContent = readFileSync('.planning/audit/neto-export.csv', 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log('Loaded ' + records.length + ' rows from Neto\n');

  // Get all active variations from Neto for target products
  const netoVariations: Map<string, Array<{
    sku: string;
    size: string;
    price: number;
    label: string;
  }>> = new Map();

  for (const row of records) {
    const parentSku = (row['Parent SKU'] || '').trim();
    const active = (row['Active'] || '').toLowerCase() === 'y';

    if (!active || !TARGET_SKUS.includes(parentSku)) continue;

    const varSku = (row['SKU*'] || '').trim();
    const price = parseFloat(row['Price (Default)'] || '0');
    const sizeRaw = (row['Specific Value 1'] || '').trim();

    if (!sizeRaw || price <= 0) continue;

    const size = normalizeSize(sizeRaw);

    if (!netoVariations.has(parentSku)) {
      netoVariations.set(parentSku, []);
    }

    netoVariations.get(parentSku)!.push({
      sku: varSku,
      size: size,
      price: price,
      label: size + ' Pipe OD',
    });
  }

  // Get products from DB
  const targetProducts = await db
    .select()
    .from(products)
    .where(inArray(products.sku, TARGET_SKUS));

  console.log('Found ' + targetProducts.length + ' / ' + TARGET_SKUS.length + ' target products in DB\n');

  const doImport = process.env.DO_IMPORT === 'true';

  let totalMissing = 0;
  let totalAdded = 0;

  for (const prod of targetProducts) {
    const netoVars = netoVariations.get(prod.sku) || [];

    if (netoVars.length === 0) {
      console.log(prod.sku + ': No variations in Neto');
      continue;
    }

    // Get existing variations
    const existingVars = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, prod.id));

    const existingSizes = new Set(existingVars.map(v => v.size));

    // Find missing
    const missing = netoVars.filter(v => !existingSizes.has(v.size));

    console.log(prod.sku + ' (' + (prod.shortName || prod.name) + ')');
    console.log('  DB has: ' + existingVars.length + ' variations');
    console.log('  Neto has: ' + netoVars.length + ' variations');
    console.log('  Missing: ' + missing.length);

    if (missing.length > 0) {
      totalMissing += missing.length;

      // Show some examples
      const examples = missing.slice(0, 5);
      for (const ex of examples) {
        console.log('    - ' + ex.size + ' @ $' + ex.price);
      }
      if (missing.length > 5) {
        console.log('    ... and ' + (missing.length - 5) + ' more');
      }

      if (doImport) {
        let displayOrder = (existingVars.length + 1) * 100;

        for (const v of missing) {
          await db.insert(productVariations).values({
            productId: prod.id,
            size: v.size,
            label: v.label,
            price: v.price.toString(),
            sku: v.sku,
            source: 'neto',
            displayOrder: displayOrder,
          });
          displayOrder += 100;
          totalAdded++;
        }
        console.log('  -> Added ' + missing.length + ' variations');
      }
    }

    console.log('');
  }

  // Check for products we expected but didn't find
  const foundSkus = new Set(targetProducts.map(p => p.sku));
  const notFound = TARGET_SKUS.filter(s => !foundSkus.has(s));
  if (notFound.length > 0) {
    console.log('\n=== NOT FOUND IN DB ===');
    for (const sku of notFound) {
      const netoVars = netoVariations.get(sku) || [];
      console.log(sku + ' - ' + netoVars.length + ' variations in Neto');
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log('Total missing: ' + totalMissing);

  if (!doImport) {
    console.log('\nDry run - no changes made.');
    console.log('To import, run: DO_IMPORT=true npx tsx scripts/sync-orbit-variations-from-neto.ts');
  } else {
    console.log('Added: ' + totalAdded + ' variations');
  }

  process.exit(0);
}

sync().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
