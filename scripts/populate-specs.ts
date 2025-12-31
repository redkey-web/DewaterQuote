/**
 * Populate Product Specifications from Neto CSV
 *
 * This script:
 * 1. Reads "Bullet points" column from Neto CSV export
 * 2. Extracts Body, Pressure, Size From values
 * 3. Updates products table with extracted specs
 *
 * The "Bullet points" column contains HTML like:
 * <ul><li>Size From: 100mm</li><li>Body: WCB/Stellite</li><li>Pressure Range: 0 - 20 BAR</li></ul>
 *
 * Run with: npx tsx scripts/populate-specs.ts
 *
 * Options:
 *   --dry-run     Show what would change without making changes
 *   --sku=X       Only process specific SKU
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { neon } from '@neondatabase/serverless';

const CSV_PATH = '.planning/audit/neto-export.csv';

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

if (!existsSync(CSV_PATH)) {
  console.error(`CSV file not found: ${CSV_PATH}`);
  console.error('Please export products from Neto control panel first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skuArg = args.find(a => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;

interface ExtractedSpecs {
  sizeFrom?: string;
  body?: string;
  pressureRange?: string;
  materials?: {
    body?: string;
    seat?: string;
    disc?: string;
    sleeve?: string;
  };
}

/**
 * Extract specs from bullet points HTML
 */
function extractSpecs(bulletHtml: string): ExtractedSpecs {
  if (!bulletHtml) return {};

  const specs: ExtractedSpecs = {};

  // Match list items: <li>Label: Value</li>
  const regex = /<li>([^:]+):\s*([^<]+)<\/li>/gi;
  let match;

  while ((match = regex.exec(bulletHtml)) !== null) {
    const label = match[1].trim().toLowerCase();
    const value = match[2].trim();

    if (label.includes('size') && (label.includes('from') || label.includes('range'))) {
      specs.sizeFrom = value;
    } else if (label === 'body' || label.includes('body material')) {
      specs.body = value;
      specs.materials = { ...specs.materials, body: value };
    } else if (label === 'seat' || label.includes('seat material')) {
      specs.materials = { ...specs.materials, seat: value };
    } else if (label === 'disc' || label.includes('disc material')) {
      specs.materials = { ...specs.materials, disc: value };
    } else if (label === 'sleeve' || label.includes('sleeve material')) {
      specs.materials = { ...specs.materials, sleeve: value };
    } else if (label.includes('pressure')) {
      specs.pressureRange = value;
    }
  }

  return specs;
}

interface CsvRow {
  'SKU*': string;
  'Parent SKU': string;
  'Name': string;
  'Bullet points': string;
  'Short Description': string;
}

async function main() {
  console.log('=== Populate Product Specs from Neto CSV ===\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No changes will be made\n');
  }

  // Read and parse CSV
  console.log(`Reading CSV: ${CSV_PATH}`);
  const csvContent = readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRow[];

  console.log(`Found ${records.length} rows in CSV\n`);

  // Filter to parent products only (those without Parent SKU or where SKU = Parent SKU)
  const parentProducts = records.filter(r => {
    const sku = r['SKU*'];
    const parentSku = r['Parent SKU'];
    return !parentSku || parentSku === sku;
  });

  console.log(`Parent products: ${parentProducts.length}\n`);

  // Get products from our database that need specs
  let dbProducts: Array<{
    id: number;
    sku: string;
    name: string;
    size_from: string | null;
    pressure_range: string | null;
    materials: Record<string, string> | null;
  }>;

  if (filterSku) {
    dbProducts = await sql`
      SELECT id, sku, name, size_from, pressure_range, materials
      FROM products
      WHERE is_active = true AND sku = ${filterSku}
      ORDER BY sku
    `;
  } else {
    dbProducts = await sql`
      SELECT id, sku, name, size_from, pressure_range, materials
      FROM products
      WHERE is_active = true
      ORDER BY sku
    `;
  }

  console.log(`Products in database: ${dbProducts.length}\n`);

  // Build CSV lookup map by SKU
  const csvMap = new Map<string, CsvRow>();
  for (const row of parentProducts) {
    csvMap.set(row['SKU*'], row);
  }

  let updated = 0;
  let skipped = 0;
  let notFound = 0;
  let errors = 0;

  for (const product of dbProducts) {
    const csvRow = csvMap.get(product.sku);

    if (!csvRow) {
      // Product not in CSV - skip silently
      notFound++;
      continue;
    }

    const bulletPoints = csvRow['Bullet points'];
    const shortDesc = csvRow['Short Description'];

    if (!bulletPoints && !shortDesc) {
      skipped++;
      continue;
    }

    // Extract specs from bullet points
    const specs = extractSpecs(bulletPoints);

    // Also try to extract from short description if bullet points didn't have it
    if (!specs.body && shortDesc) {
      // Short description often contains "Body material: X" or "Sleeve Material: X"
      const bodyMatch = shortDesc.match(/body\s*(?:material)?[;:\s]+([^;,]+)/i);
      if (bodyMatch) {
        specs.body = bodyMatch[1].trim();
        specs.materials = { ...specs.materials, body: bodyMatch[1].trim() };
      }

      const sleeveMatch = shortDesc.match(/sleeve\s*(?:material)?[;:\s]+([^;,]+)/i);
      if (sleeveMatch) {
        specs.materials = { ...specs.materials, sleeve: sleeveMatch[1].trim() };
      }
    }

    // Check if we have anything to update
    const hasNewSizeFrom = specs.sizeFrom && !product.size_from;
    const hasNewPressure = specs.pressureRange && !product.pressure_range;
    const hasNewMaterials = specs.materials && Object.keys(specs.materials).length > 0 &&
      (!product.materials || Object.keys(product.materials).length === 0);

    if (!hasNewSizeFrom && !hasNewPressure && !hasNewMaterials) {
      skipped++;
      continue;
    }

    console.log(`\n--- ${product.sku}: ${product.name} ---`);
    if (specs.sizeFrom) console.log(`  Size From: ${specs.sizeFrom}`);
    if (specs.pressureRange) console.log(`  Pressure: ${specs.pressureRange}`);
    if (specs.materials) console.log(`  Materials: ${JSON.stringify(specs.materials)}`);

    if (!dryRun) {
      try {
        // Build update query dynamically
        const updates: string[] = [];
        const values: unknown[] = [];

        if (hasNewSizeFrom && specs.sizeFrom) {
          await sql`
            UPDATE products
            SET size_from = ${specs.sizeFrom}
            WHERE id = ${product.id} AND (size_from IS NULL OR size_from = '')
          `;
        }

        if (hasNewPressure && specs.pressureRange) {
          await sql`
            UPDATE products
            SET pressure_range = ${specs.pressureRange}
            WHERE id = ${product.id} AND (pressure_range IS NULL OR pressure_range = '')
          `;
        }

        if (hasNewMaterials && specs.materials) {
          await sql`
            UPDATE products
            SET materials = ${JSON.stringify(specs.materials)}::jsonb
            WHERE id = ${product.id} AND (materials IS NULL OR materials = '{}'::jsonb)
          `;
        }

        updated++;
        console.log('  ✓ Updated');
      } catch (error) {
        console.error('  ✗ Error:', error);
        errors++;
      }
    } else {
      updated++;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Products in database: ${dbProducts.length}`);
  console.log(`Not found in CSV: ${notFound}`);
  console.log(`Skipped (no new data): ${skipped}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);

  process.exit(0);
}

main().catch(console.error);
