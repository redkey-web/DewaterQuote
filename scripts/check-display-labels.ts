import { db } from '../src/db';
import { productVariations, products } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function checkVariations() {
  // Get all variations with product names
  const results = await db.select({
    productName: products.name,
    productSlug: products.slug,
    size: productVariations.size,
    label: productVariations.label,
    sku: productVariations.sku,
  })
  .from(productVariations)
  .innerJoin(products, eq(productVariations.productId, products.id))
  .orderBy(products.name, productVariations.size);

  console.log('=== ALL VARIATIONS WITH LABELS ===');
  console.log('Total variations:', results.length);

  // Group by whether label matches size or is different
  const withDisplay: any[] = [];
  const missingDisplay: any[] = [];

  results.forEach(r => {
    // Consider 'missing' if label equals size exactly or label is empty/null
    const hasUniqueLabel = r.label && r.label.trim() !== '' && r.label !== r.size;
    if (hasUniqueLabel) {
      withDisplay.push(r);
    } else {
      missingDisplay.push(r);
    }
  });

  console.log('\n=== PRODUCTS WITH DISPLAY DATA (label != size) ===');
  console.log('Count:', withDisplay.length);

  console.log('\n=== PRODUCTS MISSING DISPLAY DATA (label = size or empty) ===');
  console.log('Count:', missingDisplay.length);

  // Group missing by product
  const missingByProduct = new Map<string, any[]>();
  missingDisplay.forEach(r => {
    const key = r.productName;
    if (!missingByProduct.has(key)) missingByProduct.set(key, []);
    missingByProduct.get(key)?.push(r);
  });

  console.log('\nProducts with missing Display data:');
  Array.from(missingByProduct.entries()).forEach(([name, variations]) => {
    console.log('- ' + name + ' (' + variations.length + ' sizes)');
  });

  // Group with data by product
  const withDataByProduct = new Map<string, any[]>();
  withDisplay.forEach(r => {
    const key = r.productName;
    if (!withDataByProduct.has(key)) withDataByProduct.set(key, []);
    withDataByProduct.get(key)?.push(r);
  });

  console.log('\n=== SAMPLE VARIATIONS WITH DISPLAY DATA ===');
  withDisplay.slice(0, 15).forEach(r => {
    console.log('Product:', r.productName);
    console.log('  Size:', r.size, '→ Display (label):', r.label);
  });

  console.log('\n=== PRODUCTS WITH DISPLAY DATA ===');
  Array.from(withDataByProduct.entries()).forEach(([name, variations]) => {
    console.log('- ' + name + ' (' + variations.length + ' sizes with Display labels)');
  });
}

checkVariations().catch(console.error);
