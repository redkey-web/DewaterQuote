/**
 * Import Product Images from Live Neto Site
 *
 * Usage: npx tsx scripts/import-live-images.ts [--dry-run]
 *
 * Downloads images from dewaterproducts.com.au and imports to Vercel Blob
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, ne } from 'drizzle-orm';
import { products, productImages } from '../src/db/schema';
import { put, del } from '@vercel/blob';

const isDryRun = process.argv.includes('--dry-run');
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const LIVE_SITE = 'https://www.dewaterproducts.com.au';

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

// Mapping of our SKUs to live site image paths
// Format: { sku: { liveSku: string, imageCount: number } }
const PRODUCT_MAPPING: Record<string, { liveSku: string; imageCount: number }> = {
  // Defender Valves
  'BFLYW316': { liveSku: 'BFLYW316', imageCount: 3 },
  'BFLYLE316': { liveSku: 'BFLYLE316', imageCount: 3 },
  'CF8MDAFV': { liveSku: 'CF8MDAFV', imageCount: 3 },
  'CF8MWEBFVL': { liveSku: 'CF8MWEBFVL', imageCount: 3 },

  // Orbit Couplings
  'OCRC55': { liveSku: 'OCRC55', imageCount: 3 },
  'OCFG-S': { liveSku: 'OCFG-S', imageCount: 3 },
  'OCML-L': { liveSku: 'OCML-L', imageCount: 3 },
  'OCML-S': { liveSku: 'OCML-S', imageCount: 3 },
  'OCFPC': { liveSku: 'OCFPC', imageCount: 3 },
  'OCERC': { liveSku: 'OCERC', imageCount: 3 },
  'OCOF300L': { liveSku: 'OCOF300-L', imageCount: 3 },
  'OCOF400L': { liveSku: 'OCOF400-L', imageCount: 3 },
  'OCRC200': { liveSku: 'OCRC200', imageCount: 3 },
  'OCRC300': { liveSku: 'OCRC300', imageCount: 3 },
  'OCFLAD': { liveSku: 'OCFLAD', imageCount: 3 },

  // Strainers
  'SSYS': { liveSku: 'SSYS', imageCount: 3 },
  'SBSANSI': { liveSku: 'SBS316-ANSI150', imageCount: 3 },

  // Teekay / Bore-Flex
  'FSFREJ': { liveSku: 'FSF-BREJ', imageCount: 3 },
  'SSFA': { liveSku: 'SSFA', imageCount: 3 },
  'BF-TSREJFTF': { liveSku: 'TSREJFTF', imageCount: 3 },
};

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`    [404] ${url}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.log(`    [ERROR] ${url}: ${error}`);
    return null;
  }
}

function getContentType(url: string): string {
  if (url.includes('.png')) return 'image/png';
  if (url.includes('.gif')) return 'image/gif';
  if (url.includes('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function importProductImages(sku: string, liveSku: string, imageCount: number) {
  console.log(`\n[${sku}] Importing from live site (${liveSku})...`);

  // Get product from DB
  const [product] = await db.select().from(products).where(eq(products.sku, sku)).limit(1);

  if (!product) {
    console.log(`  [SKIP] Product not found in DB`);
    return { success: false, reason: 'not_found' };
  }

  // Get existing images
  const existingImages = await db.select().from(productImages).where(eq(productImages.productId, product.id));

  // Build image URLs to try
  const imageUrls: string[] = [
    `${LIVE_SITE}/assets/full/${liveSku}.jpg`,
    `${LIVE_SITE}/assets/full/${liveSku}.png`,
  ];

  for (let i = 1; i <= imageCount; i++) {
    imageUrls.push(`${LIVE_SITE}/assets/alt_${i}/${liveSku}.jpg`);
    imageUrls.push(`${LIVE_SITE}/assets/alt_${i}/${liveSku}.png`);
  }

  const downloadedImages: { url: string; buffer: Buffer; isMain: boolean }[] = [];

  // Try to download main image
  for (const url of imageUrls.slice(0, 2)) {
    const buffer = await downloadImage(url);
    if (buffer) {
      downloadedImages.push({ url, buffer, isMain: true });
      break;
    }
  }

  // Try to download alt images
  for (let i = 1; i <= imageCount; i++) {
    for (const ext of ['.jpg', '.png']) {
      const url = `${LIVE_SITE}/assets/alt_${i}/${liveSku}${ext}`;
      const buffer = await downloadImage(url);
      if (buffer) {
        downloadedImages.push({ url, buffer, isMain: false });
        break;
      }
    }
  }

  if (downloadedImages.length === 0) {
    console.log(`  [SKIP] No images found on live site`);
    return { success: false, reason: 'no_images' };
  }

  console.log(`  Found ${downloadedImages.length} images`);

  if (isDryRun) {
    console.log(`  [DRY RUN] Would delete ${existingImages.length} old images and upload ${downloadedImages.length} new`);
    return { success: true, dry: true };
  }

  // Delete old images from DB and Blob
  for (const img of existingImages) {
    try {
      await del(img.url, { token: BLOB_TOKEN });
      console.log(`  Deleted old: ${img.url.split('/').pop()}`);
    } catch (e) {
      // Ignore delete errors
    }
  }
  await db.delete(productImages).where(eq(productImages.productId, product.id));

  // Upload new images
  for (let i = 0; i < downloadedImages.length; i++) {
    const { url, buffer, isMain } = downloadedImages[i];
    const ext = url.includes('.png') ? '.png' : '.jpg';
    const filename = isMain ? `main${ext}` : `alt${i}${ext}`;
    const blobPath = `products/${sku.toLowerCase()}/${filename}`;

    try {
      const blob = await put(blobPath, buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: getContentType(url),
        cacheControlMaxAge: 31536000,
        token: BLOB_TOKEN,
      });

      await db.insert(productImages).values({
        productId: product.id,
        url: blob.url,
        alt: product.name,
        type: 'image',
        isPrimary: i === 0,
        displayOrder: i,
      });

      console.log(`  ✓ Uploaded: ${filename}`);
    } catch (error) {
      console.log(`  ✗ Failed: ${filename} - ${error}`);
    }
  }

  return { success: true, count: downloadedImages.length };
}

async function main() {
  console.log('=== Live Site Image Import ===');
  console.log(`Dry run: ${isDryRun}\n`);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (const [sku, config] of Object.entries(PRODUCT_MAPPING)) {
    const result = await importProductImages(sku, config.liveSku, config.imageCount);
    if (result.success) {
      results.success++;
    } else if (result.reason === 'not_found') {
      results.skipped++;
    } else {
      results.failed++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Success: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Skipped: ${results.skipped}`);
}

main().catch(console.error);
