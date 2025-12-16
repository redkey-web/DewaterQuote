/**
 * Sync catalog.ts → Database
 *
 * Updates existing database products with clean data from catalog.ts:
 * - Clean descriptions (no HTML)
 * - Features array
 * - Specifications array
 * - Applications array
 *
 * Run with: npx tsx scripts/sync-catalog-to-db.ts
 *
 * Prerequisites:
 * - DATABASE_URL set in .env.local
 * - Products already seeded in database
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

// Import schema
import * as schema from '../src/db/schema';
import {
  products,
  productFeatures,
  productSpecifications,
  productApplications,
} from '../src/db/schema';

// Import catalog data
import { products as catalogProducts } from '../src/data/catalog';

// Initialize database connection
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

interface SyncStats {
  updated: number;
  skipped: number;
  notFound: number;
  featuresAdded: number;
  specsAdded: number;
  applicationsAdded: number;
}

async function syncCatalogToDb() {
  console.log('🔄 Syncing catalog.ts → Database\n');
  console.log(`   Source: ${catalogProducts.length} products in catalog.ts\n`);

  const stats: SyncStats = {
    updated: 0,
    skipped: 0,
    notFound: 0,
    featuresAdded: 0,
    specsAdded: 0,
    applicationsAdded: 0,
  };

  try {
    for (const catalogProduct of catalogProducts) {
      // Find matching DB product by slug
      const dbProduct = await db.query.products.findFirst({
        where: eq(products.slug, catalogProduct.slug),
        with: {
          features: true,
          specifications: true,
          applications: true,
        }
      });

      if (!dbProduct) {
        console.log(`❓ Not found in DB: ${catalogProduct.slug}`);
        stats.notFound++;
        continue;
      }

      console.log(`\n📦 Syncing: ${catalogProduct.shortName || catalogProduct.name}`);

      // ============================================
      // 1. UPDATE DESCRIPTION (clean, no HTML)
      // ============================================
      if (catalogProduct.description !== dbProduct.description) {
        await db
          .update(products)
          .set({
            description: catalogProduct.description,
            updatedAt: new Date(),
          })
          .where(eq(products.id, dbProduct.id));
        console.log(`   ✓ Updated description`);
      }

      // ============================================
      // 2. SYNC FEATURES
      // ============================================
      if (catalogProduct.features && catalogProduct.features.length > 0) {
        // Delete existing features for this product
        await db
          .delete(productFeatures)
          .where(eq(productFeatures.productId, dbProduct.id));

        // Insert features from catalog
        for (let i = 0; i < catalogProduct.features.length; i++) {
          await db.insert(productFeatures).values({
            productId: dbProduct.id,
            feature: catalogProduct.features[i],
            displayOrder: i,
          });
          stats.featuresAdded++;
        }
        console.log(`   ✓ Added ${catalogProduct.features.length} features`);
      }

      // ============================================
      // 3. SYNC SPECIFICATIONS
      // ============================================
      if (catalogProduct.specifications && catalogProduct.specifications.length > 0) {
        // Delete existing specifications for this product
        await db
          .delete(productSpecifications)
          .where(eq(productSpecifications.productId, dbProduct.id));

        // Insert specifications from catalog
        for (let i = 0; i < catalogProduct.specifications.length; i++) {
          const spec = catalogProduct.specifications[i];
          await db.insert(productSpecifications).values({
            productId: dbProduct.id,
            label: spec.label,
            value: spec.value,
            displayOrder: i,
          });
          stats.specsAdded++;
        }
        console.log(`   ✓ Added ${catalogProduct.specifications.length} specifications`);
      }

      // ============================================
      // 4. SYNC APPLICATIONS
      // ============================================
      if (catalogProduct.applications && catalogProduct.applications.length > 0) {
        // Delete existing applications for this product
        await db
          .delete(productApplications)
          .where(eq(productApplications.productId, dbProduct.id));

        // Insert applications from catalog
        for (let i = 0; i < catalogProduct.applications.length; i++) {
          await db.insert(productApplications).values({
            productId: dbProduct.id,
            application: catalogProduct.applications[i],
            displayOrder: i,
          });
          stats.applicationsAdded++;
        }
        console.log(`   ✓ Added ${catalogProduct.applications.length} applications`);
      }

      stats.updated++;
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n========================================');
    console.log('✅ Sync completed successfully!');
    console.log('========================================');
    console.log(`Products updated:    ${stats.updated}`);
    console.log(`Products not found:  ${stats.notFound}`);
    console.log(`Features added:      ${stats.featuresAdded}`);
    console.log(`Specifications added: ${stats.specsAdded}`);
    console.log(`Applications added:  ${stats.applicationsAdded}`);
    console.log('\n📊 Run "npm run db:studio" to verify data');
    console.log('🔗 Or check admin panel at /admin/products');

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run sync
syncCatalogToDb();
