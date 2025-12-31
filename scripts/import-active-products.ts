/**
 * Phase F5: Import All Active Products from Neto CSV
 *
 * This script imports NEW products from the Neto CSV export into the database.
 * It creates:
 * - Products (parent products)
 * - Product variations (size/price options)
 * - Product stock records
 * - Product shipping records
 * - Product supplier records
 * - Product SEO records (parent products only)
 *
 * Run with: npx tsx scripts/import-active-products.ts
 *
 * Options:
 *   --dry-run    Show what would be imported without making changes
 *   --fix        Apply all changes to database
 *   --limit=N    Only import first N products (for testing)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync, existsSync, writeFileSync } from 'fs';
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
const limitArg = args.find((a) => a.startsWith('--limit='));
const importLimit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

if (!isDryRun && !shouldFix) {
  console.log('Use --dry-run to preview changes or --fix to apply them');
  process.exit(0);
}

// ============================================
// Brand mapping from Neto CSV to DB brand slugs
// ============================================
const BRAND_MAPPING: Record<string, string> = {
  'Orbit Couplings': 'orbit',
  'Straub Couplings': 'straub',
  'Teekay Couplings': 'teekay',
  // Map valve/strainer brands to a generic brand or create new ones
};

// Category mapping from Neto category strings to DB category slugs
const CATEGORY_MAPPING: Record<string, string> = {
  'Industrial Valves': 'valves',
  'Ball Check Valve': 'valves',
  'Butterfly Valve': 'valves',
  'Gate Valve': 'valves',
  'Knife Gate Valve': 'valves',
  'Swing Check Valve': 'valves',
  'Float Valve': 'valves',
  'Pinch Valve': 'valves',
  'Duckbill Check Valve': 'valves',
  'Dual Plate Check Valve': 'valves',
  'Basket Strainer': 'strainers',
  'Y Strainer': 'strainers',
  'Suction Strainer': 'strainers',
  'Duplex Strainer': 'strainers',
  'Simplex Strainer': 'strainers',
  'Rubber Expansion Joint': 'rubber-expansion-joints',
  'Expansion Joint': 'rubber-expansion-joints',
  'Pipe Coupling': 'pipe-couplings',
  'Pipe Repair': 'pipe-repair-clamps',
  'Repair Clamp': 'pipe-repair-clamps',
  'Muff Coupling': 'pipe-couplings',
  'Flange Adapter': 'flange-adaptors',
  'Control Rod': 'rubber-expansion-joints',
  'Foot Valve': 'valves',
};

interface CsvRow {
  [key: string]: string;
}

interface DbBrand {
  id: number;
  slug: string;
  name: string;
}

interface DbCategory {
  id: number;
  slug: string;
  name: string;
}

interface DbProduct {
  id: number;
  sku: string;
}

// ============================================
// Parse value by type
// ============================================
function parseValue(value: string | undefined, type: string): any {
  if (!value || value.trim() === '') return null;

  switch (type) {
    case 'decimal':
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    case 'integer':
      const int = parseInt(value, 10);
      return isNaN(int) ? null : int;
    case 'boolean':
      return value.toLowerCase() === 'y' || value.toLowerCase() === 'true' || value === '1';
    case 'timestamp':
      if (!value || value.trim() === '') return null;
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString();
      } catch {
        return null;
      }
    default:
      return value.trim();
  }
}

// ============================================
// Generate URL slug from product name
// ============================================
function generateSlug(name: string, sku: string): string {
  // Create slug from name, fallback to SKU
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);

  if (!slug || slug.length < 3) {
    slug = sku.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  return slug;
}

// ============================================
// Determine category from Neto category string
// ============================================
function determineCategory(netoCategoryStr: string, productName: string): string {
  // Neto categories are semicolon-separated: "Industrial Valves;Industrial Valves > Ball Check Valve"
  const categories = netoCategoryStr.split(';').map(c => c.trim());

  for (const cat of categories) {
    // Check for subcategory pattern "Parent > Child"
    const parts = cat.split('>').map(p => p.trim());
    const lastPart = parts[parts.length - 1];

    // Check against our mapping
    for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
      if (lastPart.includes(key) || cat.includes(key)) {
        return value;
      }
    }
  }

  // Fallback based on product name
  const nameLower = productName.toLowerCase();
  if (nameLower.includes('valve')) return 'valves';
  if (nameLower.includes('strainer')) return 'strainers';
  if (nameLower.includes('expansion') || nameLower.includes('rubber')) return 'rubber-expansion-joints';
  if (nameLower.includes('coupling') || nameLower.includes('flex grip')) return 'pipe-couplings';
  if (nameLower.includes('repair') || nameLower.includes('clamp')) return 'pipe-repair-clamps';
  if (nameLower.includes('flange')) return 'flange-adaptors';

  // Default
  return 'pipe-couplings';
}

// ============================================
// Determine brand from Neto brand string
// ============================================
function determineBrand(netoBrand: string, productName: string): string {
  // Direct mapping
  if (BRAND_MAPPING[netoBrand]) {
    return BRAND_MAPPING[netoBrand];
  }

  // Check product name for brand indicators
  const nameLower = productName.toLowerCase();
  if (nameLower.includes('orbit') || nameLower.includes('flex grip') || nameLower.includes('flex-grip')) {
    return 'orbit';
  }
  if (nameLower.includes('straub')) {
    return 'straub';
  }
  if (nameLower.includes('teekay')) {
    return 'teekay';
  }

  // Default to orbit for unknown brands
  return 'orbit';
}

// ============================================
// Parse CSV and organize data
// ============================================
function parseNetoCsv(): { parents: CsvRow[]; variationsByParent: Map<string, CsvRow[]> } {
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
  }) as CsvRow[];

  const parents: CsvRow[] = [];
  const variationsByParent = new Map<string, CsvRow[]>();

  for (const row of records) {
    const sku = row['SKU*']?.trim();
    if (!sku) continue;

    const active = row['Active']?.toLowerCase() === 'y';
    if (!active) continue;

    const parentSku = row['Parent SKU']?.trim();

    if (!parentSku || parentSku === '') {
      // This is a parent product
      parents.push(row);
    } else {
      // This is a variation
      if (!variationsByParent.has(parentSku)) {
        variationsByParent.set(parentSku, []);
      }
      variationsByParent.get(parentSku)!.push(row);
    }
  }

  console.log(`   Found ${parents.length} active parent products`);
  console.log(`   Found ${variationsByParent.size} parents with variations`);
  console.log(`   Total variations: ${Array.from(variationsByParent.values()).reduce((sum, arr) => sum + arr.length, 0)}`);

  return { parents, variationsByParent };
}

// ============================================
// Get existing products to avoid duplicates
// ============================================
async function getExistingProducts(): Promise<Set<string>> {
  console.log('\n🗄️  Checking existing products in database...');

  const results = await sql`SELECT sku FROM products` as Array<{ sku: string }>;
  const skus = new Set(results.map(r => r.sku));

  console.log(`   Found ${skus.size} existing products`);
  return skus;
}

// ============================================
// Get brand and category IDs
// ============================================
async function getBrands(): Promise<Map<string, DbBrand>> {
  const results = await sql`SELECT id, slug, name FROM brands` as DbBrand[];
  const map = new Map<string, DbBrand>();
  for (const r of results) {
    map.set(r.slug, r);
  }
  console.log(`   Brands: ${Array.from(map.keys()).join(', ')}`);
  return map;
}

async function getCategories(): Promise<Map<string, DbCategory>> {
  const results = await sql`SELECT id, slug, name FROM categories` as DbCategory[];
  const map = new Map<string, DbCategory>();
  for (const r of results) {
    map.set(r.slug, r);
  }
  console.log(`   Categories: ${Array.from(map.keys()).join(', ')}`);
  return map;
}

// ============================================
// Import a single product with all related data
// ============================================
async function importProduct(
  row: CsvRow,
  variations: CsvRow[],
  brands: Map<string, DbBrand>,
  categories: Map<string, DbCategory>,
  existingSlugs: Set<string>
): Promise<{ success: boolean; productId?: number; error?: string }> {
  const sku = row['SKU*']?.trim();
  const name = row['Name']?.trim() || `Product ${sku}`;
  const netoBrand = row['Brand']?.trim() || '';
  const netoCategory = row['Category']?.trim() || '';

  // Determine brand and category
  const brandSlug = determineBrand(netoBrand, name);
  const categorySlug = determineCategory(netoCategory, name);

  const brand = brands.get(brandSlug);
  const category = categories.get(categorySlug);

  if (!brand) {
    return { success: false, error: `Unknown brand: ${brandSlug} (from "${netoBrand}")` };
  }
  if (!category) {
    return { success: false, error: `Unknown category: ${categorySlug} (from "${netoCategory}")` };
  }

  // Generate unique slug
  let slug = generateSlug(name, sku);
  let slugSuffix = 0;
  while (existingSlugs.has(slug)) {
    slugSuffix++;
    slug = `${generateSlug(name, sku)}-${slugSuffix}`;
  }
  existingSlugs.add(slug);

  // Parse product fields
  const description = row['Description']?.trim() || name;
  const priceDefault = parseValue(row['Price (Default)'], 'decimal');
  const costPrice = parseValue(row['Cost Price'], 'decimal');
  const rrp = parseValue(row['RRP'], 'decimal');
  const isQuoteOnly = parseValue(row['Enquire Now'], 'boolean') || false;
  const handlingTimeDays = parseValue(row['Handling Time (days)'], 'integer');
  const leadTimeText = row['Lead Time']?.trim() || null;
  const taxFree = parseValue(row['Tax Free Item'], 'boolean') || false;
  const priceA = parseValue(row['Price (A)'], 'decimal');
  const priceB = parseValue(row['Price (B)'], 'decimal');
  const priceC = parseValue(row['Price (C)'], 'decimal');
  const priceD = parseValue(row['Price (D)'], 'decimal');
  const priceE = parseValue(row['Price (E)'], 'decimal');
  const priceF = parseValue(row['Price (F)'], 'decimal');
  const subtitle = row['Subtitle']?.trim() || null;

  // Determine if price varies (has variations with different prices)
  const priceVaries = variations.length > 0;

  try {
    // Insert product
    const productResult = await sql`
      INSERT INTO products (
        slug, sku, name, short_name, subtitle, brand_id, category_id,
        description, price_varies, base_price, is_active,
        is_quote_only, handling_time_days, lead_time_text,
        cost_price, rrp, tax_free,
        price_a, price_b, price_c, price_d, price_e, price_f,
        created_at, updated_at
      ) VALUES (
        ${slug}, ${sku}, ${name}, ${name.substring(0, 50)}, ${subtitle},
        ${brand.id}, ${category.id},
        ${description}, ${priceVaries}, ${priceDefault},
        true, ${isQuoteOnly}, ${handlingTimeDays}, ${leadTimeText},
        ${costPrice}, ${rrp}, ${taxFree},
        ${priceA}, ${priceB}, ${priceC}, ${priceD}, ${priceE}, ${priceF},
        NOW(), NOW()
      )
      RETURNING id
    ` as Array<{ id: number }>;

    const productId = productResult[0].id;

    // Insert variations
    for (let i = 0; i < variations.length; i++) {
      const v = variations[i];
      const vSku = v['SKU*']?.trim();
      const vName = v['Name']?.trim() || '';
      const vPrice = parseValue(v['Price (Default)'], 'decimal');

      // Extract size from SKU or name
      // Common patterns: PARENTSKU_100, PARENTSKU-100mm, etc.
      let size = vSku.replace(sku, '').replace(/^[_-]/, '').trim();
      if (!size || size.length < 1) {
        // Try to extract from name
        const sizeMatch = vName.match(/(\d+(?:\.\d+)?)\s*(?:mm|inch|")/i);
        size = sizeMatch ? sizeMatch[1] + 'mm' : `Size ${i + 1}`;
      }

      const label = vName || `${size} ${name}`;

      await sql`
        INSERT INTO product_variations (product_id, size, label, price, sku, source, display_order)
        VALUES (${productId}, ${size}, ${label.substring(0, 200)}, ${vPrice}, ${vSku}, 'neto', ${i})
      `;
    }

    // Insert stock record
    const qtyInStock = parseValue(row['Qty In Stock (DE Water Products)'], 'integer') || 0;
    const incomingQty = parseValue(row['Incoming Qty'], 'integer') || 0;
    const preorderQty = parseValue(row['Preorder Qty'], 'integer') || 0;
    const expectedArrival = parseValue(row['Date Of Arrival'], 'timestamp');

    await sql`
      INSERT INTO product_stock (product_id, qty_in_stock, incoming_qty, preorder_qty, expected_arrival, last_updated_at)
      VALUES (${productId}, ${qtyInStock}, ${incomingQty}, ${preorderQty}, ${expectedArrival}, NOW())
    `;

    // Insert shipping record
    const weightKg = parseValue(row['Weight (shipping)'], 'decimal');
    const heightCm = parseValue(row['Height (Shipping)'], 'decimal');
    const widthCm = parseValue(row['Width (Shipping)'], 'decimal');
    const lengthCm = parseValue(row['Length (Shipping)'], 'decimal');
    const cubicM3 = parseValue(row['Cubic (Shipping)'], 'decimal');
    const shippingCategory = row['Shipping Category']?.trim() || null;
    const pickZone = row['Pick Zone']?.trim() || null;
    const unitOfMeasure = row['Selling Unit of Measure']?.trim() || 'ea';

    if (weightKg || heightCm || widthCm || lengthCm) {
      await sql`
        INSERT INTO product_shipping (product_id, weight_kg, height_cm, width_cm, length_cm, cubic_m3, shipping_category, pick_zone, unit_of_measure)
        VALUES (${productId}, ${weightKg}, ${heightCm}, ${widthCm}, ${lengthCm}, ${cubicM3}, ${shippingCategory}, ${pickZone}, ${unitOfMeasure})
      `;
    }

    // Insert supplier record
    const primarySupplier = row['Primary Supplier']?.trim() || null;
    const supplierItemCode = row['Supplier Item Code']?.trim() || null;
    const supplierProductName = row['Supplier Product Name']?.trim() || null;
    const purchasePrice = parseValue(row['Default Purchase Price'], 'decimal');

    if (primarySupplier || supplierItemCode) {
      await sql`
        INSERT INTO product_supplier (product_id, primary_supplier, supplier_item_code, supplier_product_name, purchase_price)
        VALUES (${productId}, ${primarySupplier}, ${supplierItemCode}, ${supplierProductName}, ${purchasePrice})
      `;
    }

    // Insert SEO record
    const metaKeywords = row['SEO Meta Keywords']?.trim() || null;
    const metaDescription = row['SEO Meta Description']?.trim() || null;
    const pageTitle = row['SEO Page Title']?.trim() || null;

    if (metaKeywords || metaDescription || pageTitle) {
      await sql`
        INSERT INTO product_seo (product_id, meta_keywords, meta_description, page_title)
        VALUES (${productId}, ${metaKeywords}, ${metaDescription}, ${pageTitle})
      `;
    }

    return { success: true, productId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Main
// ============================================
async function main() {
  console.log('='.repeat(60));
  console.log('PHASE F5: IMPORT ALL ACTIVE PRODUCTS FROM NETO CSV');
  console.log('='.repeat(60));

  console.log(`Mode: ${shouldFix ? 'FIX (applying changes)' : 'DRY RUN (preview only)'}`);
  if (importLimit) {
    console.log(`Limit: ${importLimit} products`);
  }

  // Load reference data
  const brands = await getBrands();
  const categories = await getCategories();
  const existingSkus = await getExistingProducts();
  const existingSlugs = new Set<string>();

  // Get existing slugs
  const slugResults = await sql`SELECT slug FROM products` as Array<{ slug: string }>;
  for (const r of slugResults) {
    existingSlugs.add(r.slug);
  }

  // Parse CSV
  const { parents, variationsByParent } = parseNetoCsv();

  // Filter out already-imported products
  const newParents = parents.filter(p => !existingSkus.has(p['SKU*']?.trim()));
  console.log(`\n📊 Products to import: ${newParents.length} (${parents.length - newParents.length} already exist)`);

  // Apply limit if specified
  const toImport = importLimit ? newParents.slice(0, importLimit) : newParents;

  if (isDryRun) {
    console.log('\n📋 Products that would be imported:\n');
    for (const p of toImport.slice(0, 20)) {
      const sku = p['SKU*']?.trim();
      const name = p['Name']?.trim().substring(0, 50);
      const brand = p['Brand']?.trim().substring(0, 20);
      const variations = variationsByParent.get(sku)?.length || 0;
      console.log(`   ${sku.padEnd(20)} | ${brand.padEnd(20)} | ${name} (${variations} variations)`);
    }
    if (toImport.length > 20) {
      console.log(`   ... and ${toImport.length - 20} more`);
    }

    // Show category/brand distribution
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    for (const p of toImport) {
      const brand = determineBrand(p['Brand']?.trim() || '', p['Name']?.trim() || '');
      const category = determineCategory(p['Category']?.trim() || '', p['Name']?.trim() || '');
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    console.log('\n📊 By Brand:');
    for (const [brand, count] of Object.entries(brandCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${brand}: ${count}`);
    }

    console.log('\n📊 By Category:');
    for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${cat}: ${count}`);
    }

    console.log('\n💡 Run with --fix to apply these changes');
    return;
  }

  // Import products
  console.log('\n🚀 Importing products...\n');

  let imported = 0;
  let failed = 0;
  const errors: Array<{ sku: string; error: string }> = [];

  for (let i = 0; i < toImport.length; i++) {
    const p = toImport[i];
    const sku = p['SKU*']?.trim();
    const variations = variationsByParent.get(sku) || [];

    const result = await importProduct(p, variations, brands, categories, existingSlugs);

    if (result.success) {
      imported++;
      if (imported % 10 === 0 || imported === toImport.length) {
        process.stdout.write(`\r   Imported ${imported}/${toImport.length} products...`);
      }
    } else {
      failed++;
      errors.push({ sku, error: result.error || 'Unknown error' });
    }
  }

  console.log('\n');

  // Summary
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n   ✓ Products imported:    ${imported}`);
  console.log(`   ✗ Products failed:      ${failed}`);
  console.log(`   Total variations:       ${Array.from(variationsByParent.entries())
    .filter(([sku]) => toImport.some(p => p['SKU*']?.trim() === sku))
    .reduce((sum, [, arr]) => sum + arr.length, 0)}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const e of errors.slice(0, 10)) {
      console.log(`   ${e.sku}: ${e.error}`);
    }
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more errors`);
    }

    // Write errors to file
    writeFileSync(
      'import-errors.json',
      JSON.stringify(errors, null, 2)
    );
    console.log('\n   Full error list saved to: import-errors.json');
  }

  console.log('\n✅ Import complete!');
}

main().catch(console.error);
