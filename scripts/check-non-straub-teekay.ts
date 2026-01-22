/**
 * Check non-Straub/Teekay products with priceVaries but no variations
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { brands, products, productVariations } from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

async function check() {
  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  const allVariations = await db.select().from(productVariations);
  const allBrands = await db.select().from(brands);

  const brandMap = Object.fromEntries(allBrands.map(b => [b.id, b.name]));
  const varCounts: Record<number, number> = {};

  for (const v of allVariations) {
    varCounts[v.productId] = (varCounts[v.productId] || 0) + 1;
  }

  // Find products with priceVaries but no variations (excluding Straub/Teekay)
  const problems = allProducts.filter(p => {
    const brand = brandMap[p.brandId] || '';
    const hasVars = (varCounts[p.id] || 0) > 0;
    const isStraubTeekay = brand.toLowerCase().includes('straub') || brand.toLowerCase().includes('teekay');
    return p.priceVaries && !hasVars && !isStraubTeekay;
  });

  console.log('Non-Straub/Teekay products with priceVaries=true but no variations:\n');

  if (problems.length === 0) {
    console.log('  None found - all good!');
  } else {
    problems.forEach(p => {
      const brand = brandMap[p.brandId] || 'Unknown';
      console.log('  ${p.name}');
      console.log('    Brand: ${brand} | SKU: ${p.sku} | Slug: /${p.slug}');
      console.log('');
    });
  }

  console.log('\nTotal: ${problems.length}');
  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
