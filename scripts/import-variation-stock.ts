/**
 * Import Variation-Level Stock to Parent Products
 *
 * The Neto export tracked stock at the variation level (e.g., "48.3mm" size has 5 in stock).
 * This script aggregates variation stock to parent products.
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

interface ParentStock {
  parentSku: string;
  qtyInStock: number;
  incomingQty: number;
  preorderQty: number;
  variationCount: number;
}

async function main() {
  const dryRun = !process.argv.includes('--fix');

  console.log('='.repeat(60));
  console.log('Import Variation Stock to Parent Products');
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

  // Find variations with stock and aggregate to parents
  const parentStockMap = new Map<string, ParentStock>();

  for (const row of rows) {
    const parentSku = row['Parent SKU']?.trim();
    const sku = row['SKU*']?.trim();
    const isActive = row['Active']?.toLowerCase() === 'y';

    // Skip if not a variation (no parent SKU) or inactive
    if (!parentSku || !isActive) continue;

    const qtyInStock = parseInt(row['Qty In Stock (DE Water Products)'] || '0', 10) || 0;
    const incomingQty = parseInt(row['Incoming Qty'] || '0', 10) || 0;
    const preorderQty = parseInt(row['Preorder Qty'] || '0', 10) || 0;

    // Get or create parent entry
    let parent = parentStockMap.get(parentSku);
    if (!parent) {
      parent = {
        parentSku,
        qtyInStock: 0,
        incomingQty: 0,
        preorderQty: 0,
        variationCount: 0,
      };
      parentStockMap.set(parentSku, parent);
    }

    // Aggregate stock
    parent.qtyInStock += qtyInStock;
    parent.incomingQty += incomingQty;
    parent.preorderQty += preorderQty;
    parent.variationCount++;
  }

  // Filter to parents with actual stock
  const parentsWithStock = Array.from(parentStockMap.values())
    .filter(p => p.qtyInStock > 0 || p.incomingQty > 0 || p.preorderQty > 0);

  console.log(`\nParent products with aggregated stock: ${parentsWithStock.length}`);

  if (parentsWithStock.length === 0) {
    console.log('No stock data to import.');
    return;
  }

  console.log('\nStock to import:');
  console.log('-'.repeat(60));

  for (const parent of parentsWithStock) {
    console.log(`  ${parent.parentSku}: qty=${parent.qtyInStock}, incoming=${parent.incomingQty}, preorder=${parent.preorderQty} (from ${parent.variationCount} variations)`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] No changes made. Run with --fix to apply.');
    return;
  }

  // Apply updates
  console.log('\nApplying stock updates...');

  let updated = 0;
  let notFound = 0;
  let created = 0;

  for (const parent of parentsWithStock) {
    // Find product by SKU
    const productResult = await sql`
      SELECT id FROM products WHERE sku = ${parent.parentSku}
    `;

    if (productResult.length === 0) {
      console.log(`  [NOT FOUND] ${parent.parentSku}`);
      notFound++;
      continue;
    }

    const productId = productResult[0].id;

    // Check if stock record exists
    const stockResult = await sql`
      SELECT id FROM product_stock WHERE product_id = ${productId}
    `;

    if (stockResult.length > 0) {
      // Update existing
      await sql`
        UPDATE product_stock
        SET
          qty_in_stock = ${parent.qtyInStock},
          incoming_qty = ${parent.incomingQty},
          preorder_qty = ${parent.preorderQty},
          last_updated_at = NOW()
        WHERE product_id = ${productId}
      `;
      console.log(`  [UPDATED] ${parent.parentSku}: qty=${parent.qtyInStock}`);
      updated++;
    } else {
      // Create new
      await sql`
        INSERT INTO product_stock (product_id, qty_in_stock, incoming_qty, preorder_qty, reorder_point, last_updated_at)
        VALUES (${productId}, ${parent.qtyInStock}, ${parent.incomingQty}, ${parent.preorderQty}, 5, NOW())
      `;
      console.log(`  [CREATED] ${parent.parentSku}: qty=${parent.qtyInStock}`);
      created++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  Updated: ${updated}`);
  console.log(`  Created: ${created}`);
  console.log(`  Not found: ${notFound}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
