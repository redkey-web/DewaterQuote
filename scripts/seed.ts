/**
 * Database Seed Script
 *
 * Transforms catalog.ts data into database records.
 * Run with: npx tsx scripts/seed.ts
 *
 * Prerequisites:
 * - DATABASE_URL set in .env.local
 * - Schema pushed with: npm run db:push
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

// Import schema
import {
  brands,
  categories,
  subcategories,
  products,
  productVariations,
  productImages,
  productDownloads,
  productFeatures,
  productSpecifications,
  productApplications,
} from '../src/db/schema';

// Import catalog data
import {
  products as catalogProducts,
  categories as catalogCategories,
  subcategories as catalogSubcategories,
} from '../src/data/catalog';

// Initialize database connection
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, {
  schema: {
    brands,
    categories,
    subcategories,
    products,
    productVariations,
    productImages,
    productDownloads,
    productFeatures,
    productSpecifications,
    productApplications,
  }
});

// Brand mapping (extracted from catalog products)
const BRANDS = [
  { slug: 'orbit', name: 'Orbit', description: 'Australian manufacturer of industrial pipe couplings and repair clamps.' },
  { slug: 'straub', name: 'Straub', description: 'Swiss-engineered pipe joining systems and industrial valves.' },
  { slug: 'teekay', name: 'Teekay', description: 'Manufacturer of duckbill check valves, expansion joints, and pipeline products.' },
];

async function seed() {
  console.log('Starting database seed...\n');

  try {
    // ========================================
    // 1. SEED BRANDS
    // ========================================
    console.log('Seeding brands...');
    const brandMap = new Map<string, number>();

    for (const brand of BRANDS) {
      const [inserted] = await db
        .insert(brands)
        .values(brand)
        .onConflictDoNothing()
        .returning({ id: brands.id, slug: brands.slug });

      if (inserted) {
        brandMap.set(brand.slug, inserted.id);
        console.log(`  + Brand: ${brand.name} (id: ${inserted.id})`);
      } else {
        // Already exists, fetch the ID
        const existing = await db.query.brands.findFirst({
          where: eq(brands.slug, brand.slug),
        });
        if (existing) {
          brandMap.set(brand.slug, existing.id);
          console.log(`  = Brand exists: ${brand.name} (id: ${existing.id})`);
        }
      }
    }

    // ========================================
    // 2. SEED CATEGORIES
    // ========================================
    console.log('\nSeeding categories...');
    const categoryMap = new Map<string, number>();

    for (let i = 0; i < catalogCategories.length; i++) {
      const cat = catalogCategories[i];
      const [inserted] = await db
        .insert(categories)
        .values({
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          longDescription: cat.longDescription,
          image: cat.image,
          displayOrder: i,
        })
        .onConflictDoNothing()
        .returning({ id: categories.id, slug: categories.slug });

      if (inserted) {
        categoryMap.set(cat.slug, inserted.id);
        console.log(`  + Category: ${cat.name} (id: ${inserted.id})`);
      } else {
        const existing = await db.query.categories.findFirst({
          where: eq(categories.slug, cat.slug),
        });
        if (existing) {
          categoryMap.set(cat.slug, existing.id);
          console.log(`  = Category exists: ${cat.name} (id: ${existing.id})`);
        }
      }
    }

    // ========================================
    // 3. SEED SUBCATEGORIES
    // ========================================
    console.log('\nSeeding subcategories...');
    const subcategoryMap = new Map<string, number>();

    for (let i = 0; i < catalogSubcategories.length; i++) {
      const subcat = catalogSubcategories[i];
      const categoryId = categoryMap.get(subcat.category);

      if (!categoryId) {
        console.log(`  ! Skipping subcategory ${subcat.name} - category not found: ${subcat.category}`);
        continue;
      }

      const [inserted] = await db
        .insert(subcategories)
        .values({
          slug: subcat.slug,
          name: subcat.name,
          description: subcat.description,
          image: subcat.image,
          categoryId,
          displayOrder: i,
        })
        .onConflictDoNothing()
        .returning({ id: subcategories.id, slug: subcategories.slug });

      if (inserted) {
        subcategoryMap.set(subcat.slug, inserted.id);
        console.log(`  + Subcategory: ${subcat.name} (id: ${inserted.id})`);
      } else {
        const existing = await db.query.subcategories.findFirst({
          where: eq(subcategories.slug, subcat.slug),
        });
        if (existing) {
          subcategoryMap.set(subcat.slug, existing.id);
          console.log(`  = Subcategory exists: ${subcat.name} (id: ${existing.id})`);
        }
      }
    }

    // ========================================
    // 4. SEED PRODUCTS
    // ========================================
    console.log('\nSeeding products...');
    let productCount = 0;

    for (const prod of catalogProducts) {
      // Map brand name to ID
      const brandSlug = prod.brand.toLowerCase();
      const brandId = brandMap.get(brandSlug);
      if (!brandId) {
        console.log(`  ! Skipping product ${prod.name} - brand not found: ${prod.brand}`);
        continue;
      }

      // Map category
      const categoryId = categoryMap.get(prod.category);
      if (!categoryId) {
        console.log(`  ! Skipping product ${prod.name} - category not found: ${prod.category}`);
        continue;
      }

      // Map subcategory (optional)
      const subcategoryId = prod.subcategory ? subcategoryMap.get(prod.subcategory) : undefined;

      // Calculate base price from sizeOptions if available
      let basePrice: string | undefined;
      if (prod.sizeOptions && prod.sizeOptions.length > 0) {
        const firstWithPrice = prod.sizeOptions.find(opt => opt.price);
        if (firstWithPrice?.price) {
          basePrice = String(firstWithPrice.price);
        }
      }

      // Insert product
      const [insertedProduct] = await db
        .insert(products)
        .values({
          slug: prod.slug,
          sku: prod.sku,
          name: prod.name,
          shortName: prod.shortName,
          brandId,
          categoryId,
          subcategoryId,
          description: prod.description,
          certifications: prod.certifications,
          materials: prod.materials,
          pressureRange: prod.pressureRange,
          temperature: prod.temperature,
          sizeFrom: prod.sizeFrom,
          leadTime: prod.leadTime,
          video: prod.video,
          priceVaries: prod.priceVaries ?? true,
          priceNote: prod.priceNote,
          basePrice,
          isActive: true,
        })
        .onConflictDoNothing()
        .returning({ id: products.id });

      if (!insertedProduct) {
        console.log(`  = Product exists: ${prod.shortName || prod.name}`);
        continue;
      }

      const productId = insertedProduct.id;
      console.log(`  + Product: ${prod.shortName || prod.name} (id: ${productId})`);
      productCount++;

      // ----------------------------------------
      // 4a. Insert Variations (sizeOptions)
      // ----------------------------------------
      if (prod.sizeOptions && prod.sizeOptions.length > 0) {
        for (let i = 0; i < prod.sizeOptions.length; i++) {
          const opt = prod.sizeOptions[i];
          await db.insert(productVariations).values({
            productId,
            size: opt.value,
            label: opt.label,
            price: opt.price ? String(opt.price) : undefined,
            sku: opt.sku,
            displayOrder: i,
          });
        }
        console.log(`    + ${prod.sizeOptions.length} variations`);
      }

      // ----------------------------------------
      // 4b. Insert Images
      // ----------------------------------------
      if (prod.images && prod.images.length > 0) {
        for (let i = 0; i < prod.images.length; i++) {
          const img = prod.images[i];
          await db.insert(productImages).values({
            productId,
            url: img.url,
            alt: img.alt,
            type: img.type || 'image',
            isPrimary: i === 0,
            displayOrder: i,
          });
        }
        console.log(`    + ${prod.images.length} images`);
      }

      // ----------------------------------------
      // 4c. Insert Downloads
      // ----------------------------------------
      if (prod.downloads && prod.downloads.length > 0) {
        for (const dl of prod.downloads) {
          await db.insert(productDownloads).values({
            productId,
            url: dl.url,
            label: dl.label,
            fileType: dl.url.endsWith('.pdf') ? 'pdf' : undefined,
          });
        }
        console.log(`    + ${prod.downloads.length} downloads`);
      }

      // ----------------------------------------
      // 4d. Insert Features
      // ----------------------------------------
      if (prod.features && prod.features.length > 0) {
        for (let i = 0; i < prod.features.length; i++) {
          await db.insert(productFeatures).values({
            productId,
            feature: prod.features[i],
            displayOrder: i,
          });
        }
        console.log(`    + ${prod.features.length} features`);
      }

      // ----------------------------------------
      // 4e. Insert Specifications
      // ----------------------------------------
      if (prod.specifications && prod.specifications.length > 0) {
        for (let i = 0; i < prod.specifications.length; i++) {
          const spec = prod.specifications[i];
          await db.insert(productSpecifications).values({
            productId,
            label: spec.label,
            value: spec.value,
            displayOrder: i,
          });
        }
        console.log(`    + ${prod.specifications.length} specifications`);
      }

      // ----------------------------------------
      // 4f. Insert Applications
      // ----------------------------------------
      if (prod.applications && prod.applications.length > 0) {
        for (let i = 0; i < prod.applications.length; i++) {
          await db.insert(productApplications).values({
            productId,
            application: prod.applications[i],
            displayOrder: i,
          });
        }
        console.log(`    + ${prod.applications.length} applications`);
      }
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n========================================');
    console.log('Seed completed successfully!');
    console.log('========================================');
    console.log(`Brands:        ${BRANDS.length}`);
    console.log(`Categories:    ${catalogCategories.length}`);
    console.log(`Subcategories: ${catalogSubcategories.length}`);
    console.log(`Products:      ${productCount}`);
    console.log('\nRun "npm run db:studio" to view data in Drizzle Studio');

  } catch (error) {
    console.error('\nSeed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
