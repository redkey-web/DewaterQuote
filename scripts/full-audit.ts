/**
 * Full Product & Price Audit
 * Compares: Neto CSV export vs catalog.ts vs Database
 *
 * Run with: npx tsx scripts/full-audit.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { neon } from '@neondatabase/serverless';
import { parse } from 'csv-parse/sync';

// Types
interface NetoProduct {
  sku: string;
  parentSku: string;
  name: string;
  price: number;
  active: boolean;
  size: string;
  category: string;
}

interface CatalogProduct {
  sku: string;
  name: string;
  variations: Array<{
    sku: string;
    size: string;
    price: number;
  }>;
}

interface DatabaseProduct {
  sku: string;
  price: number;
  productSku: string;
  size: string;
}

interface Discrepancy {
  sku: string;
  type: 'price_mismatch' | 'missing_in_catalog' | 'missing_in_neto' | 'missing_in_db' | 'missing_size';
  netoPrice?: number;
  catalogPrice?: number;
  dbPrice?: number;
  details: string;
}

// ============================================
// PHASE 1: Parse Neto CSV
// ============================================
function parseNetoCsv(filePath: string): Map<string, NetoProduct> {
  console.log('\n📦 Parsing Neto CSV export...');

  if (!existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const csvContent = readFileSync(filePath, 'utf-8');
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
    const approved = row['Approved']?.toLowerCase() === 'y';

    // Only include active products
    if (!active) continue;

    const price = parseFloat(row['Price (Default)'] || '0');
    const parentSku = row['Parent SKU']?.trim() || '';
    const name = row['Name']?.trim() || '';
    const size = row['Specific Value 1']?.trim() || '';
    const category = row['Category']?.trim() || '';

    products.set(sku, {
      sku,
      parentSku,
      name,
      price,
      active,
      size,
      category,
    });
  }

  console.log(`   Found ${products.size} active products in Neto`);
  return products;
}

// ============================================
// PHASE 2: Parse catalog.ts
// ============================================
function parseCatalog(): Map<string, CatalogProduct> {
  console.log('\n📂 Parsing catalog.ts...');

  // Dynamic import of catalog
  const catalogPath = '../src/data/catalog.ts';

  // Read catalog.ts and extract products
  const catalogContent = readFileSync('./src/data/catalog.ts', 'utf-8');

  // Extract product data using regex (simpler than full TS parsing)
  const products = new Map<string, CatalogProduct>();

  // Match product blocks
  const productRegex = /{\s*id:\s*["']([^"']+)["'][\s\S]*?sku:\s*["']([^"']+)["'][\s\S]*?name:\s*["']([^"']+)["'][\s\S]*?sizeOptions:\s*\[([\s\S]*?)\]/g;

  let match;
  while ((match = productRegex.exec(catalogContent)) !== null) {
    const [, id, sku, name, sizeOptionsStr] = match;

    // Parse size options
    const variations: Array<{ sku: string; size: string; price: number }> = [];
    const sizeRegex = /{\s*value:\s*["']([^"']+)["'][^}]*?price:\s*(\d+(?:\.\d+)?)[^}]*?sku:\s*["']([^"']+)["']/g;

    let sizeMatch;
    while ((sizeMatch = sizeRegex.exec(sizeOptionsStr)) !== null) {
      const [, size, price, varSku] = sizeMatch;
      variations.push({
        sku: varSku,
        size,
        price: parseFloat(price),
      });
    }

    products.set(sku, {
      sku,
      name,
      variations,
    });
  }

  let totalVariations = 0;
  products.forEach(p => totalVariations += p.variations.length);

  console.log(`   Found ${products.size} products with ${totalVariations} variations in catalog.ts`);
  return products;
}

// ============================================
// PHASE 3: Query Database
// ============================================
async function queryDatabase(): Promise<Map<string, DatabaseProduct>> {
  console.log('\n🗄️  Querying database...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }

  const sql = neon(process.env.DATABASE_URL);

  const results = await sql`
    SELECT
      pv.sku,
      pv.price,
      pv.size,
      p.sku as product_sku
    FROM product_variations pv
    JOIN products p ON pv.product_id = p.id
    ORDER BY pv.sku
  `;

  const products = new Map<string, DatabaseProduct>();

  for (const row of results) {
    products.set(row.sku, {
      sku: row.sku,
      price: parseFloat(row.price || '0'),
      productSku: row.product_sku,
      size: row.size || '',
    });
  }

  console.log(`   Found ${products.size} variations in database`);
  return products;
}

// ============================================
// PHASE 4: Cross-Check
// ============================================
function crossCheck(
  netoProducts: Map<string, NetoProduct>,
  catalogProducts: Map<string, CatalogProduct>,
  dbProducts: Map<string, DatabaseProduct>
): Discrepancy[] {
  console.log('\n🔍 Cross-checking all sources...');

  const discrepancies: Discrepancy[] = [];

  // Build a flat map of catalog variations
  const catalogVariations = new Map<string, { price: number; parentSku: string; size: string }>();
  catalogProducts.forEach((product, parentSku) => {
    product.variations.forEach(v => {
      catalogVariations.set(v.sku, {
        price: v.price,
        parentSku,
        size: v.size,
      });
    });
  });

  // Check each Neto product
  for (const [sku, netoProduct] of netoProducts) {
    const catalogVar = catalogVariations.get(sku);
    const dbProduct = dbProducts.get(sku);

    // Skip parent SKUs (no price, used for grouping)
    if (!netoProduct.parentSku && netoProduct.price === 0) continue;

    // Check if in catalog
    if (!catalogVar) {
      // Check if parent exists in catalog
      const parentInCatalog = catalogProducts.has(netoProduct.parentSku);
      if (parentInCatalog) {
        discrepancies.push({
          sku,
          type: 'missing_size',
          netoPrice: netoProduct.price,
          details: `Size "${netoProduct.size}" missing from ${netoProduct.parentSku} in catalog.ts`,
        });
      } else if (netoProduct.parentSku) {
        discrepancies.push({
          sku,
          type: 'missing_in_catalog',
          netoPrice: netoProduct.price,
          details: `Product ${netoProduct.parentSku} not in catalog.ts (${netoProduct.name})`,
        });
      }
      continue;
    }

    // Check if in database
    if (!dbProduct) {
      discrepancies.push({
        sku,
        type: 'missing_in_db',
        netoPrice: netoProduct.price,
        catalogPrice: catalogVar.price,
        details: `SKU ${sku} not in database`,
      });
      continue;
    }

    // Check price matches
    const priceDiff = Math.abs(netoProduct.price - catalogVar.price);
    if (priceDiff > 0.01) {
      discrepancies.push({
        sku,
        type: 'price_mismatch',
        netoPrice: netoProduct.price,
        catalogPrice: catalogVar.price,
        dbPrice: dbProduct.price,
        details: `Catalog: $${catalogVar.price} vs Neto: $${netoProduct.price} (${((netoProduct.price - catalogVar.price) / catalogVar.price * 100).toFixed(1)}% diff)`,
      });
    }

    // Check DB price matches Neto
    const dbPriceDiff = Math.abs(netoProduct.price - dbProduct.price);
    if (dbPriceDiff > 0.01 && priceDiff <= 0.01) {
      discrepancies.push({
        sku,
        type: 'price_mismatch',
        netoPrice: netoProduct.price,
        catalogPrice: catalogVar.price,
        dbPrice: dbProduct.price,
        details: `DB: $${dbProduct.price} vs Neto: $${netoProduct.price} (catalog correct, DB needs update)`,
      });
    }
  }

  // Check catalog items not in Neto
  for (const [parentSku, product] of catalogProducts) {
    for (const variation of product.variations) {
      if (!netoProducts.has(variation.sku)) {
        discrepancies.push({
          sku: variation.sku,
          type: 'missing_in_neto',
          catalogPrice: variation.price,
          details: `SKU ${variation.sku} in catalog but not found in Neto export`,
        });
      }
    }
  }

  return discrepancies;
}

// ============================================
// PHASE 5: Generate Report
// ============================================
function generateReport(
  discrepancies: Discrepancy[],
  netoProducts: Map<string, NetoProduct>,
  catalogProducts: Map<string, CatalogProduct>,
  dbProducts: Map<string, DatabaseProduct>
): void {
  console.log('\n📊 Generating report...');

  // Group discrepancies by type
  const byType = {
    price_mismatch: discrepancies.filter(d => d.type === 'price_mismatch'),
    missing_size: discrepancies.filter(d => d.type === 'missing_size'),
    missing_in_catalog: discrepancies.filter(d => d.type === 'missing_in_catalog'),
    missing_in_neto: discrepancies.filter(d => d.type === 'missing_in_neto'),
    missing_in_db: discrepancies.filter(d => d.type === 'missing_in_db'),
  };

  // Calculate catalog stats
  let catalogVariations = 0;
  catalogProducts.forEach(p => catalogVariations += p.variations.length);

  // Console output
  console.log('\n' + '='.repeat(70));
  console.log('AUDIT RESULTS');
  console.log('='.repeat(70));

  console.log('\n📈 Summary:');
  console.log(`   Neto active products:     ${netoProducts.size}`);
  console.log(`   Catalog products:         ${catalogProducts.size} (${catalogVariations} variations)`);
  console.log(`   Database variations:      ${dbProducts.size}`);
  console.log(`   Total discrepancies:      ${discrepancies.length}`);

  console.log('\n📋 Discrepancies by type:');
  console.log(`   Price mismatches:         ${byType.price_mismatch.length}`);
  console.log(`   Missing sizes:            ${byType.missing_size.length}`);
  console.log(`   Missing in catalog:       ${byType.missing_in_catalog.length}`);
  console.log(`   Missing in Neto:          ${byType.missing_in_neto.length}`);
  console.log(`   Missing in database:      ${byType.missing_in_db.length}`);

  // Price mismatches (most critical)
  if (byType.price_mismatch.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('❌ PRICE MISMATCHES (need fixing):');
    console.log('-'.repeat(70));
    console.log('SKU'.padEnd(25) + 'Catalog'.padStart(12) + 'Neto'.padStart(12) + 'DB'.padStart(12) + '  Diff');
    console.log('-'.repeat(70));

    for (const d of byType.price_mismatch.slice(0, 30)) {
      const diff = d.netoPrice && d.catalogPrice
        ? `${d.netoPrice > d.catalogPrice ? '+' : ''}${((d.netoPrice - d.catalogPrice) / d.catalogPrice * 100).toFixed(0)}%`
        : '';
      console.log(
        d.sku.padEnd(25) +
        `$${d.catalogPrice?.toFixed(0) || 'N/A'}`.padStart(12) +
        `$${d.netoPrice?.toFixed(0) || 'N/A'}`.padStart(12) +
        `$${d.dbPrice?.toFixed(0) || 'N/A'}`.padStart(12) +
        `  ${diff}`
      );
    }
    if (byType.price_mismatch.length > 30) {
      console.log(`... and ${byType.price_mismatch.length - 30} more`);
    }
  }

  // Missing sizes
  if (byType.missing_size.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('⚠️  MISSING SIZES (in Neto but not in catalog):');
    console.log('-'.repeat(70));

    // Group by parent SKU
    const byParent = new Map<string, Discrepancy[]>();
    for (const d of byType.missing_size) {
      const parent = netoProducts.get(d.sku)?.parentSku || 'unknown';
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent)!.push(d);
    }

    for (const [parent, items] of byParent) {
      console.log(`\n${parent}:`);
      for (const d of items) {
        const size = netoProducts.get(d.sku)?.size || '';
        console.log(`   ${d.sku.padEnd(20)} ${size.padEnd(15)} $${d.netoPrice?.toFixed(0)}`);
      }
    }
  }

  // Missing in catalog (whole products)
  if (byType.missing_in_catalog.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('📦 PRODUCTS IN NETO BUT NOT IN CATALOG:');
    console.log('-'.repeat(70));

    // Group by parent
    const parents = new Set<string>();
    for (const d of byType.missing_in_catalog) {
      const parent = netoProducts.get(d.sku)?.parentSku;
      if (parent) parents.add(parent);
    }

    console.log(`${parents.size} product families not in catalog:`);
    let count = 0;
    for (const parent of parents) {
      if (count++ >= 20) {
        console.log(`... and ${parents.size - 20} more`);
        break;
      }
      const sample = netoProducts.get([...netoProducts.values()].find(p => p.parentSku === parent)?.sku || '');
      console.log(`   ${parent.padEnd(20)} ${sample?.name?.substring(0, 45) || ''}`);
    }
  }

  // Save detailed JSON report
  const reportData = {
    generated: new Date().toISOString(),
    summary: {
      netoProducts: netoProducts.size,
      catalogProducts: catalogProducts.size,
      catalogVariations,
      dbProducts: dbProducts.size,
      totalDiscrepancies: discrepancies.length,
    },
    discrepanciesByType: {
      priceMismatch: byType.price_mismatch.length,
      missingSize: byType.missing_size.length,
      missingInCatalog: byType.missing_in_catalog.length,
      missingInNeto: byType.missing_in_neto.length,
      missingInDb: byType.missing_in_db.length,
    },
    discrepancies,
  };

  writeFileSync('.planning/audit/audit-results.json', JSON.stringify(reportData, null, 2));
  console.log('\n✅ Detailed report saved to .planning/audit/audit-results.json');
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('='.repeat(70));
  console.log('FULL PRODUCT & PRICE AUDIT');
  console.log('='.repeat(70));
  console.log('Comparing: Neto CSV → catalog.ts → Database');

  try {
    // Phase 1: Parse Neto CSV
    const netoProducts = parseNetoCsv('.planning/audit/neto-export.csv');

    // Phase 2: Parse catalog.ts
    const catalogProducts = parseCatalog();

    // Phase 3: Query database
    const dbProducts = await queryDatabase();

    // Phase 4: Cross-check
    const discrepancies = crossCheck(netoProducts, catalogProducts, dbProducts);

    // Phase 5: Generate report
    generateReport(discrepancies, netoProducts, catalogProducts, dbProducts);

    console.log('\n✅ Audit complete!');

    if (discrepancies.length > 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Review price mismatches - run: npx tsx scripts/neto-price-check.ts --fix');
      console.log('   2. Add missing sizes to catalog.ts');
      console.log('   3. Re-run seed script or update database directly');
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
