import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT sku, price FROM product_variations WHERE sku LIKE 'BFLYW316%' ORDER BY sku`;
  console.log('Database prices:');
  result.forEach(r => console.log(`  ${r.sku}: $${r.price}`));
}

check();
