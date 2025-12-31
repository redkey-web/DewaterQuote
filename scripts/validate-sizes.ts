/**
 * Size Validation Script
 * Compares sizes in database against Neto CSV to find discrepancies
 *
 * Run with: npx tsx scripts/validate-sizes.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = '.planning/audit/neto-export.csv';

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

interface NetoSize {
  sku: string;
  size: string;
  price: number;
}

interface ValidationResult {
  productSku: string;
  productName: string;
  dbSizeCount: number;
  netoSizeCount: number;
  missingInDb: NetoSize[];
  extraInDb: string[];
  status: 'ok' | 'missing' | 'extra' | 'mismatch';
}

function parseNetoCsv(): Map<string, NetoSize[]> {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}`);
  }

  const csv = readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const byParent = new Map<string, NetoSize[]>();

  for (const row of records) {
    const sku = row['SKU*']?.trim();
    const parentSku = row['Parent SKU']?.trim();
    const active = row['Active']?.toLowerCase() === 'y';
    const size = row['Specific Value 1']?.trim();
    const price = parseFloat(row['Price (Default)'] || '0');

    if (!sku || !parentSku || !active || !size) continue;

    if (!byParent.has(parentSku)) byParent.set(parentSku, []);
    byParent.get(parentSku)!.push({ sku, size, price });
  }

  return byParent;
}

// Extract just the numeric/unit part of size for comparison
// "50mm DN50 (2") Nominal Bore sizing" -> "50mm"
function normalizeSize(size: string): string {
  const match = size.match(/^(\d+(?:\.\d+)?(?:mm)?)/);
  return match ? match[1] : size;
}

async function getDbProducts(): Promise<
  Array<{
    sku: string;
    name: string;
    sizes: string[];
    variationSkus: string[];
  }>
> {
  const results = await sql`
    SELECT
      p.sku,
      p.name,
      COALESCE(array_agg(pv.size ORDER BY pv.display_order), ARRAY[]::text[]) as sizes,
      COALESCE(array_agg(pv.sku ORDER BY pv.display_order), ARRAY[]::text[]) as variation_skus
    FROM products p
    LEFT JOIN product_variations pv ON pv.product_id = p.id
    WHERE p.is_active = true
    GROUP BY p.id, p.sku, p.name
    ORDER BY p.sku
  `;

  return results.map((r) => ({
    sku: r.sku,
    name: r.name,
    sizes: (r.sizes || []).filter(Boolean),
    variationSkus: (r.variation_skus || []).filter(Boolean),
  }));
}

function validateSizes(
  dbProducts: Array<{ sku: string; name: string; sizes: string[]; variationSkus: string[] }>,
  netoByParent: Map<string, NetoSize[]>
): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const product of dbProducts) {
    const netoSizes = netoByParent.get(product.sku) || [];

    // Skip products not in Neto
    if (netoSizes.length === 0) continue;

    // Normalize sizes for comparison
    const dbNormalized = new Set(product.sizes.map(normalizeSize));
    const netoNormalized = new Map<string, NetoSize>();
    for (const n of netoSizes) {
      netoNormalized.set(normalizeSize(n.size), n);
    }

    // Find missing in DB (in Neto but not DB)
    const missingInDb: NetoSize[] = [];
    for (const [normalized, netoSize] of netoNormalized) {
      if (!dbNormalized.has(normalized)) {
        missingInDb.push(netoSize);
      }
    }

    // Find extra in DB (in DB but not Neto)
    const extraInDb: string[] = [];
    for (const dbSize of product.sizes) {
      const normalized = normalizeSize(dbSize);
      if (!netoNormalized.has(normalized)) {
        extraInDb.push(dbSize);
      }
    }

    let status: ValidationResult['status'] = 'ok';
    if (missingInDb.length > 0 && extraInDb.length > 0) status = 'mismatch';
    else if (missingInDb.length > 0) status = 'missing';
    else if (extraInDb.length > 0) status = 'extra';

    results.push({
      productSku: product.sku,
      productName: product.name,
      dbSizeCount: product.sizes.length,
      netoSizeCount: netoSizes.length,
      missingInDb,
      extraInDb,
      status,
    });
  }

  return results;
}

async function main() {
  console.log('='.repeat(70));
  console.log('SIZE VALIDATION REPORT');
  console.log('Comparing Database sizes vs Neto CSV');
  console.log('='.repeat(70));

  const netoByParent = parseNetoCsv();
  console.log(`\nParsed ${netoByParent.size} product families from Neto CSV`);

  const dbProducts = await getDbProducts();
  console.log(`Found ${dbProducts.length} products in database`);

  const results = validateSizes(dbProducts, netoByParent);

  // Summary counts
  const okCount = results.filter((r) => r.status === 'ok').length;
  const missingCount = results.filter((r) => r.status === 'missing' || r.status === 'mismatch').length;
  const extraCount = results.filter((r) => r.status === 'extra' || r.status === 'mismatch').length;

  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Products checked: ${results.length}`);
  console.log(`✅ Fully synced:   ${okCount}`);
  console.log(`⚠️  Missing sizes: ${missingCount}`);
  console.log(`📦 Extra in DB:    ${extraCount}`);

  // Show issues
  const issues = results.filter((r) => r.status !== 'ok');

  if (issues.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('ISSUES FOUND');
    console.log('='.repeat(70));

    for (const result of issues) {
      console.log(`\n${result.productSku} (${result.productName.substring(0, 45)})`);
      console.log(`  DB: ${result.dbSizeCount} sizes, Neto: ${result.netoSizeCount} sizes`);

      if (result.missingInDb.length > 0) {
        console.log(`  ❌ MISSING in DB (${result.missingInDb.length}):`);
        for (const m of result.missingInDb.slice(0, 10)) {
          console.log(`     - ${m.size} @ $${m.price.toFixed(2)}`);
        }
        if (result.missingInDb.length > 10) {
          console.log(`     ... and ${result.missingInDb.length - 10} more`);
        }
      }

      if (result.extraInDb.length > 0) {
        console.log(`  ➕ EXTRA in DB (${result.extraInDb.length}):`);
        for (const e of result.extraInDb.slice(0, 5)) {
          console.log(`     - ${e}`);
        }
      }
    }
  } else {
    console.log('\n✅ All product sizes are in sync!');
  }

  // Total missing count
  const totalMissing = results.reduce((sum, r) => sum + r.missingInDb.length, 0);
  console.log(`\nTotal sizes missing from DB: ${totalMissing}`);

  console.log('\nDone!');
}

main().catch(console.error);
