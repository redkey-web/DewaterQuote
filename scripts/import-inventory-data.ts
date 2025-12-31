/**
 * Import Inventory Data from Neto CSV Export
 *
 * Phase F4: One-time migration of additional fields into new tables
 *
 * This script imports data into:
 * - products table (new fields: costPrice, rrp, isQuoteOnly, etc.)
 * - product_stock table (qty, incoming, preorder, etc.)
 * - product_shipping table (weight, dimensions, etc.)
 * - product_supplier table (supplier info)
 * - product_seo table (meta keywords, description, title)
 *
 * Run with: npx tsx scripts/import-inventory-data.ts
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

// Field mapping from Neto CSV to our schema
const FIELD_MAPPING = {
  // Products table - pricing
  'Cost Price': { table: 'products', field: 'cost_price', type: 'decimal' },
  'RRP': { table: 'products', field: 'rrp', type: 'decimal' },
  'Promotion Price': { table: 'products', field: 'promotion_price', type: 'decimal' },
  'Promotion Start Date': { table: 'products', field: 'promotion_start_date', type: 'timestamp' },
  'Promotion Expiry Date': { table: 'products', field: 'promotion_end_date', type: 'timestamp' },
  'Promotion ID': { table: 'products', field: 'promotion_id', type: 'text' },

  // Products table - availability
  'Enquire Now': { table: 'products', field: 'is_quote_only', type: 'boolean' },
  'Handling Time (days)': { table: 'products', field: 'handling_time_days', type: 'integer' },
  'Lead Time': { table: 'products', field: 'lead_time_text', type: 'text' },

  // Products table - tax
  'Tax Free Item': { table: 'products', field: 'tax_free', type: 'boolean' },
  'Tax Category': { table: 'products', field: 'tax_category', type: 'text' },

  // Products table - price tiers
  'Price (A)': { table: 'products', field: 'price_a', type: 'decimal' },
  'Price (B)': { table: 'products', field: 'price_b', type: 'decimal' },
  'Price (C)': { table: 'products', field: 'price_c', type: 'decimal' },
  'Price (D)': { table: 'products', field: 'price_d', type: 'decimal' },
  'Price (E)': { table: 'products', field: 'price_e', type: 'decimal' },
  'Price (F)': { table: 'products', field: 'price_f', type: 'decimal' },

  // Products table - other
  'Virtual': { table: 'products', field: 'is_virtual', type: 'boolean' },
  'Service Item': { table: 'products', field: 'is_service', type: 'boolean' },
  'Custom Label/Code': { table: 'products', field: 'custom_code', type: 'text' },
  'Subtitle': { table: 'products', field: 'subtitle', type: 'text' },

  // Stock table
  'Qty In Stock (DE Water Products)': { table: 'product_stock', field: 'qty_in_stock', type: 'integer' },
  'Incoming Qty': { table: 'product_stock', field: 'incoming_qty', type: 'integer' },
  'Preorder Qty': { table: 'product_stock', field: 'preorder_qty', type: 'integer' },
  'Date Of Arrival': { table: 'product_stock', field: 'expected_arrival', type: 'timestamp' },

  // Shipping table
  'Weight (shipping)': { table: 'product_shipping', field: 'weight_kg', type: 'decimal' },
  'Height (Shipping)': { table: 'product_shipping', field: 'height_cm', type: 'decimal' },
  'Width (Shipping)': { table: 'product_shipping', field: 'width_cm', type: 'decimal' },
  'Length (Shipping)': { table: 'product_shipping', field: 'length_cm', type: 'decimal' },
  'Cubic (Shipping)': { table: 'product_shipping', field: 'cubic_m3', type: 'decimal' },
  'Shipping Category': { table: 'product_shipping', field: 'shipping_category', type: 'text' },
  'Pick Zone': { table: 'product_shipping', field: 'pick_zone', type: 'text' },
  'Selling Unit of Measure': { table: 'product_shipping', field: 'unit_of_measure', type: 'text' },

  // Supplier table
  'Primary Supplier': { table: 'product_supplier', field: 'primary_supplier', type: 'text' },
  'Supplier Item Code': { table: 'product_supplier', field: 'supplier_item_code', type: 'text' },
  'Supplier Product Name': { table: 'product_supplier', field: 'supplier_product_name', type: 'text' },
  'Default Purchase Price': { table: 'product_supplier', field: 'purchase_price', type: 'decimal' },

  // SEO table (parent products only)
  'SEO Meta Keywords': { table: 'product_seo', field: 'meta_keywords', type: 'text' },
  'SEO Meta Description': { table: 'product_seo', field: 'meta_description', type: 'text' },
  'SEO Page Title': { table: 'product_seo', field: 'page_title', type: 'text' },
} as const;

interface CsvRow {
  [key: string]: string;
}

interface DbProduct {
  id: number;
  sku: string;
  name: string;
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
      // Neto format: DD/MM/YYYY or YYYY-MM-DD
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
// Parse Neto CSV
// ============================================
function parseNetoCsv(): Map<string, CsvRow> {
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

  const products = new Map<string, CsvRow>();
  let activeCount = 0;
  let parentCount = 0;

  for (const row of records) {
    const sku = row['SKU*']?.trim();
    if (!sku) continue;

    const active = row['Active']?.toLowerCase() === 'y';
    if (!active) continue;
    activeCount++;

    const parentSku = row['Parent SKU']?.trim();

    // For parent products (no parent SKU or parent SKU is empty)
    if (!parentSku || parentSku === '') {
      parentCount++;
    }

    products.set(sku, row);
  }

  console.log(`   Found ${products.size} active products`);
  console.log(`   Found ${parentCount} parent products (for SEO import)`);
  return products;
}

// ============================================
// Get DB Products
// ============================================
async function getDbProducts(): Promise<Map<string, DbProduct>> {
  console.log('\n🗄️  Querying database products...');

  let query = `SELECT id, sku, name FROM products WHERE is_active = true`;
  if (filterSku) {
    query += ` AND sku = '${filterSku}'`;
  }

  const results = await sql(query) as Array<{ id: number; sku: string; name: string }>;
  const map = new Map<string, DbProduct>();
  for (const r of results) {
    map.set(r.sku, r);
  }

  console.log(`   Found ${map.size} products in database`);
  return map;
}

// ============================================
// Import to products table
// ============================================
async function importProductFields(
  dbProducts: Map<string, DbProduct>,
  netoData: Map<string, CsvRow>
): Promise<number> {
  console.log('\n📊 Importing product fields...');

  let updates = 0;

  const productFields = Object.entries(FIELD_MAPPING)
    .filter(([, config]) => config.table === 'products');

  for (const [dbSku, product] of dbProducts) {
    // Find matching Neto record - try various SKU formats
    let netoRow = netoData.get(dbSku);

    // Try child SKU pattern
    if (!netoRow) {
      // Look for any child product with this parent SKU
      for (const [sku, row] of netoData) {
        if (row['Parent SKU'] === dbSku || sku === dbSku) {
          netoRow = row;
          break;
        }
      }
    }

    if (!netoRow) {
      console.log(`   ⚠️  No Neto data for ${dbSku}`);
      continue;
    }

    // Build update object
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    for (const [csvField, config] of productFields) {
      const value = parseValue(netoRow[csvField], config.type);
      if (value !== null) {
        updateFields.push(`${config.field} = $${updateValues.length + 1}`);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) continue;

    updateValues.push(product.id);

    if (shouldFix) {
      const updateQuery = `UPDATE products SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${updateValues.length}`;
      await sql(updateQuery, updateValues);
    }

    updates++;
    if (isDryRun && updates <= 10) {
      console.log(`   Would update ${dbSku}: ${updateFields.length} fields`);
    }
  }

  console.log(`   ${shouldFix ? '✓ Updated' : 'Would update'} ${updates} products`);
  return updates;
}

// ============================================
// Import to product_stock table
// ============================================
async function importStockData(
  dbProducts: Map<string, DbProduct>,
  netoData: Map<string, CsvRow>
): Promise<number> {
  console.log('\n📦 Importing stock data...');

  let records = 0;
  const stockFields = Object.entries(FIELD_MAPPING)
    .filter(([, config]) => config.table === 'product_stock');

  for (const [dbSku, product] of dbProducts) {
    let netoRow = netoData.get(dbSku);
    if (!netoRow) {
      for (const [sku, row] of netoData) {
        if (row['Parent SKU'] === dbSku) {
          netoRow = row;
          break;
        }
      }
    }

    if (!netoRow) continue;

    const values: any = { productId: product.id };
    let hasData = false;

    for (const [csvField, config] of stockFields) {
      const value = parseValue(netoRow[csvField], config.type);
      if (value !== null) {
        values[config.field] = value;
        hasData = true;
      }
    }

    if (!hasData) continue;

    if (shouldFix) {
      // Upsert: check if exists first
      const existing = await sql`SELECT id FROM product_stock WHERE product_id = ${product.id}`;

      if (existing.length > 0) {
        await sql`
          UPDATE product_stock SET
            qty_in_stock = ${values.qty_in_stock ?? null},
            incoming_qty = ${values.incoming_qty ?? null},
            preorder_qty = ${values.preorder_qty ?? null},
            expected_arrival = ${values.expected_arrival ?? null},
            last_updated_at = NOW()
          WHERE product_id = ${product.id}
        `;
      } else {
        await sql`
          INSERT INTO product_stock (product_id, qty_in_stock, incoming_qty, preorder_qty, expected_arrival, last_updated_at)
          VALUES (${product.id}, ${values.qty_in_stock ?? 0}, ${values.incoming_qty ?? 0}, ${values.preorder_qty ?? 0}, ${values.expected_arrival ?? null}, NOW())
        `;
      }
    }

    records++;
  }

  console.log(`   ${shouldFix ? '✓ Imported' : 'Would import'} ${records} stock records`);
  return records;
}

// ============================================
// Import to product_shipping table
// ============================================
async function importShippingData(
  dbProducts: Map<string, DbProduct>,
  netoData: Map<string, CsvRow>
): Promise<number> {
  console.log('\n🚚 Importing shipping data...');

  let records = 0;
  const shippingFields = Object.entries(FIELD_MAPPING)
    .filter(([, config]) => config.table === 'product_shipping');

  for (const [dbSku, product] of dbProducts) {
    let netoRow = netoData.get(dbSku);
    if (!netoRow) {
      for (const [sku, row] of netoData) {
        if (row['Parent SKU'] === dbSku) {
          netoRow = row;
          break;
        }
      }
    }

    if (!netoRow) continue;

    const values: any = { productId: product.id };
    let hasData = false;

    for (const [csvField, config] of shippingFields) {
      const value = parseValue(netoRow[csvField], config.type);
      if (value !== null) {
        values[config.field] = value;
        hasData = true;
      }
    }

    if (!hasData) continue;

    if (shouldFix) {
      const existing = await sql`SELECT id FROM product_shipping WHERE product_id = ${product.id}`;

      if (existing.length > 0) {
        await sql`
          UPDATE product_shipping SET
            weight_kg = ${values.weight_kg ?? null},
            height_cm = ${values.height_cm ?? null},
            width_cm = ${values.width_cm ?? null},
            length_cm = ${values.length_cm ?? null},
            cubic_m3 = ${values.cubic_m3 ?? null},
            shipping_category = ${values.shipping_category ?? null},
            pick_zone = ${values.pick_zone ?? null},
            unit_of_measure = ${values.unit_of_measure ?? 'ea'}
          WHERE product_id = ${product.id}
        `;
      } else {
        await sql`
          INSERT INTO product_shipping (product_id, weight_kg, height_cm, width_cm, length_cm, cubic_m3, shipping_category, pick_zone, unit_of_measure)
          VALUES (${product.id}, ${values.weight_kg ?? null}, ${values.height_cm ?? null}, ${values.width_cm ?? null}, ${values.length_cm ?? null}, ${values.cubic_m3 ?? null}, ${values.shipping_category ?? null}, ${values.pick_zone ?? null}, ${values.unit_of_measure ?? 'ea'})
        `;
      }
    }

    records++;
  }

  console.log(`   ${shouldFix ? '✓ Imported' : 'Would import'} ${records} shipping records`);
  return records;
}

// ============================================
// Import to product_supplier table
// ============================================
async function importSupplierData(
  dbProducts: Map<string, DbProduct>,
  netoData: Map<string, CsvRow>
): Promise<number> {
  console.log('\n🏭 Importing supplier data...');

  let records = 0;
  const supplierFields = Object.entries(FIELD_MAPPING)
    .filter(([, config]) => config.table === 'product_supplier');

  for (const [dbSku, product] of dbProducts) {
    let netoRow = netoData.get(dbSku);
    if (!netoRow) {
      for (const [sku, row] of netoData) {
        if (row['Parent SKU'] === dbSku) {
          netoRow = row;
          break;
        }
      }
    }

    if (!netoRow) continue;

    const values: any = { productId: product.id };
    let hasData = false;

    for (const [csvField, config] of supplierFields) {
      const value = parseValue(netoRow[csvField], config.type);
      if (value !== null) {
        values[config.field] = value;
        hasData = true;
      }
    }

    if (!hasData) continue;

    if (shouldFix) {
      const existing = await sql`SELECT id FROM product_supplier WHERE product_id = ${product.id}`;

      if (existing.length > 0) {
        await sql`
          UPDATE product_supplier SET
            primary_supplier = ${values.primary_supplier ?? null},
            supplier_item_code = ${values.supplier_item_code ?? null},
            supplier_product_name = ${values.supplier_product_name ?? null},
            purchase_price = ${values.purchase_price ?? null}
          WHERE product_id = ${product.id}
        `;
      } else {
        await sql`
          INSERT INTO product_supplier (product_id, primary_supplier, supplier_item_code, supplier_product_name, purchase_price)
          VALUES (${product.id}, ${values.primary_supplier ?? null}, ${values.supplier_item_code ?? null}, ${values.supplier_product_name ?? null}, ${values.purchase_price ?? null})
        `;
      }
    }

    records++;
  }

  console.log(`   ${shouldFix ? '✓ Imported' : 'Would import'} ${records} supplier records`);
  return records;
}

// ============================================
// Import to product_seo table (parent products only)
// ============================================
async function importSeoData(
  dbProducts: Map<string, DbProduct>,
  netoData: Map<string, CsvRow>
): Promise<number> {
  console.log('\n🔍 Importing SEO data (parent products only)...');

  let records = 0;
  const seoFields = Object.entries(FIELD_MAPPING)
    .filter(([, config]) => config.table === 'product_seo');

  for (const [dbSku, product] of dbProducts) {
    // For SEO, we only import parent products (products without parent SKU in Neto)
    let netoRow = netoData.get(dbSku);

    // Skip if this is a child product
    if (netoRow && netoRow['Parent SKU'] && netoRow['Parent SKU'].trim() !== '') {
      continue;
    }

    // If not found directly, look for parent in Neto
    if (!netoRow) {
      for (const [sku, row] of netoData) {
        if (sku === dbSku && (!row['Parent SKU'] || row['Parent SKU'].trim() === '')) {
          netoRow = row;
          break;
        }
      }
    }

    if (!netoRow) continue;

    const values: any = { productId: product.id };
    let hasData = false;

    for (const [csvField, config] of seoFields) {
      const value = parseValue(netoRow[csvField], config.type);
      if (value !== null && value !== '') {
        values[config.field] = value;
        hasData = true;
      }
    }

    if (!hasData) continue;

    if (shouldFix) {
      const existing = await sql`SELECT id FROM product_seo WHERE product_id = ${product.id}`;

      if (existing.length > 0) {
        await sql`
          UPDATE product_seo SET
            meta_keywords = ${values.meta_keywords ?? null},
            meta_description = ${values.meta_description ?? null},
            page_title = ${values.page_title ?? null}
          WHERE product_id = ${product.id}
        `;
      } else {
        await sql`
          INSERT INTO product_seo (product_id, meta_keywords, meta_description, page_title)
          VALUES (${product.id}, ${values.meta_keywords ?? null}, ${values.meta_description ?? null}, ${values.page_title ?? null})
        `;
      }
    }

    records++;
  }

  console.log(`   ${shouldFix ? '✓ Imported' : 'Would import'} ${records} SEO records`);
  return records;
}

// ============================================
// Main
// ============================================
async function main() {
  console.log('='.repeat(60));
  console.log('PHASE F4: IMPORT INVENTORY DATA FROM NETO CSV');
  console.log('='.repeat(60));

  if (filterSku) {
    console.log(`Filtering: ${filterSku}`);
  }
  console.log(`Mode: ${shouldFix ? 'FIX (applying changes)' : 'DRY RUN (preview only)'}`);

  // Load data
  const netoData = parseNetoCsv();
  const dbProducts = await getDbProducts();

  // Import to each table
  const productUpdates = await importProductFields(dbProducts, netoData);
  const stockRecords = await importStockData(dbProducts, netoData);
  const shippingRecords = await importShippingData(dbProducts, netoData);
  const supplierRecords = await importSupplierData(dbProducts, netoData);
  const seoRecords = await importSeoData(dbProducts, netoData);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n   Products updated:    ${productUpdates}`);
  console.log(`   Stock records:       ${stockRecords}`);
  console.log(`   Shipping records:    ${shippingRecords}`);
  console.log(`   Supplier records:    ${supplierRecords}`);
  console.log(`   SEO records:         ${seoRecords}`);

  if (isDryRun) {
    console.log('\n💡 Run with --fix to apply these changes');
  } else {
    console.log('\n✅ All data imported successfully!');
  }

  console.log('\nDone!');
}

main().catch(console.error);
