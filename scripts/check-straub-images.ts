require('dotenv').config({ path: '.env.local' });

async function main() {
  const { db } = await import('../src/db');
  const { products, brands, productImages } = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');

  const straubBrand = await db.select().from(brands).where(eq(brands.slug, 'straub'));
  if (straubBrand.length === 0) {
    console.log('No Straub brand found');
    return;
  }

  const straubProducts = await db.select().from(products).where(eq(products.brandId, straubBrand[0].id));

  console.log('Straub Product Images:\n');
  for (const p of straubProducts) {
    const images = await db.select().from(productImages).where(eq(productImages.productId, p.id));
    console.log(`${p.name}:`);
    for (const img of images) {
      console.log(`  ${img.isPrimary ? '★' : ' '} ${img.url.substring(0, 80)}...`);
    }
    console.log('');
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
