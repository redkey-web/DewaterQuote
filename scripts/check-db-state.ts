import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function checkDatabase() {
  console.log('=== Variation DisplayOrder Analysis ===');
  
  // Check displayOrder distribution
  const orderStats = await db.execute(sql`
    SELECT 
      display_order,
      COUNT(*) as count 
    FROM product_variations 
    GROUP BY display_order 
    ORDER BY display_order 
    LIMIT 20
  `);
  console.log('DisplayOrder distribution:');
  console.log(orderStats.rows);
  
  console.log('\n=== Stock Records Analysis ===');
  
  // Check stock records
  const stockStats = await db.execute(sql`
    SELECT 
      COUNT(*) as total_stock_records,
      COUNT(variation_id) as with_variation_id
    FROM product_stock
  `);
  console.log('Stock records:');
  console.log(stockStats.rows);
  
  // Sample stock with variation_id
  const stockWithVariation = await db.execute(sql`
    SELECT ps.*, pv.size, pv.label 
    FROM product_stock ps 
    LEFT JOIN product_variations pv ON ps.variation_id = pv.id
    WHERE ps.variation_id IS NOT NULL
    LIMIT 5
  `);
  console.log('\nStock records with variation_id:');
  console.log(stockWithVariation.rows);
  
  // Check total variations count
  const totalVariations = await db.execute(sql`SELECT COUNT(*) as count FROM product_variations`);
  console.log('\nTotal variations:', totalVariations.rows);
  
  process.exit(0);
}

checkDatabase().catch(console.error);
