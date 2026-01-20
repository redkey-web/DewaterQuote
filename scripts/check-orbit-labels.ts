import 'dotenv/config';
import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function checkOrbitProducts() {
  const orbitProducts = await db.query.products.findMany({
    where: sql`brand_id = (SELECT id FROM brands WHERE slug = 'orbit')`,
    with: {
      variations: true
    }
  });
  
  console.log('=== ORBIT PRODUCTS SIZE LABEL STATUS ===\n');
  
  let withLabels = 0;
  let withoutLabels = 0;
  let noVariations = 0;
  
  for (const p of orbitProducts) {
    const hasVariations = p.variations && p.variations.length > 0;
    const firstVar = p.variations?.[0];
    const hasLabel = firstVar?.label && firstVar.label.trim() !== '';
    
    if (!hasVariations) {
      noVariations++;
      console.log(`NO VARIATIONS: ${p.name} (${p.sku})`);
    } else if (hasLabel) {
      withLabels++;
    } else {
      withoutLabels++;
      console.log(`MISSING LABEL: ${p.name}`);
      console.log(`  SKU: ${p.sku}`);
      console.log(`  First size: ${firstVar?.size}`);
      console.log(`  Label value: "${firstVar?.label || ''}"`);
      console.log('');
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total Orbit products: ${orbitProducts.length}`);
  console.log(`With proper labels: ${withLabels}`);
  console.log(`Missing labels: ${withoutLabels}`);
  console.log(`No variations at all: ${noVariations}`);
}

checkOrbitProducts().catch(console.error);
