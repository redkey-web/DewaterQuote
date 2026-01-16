/**
 * Import basket strainer videos from Neto scrape to database
 * Usage: npx tsx scripts/import-basket-strainer-videos.ts [--dry-run]
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const sql = neon(process.env.DATABASE_URL!);

const DRY_RUN = process.argv.includes('--dry-run');

interface ScrapedProduct {
  sku: string;
  netoUrl: string;
  images: {
    main: string | null;
    alt: string[];
  };
  videos: string[];
  hasVideoTab: boolean;
  scrapedAt: string;
}

interface ScrapeData {
  products: ScrapedProduct[];
}

async function main() {
  console.log('Importing basket strainer videos from Neto scrape...');
  if (DRY_RUN) {
    console.log('DRY RUN MODE - no changes will be made\n');
  }

  // Load scraped data
  const scrapePath = path.join(process.cwd(), '.planning', 'audit', 'neto-basket-scrape.json');
  const scrapeData: ScrapeData = JSON.parse(fs.readFileSync(scrapePath, 'utf-8'));

  // Get current database state for these SKUs
  const skus = scrapeData.products.map(p => p.sku);

  // Use parameterized query
  const query = "SELECT id, sku, name, video, (SELECT COUNT(*) FROM product_images WHERE product_id = products.id) as image_count FROM products WHERE sku = ANY($1)";
  const dbProducts = await sql(query, [skus]);

  // Create lookup map
  const dbBysku = new Map<string, any>();
  for (const p of dbProducts) {
    dbBysku.set(p.sku, p);
  }

  console.log('=== COMPARISON ===\n');
  console.log('SKU'.padEnd(18), 'DB Images', 'Neto Images', 'DB Video', 'Neto Video');
  console.log('-'.repeat(80));

  const videosToAdd: Array<{id: number, sku: string, videoUrl: string}> = [];
  const imageGaps: Array<{sku: string, dbCount: number, netoCount: number}> = [];

  for (const scraped of scrapeData.products) {
    const db = dbBysku.get(scraped.sku);
    if (!db) {
      console.log(scraped.sku.padEnd(18), 'NOT IN DB');
      continue;
    }

    const dbImageCount = parseInt(db.image_count) || 0;
    const netoImageCount = 1 + scraped.images.alt.length; // main + alts
    const hasDbVideo = db.video ? 'YES' : 'NO';
    const hasNetoVideo = scraped.videos.length > 0 ? 'YES' : 'NO';

    console.log(
      scraped.sku.padEnd(18),
      String(dbImageCount).padEnd(10),
      String(netoImageCount).padEnd(12),
      hasDbVideo.padEnd(9),
      hasNetoVideo + (scraped.videos[0] ? ' (' + scraped.videos[0].split('=')[1] + ')' : '')
    );

    // Track videos to add
    if (scraped.videos.length > 0 && !db.video) {
      videosToAdd.push({
        id: db.id,
        sku: scraped.sku,
        videoUrl: scraped.videos[0]
      });
    }

    // Track image gaps
    if (netoImageCount > dbImageCount) {
      imageGaps.push({
        sku: scraped.sku,
        dbCount: dbImageCount,
        netoCount: netoImageCount
      });
    }
  }

  console.log('\n=== VIDEOS TO ADD ===');
  if (videosToAdd.length === 0) {
    console.log('No new videos to add.');
  } else {
    for (const v of videosToAdd) {
      console.log('  ' + v.sku + ': ' + v.videoUrl);
    }

    if (!DRY_RUN) {
      console.log('\nAdding videos to database...');
      for (const v of videosToAdd) {
        await sql("UPDATE products SET video = $1 WHERE id = $2", [v.videoUrl, v.id]);
        console.log('  Updated ' + v.sku);
      }
      console.log('Done! Added ' + videosToAdd.length + ' videos.');
    } else {
      console.log('\n[DRY RUN] Would add ' + videosToAdd.length + ' videos.');
    }
  }

  console.log('\n=== IMAGE GAPS ===');
  if (imageGaps.length === 0) {
    console.log('No image gaps found - database has same or more images than Neto.');
  } else {
    console.log('Products where Neto has more images than DB:');
    for (const g of imageGaps) {
      console.log('  ' + g.sku + ': DB has ' + g.dbCount + ', Neto has ' + g.netoCount);
    }
    console.log('\nNote: Review these manually if you want to add missing alt images.');
  }
}

main().catch(console.error);
