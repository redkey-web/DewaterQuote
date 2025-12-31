/**
 * Download Product Images from Neto API
 *
 * This script:
 * 1. Fetches image URLs from Neto API for products missing images
 * 2. Downloads images to local folder
 * 3. (Future: Upload to Vercel Blob and update database)
 *
 * Run with: npx tsx scripts/download-neto-images.ts
 *
 * Options:
 *   --dry-run     Show what would be downloaded without downloading
 *   --sku=X       Only process specific SKU
 *   --limit=N     Limit number of products to process
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

// Check required env vars
if (!process.env.NETO_API_KEY) {
  console.error('Missing NETO_API_KEY in .env.local');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const OUTPUT_DIR = '.planning/audit/images';

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skuArg = args.find(a => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

interface NetoImage {
  Name: string;
  URL: string;
  ThumbURL: string;
  MediumThumbURL?: string;
  Timestamp?: string;
}

interface NetoItem {
  SKU: string;
  Name: string;
  ParentSKU?: string;
  Images?: NetoImage[];  // API returns array directly
  ImageURL?: string;
}

interface NetoResponse {
  Item: NetoItem[];
  Ack: string;
  Messages?: Array<{ Error?: { Message: string } }>;
}

async function fetchNetoProductsWithImages(skus: string[]): Promise<NetoItem[]> {
  const url = 'https://www.dewaterproducts.com.au/do/WS/NetoAPI';

  // Fetch in batches of 50
  const allItems: NetoItem[] = [];
  const batchSize = 50;

  for (let i = 0; i < skus.length; i += batchSize) {
    const batchSkus = skus.slice(i, i + batchSize);
    console.log(`Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(skus.length / batchSize)} (${batchSkus.length} SKUs)`);

    const body = {
      Filter: {
        SKU: batchSkus,
        OutputSelector: [
          'SKU',
          'Name',
          'ParentSKU',
          'Images',
          'ImageURL',
        ],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'NETOAPI_ACTION': 'GetItem',
        'NETOAPI_KEY': process.env.NETO_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`Neto API error: ${response.status} ${response.statusText}`);
      continue;
    }

    const data = await response.json() as NetoResponse;

    if (data.Ack !== 'Success') {
      console.error('Neto API returned error:', data.Messages);
      continue;
    }

    if (data.Item) {
      allItems.push(...data.Item);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return allItems;
}

async function downloadImage(imageUrl: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`  Failed to download: ${response.status}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outputPath, buffer);
    return true;
  } catch (error) {
    console.error(`  Download error:`, error);
    return false;
  }
}

async function main() {
  console.log('=== Download Neto Product Images ===\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No files will be downloaded\n');
  }

  // Create output directory
  if (!dryRun && !existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get products missing images from our database
  let productsWithoutImages: Array<{ id: number; sku: string; name: string }>;

  if (filterSku) {
    productsWithoutImages = await sql`
      SELECT p.id, p.sku, p.name
      FROM products p
      WHERE p.is_active = true
        AND p.sku = ${filterSku}
        AND NOT EXISTS (
          SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
        )
    `;
  } else if (limit) {
    productsWithoutImages = await sql`
      SELECT p.id, p.sku, p.name
      FROM products p
      WHERE p.is_active = true
        AND NOT EXISTS (
          SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
        )
      ORDER BY p.sku
      LIMIT ${limit}
    `;
  } else {
    productsWithoutImages = await sql`
      SELECT p.id, p.sku, p.name
      FROM products p
      WHERE p.is_active = true
        AND NOT EXISTS (
          SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
        )
      ORDER BY p.sku
    `;
  }

  console.log(`Found ${productsWithoutImages.length} products without images\n`);

  if (productsWithoutImages.length === 0) {
    console.log('All products have images!');
    process.exit(0);
  }

  // Get SKUs to fetch from Neto
  const skus = productsWithoutImages.map(p => p.sku);

  // Fetch image info from Neto API
  console.log('Fetching image URLs from Neto API...\n');
  const netoProducts = await fetchNetoProductsWithImages(skus);

  console.log(`Received ${netoProducts.length} products from Neto\n`);

  // Track results
  let downloaded = 0;
  let noImages = 0;
  let errors = 0;

  // Create a lookup map
  const netoMap = new Map<string, NetoItem>();
  for (const item of netoProducts) {
    netoMap.set(item.SKU, item);
  }

  // Process each product
  for (const product of productsWithoutImages) {
    const netoProduct = netoMap.get(product.sku);

    if (!netoProduct) {
      console.log(`${product.sku}: Not found in Neto`);
      errors++;
      continue;
    }

    const images = netoProduct.Images || [];
    const fallbackUrl = netoProduct.ImageURL;

    if (images.length === 0 && !fallbackUrl) {
      console.log(`${product.sku}: No images in Neto`);
      noImages++;
      continue;
    }

    // Download images
    const productDir = path.join(OUTPUT_DIR, product.sku);
    if (!dryRun && !existsSync(productDir)) {
      mkdirSync(productDir, { recursive: true });
    }

    if (images.length > 0) {
      console.log(`${product.sku}: ${images.length} image(s) found`);

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = path.extname(img.URL) || '.jpg';
        const filename = `${product.sku}_${i + 1}${ext}`;
        const outputPath = path.join(productDir, filename);

        console.log(`  - ${img.URL}`);

        if (!dryRun) {
          const success = await downloadImage(img.URL, outputPath);
          if (success) downloaded++;
          else errors++;
        } else {
          downloaded++;
        }
      }
    } else if (fallbackUrl) {
      console.log(`${product.sku}: Using ImageURL fallback`);
      console.log(`  - ${fallbackUrl}`);

      if (!dryRun) {
        const ext = path.extname(fallbackUrl) || '.jpg';
        const outputPath = path.join(productDir, `${product.sku}_1${ext}`);
        const success = await downloadImage(fallbackUrl, outputPath);
        if (success) downloaded++;
        else errors++;
      } else {
        downloaded++;
      }
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Products processed: ${productsWithoutImages.length}`);
  console.log(`Images downloaded: ${downloaded}`);
  console.log(`Products with no images in Neto: ${noImages}`);
  console.log(`Errors: ${errors}`);

  if (!dryRun) {
    console.log(`\nImages saved to: ${OUTPUT_DIR}/`);
    console.log('\nNext steps:');
    console.log('1. Review downloaded images');
    console.log('2. Run upload-images-to-blob.ts to upload to Vercel Blob');
  }

  process.exit(0);
}

main().catch(console.error);
