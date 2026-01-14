import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function verify() {
  // Check displayOrder distribution after migration
  const orderStats = await db.execute(sql`
    SELECT 
      display_order,
      COUNT(*) as count 
    FROM product_variations 
    GROUP BY display_order 
    ORDER BY display_order 
    LIMIT 15
  `);
  console.log('DisplayOrder distribution after migration:');
  console.log(orderStats.rows);
  
  // Sample a product to verify sorting
  const sampleProduct = await db.execute(sql`
    SELECT p.name, pv.size, pv.display_order 
    FROM products p 
    JOIN product_variations pv ON p.id = pv.product_id 
    WHERE p.id = (SELECT product_id FROM product_variations GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 1)
    ORDER BY pv.display_order
    LIMIT 10
  `);
  console.log('\nSample product variations (sorted by rank):');
  console.log(sampleProduct.rows);
  
  process.exit(0);
}
verify().catch(console.error);
