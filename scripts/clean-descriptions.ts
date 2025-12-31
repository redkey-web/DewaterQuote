/**
 * Clean HTML from Product Descriptions
 *
 * This script:
 * 1. Finds products with HTML tags in descriptions
 * 2. Strips HTML tags and converts to clean text
 * 3. Updates the database
 *
 * Run with: npx tsx scripts/clean-descriptions.ts
 *
 * Options:
 *   --dry-run     Show what would change without making changes
 *   --sku=X       Only process specific SKU
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skuArg = args.find(a => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;

/**
 * Clean HTML from description text
 */
function cleanDescription(html: string): string {
  if (!html) return '';

  return html
    // Convert paragraphs to double newlines
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    // Convert breaks to newlines
    .replace(/<br\s*\/?>/gi, '\n')
    // Convert list items to bullet points
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    // Remove list wrappers
    .replace(/<\/?ul>/gi, '\n')
    .replace(/<\/?ol>/gi, '\n')
    // Convert HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/[ \t]+/g, ' ')  // Collapse spaces
    .replace(/\n[ \t]+/g, '\n')  // Remove leading spaces on lines
    .replace(/[ \t]+\n/g, '\n')  // Remove trailing spaces on lines
    .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
    .trim();
}

async function main() {
  console.log('=== Clean HTML from Product Descriptions ===\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No changes will be made\n');
  }

  // Find products with HTML in descriptions
  let productsWithHtml: Array<{ id: number; sku: string; name: string; description: string }>;

  if (filterSku) {
    productsWithHtml = await sql`
      SELECT id, sku, name, description
      FROM products
      WHERE sku = ${filterSku}
        AND description IS NOT NULL
        AND (description LIKE '%<p>%' OR description LIKE '%&nbsp;%' OR description LIKE '%<br%')
    `;
  } else {
    productsWithHtml = await sql`
      SELECT id, sku, name, description
      FROM products
      WHERE description IS NOT NULL
        AND (description LIKE '%<p>%' OR description LIKE '%&nbsp;%' OR description LIKE '%<br%')
      ORDER BY sku
    `;
  }

  console.log(`Found ${productsWithHtml.length} products with HTML in description\n`);

  if (productsWithHtml.length === 0) {
    console.log('No products need cleaning!');
    process.exit(0);
  }

  let updated = 0;
  let errors = 0;

  for (const product of productsWithHtml) {
    const cleanedDesc = cleanDescription(product.description);

    console.log(`\n--- ${product.sku}: ${product.name} ---`);
    console.log('BEFORE (first 200 chars):');
    console.log(product.description.substring(0, 200));
    console.log('\nAFTER (first 200 chars):');
    console.log(cleanedDesc.substring(0, 200));

    if (!dryRun) {
      try {
        await sql`
          UPDATE products
          SET description = ${cleanedDesc}
          WHERE id = ${product.id}
        `;
        updated++;
        console.log('✓ Updated');
      } catch (error) {
        console.error('✗ Error:', error);
        errors++;
      }
    } else {
      updated++;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Products processed: ${productsWithHtml.length}`);
  console.log(`Descriptions cleaned: ${updated}`);
  console.log(`Errors: ${errors}`);

  process.exit(0);
}

main().catch(console.error);
