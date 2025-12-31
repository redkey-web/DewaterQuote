/**
 * Upload Downloaded Images to Vercel Blob
 *
 * This script:
 * 1. Reads images from .planning/audit/images/
 * 2. Uploads each to Vercel Blob
 * 3. Updates product_images table with URLs
 *
 * Run with: npx tsx scripts/upload-images-to-blob.ts
 *
 * Options:
 *   --dry-run     Show what would be uploaded without uploading
 *   --sku=X       Only process specific SKU
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import path from 'path';

const IMAGES_DIR = '.planning/audit/images';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skuArg = args.find(a => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;

async function main() {
  console.log('=== Upload Images to Vercel Blob ===\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No uploads will be made\n');
  }

  if (!existsSync(IMAGES_DIR)) {
    console.error(`Images directory not found: ${IMAGES_DIR}`);
    console.error('Run download-neto-images.ts first.');
    process.exit(1);
  }

  // Get list of product folders
  let productFolders = readdirSync(IMAGES_DIR).filter(f => {
    const fullPath = path.join(IMAGES_DIR, f);
    return statSync(fullPath).isDirectory();
  });

  if (filterSku) {
    productFolders = productFolders.filter(f => f === filterSku);
  }

  console.log(`Found ${productFolders.length} product folders\n`);

  // Get product IDs from database
  const products: Array<{ id: number; sku: string }> = await sql`
    SELECT id, sku FROM products WHERE is_active = true
  `;
  const skuToId = new Map(products.map(p => [p.sku, p.id]));

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const sku of productFolders) {
    const productId = skuToId.get(sku);
    if (!productId) {
      console.log(`${sku}: SKU not found in database, skipping`);
      skipped++;
      continue;
    }

    const folderPath = path.join(IMAGES_DIR, sku);
    const imageFiles = readdirSync(folderPath).filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );

    if (imageFiles.length === 0) {
      console.log(`${sku}: No image files found`);
      skipped++;
      continue;
    }

    console.log(`\n${sku}: ${imageFiles.length} image(s)`);

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const filePath = path.join(folderPath, filename);
      const isPrimary = i === 0;

      console.log(`  - ${filename}${isPrimary ? ' (primary)' : ''}`);

      if (dryRun) {
        uploaded++;
        continue;
      }

      try {
        // Read file
        const fileBuffer = readFileSync(filePath);
        const contentType = filename.endsWith('.png') ? 'image/png' :
                          filename.endsWith('.gif') ? 'image/gif' :
                          filename.endsWith('.webp') ? 'image/webp' :
                          'image/jpeg';

        // Upload to Vercel Blob
        const blobPath = `products/${sku}/${filename}`;
        const blob = await put(blobPath, fileBuffer, {
          access: 'public',
          contentType,
          addRandomSuffix: false,
        });

        console.log(`    → ${blob.url}`);

        // Check if image already exists in DB
        const existing = await sql`
          SELECT id FROM product_images
          WHERE product_id = ${productId} AND url = ${blob.url}
        `;

        if (existing.length > 0) {
          console.log(`    (already in database)`);
          continue;
        }

        // Insert into database
        await sql`
          INSERT INTO product_images (product_id, url, alt, type, is_primary, display_order)
          VALUES (
            ${productId},
            ${blob.url},
            ${sku + (isPrimary ? ' - Main product image' : ' - Product image')},
            'image',
            ${isPrimary},
            ${i}
          )
        `;

        uploaded++;
      } catch (error) {
        console.error(`    ERROR: ${error}`);
        errors++;
      }
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Product folders: ${productFolders.length}`);
  console.log(`Images uploaded: ${uploaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);

  process.exit(0);
}

main().catch(console.error);
