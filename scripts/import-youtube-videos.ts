/**
 * Import YouTube videos from fetch-youtube-videos.ts output into product_videos table
 * Usage: npx tsx scripts/import-youtube-videos.ts
 */

// Load dotenv FIRST before any other imports
require('dotenv').config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { db } from '../src/db';
import { products, productVariations, productVideos } from '../src/db/schema';
import { eq, sql } from 'drizzle-orm';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
  sizeMatch: string | null;
  productMatch: string | null;
}

interface YouTubeData {
  fetchedAt: string;
  channelId: string;
  totalVideos: number;
  byProduct: Record<string, YouTubeVideo[]>;
  unmatched: YouTubeVideo[];
  allVideos: YouTubeVideo[];
}

// SKU mapping from productMatch string to actual database SKU
const SKU_MAP: Record<string, string> = {
  'Flex Grip 2P Long (FlexGrip2PLong)': 'FlexGrip2PLong',
  'Flex Grip 2 L (OCFG2-L)': 'OCFG2-L',
  'Flex Grip 2 S (OCFG2-S)': 'OCFG2-S',
  'Flex Grip Open L (OCFGO-L)': 'OCFGO-L',
  'Flex Grip Open S (OCFGO-S)': 'OCFGO-S',
  'Flex Grip L (OCFG-L)': 'OCFG-L',
  'Flex Grip S (OCFG-S)': 'OCFG-S',
  'Open Flex 400-L (OCOF400-L)': 'OCOF400-L',
  'Open Flex 300-L (OCOF300-L)': 'OCOF300-L',
  'Open Flex 200-L (OCOF200-L)': 'OCOF200-L',
  'Metal Lock L (OCML-L)': 'OCML-L',
  'Metal Lock S (OCML-S)': 'OCML-S',
  'Elbow Repair Clamp Type 2 (OCELBRC)': 'OCELBRC',
  'Elbow Repair Clamp Type 1 (OCERC)': 'OCERC',
  'Elbow Repair Clamp (OCERC)': 'OCERC',
  'Encapsulating Pipe Repair Clamp (ENCAPRC-SS)': 'ENCAPRC-SS',
  'Orbit Repair Clamp 400mm (OCRC400)': 'OCRC400',
  'Orbit Repair Clamp 300mm (OCRC300)': 'OCRC300',
  'Orbit Repair Clamp 200mm (OCRC)': 'OCRC',
  'Orbit Repair Clamp 100mm (OCRC100wide)': 'OCRC100wide',
  'Orbit Repair Clamp 55mm (OCRC55)': 'OCRC55',
  'Orbit Repair Clamp (OCRC)': 'OCRC',
  'Universal Dual Clamp (UDC)': 'UDC',
  'Plast Coupling (OCPC)': 'OCPC',
  'Combo Lock (OCCL)': 'OCCL',
  'Pipe Coupling (generic) (UNKNOWN)': null, // Will need manual matching
};

// Normalize size string for comparison (e.g., "114.3mm" -> "114.3")
function normalizeSize(size: string | null): string | null {
  if (!size) return null;
  // Remove 'mm' and trim
  return size.replace(/mm$/i, '').trim();
}

