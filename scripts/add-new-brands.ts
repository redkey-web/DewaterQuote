/**
 * Add New Brands Script
 *
 * Adds "Dewater Products" and "Other Manufacturers" brands to the database.
 * Run with: npx tsx scripts/add-new-brands.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

// Import schema
import { brands } from '../src/db/schema';

// Initialize database connection
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema: { brands } });

const NEW_BRANDS = [
  {
    slug: 'dewater-products',
    name: 'Dewater Products',
    description: 'Dewater Products own-brand industrial pipe fittings and accessories.',
  },
  {
    slug: 'other',
    name: 'Other Manufacturers',
    description: 'Products from various other manufacturers.',
  },
];

async function addBrands() {
  console.log('Adding new brands...\n');

  try {
    for (const brand of NEW_BRANDS) {
      // Check if brand already exists
      const existing = await db.query.brands.findFirst({
        where: eq(brands.slug, brand.slug),
      });

      if (existing) {
        console.log('  = Brand already exists: ${brand.name} (id: ${existing.id})');
        continue;
      }

      // Insert new brand
      const [inserted] = await db
        .insert(brands)
        .values(brand)
        .returning({ id: brands.id });

      console.log('  + Created brand: ${brand.name} (id: ${inserted.id})');
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('Error adding brands:', error);
    process.exit(1);
  }
}

addBrands();
