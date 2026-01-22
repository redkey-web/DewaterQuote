/**
 * Check specific products that are missing variations
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, productVariations, productDownloads } from '../src/db/schema';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const db = drizzle(neon(connectionString));

async function check() {
  const skusToCheck = [
    'D-SERIESENCAP',  // D-Series Encapsulating Clamp - shows 1 size
    'OCOF300-L',      // Open Flex 300-L - shows 2 sizes
    'OCOF200-L',      // Open Flex 200-L - shows 2 sizes
    'OCOF400-L',      // Open Flex 400-L - shows 43 sizes (for comparison)
    'ENCAPRC-SS',     // Encapsulating Pipe Repair Clamp - shows 1 size
    'OCFPC',          // Fire Protection Coupling - shows 1 size
    'OCCL',           // Combo Lock - shows 1 size
  ];

  for (const sku of skusToCheck) {
    const product = await db.select().from(products).where(eq(products.sku, sku));

    if (product[0]) {
      const vars = await db.select().from(productVariations).where(eq(productVariations.productId, product[0].id));
      const downloads = await db.select().from(productDownloads).where(eq(productDownloads.productId, product[0].id));

      console.log('========================================');
      console.log(product[0].name);
      console.log('SKU:', sku);
      console.log('Slug:', product[0].slug);
      console.log('----------------------------------------');
      console.log('Variations in DB:', vars.length);
      if (vars.length > 0 && vars.length <= 10) {
        vars.forEach(v => console.log('  -', v.size, '|', v.label || '', '|', v.price ? '$' + v.price : 'POA'));
      } else if (vars.length > 10) {
        console.log('  First 5:');
        vars.slice(0, 5).forEach(v => console.log('    -', v.size, '|', v.label || '', '|', v.price ? '$' + v.price : 'POA'));
        console.log('  ...');
        console.log('  Last 5:');
        vars.slice(-5).forEach(v => console.log('    -', v.size, '|', v.label || '', '|', v.price ? '$' + v.price : 'POA'));
      }
      console.log('Downloads/Datasheets:', downloads.length);
      downloads.forEach(d => console.log('  -', d.name, ':', d.url));
      console.log('');
    } else {
      console.log('Product not found:', sku);
    }
  }

  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
