/**
 * Import Variation-Level Stock to product_stock table
 *
 * This script creates individual stock records for each variation,
 * linking via the variationId field in product_stock.
 *
 * Data flow:
 * 1. Read Neto CSV - find variations (rows with Parent SKU and stock data)
 * 2. Match to productVariations by SKU
 * 3. Create/update productStock record with variationId set
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

interface CsvRow {
  'SKU*': string;
  'Parent SKU': string;
  'Name': string;
  'Active': string;
  'Qty In Stock (DE Water Products)': string;
  'Incoming Qty': string;
  'Preorder Qty': string;
  [key: string]: string;
}

interface VariationStock {
  variationSku: string;
  parentSku: string;
  qtyInStock: number;
  incomingQty: number;
  preorderQty: number;
}

async function main() {
  const dryRun = !process.argv.includes('--fix');

  console.log('='.repeat(60));
  console.log('Import Variation-Level Stock (v2)');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN (use --fix to apply)' : 'APPLYING CHANGES'}\n`);

  // Read CSV
  const csvPath = path.join(process.cwd(), '.planning/audit/neto-export.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Total CSV rows: ${rows.length}`);

  // Find variations with stock data
  const variationsWithStock: VariationStock[] = [];

  for (const row of rows) {
    const parentSku = row['Parent SKU']?.trim();
    const sku = row['SKU*']?.trim();
    const isActive = row['Active']?.toLowerCase() === 'y';

    // Skip if not a variation (no parent SKU) or inactive
    if (!parentSku || !isActive || !sku) continue;

    const qtyInStock = parseInt(row['Qty In Stock (DE Water Products)'] || '0', 10) || 0;
    const incomingQty = parseInt(row['Incoming Qty'] || '0', 10) || 0;
    const preorderQty = parseInt(row['Preorder Qty'] || '0', 10) || 0;

    // Only include variations that have some stock data
    if (qtyInStock > 0 || incomingQty > 0 || preorderQty > 0) {
      variationsWithStock.push({
        variationSku: sku,
        parentSku,
        qtyInStock,
        incomingQty,
        preorderQty,
      });
    }
  }

  console.log(`\nVariations with stock data: ${variationsWithStock.length}`);

  if (variationsWithStock.length === 0) {
    console.log('No variation stock data to import.');
    return;
  }

  // First, clear existing parent-level aggregated stock (we'll replace with variation-level)
  if (!dryRun) {
    console.log('\nClearing existing product-level stock (will be replaced by variation stock)...');
    await sql`DELETE FROM product_stock WHERE variation_id IS NULL`;
  }

  // Match to database variations and create stock records
  console.log('\nProcessing variations:');
  console.log('-'.repeat(60));

  let created = 0;
  let updated = 0;
  let notFound = 0;
  let errors: string[] = [];

  for (const varStock of variationsWithStock) {
    // Find the variation by SKU
    const variationResult = await sql`
      SELECT pv.id as variation_id, pv.product_id, pv.size, p.sku as parent_sku
      FROM product_variations pv
      JOIN products p ON p.id = pv.product_id
      WHERE pv.sku = ${varStock.variationSku}
    `;

    if (variationResult.length === 0) {
      console.log(`  [NOT FOUND] Variation SKU: ${varStock.variationSku}`);
      notFound++;
      continue;
    }

    const variation = variationResult[0];
    const variationId = variation.variation_id;
    const productId = variation.product_id;

    if (dryRun) {
      console.log(`  [DRY RUN] ${varStock.variationSku} (${variation.size}): qty=${varStock.qtyInStock}, incoming=${varStock.incomingQty}`);
      created++;
      continue;
    }

    try {
      // Check if stock record already exists for this variation
      const existingStock = await sql`
        SELECT id FROM product_stock WHERE variation_id = ${variationId}
      `;

      if (existingStock.length > 0) {
        // Update existing
        await sql`
          UPDATE product_stock
          SET
            qty_in_stock = ${varStock.qtyInStock},
            incoming_qty = ${varStock.incomingQty},
            preorder_qty = ${varStock.preorderQty},
            last_updated_at = NOW()
          WHERE variation_id = ${variationId}
        `;
        console.log(`  [UPDATED] ${varStock.variationSku}: qty=${varStock.qtyInStock}`);
        updated++;
      } else {
        // Create new
        await sql`
          INSERT INTO product_stock (product_id, variation_id, qty_in_stock, incoming_qty, preorder_qty, reorder_point, last_updated_at)
          VALUES (${productId}, ${variationId}, ${varStock.qtyInStock}, ${varStock.incomingQty}, ${varStock.preorderQty}, 2, NOW())
        `;
        console.log(`  [CREATED] ${varStock.variationSku}: qty=${varStock.qtyInStock}`);
        created++;
      }
    } catch (err) {
      console.error(`  [ERROR] ${varStock.variationSku}:`, err);
      errors.push(varStock.variationSku);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  if (dryRun) {
    console.log(`  Would create: ${created} stock records`);
    console.log(`  Not found in DB: ${notFound}`);
    console.log('\n[DRY RUN] Run with --fix to apply changes.');
  } else {
    console.log(`  Created: ${created}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Not found: ${notFound}`);
    if (errors.length > 0) {
      console.log(`  Errors: ${errors.length}`);
    }
  }
  console.log('='.repeat(60));
}

main().catch(console.error);
