import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { brands, products, productVariations, productImages, productFeatures, productSpecifications, productApplications, subcategories, categories } from '../src/db/schema';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Adding Duckbill Check Valve Products...\n');

  // 1. Get Teekay brand ID
  const [teekayBrand] = await db.select().from(brands).where(eq(brands.slug, 'teekay'));
  if (!teekayBrand) {
    console.error('Teekay brand not found!');
    return;
  }
  const brandId = teekayBrand.id;
  console.log('Using Teekay brand ID:', brandId);

  // 2. Get valves category ID
  const [valvesCategory] = await db.select().from(categories).where(eq(categories.slug, 'valves'));
  if (!valvesCategory) {
    console.error('valves category not found!');
    return;
  }
  const categoryId = valvesCategory.id;
  console.log('Using category ID:', categoryId);

  // 3. Create or get duckbill-check-valve subcategory
  let subcategoryId: number;
  const [existingSubcat] = await db.select().from(subcategories).where(eq(subcategories.slug, 'duckbill-check-valve'));

  if (existingSubcat) {
    console.log('Subcategory duckbill-check-valve already exists (ID:', existingSubcat.id, ')');
    subcategoryId = existingSubcat.id;
  } else {
    const [newSubcat] = await db.insert(subcategories).values({
      slug: 'duckbill-check-valve',
      name: 'Duckbill Check Valves',
      description: 'Rubber valve that flexes open under flow, ideal for outfalls and stormwater systems.',
      categoryId: categoryId,
      displayOrder: 6,
    }).returning();
    console.log('Created subcategory duckbill-check-valve (ID:', newSubcat.id, ')');
    subcategoryId = newSubcat.id;
  }

  // 4. Check if product already exists
  const [existingProduct] = await db.select().from(products).where(eq(products.slug, 'db-1-slip-on-duckbill-check-valve-neoprene'));
  if (existingProduct) {
    console.log('\nProduct already exists! Skipping...');
    console.log('Product ID:', existingProduct.id);
    process.exit(0);
  }

  // 5. Create the product
  console.log('\nCreating DB-1 Duckbill Check Valve...');

  const [newProduct] = await db.insert(products).values({
    slug: 'db-1-slip-on-duckbill-check-valve-neoprene',
    sku: 'DB-1',
    name: 'DB-1 Slip On Duckbill Check Valve - Neoprene',
    shortName: 'DB-1 Duckbill Check Valve',
    brandId: brandId,
    categoryId: categoryId,
    subcategoryId: subcategoryId,
    description: 'The Slip On Duckbill Check Valve model DB-1 is installed over the end of a plain ended pipe to prevent back flow. The DB-1 model is a Flat bottom model, with a flared top to enhance flow rates and reduce head loss.',
    certifications: 'Rubber materials comply with relevant water and wastewater standards. Available in WRAS-approved EPDM for potable water applications. 316 stainless steel clamps provide corrosion resistance.',
    materials: { body: 'Neoprene', sleeve: '316ss' },
    pressureRange: '0 - 1 BAR',
    sizeFrom: '88.9mm to 630mm',
    leadTime: '3 weeks if nil stock',
    video: 'https://www.youtube.com/watch?v=iCanHpZe7EY',
    priceVaries: true,
    priceNote: 'POA - Contact us for pricing',
    isActive: true,
  }).returning();

  console.log('Created product ID:', newProduct.id);

  // 6. Add features
  const features = [
    'Curved Bill model provides 50% more sealing area compared to straight bill',
    'Better tighter seal when debris are present',
    '25mm of fluid/water is all it takes to open the valve',
    'Available in a wide range of sizes: 88.9mm to 1700.0mm',
    'Available in different rubber materials: Neoprene, NBR, EPDM, Viton',
    '12 months warranty on manufacturing defects only',
    'Zero maintenance - no moving parts',
    'Self-cleaning design',
  ];

  console.log('Adding features...');
  for (let i = 0; i < features.length; i++) {
    await db.insert(productFeatures).values({
      productId: newProduct.id,
      feature: features[i],
      displayOrder: i,
    });
  }

  // 7. Add specifications
  const specifications = [
    { label: 'SKU', value: 'DB-1' },
    { label: 'Body Material', value: 'Neoprene' },
    { label: 'Clamp Material', value: '316 stainless steel' },
    { label: 'Type', value: 'Slip-on duckbill check valve' },
    { label: 'Bill Type', value: 'Curved bill with flared top' },
    { label: 'Opening Pressure', value: '25mm head' },
    { label: 'Size Range', value: '88.9mm to 630mm OD' },
  ];

  console.log('Adding specifications...');
  for (let i = 0; i < specifications.length; i++) {
    await db.insert(productSpecifications).values({
      productId: newProduct.id,
      label: specifications[i].label,
      value: specifications[i].value,
      displayOrder: i,
    });
  }

  // 8. Add applications
  const applications = [
    'Stormwater outfalls',
    'Wastewater discharge',
    'Pump station outlets',
    'Tide gates replacement',
    'Dam and levee outlets',
    'Marine and coastal',
    'Industrial effluent',
    'Drainage systems',
  ];

  console.log('Adding applications...');
  for (let i = 0; i < applications.length; i++) {
    await db.insert(productApplications).values({
      productId: newProduct.id,
      application: applications[i],
      displayOrder: i,
    });
  }

  // 9. Add images
  const images = [
    { url: '/images/products/nobg/DB-1_nobg.png', alt: 'DB-1 Duckbill Check Valve Neoprene', isPrimary: true },
    { url: '/images/products/optimized/DB-1.jpg', alt: 'DB-1 Duckbill Check Valve Neoprene - Product Photo', isPrimary: false },
    { url: '/images/products/optimized/DB-1_alt1.jpg', alt: 'DB-1 Duckbill Check Valve Neoprene - View 2', isPrimary: false },
    { url: '/images/products/optimized/DB-1_alt2.jpg', alt: 'DB-1 Duckbill Check Valve Neoprene - View 3', isPrimary: false },
    { url: '/images/products/optimized/DB-1_alt3.jpg', alt: 'DB-1 Duckbill Check Valve Neoprene - View 4', isPrimary: false },
  ];

  console.log('Adding images...');
  for (let i = 0; i < images.length; i++) {
    await db.insert(productImages).values({
      productId: newProduct.id,
      url: images[i].url,
      alt: images[i].alt,
      type: 'image',
      isPrimary: images[i].isPrimary,
      displayOrder: i,
    });
  }

  // 10. Add size variations (POA pricing)
  const sizeOptions = [
    '88.9mm', '90.0mm', '101.6mm', '110.0mm', '114.3mm', '125.0mm',
    '140.0mm', '141.3mm', '160.0mm', '168.3mm', '180.0mm', '200.0mm',
    '219.1mm', '225.0mm', '250.0mm', '273.0mm', '280.0mm', '315.0mm',
    '323.9mm', '355.0mm', '355.6mm', '400.0mm', '406.4mm', '450.0mm',
    '457.0mm', '500.0mm', '508.0mm', '559.0mm', '560.0mm', '609.6mm', '630.0mm'
  ];

  console.log('Adding size variations...');
  for (let i = 0; i < sizeOptions.length; i++) {
    await db.insert(productVariations).values({
      productId: newProduct.id,
      size: sizeOptions[i],
      label: `${sizeOptions[i]} Pipe OD`,
      price: null, // POA
      sku: `DB-1-${sizeOptions[i]}`,
      source: 'manual',
      displayOrder: i,
    });
  }

  console.log('\n✅ Successfully added DB-1 Duckbill Check Valve!');
  console.log('   Product ID:', newProduct.id);
  console.log('   Features:', features.length);
  console.log('   Specifications:', specifications.length);
  console.log('   Applications:', applications.length);
  console.log('   Images:', images.length);
  console.log('   Size Variations:', sizeOptions.length);

  process.exit(0);
}

main().catch(console.error);
