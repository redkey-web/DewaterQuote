/**
 * Import Straub Grip L variations from Neto CSV
 *
 * This product (SKU: SGL) has 22 variations in Neto but 0 in the database.
 * Run with: npx tsx scripts/import-straub-grip-l.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { eq } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const db = drizzle(neon(connectionString));

async function importSGL() {
  console.log('Finding Straub Grip L product...');

  // Find the product
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.sku, 'SGL'));

  if (!product) {
    console.error('Product SGL not found in database!');
    process.exit(1);
  }

  console.log('Found product: ${product.name} (ID: ${product.id})');

  // Check existing variations
  const existingVars = await db
    .select()
    .from(productVariations)
    .where(eq(productVariations.productId, product.id));

  if (existingVars.length > 0) {
    console.log('Product already has ${existingVars.length} variations. Skipping.');
    process.exit(0);
  }

  // Read Neto CSV
  console.log('\nReading Neto CSV...');
  const csvContent = readFileSync('.planning/audit/neto-export.csv', 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  // Find SGL variations (Parent SKU = SGL, Active = Y)
  const sglVariations = records.filter((row: Record<string, string>) => {
    const parentSku = row['Parent SKU']?.trim();
    const active = row['Active']?.toLowerCase() === 'y';
    return parentSku === 'SGL' && active;
  });

  console.log('Found ${sglVariations.length} variations in Neto CSV');

  // Extract size from the "Specific Value 1" column or SKU
  const variations: Array<{
    sku: string;
    size: string;
    label: string;
    price: string;
  }> = [];

  for (const row of sglVariations) {
    const sku = row['SKU*']?.trim();
    const price = row['Price (Default)']?.trim();
    let size = row['Specific Value 1']?.trim() || '';

    // Clean up size - remove "Pipe Outside Diameter sizing" suffix
    size = size.replace(/\s*Pipe Outside Diameter sizing/i, '').trim();
    size = size.replace(/\s*Pipe Outside Diameter/i, '').trim();

    // If size is missing, extract from SKU (e.g., SGL101.6 -> 101.6mm)
    if (!size && sku.startsWith('SGL')) {
      const match = sku.match(/SGL[_]?(\d+\.?\d*)/);
      if (match) {
        size = match[1] + 'mm';
      }
    }

    // Ensure size ends with mm
    if (size && !size.toLowerCase().endsWith('mm')) {
      size = size + 'mm';
    }

    if (!size || !price) {
      console.log('  Skipping ${sku}: missing size or price');
      continue;
    }

    variations.push({
      sku,
      size,
      label: '${size} Pipe OD',
      price,
    });
  }

  // Sort by numeric size value
  variations.sort((a, b) => {
    const numA = parseFloat(a.size.replace('mm', ''));
    const numB = parseFloat(b.size.replace('mm', ''));
    return numA - numB;
  });

  console.log('\nVariations to insert:');
  variations.forEach((v, i) => {
    console.log('  ${(i+1).toString().padStart(2)}. ${v.size.padEnd(10)} $${v.price.padStart(8)} (${v.sku})');
  });

  // Insert variations
  console.log('\nInserting variations...');

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];
    await db.insert(productVariations).values({
      productId: product.id,
      size: v.size,
      label: v.label,
      price: v.price,
      sku: v.sku,
      source: 'neto',
      displayOrder: (i + 1) * 100, // Gap numbering: 100, 200, 300...
    });
  }

  console.log('\n✅ Inserted ${variations.length} variations for ${product.name}');
  process.exit(0);
}

importSGL().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
