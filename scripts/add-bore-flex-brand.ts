import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../src/db';
import { brands, products, productVariations, productImages, productFeatures, productSpecifications, productDownloads, subcategories } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

async function uploadToBlob(localPath: string, blobPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    addRandomSuffix: false,
  });
  return blob.url;
}

async function main() {
  console.log('Adding Bore-Flex Rubber brand and products...\n');

  // 1. Create Bore-Flex brand
  console.log('1. Creating Bore-Flex Rubber brand...');
  const [existingBrand] = await db.select().from(brands).where(eq(brands.slug, 'bore-flex-rubber'));

  let brandId: number;
  if (existingBrand) {
    console.log('   Brand already exists, using existing brand ID:', existingBrand.id);
    brandId = existingBrand.id;
  } else {
    const [newBrand] = await db.insert(brands).values({
      slug: 'bore-flex-rubber',
      name: 'Bore-Flex Rubber',
      description: 'Bore-Flex Rubber manufactures high-quality rubber expansion joints and flexible pipe connectors for industrial applications. Their products are designed for vibration isolation, thermal expansion compensation, and noise reduction in piping systems.',
    }).returning();
    brandId = newBrand.id;
    console.log('   Created brand with ID:', brandId);
  }

  // 2. Get twin-sphere subcategory (part of rubber-expansion-joints)
  console.log('\n2. Finding twin-sphere subcategory...');
  const [twinSphereSubcat] = await db.select().from(subcategories).where(eq(subcategories.slug, 'twin-sphere'));
  if (!twinSphereSubcat) {
    console.error('   Error: twin-sphere subcategory not found!');
    return;
  }
  console.log('   Found subcategory ID:', twinSphereSubcat.id);

  // 3. Upload images to Vercel Blob
  console.log('\n3. Uploading images to Vercel Blob...');

  // Upload logo
  const logoLocalPath = path.join(process.cwd(), 'public/images/brands/bore-flex-rubber-logo.png');
  let logoUrl = '/images/brands/bore-flex-rubber-logo.png';
  if (fs.existsSync(logoLocalPath)) {
    try {
      logoUrl = await uploadToBlob(logoLocalPath, 'brands/bore-flex-rubber-logo.png');
      console.log('   Logo uploaded:', logoUrl);
    } catch (e) {
      console.log('   Using local logo path');
    }
  }

  // Upload product image
  const productImagePath = path.join(process.cwd(), 'public/images/products/bore-flex/twin-sphere-expansion-joint.jpg');
  let productImageUrl = '/images/products/bore-flex/twin-sphere-expansion-joint.jpg';
  if (fs.existsSync(productImagePath)) {
    try {
      productImageUrl = await uploadToBlob(productImagePath, 'products/bore-flex/twin-sphere-expansion-joint.jpg');
      console.log('   Product image uploaded:', productImageUrl);
    } catch (e) {
      console.log('   Using local product image path');
    }
  }

  // Upload datasheet PDF
  const datasheetPath = path.join(process.cwd(), 'public/downloads/bore-flex/twin-sphere-expansion-joint-datasheet.pdf');
  let datasheetUrl = '/downloads/bore-flex/twin-sphere-expansion-joint-datasheet.pdf';
  if (fs.existsSync(datasheetPath)) {
    try {
      datasheetUrl = await uploadToBlob(datasheetPath, 'downloads/bore-flex/twin-sphere-expansion-joint-datasheet.pdf');
      console.log('   Datasheet uploaded:', datasheetUrl);
    } catch (e) {
      console.log('   Using local datasheet path');
    }
  }

  // 4. Create the Twin Sphere Expansion Joint product
  console.log('\n4. Creating Twin Sphere Expansion Joint product...');

  const productSlug = 'bore-flex-twin-sphere-expansion-joint';
  const [existingProduct] = await db.select().from(products).where(eq(products.slug, productSlug));

  let productId: number;
  if (existingProduct) {
    console.log('   Product already exists, updating...');
    productId = existingProduct.id;
    await db.update(products).set({
      name: 'Bore-Flex Twin Sphere Rubber Expansion Joint FTF',
      shortName: 'Twin Sphere Expansion Joint',
      brandId: brandId,
      categoryId: twinSphereSubcat.categoryId,
      subcategoryId: twinSphereSubcat.id,
      description: 'Twin sphere rubber expansion joint with Table E or ANSI 150LB zinc flanges. The two spheres provide more flexibility and movement compared to a single sphere model, functioning as a vibration eliminator and rubber bellows system. EPDM rubber construction with optional 316 stainless steel flanges available.',
      materials: {
        body: 'EPDM Rubber',
        sleeve: 'Zinc Flanges (Table E or ANSI 150LB)',
      },
      pressureRange: 'PN16',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN25 to DN750',
      leadTime: '3 weeks if out of stock',
      priceVaries: true,
      priceNote: 'Prices ex GST',
      isActive: true,
    }).where(eq(products.id, productId));
  } else {
    const [newProduct] = await db.insert(products).values({
      slug: productSlug,
      sku: 'BF-TSREJFTF',
      name: 'Bore-Flex Twin Sphere Rubber Expansion Joint FTF',
      shortName: 'Twin Sphere Expansion Joint',
      brandId: brandId,
      categoryId: twinSphereSubcat.categoryId,
      subcategoryId: twinSphereSubcat.id,
      description: 'Twin sphere rubber expansion joint with Table E or ANSI 150LB zinc flanges. The two spheres provide more flexibility and movement compared to a single sphere model, functioning as a vibration eliminator and rubber bellows system. EPDM rubber construction with optional 316 stainless steel flanges available.',
      materials: {
        body: 'EPDM Rubber',
        sleeve: 'Zinc Flanges (Table E or ANSI 150LB)',
      },
      pressureRange: 'PN16',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN25 to DN750',
      leadTime: '3 weeks if out of stock',
      priceVaries: true,
      priceNote: 'Prices ex GST',
      isActive: true,
    }).returning();
    productId = newProduct.id;
    console.log('   Created product with ID:', productId);
  }

  // 5. Add product variations (sizes and prices)
  console.log('\n5. Adding product variations...');

  // Clear existing variations
  await db.delete(productVariations).where(eq(productVariations.productId, productId));

  const variations = [
    { size: 'DN25', label: 'DN25 (1")', price: '304.00' },
    { size: 'DN32', label: 'DN32 (1¼")', price: '304.00' },
    { size: 'DN40', label: 'DN40 (1½")', price: '304.00' },
    { size: 'DN50', label: 'DN50 (2")', price: '304.00' },
    { size: 'DN65', label: 'DN65 (2½")', price: '334.00' },
    { size: 'DN80', label: 'DN80 (3")', price: '334.00' },
    { size: 'DN100', label: 'DN100 (4")', price: '385.00' },
    { size: 'DN125', label: 'DN125 (5")', price: '495.00' },
    { size: 'DN150', label: 'DN150 (6")', price: '550.00' },
    { size: 'DN200', label: 'DN200 (8")', price: '770.00' },
    { size: 'DN250', label: 'DN250 (10")', price: '990.00' },
    { size: 'DN300', label: 'DN300 (12")', price: '1320.00' },
    { size: 'DN350', label: 'DN350 (14")', price: '1650.00' },
    { size: 'DN400', label: 'DN400 (16")', price: '2090.00' },
    { size: 'DN450', label: 'DN450 (18")', price: '2530.00' },
    { size: 'DN500', label: 'DN500 (20")', price: '3080.00' },
    { size: 'DN600', label: 'DN600 (24")', price: '4180.00' },
    { size: 'DN750', label: 'DN750 (30")', price: null }, // POA
  ];

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];
    await db.insert(productVariations).values({
      productId,
      size: v.size,
      label: v.label,
      price: v.price,
      sku: `BF-TSREJFTF-${v.size}`,
      source: 'manual',
      displayOrder: i,
    });
  }
  console.log(`   Added ${variations.length} size variations`);

  // 6. Add product image
  console.log('\n6. Adding product image...');
  await db.delete(productImages).where(eq(productImages.productId, productId));
  await db.insert(productImages).values({
    productId,
    url: productImageUrl,
    alt: 'Bore-Flex Twin Sphere Rubber Expansion Joint',
    type: 'image',
    isPrimary: true,
    displayOrder: 0,
  });
  console.log('   Added primary product image');

  // 7. Add product features
  console.log('\n7. Adding product features...');
  await db.delete(productFeatures).where(eq(productFeatures.productId, productId));
  const features = [
    'Two spheres provide more flexibility and movement than single sphere models',
    'Functions as vibration eliminator and rubber bellows system',
    'EPDM rubber construction for chemical resistance',
    'Table E or ANSI 150LB zinc flanges (standard)',
    '316 stainless steel flanges available on request',
    'Tie rods/control rods recommended for excessive movements',
    '12 months warranty on manufacturing defects',
    'Multiple rubber materials available: EPDM, NBR, Viton',
  ];
  for (let i = 0; i < features.length; i++) {
    await db.insert(productFeatures).values({
      productId,
      feature: features[i],
      displayOrder: i,
    });
  }
  console.log(`   Added ${features.length} features`);

  // 8. Add product specifications
  console.log('\n8. Adding product specifications...');
  await db.delete(productSpecifications).where(eq(productSpecifications.productId, productId));
  const specs = [
    { label: 'Body Material', value: 'EPDM Rubber (standard)' },
    { label: 'Flange Material', value: 'Zinc (Table E or ANSI 150LB)' },
    { label: 'Optional Flange', value: '316 Stainless Steel' },
    { label: 'Size Range', value: 'DN25 to DN750 (1" to 30")' },
    { label: 'Pressure Rating', value: 'PN16' },
    { label: 'Temperature Range', value: '-20°C to +110°C' },
    { label: 'Axial Movement', value: '27mm to 65mm (size dependent)' },
    { label: 'Rubber Options', value: 'EPDM, NBR, Viton' },
  ];
  for (let i = 0; i < specs.length; i++) {
    await db.insert(productSpecifications).values({
      productId,
      label: specs[i].label,
      value: specs[i].value,
      displayOrder: i,
    });
  }
  console.log(`   Added ${specs.length} specifications`);

  // 9. Add product download (datasheet)
  console.log('\n9. Adding product datasheet...');
  await db.delete(productDownloads).where(eq(productDownloads.productId, productId));
  await db.insert(productDownloads).values({
    productId,
    name: 'Twin Sphere Expansion Joint Datasheet',
    url: datasheetUrl,
    type: 'datasheet',
  });
  console.log('   Added datasheet download');

  console.log('\n✅ Bore-Flex brand and Twin Sphere Expansion Joint product added successfully!');
  console.log('\nBrand page will be available at: /brands/bore-flex-rubber');
  console.log('Product page will be available at: /bore-flex-twin-sphere-expansion-joint');

  process.exit(0);
}

main().catch(console.error);
