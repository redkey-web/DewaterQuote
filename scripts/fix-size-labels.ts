/**
 * Fix Size Labels Script
 *
 * Updates database size/label fields to match Neto's full descriptive format.
 * Example: "168.3" → "168.3mm Pipe Outside Diameter sizing"
 *
 * Run with: npx tsx scripts/fix-size-labels.ts
 *
 * Options:
 *   --dry-run    Show what would change without making changes
 *   --fix        Apply all changes
 *   --sku=X      Only process specific parent SKU
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = '.planning/audit/neto-export.csv';

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Parse args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldFix = args.includes('--fix');
const skuArg = args.find((a) => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;

if (!isDryRun && !shouldFix) {
  console.log('Use --dry-run to preview changes or --fix to apply them');
  process.exit(0);
}

interface NetoSize {
  sku: string;
  parentSku: string;
  size: string; // Full format: "168.3mm Pipe Outside Diameter sizing"
  price: number;
}

interface DbVariation {
  id: number;
  sku: string;
  size: string;
  label: string;
  productId: number;
  productSku: string;
}

interface LabelChange {
  variationId: number;
  sku: string;
  oldSize: string;
  oldLabel: string;
  newSize: string;
  newLabel: string;
}

// Normalize size for matching: "168.3mm Pipe Outside..." -> "168.3"
function normalizeSize(size: string): string {
  const match = size.match(/^(\d+(?:\.\d+)?)/);
  return match ? match[1] : size;
}

function parseNetoCsv(): Map<string, NetoSize[]> {
  console.log('\n📦 Parsing Neto CSV export...');

  if (!existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found: ${CSV_PATH}`);
  }

  const csvContent = readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const byParent = new Map<string, NetoSize[]>();

  for (const row of records) {
    const sku = row['SKU*']?.trim();
    if (!sku) continue;

    const active = row['Active']?.toLowerCase() === 'y';
    if (!active) continue;

    const price = parseFloat(row['Price (Default)'] || '0');
    const parentSku = row['Parent SKU']?.trim() || '';
    const size = row['Specific Value 1']?.trim() || '';

    if (!parentSku || !size) continue;

    if (!byParent.has(parentSku)) byParent.set(parentSku, []);
    byParent.get(parentSku)!.push({ sku, parentSku, size, price });
  }

  console.log(`   Found ${byParent.size} product families`);
  return byParent;
}

async function getDbVariations(): Promise<DbVariation[]> {
  console.log('\n🗄️  Querying database...');

  let query = `
    SELECT
      pv.id,
      pv.sku,
      pv.size,
      pv.label,
      pv.product_id,
      p.sku as product_sku
    FROM product_variations pv
    JOIN products p ON pv.product_id = p.id
    WHERE p.is_active = true
  `;

  if (filterSku) {
    query += ` AND p.sku = '${filterSku}'`;
  }

  query += ' ORDER BY p.sku, pv.display_order';

  const results = (await sql(query)) as Array<{
    id: number;
    sku: string;
    size: string;
    label: string;
    product_id: number;
    product_sku: string;
  }>;

  const variations = results.map((r) => ({
    id: r.id,
    sku: r.sku,
    size: r.size,
    label: r.label,
    productId: r.product_id,
    productSku: r.product_sku,
  }));

  console.log(`   Found ${variations.length} variations in database`);
  return variations;
}

function findLabelChanges(
  dbVariations: DbVariation[],
  netoByParent: Map<string, NetoSize[]>
): LabelChange[] {
  console.log('\n🔍 Finding label changes...');

  const changes: LabelChange[] = [];

  for (const dbVar of dbVariations) {
    // Skip if already has full format (contains "mm" and descriptive text)
    if (dbVar.size.includes('mm') && dbVar.size.length > 10) continue;

    // Skip "Standard" placeholders - these will be handled separately
    if (dbVar.size === 'Standard') continue;

    // Get Neto sizes for this product
    const netoSizes = netoByParent.get(dbVar.productSku) || [];
    if (netoSizes.length === 0) continue;

    // Build normalized -> full size map
    const netoByNormalized = new Map<string, string>();
    for (const neto of netoSizes) {
      netoByNormalized.set(normalizeSize(neto.size), neto.size);
    }

    // Find matching Neto size
    const dbNormalized = normalizeSize(dbVar.size);
    const netoFullSize = netoByNormalized.get(dbNormalized);

    if (netoFullSize && netoFullSize !== dbVar.size) {
      changes.push({
        variationId: dbVar.id,
        sku: dbVar.sku || `${dbVar.productSku}-${dbNormalized}`,
        oldSize: dbVar.size,
        oldLabel: dbVar.label,
        newSize: netoFullSize,
        newLabel: netoFullSize, // Use same value for label
      });
    }
  }

  return changes;
}

async function applyChanges(changes: LabelChange[]): Promise<void> {
  console.log('\n⚡ Applying changes...');

  let updated = 0;

  for (const change of changes) {
    await sql`
      UPDATE product_variations
      SET size = ${change.newSize}, label = ${change.newLabel}
      WHERE id = ${change.variationId}
    `;
    updated++;
  }

  console.log(`   ✓ Updated ${updated} variations`);
}

async function main() {
  console.log('='.repeat(70));
  console.log('FIX SIZE LABELS');
  console.log('Update DB size/label fields to match Neto format');
  console.log('='.repeat(70));

  if (filterSku) {
    console.log(`Filtering: ${filterSku}`);
  }
  console.log(`Mode: ${shouldFix ? 'FIX' : 'DRY RUN'}`);

  // Load data
  const netoByParent = parseNetoCsv();
  const dbVariations = await getDbVariations();

  // Find changes
  const changes = findLabelChanges(dbVariations, netoByParent);

  // Report
  console.log('\n' + '='.repeat(70));
  console.log('CHANGES FOUND');
  console.log('='.repeat(70));

  console.log(`\n📝 Size label updates: ${changes.length}`);

  if (changes.length > 0) {
    // Group by product
    const byProduct = new Map<string, LabelChange[]>();
    for (const c of changes) {
      const productSku = c.sku.split('-')[0].split('_')[0];
      if (!byProduct.has(productSku)) byProduct.set(productSku, []);
      byProduct.get(productSku)!.push(c);
    }

    for (const [productSku, productChanges] of byProduct) {
      console.log(`\n${productSku}: ${productChanges.length} labels to update`);
      for (const c of productChanges.slice(0, 5)) {
        console.log(`   "${c.oldSize}" → "${c.newSize}"`);
      }
      if (productChanges.length > 5) {
        console.log(`   ... and ${productChanges.length - 5} more`);
      }
    }
  }

  // Apply if requested
  if (shouldFix && changes.length > 0) {
    await applyChanges(changes);
    console.log('\n✅ All changes applied!');
  } else if (changes.length > 0) {
    console.log('\n💡 Run with --fix to apply changes');
  } else {
    console.log('\n✅ All size labels already match Neto format!');
  }

  console.log('\nDone!');
}

main().catch(console.error);
