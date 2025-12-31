/**
 * Sync Database from Neto CSV Export
 *
 * This script:
 * 1. Parses Neto CSV export
 * 2. Compares with database
 * 3. Updates SKUs to match Neto format
 * 4. Adds missing size variations
 * 5. Updates prices to match Neto
 *
 * Run with: npx tsx scripts/sync-from-neto-csv.ts
 *
 * Options:
 *   --dry-run    Show what would change without making changes
 *   --fix        Apply all changes
 *   --sku=X      Only process specific parent SKU
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync, existsSync } from 'fs';
import { neon } from '@neondatabase/serverless';
import { parse } from 'csv-parse/sync';

const CSV_PATH = '.planning/audit/neto-export.csv';

// Check env
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

interface NetoProduct {
  sku: string;
  parentSku: string;
  name: string;
  price: number;
  size: string;
  active: boolean;
}

interface DbVariation {
  id: number;
  sku: string;
  price: string | null;
  size: string;
  label: string;
  productId: number;
  productSku: string;
  productName: string;
}

interface Change {
  type: 'sku_update' | 'price_update' | 'add_variation';
  variationId?: number;
  productId?: number;
  oldValue?: string | number | null;
  newValue: string | number;
  sku: string;
  details: string;
}

// ============================================
// Parse Neto CSV
// ============================================
function parseNetoCsv(): Map<string, NetoProduct> {
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

  const products = new Map<string, NetoProduct>();

  for (const row of records) {
    const sku = row['SKU*']?.trim();
    if (!sku) continue;

    const active = row['Active']?.toLowerCase() === 'y';
    if (!active) continue;

    const price = parseFloat(row['Price (Default)'] || '0');
    const parentSku = row['Parent SKU']?.trim() || '';
    const name = row['Name']?.trim() || '';
    const size = row['Specific Value 1']?.trim() || '';

    products.set(sku, {
      sku,
      parentSku,
      name,
      price,
      size,
      active,
    });
  }

  console.log(`   Found ${products.size} active products in Neto`);
  return products;
}

// ============================================
// Query Database
// ============================================
async function getDbVariations(): Promise<DbVariation[]> {
  console.log('\n🗄️  Querying database...');

  let query = `
    SELECT
      pv.id,
      pv.sku,
      pv.price,
      pv.size,
      pv.label,
      pv.product_id,
      p.sku as product_sku,
      p.name as product_name
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
    price: string | null;
    size: string;
    label: string;
    product_id: number;
    product_sku: string;
    product_name: string;
  }>;

  const variations = results.map((r) => ({
    id: r.id,
    sku: r.sku,
    price: r.price,
    size: r.size,
    label: r.label,
    productId: r.product_id,
    productSku: r.product_sku,
    productName: r.product_name,
  }));

  console.log(`   Found ${variations.length} variations in database`);
  return variations;
}

async function getProducts(): Promise<
  Map<string, { id: number; sku: string; name: string }>
> {
  let query = `SELECT id, sku, name FROM products WHERE is_active = true`;
  if (filterSku) {
    query += ` AND sku = '${filterSku}'`;
  }

  const results = (await sql(query)) as Array<{
    id: number;
    sku: string;
    name: string;
  }>;
  const map = new Map<string, { id: number; sku: string; name: string }>();
  for (const r of results) {
    map.set(r.sku, r);
  }
  return map;
}

// ============================================
// Helper: Normalize size for comparison
// "168.3mm Pipe Outside Diameter sizing" -> "168.3"
// "168.3" -> "168.3"
// ============================================
function normalizeSize(size: string): string {
  const match = size.match(/^(\d+(?:\.\d+)?)/);
  return match ? match[1] : size;
}

// ============================================
// Compare and Find Changes
// ============================================
function findChanges(
  netoProducts: Map<string, NetoProduct>,
  dbVariations: DbVariation[],
  dbProducts: Map<string, { id: number; sku: string; name: string }>
): Change[] {
  console.log('\n🔍 Comparing sources...');

  const changes: Change[] = [];

  // Build index of DB variations by SKU
  const dbBysku = new Map<string, DbVariation>();
  for (const v of dbVariations) {
    if (v.sku) {
      dbBysku.set(v.sku, v);
    }
  }

  // Build index of Neto products by parent SKU
  const netoByParent = new Map<string, NetoProduct[]>();
  for (const [, neto] of netoProducts) {
    if (!neto.parentSku) continue;
    if (!netoByParent.has(neto.parentSku)) {
      netoByParent.set(neto.parentSku, []);
    }
    netoByParent.get(neto.parentSku)!.push(neto);
  }

  // For each DB variation, check if it needs SKU or price update
  for (const dbVar of dbVariations) {
    if (!dbVar.sku) continue;

    // Try to find matching Neto product
    let netoMatch = netoProducts.get(dbVar.sku);

    // If not found, try common format conversions
    if (!netoMatch) {
      // FSFREJ-50 -> FSFREJ50
      const noDash = dbVar.sku.replace(/-/g, '');
      netoMatch = netoProducts.get(noDash);
      if (netoMatch) {
        changes.push({
          type: 'sku_update',
          variationId: dbVar.id,
          sku: dbVar.sku,
          oldValue: dbVar.sku,
          newValue: noDash,
          details: `SKU format: ${dbVar.sku} → ${noDash}`,
        });
      }
    }

    if (!netoMatch) {
      // CF8MWEBFVL-100 -> CF8MWEBFVL_100
      const dashToUnderscore = dbVar.sku.replace(/-/g, '_');
      netoMatch = netoProducts.get(dashToUnderscore);
      if (netoMatch) {
        changes.push({
          type: 'sku_update',
          variationId: dbVar.id,
          sku: dbVar.sku,
          oldValue: dbVar.sku,
          newValue: dashToUnderscore,
          details: `SKU format: ${dbVar.sku} → ${dashToUnderscore}`,
        });
      }
    }

    // Check price if we found a match
    if (netoMatch) {
      const dbPrice = dbVar.price ? parseFloat(dbVar.price) : null;
      if (dbPrice === null || Math.abs(dbPrice - netoMatch.price) > 0.01) {
        changes.push({
          type: 'price_update',
          variationId: dbVar.id,
          sku: netoMatch.sku, // Use Neto SKU (might be updated)
          oldValue: dbPrice,
          newValue: netoMatch.price,
          details: `Price: $${dbPrice?.toFixed(2) || 'N/A'} → $${netoMatch.price.toFixed(2)}`,
        });
      }
    }
  }

  // For each DB product, check prices and find missing sizes from Neto
  for (const [parentSku, product] of dbProducts) {
    const netoSizes = netoByParent.get(parentSku) || [];
    const dbVarsForProduct = dbVariations.filter((v) => v.productSku === parentSku);

    // Build normalized size -> Neto product map
    const netoByNormalizedSize = new Map<string, NetoProduct>();
    for (const neto of netoSizes) {
      netoByNormalizedSize.set(normalizeSize(neto.size), neto);
    }

    // Check prices for existing DB variations by matching normalized size
    for (const dbVar of dbVarsForProduct) {
      if (!dbVar.size || dbVar.size === 'Standard') continue;

      const normalized = normalizeSize(dbVar.size);
      const netoMatch = netoByNormalizedSize.get(normalized);

      if (netoMatch) {
        const dbPrice = dbVar.price ? parseFloat(dbVar.price) : null;
        if (dbPrice === null || Math.abs(dbPrice - netoMatch.price) > 0.01) {
          changes.push({
            type: 'price_update',
            variationId: dbVar.id,
            sku: dbVar.sku || `${parentSku}-${normalized}`,
            oldValue: dbPrice,
            newValue: netoMatch.price,
            details: `Price: $${dbPrice?.toFixed(2) || 'N/A'} → $${netoMatch.price.toFixed(2)} (size: ${dbVar.size})`,
          });
        }
      }
    }
  }

  // For each DB product, find missing sizes from Neto
  for (const [parentSku, product] of dbProducts) {
    const netoSizes = netoByParent.get(parentSku) || [];

    // Get existing SKUs for this product
    const existingSkus = new Set(
      dbVariations.filter((v) => v.productSku === parentSku).map((v) => v.sku)
    );

    // Get existing NORMALIZED sizes for this product (e.g., "168.3" not "168.3mm")
    const existingNormalizedSizes = new Set<string>();
    for (const v of dbVariations.filter((v) => v.productSku === parentSku)) {
      existingNormalizedSizes.add(normalizeSize(v.size));
    }

    for (const neto of netoSizes) {
      // Skip if already exists (by SKU)
      if (existingSkus.has(neto.sku)) continue;
      // Also check no-dash version
      if (existingSkus.has(neto.sku.replace(/_/g, '-'))) continue;
      // Also check with dash
      if (existingSkus.has(neto.parentSku + '-' + neto.size.replace(/mm.*/, '')))
        continue;

      // Skip if NORMALIZED size already exists (e.g., "168.3" matches "168.3mm Pipe...")
      const netoNormalized = normalizeSize(neto.size);
      if (existingNormalizedSizes.has(netoNormalized)) continue;
      // Also skip "Standard" placeholder
      if (existingNormalizedSizes.has('Standard')) continue;

      changes.push({
        type: 'add_variation',
        productId: product.id,
        sku: neto.sku,
        newValue: neto.price,
        details: `Add size: ${neto.size} @ $${neto.price.toFixed(2)}`,
      });
    }
  }

  return changes;
}