async function main() {
  console.log('Importing YouTube videos to database...\n');

  // Read the JSON file
  const jsonPath = path.join(process.cwd(), '.planning', 'audit', 'youtube-videos.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Error: youtube-videos.json not found. Run fetch-youtube-videos.ts first.');
    process.exit(1);
  }

  const data: YouTubeData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Found ${data.totalVideos} videos to import\n`);

  // Get all products from database
  const dbProducts = await db.query.products.findMany({
    columns: { id: true, sku: true, name: true, shortName: true },
  });
  console.log(`Found ${dbProducts.length} products in database\n`);

  // Create SKU -> product ID map
  const skuToProductId = new Map<string, number>();
  for (const p of dbProducts) {
    skuToProductId.set(p.sku, p.id);
  }

  // Get all variations for size matching
  const dbVariations = await db.query.productVariations.findMany({
    columns: { id: true, productId: true, size: true },
  });

  // Create productId -> (size -> variationId) map
  const productVariationMap = new Map<number, Map<string, number>>();
  for (const v of dbVariations) {
    if (!productVariationMap.has(v.productId)) {
      productVariationMap.set(v.productId, new Map());
    }
    const normalizedSize = normalizeSize(v.size);
    if (normalizedSize) {
      productVariationMap.get(v.productId)!.set(normalizedSize, v.id);
    }
  }

  // Clear existing product_videos (fresh import)
  console.log('Clearing existing product_videos...');
  await db.delete(productVideos);

  // Track stats
  let imported = 0;
  let skipped = 0;
  let unmatchedCount = 0;
  const unmatchedVideos: YouTubeVideo[] = [];

  // Process each video
  for (const video of data.allVideos) {
    // Skip if no product match
    if (!video.productMatch) {
      unmatchedCount++;
      unmatchedVideos.push(video);
      continue;
    }

    // Get SKU from match string
    const sku = SKU_MAP[video.productMatch];
    if (!sku) {
      unmatchedCount++;
      unmatchedVideos.push(video);
      continue;
    }

    // Get product ID
    const productId = skuToProductId.get(sku);
    if (!productId) {
      console.log(`  SKU not found in DB: ${sku}`);
      skipped++;
      continue;
    }

    // Try to match to a variation by size
    let variationId: number | null = null;
    if (video.sizeMatch) {
      const normalizedSize = normalizeSize(video.sizeMatch);
      const variationMap = productVariationMap.get(productId);
      if (variationMap && normalizedSize) {
        variationId = variationMap.get(normalizedSize) || null;
      }
    }

    // Insert video
    await db.insert(productVideos).values({
      productId,
      variationId,
      youtubeId: video.videoId,
      title: video.title,
      sizeLabel: video.sizeMatch,
      isPrimary: false, // Will set primary separately
      displayOrder: 0,
    });

    imported++;
  }

  // Set primary video for each product (first video by date, or most general)
  console.log('\nSetting primary videos...');

  // Get all imported videos grouped by product
  const importedVideos = await db.query.productVideos.findMany({
    orderBy: (pv, { asc }) => [asc(pv.productId), asc(pv.variationId)],
  });

  // Group by productId and set first one (without variation) as primary
  const seenProducts = new Set<number>();
  for (const video of importedVideos) {
    if (!seenProducts.has(video.productId)) {
      // Prefer videos without variationId (general product videos)
      const productVideosForProduct = importedVideos.filter(v => v.productId === video.productId);
      const generalVideo = productVideosForProduct.find(v => !v.variationId) || productVideosForProduct[0];

      if (generalVideo) {
        await db
          .update(productVideos)
          .set({ isPrimary: true })
          .where(eq(productVideos.id, generalVideo.id));
      }

      seenProducts.add(video.productId);
    }
  }

  // Print summary
  console.log('\n=== IMPORT SUMMARY ===');
  console.log(`Total videos: ${data.totalVideos}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped (SKU not in DB): ${skipped}`);
  console.log(`Unmatched (no product pattern): ${unmatchedCount}`);
  console.log(`Products with videos: ${seenProducts.size}`);

  if (unmatchedVideos.length > 0) {
    console.log('\n=== UNMATCHED VIDEOS (need manual review) ===');
    for (const v of unmatchedVideos) {
      console.log(`  - ${v.title}`);
      console.log(`    URL: ${v.url}`);
    }
  }

  // Update the products.video field with primary video URL for backwards compatibility
  console.log('\nUpdating products.video field for backwards compatibility...');

  const primaryVideos = await db.query.productVideos.findMany({
    where: eq(productVideos.isPrimary, true),
  });

  for (const pv of primaryVideos) {
    await db
      .update(products)
      .set({ video: `https://www.youtube.com/watch?v=${pv.youtubeId}` })
      .where(eq(products.id, pv.productId));
  }

  console.log(`Updated ${primaryVideos.length} products with primary video URL`);
  console.log('\nDone!');

  process.exit(0);
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
