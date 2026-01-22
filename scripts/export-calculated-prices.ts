/**
 * Export all products with calculated/estimated prices
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, inArray } from 'drizzle-orm';
import { products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

const CALCULATED_SKUS = ['D-SERIESENCAP', 'OCOF200-L', 'OCOF300-L'];

async function exportPrices() {
  const targetProducts = await db
    .select()
    .from(products)
    .where(inArray(products.sku, CALCULATED_SKUS));

  for (const prod of targetProducts) {
    const variations = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, prod.id));

    // Sort by numeric size
    variations.sort((a, b) => {
      const numA = parseFloat(a.size.replace('mm', ''));
      const numB = parseFloat(b.size.replace('mm', ''));
      return numA - numB;
    });

    console.log('\n' + '='.repeat(60));
    console.log(prod.sku + ' - ' + prod.name);
    console.log('='.repeat(60));
    console.log('Size\t\tPrice\t\tSKU');
    console.log('-'.repeat(60));

    for (const v of variations) {
      const sizeCol = v.size.padEnd(12);
      const priceCol = ('$' + v.price).padEnd(12);
      console.log(sizeCol + '\t' + priceCol + '\t' + v.sku);
    }

    console.log('-'.repeat(60));
    console.log('Total: ' + variations.length + ' variations');
  }

  process.exit(0);
}

exportPrices().catch(e => {
  console.error(e);
  process.exit(1);
});
