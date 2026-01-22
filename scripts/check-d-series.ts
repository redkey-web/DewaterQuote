/**
 * Check D-Series Encapsulating Clamp product data
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, productDownloads, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

async function check() {
  const [prod] = await db.select().from(products).where(eq(products.sku, 'D-SERIESENCAP'));

  if (!prod) {
    console.log('Product not found');
    process.exit(1);
  }

  console.log('Product: ' + prod.name);
  console.log('ID: ' + prod.id);
  console.log('SKU: ' + prod.sku);

  const downloads = await db.select().from(productDownloads).where(eq(productDownloads.productId, prod.id));
  console.log('\nDownloads:');
  downloads.forEach(d => {
    console.log('  - ' + d.url);
  });

  const variations = await db.select().from(productVariations).where(eq(productVariations.productId, prod.id));
  console.log('\nVariations (' + variations.length + '):');
  variations.forEach(v => {
    console.log('  - ' + v.size + ' @ $' + v.price + ' (' + v.sku + ')');
  });

  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