// ============================================
// Apply Changes
// ============================================
async function applyChanges(changes: Change[]): Promise<void> {
  console.log('\n⚡ Applying changes...');

  let skuUpdates = 0;
  let priceUpdates = 0;
  let addedVariations = 0;

  for (const change of changes) {
    if (change.type === 'sku_update' && change.variationId) {
      await sql`UPDATE product_variations SET sku = ${change.newValue as string} WHERE id = ${change.variationId}`;
      skuUpdates++;
    } else if (change.type === 'price_update' && change.variationId) {
      await sql`UPDATE product_variations SET price = ${String(change.newValue)} WHERE id = ${change.variationId}`;
      priceUpdates++;
    } else if (change.type === 'add_variation' && change.productId) {
      // Extract size from SKU or use details
      const sizeParts = change.details.match(/Add size: ([^\s@]+)/);
      const size = sizeParts ? sizeParts[1] : change.sku;

      // Get max display order
      const maxOrder =
        (await sql`SELECT COALESCE(MAX(display_order), 0) as max FROM product_variations WHERE product_id = ${change.productId}`) as Array<{
          max: number;
        }>;
      const nextOrder = (maxOrder[0]?.max || 0) + 1;

      await sql`
        INSERT INTO product_variations (product_id, sku, size, label, price, source, display_order)
        VALUES (${change.productId}, ${change.sku}, ${size}, ${size}, ${String(change.newValue)}, 'neto', ${nextOrder})
      `;
      addedVariations++;
    }
  }

  console.log(`   ✓ SKU updates: ${skuUpdates}`);
  console.log(`   ✓ Price updates: ${priceUpdates}`);
  console.log(`   ✓ New variations: ${addedVariations}`);
}

