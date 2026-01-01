import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../src/db';
import { brands, products, productVariations, productImages, productFeatures, productSpecifications, subcategories, categories } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('Adding Expansion Joint Subcategories and Products...\n');

  // 1. Get Bore-Flex brand ID
  const [boreFlexBrand] = await db.select().from(brands).where(eq(brands.slug, 'bore-flex-rubber'));
  if (!boreFlexBrand) {
    console.error('Bore-Flex brand not found!');
    return;
  }
  const brandId = boreFlexBrand.id;
  console.log('Using Bore-Flex brand ID:', brandId);

  // 2. Get rubber-expansion-joints category ID
  const [expansionCategory] = await db.select().from(categories).where(eq(categories.slug, 'rubber-expansion-joints'));
  if (!expansionCategory) {
    console.error('rubber-expansion-joints category not found!');
    return;
  }
  const categoryId = expansionCategory.id;
  console.log('Using category ID:', categoryId);

  // 3. Define subcategories to create
  const subcategoryData = [
    { slug: 'fsf-single-sphere', name: 'FSF Single Sphere', description: 'Single sphere rubber expansion joints - economical model providing good expansion, contraction, angular movement and vibration elimination.', displayOrder: 0 },
    { slug: 'fsf-b-single-sphere', name: 'FSF-B Single Sphere', description: 'FSF-B single sphere rubber expansion joints with enhanced features.', displayOrder: 1 },
    { slug: 'single-arch', name: 'Single Arch', description: 'Single arch rubber expansion joints with one arch design for good movement and flexibility.', displayOrder: 3 },
    { slug: 'double-arch', name: 'Double Arch', description: 'Double arch rubber expansion joints with two arches for greater movement than single arch models.', displayOrder: 4 },
    { slug: 'triple-arch', name: 'Triple Arch', description: 'Triple arch rubber expansion joints for maximum movement compensation.', displayOrder: 5 },
    { slug: 'quadruple-arch', name: 'Quadruple Arch', description: 'Quadruple arch rubber expansion joints for extreme movement requirements.', displayOrder: 6 },
    { slug: 'reducing', name: 'Reducing', description: 'Reducing rubber expansion joints for connecting different pipe sizes with expansion compensation.', displayOrder: 7 },
    { slug: 'ptfe-lined', name: 'PTFE Lined', description: 'PTFE lined rubber expansion joints for chemical resistance applications.', displayOrder: 8 },
  ];

  // Create subcategories
  console.log('\n3. Creating subcategories...');
  const subcatMap: Record<string, number> = {};

  for (const subcat of subcategoryData) {
    const [existing] = await db.select().from(subcategories).where(eq(subcategories.slug, subcat.slug));
    if (existing) {
      console.log(`   ${subcat.name} already exists (ID: ${existing.id})`);
      subcatMap[subcat.slug] = existing.id;
    } else {
      const [newSubcat] = await db.insert(subcategories).values({
        slug: subcat.slug,
        name: subcat.name,
        description: subcat.description,
        categoryId: categoryId,
        displayOrder: subcat.displayOrder,
      }).returning();
      console.log(`   Created ${subcat.name} (ID: ${newSubcat.id})`);
      subcatMap[subcat.slug] = newSubcat.id;
    }
  }

  // 4. Define products to create
  const productData = [
    // FSF Single Sphere - Zinc
    {
      slug: 'fsf-single-sphere-zinc',
      sku: 'BF-FSFSSZ',
      name: 'FSF Single Sphere Rubber Expansion Joint - Zinc Flanges',
      shortName: 'FSF Single Sphere (Zinc)',
      subcategory: 'fsf-single-sphere',
      description: 'Single sphere rubber expansion joint with Table E or ANSI 150LB zinc flanges. Economical model providing good expansion, contraction, angular movement and vibration elimination.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges (Table E or ANSI 150LB)' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN32 to DN600',
      leadTime: '3 weeks if out of stock',
      basePrice: '174.00',
      features: [
        'Single sphere design for economical solution',
        'Good expansion, contraction and angular movement',
        'Excellent vibration elimination',
        'EPDM rubber construction',
        'Table E or ANSI 150LB zinc flanges',
        'Multiple rubber materials available: EPDM, NBR, Viton',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber (standard)' },
        { label: 'Flange Material', value: 'Zinc (Table E or ANSI 150LB)' },
        { label: 'Size Range', value: 'DN32 to DN600' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Temperature Range', value: '-20°C to +110°C' },
      ],
    },
    // FSF Single Sphere - 316SS
    {
      slug: 'fsf-single-sphere-316ss',
      sku: 'BF-FSFSS316',
      name: 'FSF Single Sphere Rubber Expansion Joint - 316SS Flanges',
      shortName: 'FSF Single Sphere (316SS)',
      subcategory: 'fsf-single-sphere',
      description: 'Single sphere rubber expansion joint with 316 stainless steel flanges. Enhanced corrosion resistance for demanding applications.',
      materials: { body: 'EPDM Rubber', sleeve: '316 Stainless Steel Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN32 to DN600',
      leadTime: '3 weeks if out of stock',
      basePrice: '350.00',
      features: [
        '316 stainless steel flanges for superior corrosion resistance',
        'Single sphere design',
        'Good expansion, contraction and angular movement',
        'Excellent vibration elimination',
        'EPDM rubber construction',
        'Suitable for chemical and marine environments',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber (standard)' },
        { label: 'Flange Material', value: '316 Stainless Steel' },
        { label: 'Size Range', value: 'DN32 to DN600' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Temperature Range', value: '-20°C to +110°C' },
      ],
    },
    // Single Arch - Filled
    {
      slug: 'single-arch-filled',
      sku: 'BF-SFAREJ',
      name: 'Single Filled Arch Rubber Expansion Joint',
      shortName: 'Single Arch (Filled)',
      subcategory: 'single-arch',
      description: 'Single arch rubber expansion joint with filled arch design. The smooth, filled arch bore prevents slurry entrapment. Ideal for suction pipes with negative pressure rating of 750mm Hg.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '817.00',
      features: [
        'Filled arch design prevents slurry entrapment',
        'Negative pressure rating: 750mm Hg',
        'Ideal for suction pipes',
        'Full rubber flange faces for excellent seal',
        'Steel flange backing ring with nuts and washers',
        'Suitable for mining slurry applications',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber' },
        { label: 'Flange Material', value: 'Zinc with steel backing' },
        { label: 'Size Range', value: 'DN50 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Negative Pressure', value: '750mm Hg' },
        { label: 'Applications', value: 'Suction pipes, mining slurry, dewatering' },
      ],
    },
    // Single Arch - Unfilled
    {
      slug: 'single-arch-unfilled',
      sku: 'BF-SAREJ',
      name: 'Single Arch Rubber Expansion Joint - Unfilled',
      shortName: 'Single Arch (Unfilled)',
      subcategory: 'single-arch',
      description: 'Single arch rubber expansion joint with unfilled arch. Provides good movement and flexibility, vibration control and dampening, taking up pipe misalignment and thermal expansion.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '668.00',
      features: [
        'Unfilled arch for standard pressure applications',
        'Elongation, compression and angular movement',
        'Excellent vibration absorption',
        'Full rubber flange faces',
        'Steel flange backing',
        'Accommodates pipe misalignment',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber' },
        { label: 'Flange Material', value: 'Zinc with steel backing' },
        { label: 'Size Range', value: 'DN50 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Temperature Range', value: '-20°C to +110°C' },
      ],
    },
    // Double Arch - Filled
    {
      slug: 'double-arch-filled',
      sku: 'BF-DFAREJ',
      name: 'Double Filled Arch Rubber Expansion Joint',
      shortName: 'Double Arch (Filled)',
      subcategory: 'double-arch',
      description: 'Double arch rubber expansion joint with two filled arches. Hand-built using high-strength quality rubber with full rubber faces and steel flange backing. Ideal for suction pipes and mining slurry applications.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '2198.90',
      features: [
        'Two filled arches for greater movement',
        'Smooth filled bore prevents slurry entrapment',
        'Negative pressure rating: 750mm Hg',
        'Hand-built high-strength rubber construction',
        'Full rubber flange faces for excellent seal',
        'Ideal for mining, dredging, dewatering',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber (hand-built)' },
        { label: 'Flange Material', value: 'Steel backing with rubber face' },
        { label: 'Size Range', value: 'DN50 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Negative Pressure', value: '750mm Hg' },
        { label: 'Applications', value: 'Mining slurry, dredging, sand/gravel processing' },
      ],
    },
    // Double Arch - Unfilled
    {
      slug: 'double-arch-unfilled',
      sku: 'BF-DAREJ',
      name: 'Double Arch Rubber Expansion Joint - Unfilled',
      shortName: 'Double Arch (Unfilled)',
      subcategory: 'double-arch',
      description: 'Double arch rubber expansion joint with two unfilled arches. Provides greater movement than single arch models with excellent vibration control and dampening.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '1013.00',
      features: [
        'Two arches for greater movement than single arch',
        'Elongation, compression and angular movement',
        'Excellent vibration absorption',
        'Hand-built high-quality rubber',
        'Steel flange backing',
        'Full rubber flange faces',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber' },
        { label: 'Flange Material', value: 'Steel backing with rubber face' },
        { label: 'Size Range', value: 'DN50 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Temperature Range', value: '-20°C to +110°C' },
      ],
    },
    // Concentric Reducing
    {
      slug: 'concentric-reducing-expansion-joint',
      sku: 'BF-CREJ',
      name: 'Concentric Reducing Rubber Expansion Joint',
      shortName: 'Concentric Reducing',
      subcategory: 'reducing',
      description: 'Concentric reducing rubber expansion joint with same centerline for both ends. Table E or ANSI 150LB zinc flanges. Connects different pipe sizes while providing expansion compensation.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 x DN65 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '398.00',
      features: [
        'Concentric design maintains same centerline',
        'Connects different pipe sizes',
        'Vibration isolation and expansion compensation',
        'Table E or ANSI 150LB zinc flanges',
        'EPDM rubber construction',
        'Custom sizes available',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber' },
        { label: 'Flange Material', value: 'Zinc (Table E or ANSI 150LB)' },
        { label: 'Size Range', value: 'DN50 x DN65 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Design', value: 'Concentric (same centerline)' },
      ],
    },
    // Eccentric Reducing
    {
      slug: 'eccentric-reducing-expansion-joint',
      sku: 'BF-EREJ',
      name: 'Eccentric Reducing Rubber Expansion Joint',
      shortName: 'Eccentric Reducing',
      subcategory: 'reducing',
      description: 'Eccentric reducing rubber expansion joint with offset centerline configuration. Table E or ANSI 150LB zinc flanges. Ideal for horizontal piping runs requiring drainage.',
      materials: { body: 'EPDM Rubber', sleeve: 'Zinc Flanges' },
      pressureRange: 'PN16 (0-16 BAR)',
      temperature: '-20°C to +110°C',
      sizeFrom: 'DN50 x DN65 and above',
      leadTime: '3 weeks if out of stock',
      basePrice: '878.00',
      features: [
        'Eccentric design with offset centerline',
        'Prevents air/liquid trapping in horizontal runs',
        'Connects different pipe sizes',
        'Table E or ANSI 150LB zinc flanges',
        'EPDM rubber construction',
        'Custom sizes available',
      ],
      specifications: [
        { label: 'Body Material', value: 'EPDM Rubber' },
        { label: 'Flange Material', value: 'Zinc (Table E or ANSI 150LB)' },
        { label: 'Size Range', value: 'DN50 x DN65 and above' },
        { label: 'Pressure Rating', value: 'PN16 (0-16 BAR)' },
        { label: 'Design', value: 'Eccentric (offset centerline)' },
      ],
    },
  ];

  // Create products
  console.log('\n4. Creating products...');
  for (const prod of productData) {
    const [existing] = await db.select().from(products).where(eq(products.slug, prod.slug));
    if (existing) {
      console.log(`   ${prod.shortName} already exists, skipping...`);
      continue;
    }

    const subcatId = subcatMap[prod.subcategory];
    if (!subcatId) {
      console.log(`   Warning: subcategory ${prod.subcategory} not found for ${prod.name}`);
      continue;
    }

    const [newProduct] = await db.insert(products).values({
      slug: prod.slug,
      sku: prod.sku,
      name: prod.name,
      shortName: prod.shortName,
      brandId: brandId,
      categoryId: categoryId,
      subcategoryId: subcatId,
      description: prod.description,
      materials: prod.materials,
      pressureRange: prod.pressureRange,
      temperature: prod.temperature,
      sizeFrom: prod.sizeFrom,
      leadTime: prod.leadTime,
      priceVaries: false,
      basePrice: prod.basePrice,
      priceNote: 'Price ex GST. Contact for bulk pricing.',
      isActive: true,
    }).returning();

    console.log(`   Created ${prod.shortName} (ID: ${newProduct.id})`);

    // Add features
    for (let i = 0; i < prod.features.length; i++) {
      await db.insert(productFeatures).values({
        productId: newProduct.id,
        feature: prod.features[i],
        displayOrder: i,
      });
    }

    // Add specifications
    for (let i = 0; i < prod.specifications.length; i++) {
      await db.insert(productSpecifications).values({
        productId: newProduct.id,
        label: prod.specifications[i].label,
        value: prod.specifications[i].value,
        displayOrder: i,
      });
    }
  }

  console.log('\n✅ Expansion joint subcategories and products added successfully!');
  process.exit(0);
}

main().catch(console.error);
