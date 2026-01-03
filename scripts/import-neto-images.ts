/**
 * Import Product Images from Neto Export
 *
 * Usage: npx tsx scripts/import-neto-images.ts [--dry-run]
 *
 * Reads images from .planning/audit/images/{SKU}/ folders,
 * uploads to Vercel Blob, and links to products in the database.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, productImages } from '../src/db/schema';
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const isDryRun = process.argv.includes('--dry-run');
const IMAGES_DIR = path.join(process.cwd(), '.planning/audit/images');
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

if (!BLOB_TOKEN && !isDryRun) {
  console.error('ERROR: BLOB_READ_WRITE_TOKEN not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Get content type from extension
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}

async function importImages() {
  console.log('=== Neto Image Import ===\n');
  console.log(`Images directory: ${IMAGES_DIR}`);
  console.log(`Dry run: ${isDryRun}\n`);

  // Get all SKU folders
  const skuFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`Found ${skuFolders.length} SKU folders\n`);

  // Get all products from DB for matching
  const allProducts = await db.select({
    id: products.id,
    sku: products.sku,
    name: products.name,
  }).from(products);

  const productMap = new Map(allProducts.map(p => [p.sku.toUpperCase(), p]));
  console.log(`Found ${allProducts.length} products in database\n`);

  let matched = 0;
  let unmatched = 0;
  let imagesUploaded = 0;
  let skipped = 0;

  const unmatchedSkus: string[] = [];

  for (const skuFolder of skuFolders) {
    const product = productMap.get(skuFolder.toUpperCase());

    if (!product) {
      unmatched++;
      unmatchedSkus.push(skuFolder);
      continue;
    }

    matched++;
    const folderPath = path.join(IMAGES_DIR, skuFolder);
    const imageFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort(); // Ensure consistent order

    if (imageFiles.length === 0) {
      console.log(`[SKIP] ${skuFolder}: No images found`);
      continue;
    }

    console.log(`[${skuFolder}] ${product.name}`);
    console.log(`  Found ${imageFiles.length} images`);

    // Check for existing images
    const existingImages = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, product.id));

    if (existingImages.length > 0) {
      console.log(`  [SKIP] Already has ${existingImages.length} images`);
      skipped++;
      continue;
    }

    if (isDryRun) {
      console.log(`  [DRY RUN] Would upload ${imageFiles.length} images`);
      continue;
    }

    // Upload each image
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const filePath = path.join(folderPath, filename);
      const fileBuffer = fs.readFileSync(filePath);
      const contentType = getContentType(filename);

      // Generate Blob path
      const blobPath = `products/${skuFolder.toLowerCase()}/${filename}`;

      try {
        const blob = await put(blobPath, fileBuffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType,
          cacheControlMaxAge: 31536000, // 1 year
          token: BLOB_TOKEN,
        });

        // Insert into product_images
        await db.insert(productImages).values({
          productId: product.id,
          url: blob.url,
          alt: product.name,
          type: 'image',
          isPrimary: i === 0, // First image is primary
          displayOrder: i,
        });

        imagesUploaded++;
        console.log(`  ✓ ${filename} -> ${blob.url}`);
      } catch (error) {
        console.error(`  ✗ ${filename}: ${error}`);
      }
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Products matched: ${matched}`);
  console.log(`Products not found: ${unmatched}`);
  console.log(`Products skipped (already have images): ${skipped}`);
  console.log(`Images uploaded: ${imagesUploaded}`);

  if (unmatchedSkus.length > 0 && unmatchedSkus.length <= 20) {
    console.log('\nUnmatched SKUs:');
    unmatchedSkus.forEach(sku => console.log(`  - ${sku}`));
  } else if (unmatchedSkus.length > 20) {
    console.log(`\nFirst 20 unmatched SKUs (${unmatchedSkus.length} total):`);
    unmatchedSkus.slice(0, 20).forEach(sku => console.log(`  - ${sku}`));
  }
}

importImages().catch(console.error);
