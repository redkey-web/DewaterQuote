/**
 * Compare Neto CSV vs Database variations
 * Shows which products have discrepancies
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { products, productVariations } from '../src/db/schema';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const db = drizzle(neon(connectionString));

async function compare() {
  console.log('Loading Neto CSV...');
  const csvContent = readFileSync('.planning/audit/neto-export.csv', 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  // Count variations per parent SKU in Neto
  const netoCountByParent: Record<string, number> = {};
  for (const row of records) {
    const parentSku = row['Parent SKU']?.trim();
    const active = row['Active']?.toLowerCase() === 'y';
    if (parentSku && active) {
      netoCountByParent[parentSku] = (netoCountByParent[parentSku] || 0) + 1;
    }
  }

  console.log('Loading database...');
  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  const allVariations = await db.select().from(productVariations);

  // Count variations per product in DB
  const dbCountByProduct: Record<number, number> = {};
  for (const v of allVariations) {
    dbCountByProduct[v.productId] = (dbCountByProduct[v.productId] || 0) + 1;
  }

  // Build product SKU to ID map
  const productSkuToId = new Map(allProducts.map(p => [p.sku, p.id]));

  console.log('\n=== PRODUCTS WITH FEWER VARIATIONS IN DB THAN NETO ===\n');

  const discrepancies: Array<{
    sku: string;
    name: string;
    netoCount: number;
    dbCount: number;
    missing: number;
  }> = [];

  for (const product of allProducts) {
    const netoCount = netoCountByParent[product.sku] || 0;
    const dbCount = dbCountByProduct[product.id] || 0;

    if (netoCount > dbCount) {
      discrepancies.push({
        sku: product.sku,
        name: product.shortName || product.name,
        netoCount,
        dbCount,
        missing: netoCount - dbCount,
      });
    }
  }

  // Sort by missing count
  discrepancies.sort((a, b) => b.missing - a.missing);

  let totalMissing = 0;
  for (const d of discrepancies) {
    console.log(d.name + ' (' + d.sku + ')');
    console.log('  Neto: ' + d.netoCount + ' | DB: ' + d.dbCount + ' | Missing: ' + d.missing);
    totalMissing += d.missing;
  }

  console.log('\n=== SUMMARY ===');
  console.log('Products with missing variations: ' + discrepancies.length);
  console.log('Total missing variations: ' + totalMissing);

  console.log('\n=== PRODUCTS NEVER ADDED TO NETO (in DB but 0 in Neto) ===\n');

  const neverInNeto = allProducts.filter(p => {
    const netoCount = netoCountByParent[p.sku] || 0;
    const dbCount = dbCountByProduct[p.id] || 0;
    return netoCount === 0 && p.priceVaries;
  });

  for (const p of neverInNeto) {
    const dbCount = dbCountByProduct[p.id] || 0;
    console.log(p.shortName || p.name);
    console.log('  SKU: ' + p.sku + ' | DB has: ' + dbCount + ' variations');
  }

  console.log('\nTotal products never in Neto: ' + neverInNeto.length);

  process.exit(0);
}

compare().catch(e => {
  console.error(e);
  process.exit(1);
});
