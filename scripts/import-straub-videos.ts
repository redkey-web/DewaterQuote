/**
 * Import Straub videos from DeWater Products YouTube channel to database
 * Usage: npx tsx scripts/import-straub-videos.ts [--dry-run]
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const DRY_RUN = process.argv.includes('--dry-run');

// Map product slugs to their videos
// Videos are from the DeWater Products YouTube channel
const VIDEO_MAPPINGS: Record<string, Array<{ youtubeId: string; title: string; sizeLabel?: string }>> = {
  // STRAUB-FLEX 1 Pipe Coupling
  'straub-flex-1': [
    { youtubeId: 'ev1DEQWeA7M', title: '114.3mm Straub Flex 1L', sizeLabel: '114.3mm' },
    { youtubeId: 'Z4j1-EqqQgQ', title: '133.0mm Straub Flex 1L pipe coupling', sizeLabel: '133.0mm' },
    { youtubeId: '5Wa29DQ3YV4', title: '48.3mm Straub Flex 1L | Australian Supplier', sizeLabel: '48.3mm' },
    { youtubeId: 'uYtrb8bVtLk', title: '60.3mm pipe coupling Straub Flex', sizeLabel: '60.3mm' },
    { youtubeId: 'jNHyekLWwgI', title: '88.9mm pipe coupling Straub Flex 1L', sizeLabel: '88.9mm' },
    { youtubeId: 'biioWtc9TMg', title: 'Straub Flex 1L 127.0mm', sizeLabel: '127.0mm' },
  ],

  // STRAUB-FLEX 2 Pipe Coupling
  'straub-flex-2': [
    { youtubeId: 'VWtJcFWUPU8', title: '232mm pipe coupling Straub Flex 2LS', sizeLabel: '232.0mm' },
    { youtubeId: 'cnrio-XMVQ4', title: '406.4mm Straub Flex 2LS', sizeLabel: '406.4mm' },
    { youtubeId: 'SeFKq-XBSUI', title: '406.4mm Straub Flex 2LU | Australian Supplier', sizeLabel: '406.4mm' },
    { youtubeId: 'CcB5azysT-U', title: '609.6mm Straub Flex 2H pipe coupling', sizeLabel: '609.6mm' },
    { youtubeId: 'JPCn4RJTi6k', title: 'Straub Flex 2LS 180.0mm', sizeLabel: '180.0mm' },
    { youtubeId: '5MV0b1uvxAY', title: 'Straub Flex 2LS 219.1mm', sizeLabel: '219.1mm' },
    { youtubeId: '35pRqltNSnA', title: 'Straub Flex 2LS 273.0mm', sizeLabel: '273.0mm' },
    { youtubeId: 'sPYMx3UDPuM', title: 'Straub Flex 2LS 285.0mm Australia', sizeLabel: '285.0mm' },
    { youtubeId: 'TCqI0XVqj7Y', title: 'Straub Flex 2LS 323.9mm | Australia', sizeLabel: '323.9mm' },
    { youtubeId: 'SEAivK4JSgo', title: 'Straub Flex 2LS 336.0mm', sizeLabel: '336.0mm' },
    { youtubeId: 'aGh60EufDoc', title: 'Straub Flex 2LS 470.0mm', sizeLabel: '470.0mm' },
    { youtubeId: 'o-zqgtOYakQ', title: 'Straub Flex 2LS pipe coupling 521.0mm', sizeLabel: '521.0mm' },
    { youtubeId: 'Rkmmzh3A010', title: 'Straub Flex 914.4mm pipe coupling', sizeLabel: '914.4mm' },
  ],

  // Straub Grip L
  'straub-grip-l': [
    { youtubeId: '1bzTpN9wf18', title: '42.4mm Straub Grip L pipe coupling', sizeLabel: '42.4mm' },
    { youtubeId: 'itn2g_9ynqQ', title: 'Straub Grip L 323.9mm pipe coupling', sizeLabel: '323.9mm' },
  ],

  // STRAUB-METAL-GRIP Pipe Coupling
  'straub-metal-grip': [
    { youtubeId: 'flgKdadv7YE', title: 'Straub Metal Grip 114.3mm', sizeLabel: '114.3mm' },
    { youtubeId: 'pobbtc0Mf5g', title: 'Straub Metal Grip 48.3mm pipe coupling', sizeLabel: '48.3mm' },
    { youtubeId: 'OhY0VR_HTSU', title: 'Straub Metal Grip 76.1mm', sizeLabel: '76.1mm' },
  ],

  // STRAUB-OPEN-FLEX 1 Pipe Coupling (1L series)
  'straub-open-flex-1': [
    { youtubeId: 'JaSRt9MrCwg', title: 'Straub Open Flex 1L 114.3mm | Australia', sizeLabel: '114.3mm' },
    { youtubeId: '9s3dFqAUwXI', title: 'Straub Open Flex 1L 48.3mm | Australian Supplier', sizeLabel: '48.3mm' },
  ],

  // STRAUB-OPEN-FLEX 2 Pipe Coupling (2LS/2LU series)
  'straub-open-flex-2': [
    { youtubeId: 'U7b0cAcNpok', title: '508.0mm Straub Open Flex 2LS', sizeLabel: '508.0mm' },
    { youtubeId: 'm95lU9En2aU', title: 'Straub Open Flex 219.1mm', sizeLabel: '219.1mm' },
    { youtubeId: 'cF3_ys-Pak4', title: 'Straub Open Flex 2LU size 219.1mm PN25 rated', sizeLabel: '219.1mm' },
  ],

  // STRAUB-CLAMP Two-Piece (SCE clamps)
  'straub-clamp-two-piece': [
    { youtubeId: '5Ii1N101jpc', title: 'Straub Clamp SCE 114.3mm', sizeLabel: '114.3mm' },
    { youtubeId: 'zEzICw7t1xA', title: 'Straub Clamp SCE 215.0mm', sizeLabel: '215.0mm' },
  ],

  // STRAUB-COMBI-GRIP Pipe Coupling
  'straub-combi-grip': [
    { youtubeId: 'FCsx08EDQCA', title: 'Straub Combi Grip - pipe coupling for joining metal and plastic pipe connections' },
  ],

  // STRAUB-GRIP Pipe Coupling (general - Fire Fence is a specialty Grip variant)
  'straub-grip': [
    { youtubeId: '5cVxjBL_-3E', title: 'Straub Fire Fence coupling' },
  ],
};

async function main() {
  console.log('Importing Straub videos from DeWater Products YouTube channel...');
  if (DRY_RUN) {
    console.log('DRY RUN MODE - no changes will be made\n');
  }

  // Get all Straub products
  const products = await sql`
    SELECT p.id, p.slug, p.name,
           (SELECT COUNT(*) FROM product_videos WHERE product_id = p.id) as video_count
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    WHERE b.name ILIKE '%straub%'
  `;

  const productBySlug = new Map<string, { id: number; name: string; videoCount: number }>();
  for (const p of products) {
    productBySlug.set(p.slug, {
      id: p.id,
      name: p.name,
      videoCount: parseInt(p.video_count) || 0,
    });
  }

  console.log('=== PRODUCT VIDEO STATUS ===\n');
  let totalVideosToAdd = 0;
  const videosToInsert: Array<{
    productId: number;
    youtubeId: string;
    title: string;
    sizeLabel?: string;
    displayOrder: number;
  }> = [];

  for (const [slug, videos] of Object.entries(VIDEO_MAPPINGS)) {
    const product = productBySlug.get(slug);
    if (!product) {
      console.log(`SKIP: ${slug} - NOT IN DATABASE`);
      continue;
    }

    console.log(`${slug}: ${product.name}`);
    console.log(`  Current videos: ${product.videoCount}`);
    console.log(`  Videos to add: ${videos.length}`);

    if (product.videoCount === 0) {
      let order = 0;
      for (const video of videos) {
        videosToInsert.push({
          productId: product.id,
          youtubeId: video.youtubeId,
          title: video.title,
          sizeLabel: video.sizeLabel,
          displayOrder: order++,
        });
        totalVideosToAdd++;
      }
    } else {
      console.log('  -> Skipping (already has videos)');
    }
    console.log();
  }

  console.log('=== SUMMARY ===');
  console.log(`Total videos to add: ${totalVideosToAdd}`);
  console.log();

  if (videosToInsert.length === 0) {
    console.log('No new videos to add.');
    return;
  }

  if (!DRY_RUN) {
    console.log('Adding videos to database...');
    for (const v of videosToInsert) {
      await sql`
        INSERT INTO product_videos (product_id, youtube_id, title, size_label, display_order)
        VALUES (${v.productId}, ${v.youtubeId}, ${v.title}, ${v.sizeLabel || null}, ${v.displayOrder})
      `;
      console.log(`  Added: ${v.title}`);
    }
    console.log(`\nDone! Added ${videosToInsert.length} videos.`);
  } else {
    console.log('[DRY RUN] Would add the following videos:');
    for (const v of videosToInsert) {
      console.log(`  - ${v.title} (${v.youtubeId})`);
    }
  }
}

main().catch(console.error);
