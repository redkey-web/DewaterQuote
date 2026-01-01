import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL as string);

async function main() {
  const results = await sql`
    SELECT p.sku as product_sku, p.name as product_name,
           v.sku as variation_sku, v.size, v.price
    FROM products p
    LEFT JOIN product_variations v ON v.product_id = p.id
    WHERE p.sku IN ('DB-1', 'DB4DCV', 'DBCVFE', 'ILDBCV')
    ORDER BY p.sku, v.display_order
  `;

  let currentProduct = '';
  for (const r of results) {
    if (r.product_sku !== currentProduct) {
      console.log('\n' + r.product_sku + ' - ' + r.product_name);
      currentProduct = r.product_sku;
    }
    console.log('  ' + (r.variation_sku || 'no-sku').padEnd(20) + ' ' + (r.size || '').padEnd(10) + ' $' + r.price);
  }
}

main().then(() => process.exit(0));
