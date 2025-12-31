/**
 * Check products missing images and descriptions with HTML
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  // Get all active products
  const allProducts = await sql`
    SELECT id, name, sku, description
    FROM products
    WHERE is_active = true
  `;

  // Get products that have images
  const productsWithImages = await sql`
    SELECT DISTINCT product_id
    FROM product_images
  `;

  const withImageIds = new Set(productsWithImages.map((p: { product_id: number }) => p.product_id));
  const productsWithout = allProducts.filter((p: { id: number }) => !withImageIds.has(p.id));

  console.log('Total active products:', allProducts.length);
  console.log('Products WITH images:', withImageIds.size);
  console.log('Products WITHOUT images:', productsWithout.length);
  console.log('\n=== Products missing images (first 30): ===');
  productsWithout.slice(0, 30).forEach((p: { sku: string; name: string }) => console.log(`  - ${p.sku}: ${p.name}`));
  if (productsWithout.length > 30) console.log(`  ... and ${productsWithout.length - 30} more`);

  // Check descriptions with HTML tags
  const htmlInDesc = allProducts.filter((p: { description: string | null }) =>
    p.description && (p.description.includes('<p>') || p.description.includes('&nbsp;'))
  );
  console.log('\n=== Products with HTML in description: ===');
  console.log('Count:', htmlInDesc.length);
  if (htmlInDesc.length > 0) {
    const sample = htmlInDesc[0] as { description: string; sku: string };
    console.log('\nSample description (first 300 chars):');
    console.log(sample.description?.substring(0, 300));
    console.log('\n... SKU:', sample.sku);
  }

  // List all products with raw HTML
  if (htmlInDesc.length > 0) {
    console.log('\n=== All products with HTML in description: ===');
    htmlInDesc.forEach((p: { sku: string; name: string }) => console.log(`  - ${p.sku}: ${p.name}`));
  }

  process.exit(0);
}

check().catch(console.error);
