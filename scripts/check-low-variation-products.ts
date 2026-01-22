/**
 * Find products with suspiciously few variations
 * (Products that have some variations but likely need more)
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and } from 'drizzle-orm';
import {
  brands,
  products,
  productVariations,
  productDownloads,
} from '../src/db/schema';

config({ path: '.env.local' });

const db = drizzle(neon(process.env.DATABASE_URL!));

async function check() {
  const allProducts = await db.select().from(products).where(eq(products.isActive, true));
  const allVariations = await db.select().from(productVariations);
  const allBrands = await db.select().from(brands);
  const allDownloads = await db.select().from(productDownloads);

  const brandMap = Object.fromEntries(allBrands.map(b => [b.id, b.name]));

  // Count variations per product
  const varCounts: Record<number, number> = {};
  for (const v of allVariations) {
    varCounts[v.productId] = (varCounts[v.productId] || 0) + 1;
  }

  // Get downloads per product
  const downloads: Record<number, string[]> = {};
  for (const d of allDownloads) {
    if (!downloads[d.productId]) downloads[d.productId] = [];
    downloads[d.productId].push(d.url);
  }

  // Filter for low variation products (excluding Straub/Teekay)
  // - Has priceVaries = true
  // - Has 1-5 variations (suspiciously low)
  const lowVarProducts = allProducts.filter(p => {
    const brand = brandMap[p.brandId] || '';
    const count = varCounts[p.id] || 0;
    const isStraubTeekay = brand.toLowerCase().includes('straub') || brand.toLowerCase().includes('teekay');
    return p.priceVaries && count >= 1 && count <= 5 && !isStraubTeekay;
  });

  console.log('Products with few variations (1-5, possibly incomplete):\n');
  console.log('='.repeat(70));

  // Sort by variation count
  lowVarProducts.sort((a, b) => (varCounts[a.id] || 0) - (varCounts[b.id] || 0));

  for (const p of lowVarProducts) {
    const brand = brandMap[p.brandId] || 'Unknown';
    const count = varCounts[p.id] || 0;
    const hasDatasheet = (downloads[p.id] || []).length > 0;
    const dsStatus = hasDatasheet ? 'YES' : 'NO';

    console.log('\n' + (p.shortName || p.name));
    console.log('  Brand: ' + brand + ' | SKU: ' + p.sku);
    console.log('  Variations: ' + count + ' | Datasheet: ' + dsStatus);
    console.log('  Slug: /' + p.slug);
  }

  console.log('\n' + '='.repeat(70));
  console.log('\nTotal: ' + lowVarProducts.length + ' products with 1-5 variations');

  // Also show specific products mentioned by user
  console.log('\n\n=== SPECIFIC PRODUCTS TO CHECK ===\n');

  const specificSlugs = [
    'd-series-encapsulating-clamp',
    'open-flex-300-l',
    'open-flex-200-l',
    'open-flex-400-l',
  ];

  for (const slug of specificSlugs) {
    const prod = allProducts.find(p => p.slug === slug);
    if (prod) {
      const count = varCounts[prod.id] || 0;
      const brand = brandMap[prod.brandId] || 'Unknown';
      const hasDatasheet = (downloads[prod.id] || []).length > 0;
      const dsUrls = downloads[prod.id] || [];
      const dsDisplay = hasDatasheet ? dsUrls[0] : 'NONE';

      console.log((prod.shortName || prod.name));
      console.log('  SKU: ' + prod.sku + ' | Brand: ' + brand);
      console.log('  Current variations: ' + count);
      console.log('  Datasheet: ' + dsDisplay);
      console.log('');
    }
  }

  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
