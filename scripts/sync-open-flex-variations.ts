/**
 * Sync missing Open Flex 200-L and 300-L variations
 *
 * The OCOF400-L has complete variations in Neto, but OCOF200-L and OCOF300-L
 * are missing many sizes. This script identifies what's missing and can import.
 *
 * Run with: npx tsx scripts/sync-open-flex-variations.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { eq, and, inArray } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const db = drizzle(neon(connectionString));

// Pricing multipliers relative to 400-L base prices
// Based on actual Neto prices at 219.1mm: 200-L=$1688, 300-L=$2430, 400-L=$5300
const PRICE_MULTIPLIERS: Record<string, number> = {
  'OCOF200-L': 0.32, // 200-L is ~32% of 400-L price ($1688/$5300)
  'OCOF300-L': 0.46, // 300-L is ~46% of 400-L price ($2430/$5300)
};

async function analyze() {
  console.log('Loading data...\n');

  // Load Neto CSV
  const csvContent = readFileSync('.planning/audit/neto-export.csv', 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  // Get 400-L variations from Neto (the complete set)
  const ocof400Vars = records.filter((row: Record<string, string>) => {
    const parentSku = row['Parent SKU']?.trim();
    const active = row['Active']?.toLowerCase() === 'y';
    return parentSku === 'OCOF400-L' && active;
  });

  console.log('OCOF400-L has ' + ocof400Vars.length + ' active variations in Neto');

  // Extract sizes and prices from 400-L
  const ref400Data: Array<{
    size: string;
    price: number;
  }> = [];

  for (const row of ocof400Vars) {
    let size = row['Specific Value 1']?.trim() || '';
    const price = parseFloat(row['Price (Default)']?.trim() || '0');

    // Clean up size
    size = size.replace(/\s*Pipe Outside Diameter sizing/i, '').trim();
    size = size.replace(/\s*Pipe Outside Diameter/i, '').trim();
    if (size && !size.toLowerCase().endsWith('mm')) {
      size = size + 'mm';
    }

    if (size && price > 0) {
      ref400Data.push({ size, price });
    }
  }

  // Sort by numeric size
  ref400Data.sort((a, b) => {
    const numA = parseFloat(a.size.replace('mm', ''));
    const numB = parseFloat(b.size.replace('mm', ''));
    return numA - numB;
  });

  console.log('Reference sizes from 400-L: ' + ref400Data.length);
  console.log('Size range: ' + ref400Data[0]?.size + ' to ' + ref400Data[ref400Data.length - 1]?.size);

  // Load products from DB
  const targetSkus = ['OCOF200-L', 'OCOF300-L'];
  const targetProducts = await db
    .select()
    .from(products)
    .where(inArray(products.sku, targetSkus));

  console.log('\n=== CURRENT STATE ===\n');

  for (const prod of targetProducts) {
    const existingVars = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, prod.id));

    const existingSizes = new Set(existingVars.map(v => v.size));

    console.log(prod.sku + ' (' + prod.shortName + ')');
    console.log('  Current variations: ' + existingVars.length);
    console.log('  Existing sizes: ' + Array.from(existingSizes).join(', '));

    // Calculate what's missing
    const multiplier = PRICE_MULTIPLIERS[prod.sku] || 0.5;
    const missingVars: Array<{
      size: string;
      price: number;
      sku: string;
    }> = [];

    for (const ref of ref400Data) {
      if (!existingSizes.has(ref.size)) {
        const adjustedPrice = Math.round(ref.price * multiplier);
        const varSku = prod.sku + '_' + ref.size.replace('mm', '');
        missingVars.push({
          size: ref.size,
          price: adjustedPrice,
          sku: varSku,
        });
      }
    }

    console.log('  Missing variations: ' + missingVars.length);

    if (missingVars.length > 0) {
      console.log('  Would add:');
      missingVars.slice(0, 5).forEach(v => {
        console.log('    - ' + v.size + ' @ $' + v.price + ' (' + v.sku + ')');
      });
      if (missingVars.length > 5) {
        console.log('    ... and ' + (missingVars.length - 5) + ' more');
      }
    }

    console.log('');
  }

  // Ask for confirmation via env var
  const doImport = process.env.DO_IMPORT === 'true';

  if (!doImport) {
    console.log('\n=== DRY RUN ===');
    console.log('To actually import, run with: DO_IMPORT=true npx tsx scripts/sync-open-flex-variations.ts');
    process.exit(0);
  }

  console.log('\n=== IMPORTING ===\n');

  for (const prod of targetProducts) {
    const existingVars = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, prod.id));

    const existingSizes = new Set(existingVars.map(v => v.size));
    const multiplier = PRICE_MULTIPLIERS[prod.sku] || 0.5;

    let added = 0;
    let displayOrder = (existingVars.length + 1) * 100;

    for (const ref of ref400Data) {
      if (!existingSizes.has(ref.size)) {
        const adjustedPrice = Math.round(ref.price * multiplier);
        const varSku = prod.sku + '_' + ref.size.replace('mm', '');

        await db.insert(productVariations).values({
          productId: prod.id,
          size: ref.size,
          label: ref.size + ' Pipe OD',
          price: adjustedPrice.toString(),
          sku: varSku,
          source: 'manual',
          displayOrder: displayOrder,
        });

        added++;
        displayOrder += 100;
      }
    }

    console.log('Added ' + added + ' variations to ' + prod.sku);
  }

  console.log('\nDone!');
  process.exit(0);
}

analyze().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