// ============================================
// Main
// ============================================
async function main() {
  console.log('='.repeat(60));
  console.log('SYNC DATABASE FROM NETO CSV');
  console.log('='.repeat(60));

  if (filterSku) {
    console.log(`Filtering: ${filterSku}`);
  }
  console.log(`Mode: ${shouldFix ? 'FIX' : 'DRY RUN'}`);

  // Load data
  const netoProducts = parseNetoCsv();
  const dbVariations = await getDbVariations();
  const dbProducts = await getProducts();

  // Find changes
  const changes = findChanges(netoProducts, dbVariations, dbProducts);

  // Report
  console.log('\n' + '='.repeat(60));
  console.log('CHANGES FOUND');
  console.log('='.repeat(60));

  const skuChanges = changes.filter((c) => c.type === 'sku_update');
  const priceChanges = changes.filter((c) => c.type === 'price_update');
  const addChanges = changes.filter((c) => c.type === 'add_variation');

  console.log(`\n📝 SKU format changes: ${skuChanges.length}`);
  if (skuChanges.length > 0) {
    for (const c of skuChanges.slice(0, 20)) {
      console.log(`   ${c.details}`);
    }
    if (skuChanges.length > 20) {
      console.log(`   ... and ${skuChanges.length - 20} more`);
    }
  }

  console.log(`\n💰 Price updates: ${priceChanges.length}`);
  if (priceChanges.length > 0) {
    for (const c of priceChanges.slice(0, 20)) {
      console.log(`   ${c.sku}: ${c.details}`);
    }
    if (priceChanges.length > 20) {
      console.log(`   ... and ${priceChanges.length - 20} more`);
    }
  }

  console.log(`\n➕ New variations to add: ${addChanges.length}`);
  if (addChanges.length > 0) {
    // Group by product
    const byProduct = new Map<number, Change[]>();
    for (const c of addChanges) {
      if (!c.productId) continue;
      if (!byProduct.has(c.productId)) {
        byProduct.set(c.productId, []);
      }
      byProduct.get(c.productId)!.push(c);
    }

    for (const [productId, productChanges] of byProduct) {
      const parentSku =
        dbVariations.find((v) => v.productId === productId)?.productSku ||
        'Unknown';
      console.log(`   ${parentSku}: ${productChanges.length} sizes`);
      for (const c of productChanges.slice(0, 5)) {
        console.log(`      ${c.details}`);
      }
      if (productChanges.length > 5) {
        console.log(`      ... and ${productChanges.length - 5} more`);
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
    console.log('\n✅ Database is in sync with Neto!');
  }

  console.log('\nDone!');
}

main().catch(console.error);
