/**
 * Align Database Prices with Neto Export CSV
 *
 * The Neto export contains Ex GST prices. Our database prices may have
 * been incorrectly modified (GST deducted). This script compares and aligns.
 *
 * Usage: npx tsx scripts/align-prices-with-neto.ts [--dry-run]
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.join(process.cwd(), '.planning/audit/neto-export.csv');
const DRY_RUN = process.argv.includes('--dry-run');

const sql = neon(process.env.DATABASE_URL!);

interface NetoProduct {
  sku: string;
  parentSku: string;
  name: string;
  price: number;
  size: string;
}

interface PriceMismatch {
  sku: string;
  parentSku: string;
  size: string;
  netoPrice: number;
  dbPrice: number | null;
  difference: number;
  variationId?: number;
}

/**
 * Parse CSV line handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

/**
 * Parse the Neto CSV file
 */
function parseNetoCSV(): NetoProduct[] {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n');
  const products: NetoProduct[] = [];

  // Skip header (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);

    // Column indices (0-based):
    // 0: SKU*, 1: Parent SKU, 2: Name, 10: Price (Default), 30: Specific Value 1 (size)
    const sku = fields[0]?.replace(/"/g, '').trim();
    const parentSku = fields[1]?.replace(/"/g, '').trim();
    const name = fields[2]?.replace(/"/g, '').trim();
    const priceStr = fields[10]?.replace(/"/g, '').trim();
    const size = fields[30]?.replace(/"/g, '').trim() || '';

    // Skip if no SKU or no price
    if (!sku || !priceStr) continue;

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) continue;

    // Skip demo/test products
    if (name?.toLowerCase().includes('demo') || name?.toLowerCase().includes('test')) continue;

    products.push({
      sku,
      parentSku,
      name: name || '',
      price,
      size,
    });
  }

  console.log(`Parsed ${products.length} products from Neto CSV`);
  return products;
}

/**
 * Get all product variations from database with their SKUs
 */
async function getDbVariations(): Promise<Map<string, { id: number; price: string | null; size: string }>> {
  const variations = await sql`
    SELECT id, sku, price, size
    FROM product_variations
    WHERE sku IS NOT NULL
  `;

  const map = new Map<string, { id: number; price: string | null; size: string }>();

  for (const v of variations) {
    if (v.sku) {
      map.set(v.sku as string, {
        id: v.id as number,
        price: v.price as string | null,
        size: v.size as string
      });
    }
  }

  console.log(`Found ${map.size} variations with SKUs in database`);
  return map;
}

/**
 * Find mismatches between Neto and DB prices
 */
async function findMismatches(netoProducts: NetoProduct[]): Promise<PriceMismatch[]> {
  const dbVariations = await getDbVariations();
  const mismatches: PriceMismatch[] = [];
  const matched = new Set<string>();

  for (const neto of netoProducts) {
    // Try to find by exact SKU match in variations
    const dbVar = dbVariations.get(neto.sku);

    if (dbVar) {
      matched.add(neto.sku);
      const dbPrice = dbVar.price ? parseFloat(dbVar.price) : null;

      // Compare prices (allow small rounding differences)
      if (dbPrice === null || Math.abs(dbPrice - neto.price) > 0.01) {
        mismatches.push({
          sku: neto.sku,
          parentSku: neto.parentSku,
          size: neto.size || dbVar.size,
          netoPrice: neto.price,
          dbPrice,
          difference: dbPrice ? neto.price - dbPrice : neto.price,
          variationId: dbVar.id,
        });
      }
    }
  }

  console.log(`\nMatched ${matched.size} SKUs`);
  console.log(`Found ${mismatches.length} price mismatches`);

  return mismatches;
}

/**
 * Update prices in database
 */
async function updatePrices(mismatches: PriceMismatch[]): Promise<void> {
  let updated = 0;
  let failed = 0;

  for (const m of mismatches) {
    if (!m.variationId) {
      console.log(`  SKIP: No variation ID for ${m.sku}`);
      failed++;
      continue;
    }

    try {
      if (!DRY_RUN) {
        await sql`
          UPDATE product_variations
          SET price = ${m.netoPrice.toFixed(2)}
          WHERE id = ${m.variationId}
        `;
      }

      console.log(`  ${DRY_RUN ? '[DRY-RUN] ' : ''}Updated ${m.sku}: $${m.dbPrice ?? 'null'} -> $${m.netoPrice.toFixed(2)}`);
      updated++;
    } catch (err) {
      console.error(`  ERROR updating ${m.sku}:`, err);
      failed++;
    }
  }

  console.log(`\n${DRY_RUN ? '[DRY-RUN] ' : ''}Updated: ${updated}, Failed: ${failed}`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('NETO → DATABASE PRICE ALIGNMENT');
  console.log('='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE UPDATE'}`);
  console.log('');

  // Step 1: Parse CSV
  console.log('Step 1: Parsing Neto CSV...');
  const netoProducts = parseNetoCSV();

  // Step 2: Find mismatches
  console.log('\nStep 2: Finding price mismatches...');
  const mismatches = await findMismatches(netoProducts);

  if (mismatches.length === 0) {
    console.log('\nAll prices match! Nothing to update.');
    process.exit(0);
  }

  // Step 3: Show summary
  console.log('\n' + '='.repeat(60));
  console.log('PRICE MISMATCHES');
  console.log('='.repeat(60));

  // Group by product for readability
  const byProduct = new Map<string, PriceMismatch[]>();
  for (const m of mismatches) {
    const key = m.parentSku || m.sku;
    if (!byProduct.has(key)) byProduct.set(key, []);
    byProduct.get(key)!.push(m);
  }

  for (const [parentSku, variants] of byProduct) {
    console.log(`\n${parentSku}:`);
    for (const v of variants) {
      const diff = v.difference > 0 ? `+$${v.difference.toFixed(2)}` : `-$${Math.abs(v.difference).toFixed(2)}`;
      console.log(`  ${v.size || v.sku}: $${v.dbPrice ?? 'null'} -> $${v.netoPrice.toFixed(2)} (${diff})`);
    }
  }

  // Calculate total value difference
  const totalDiff = mismatches.reduce((sum, m) => sum + m.difference, 0);
  console.log('\n' + '='.repeat(60));
  console.log(`Total price difference: ${totalDiff > 0 ? '+' : ''}$${totalDiff.toFixed(2)}`);
  console.log(`Variations to update: ${mismatches.length}`);
  console.log('='.repeat(60));

  // Step 4: Update
  console.log('\nStep 3: Updating database prices...');
  await updatePrices(mismatches);

  console.log('\nDone!');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
