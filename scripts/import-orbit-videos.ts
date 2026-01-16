/**
 * Import Orbit Couplings YouTube videos to database
 * Usage: npx tsx scripts/import-orbit-videos.ts [--dry-run]
 *
 * Videos scraped from: https://www.youtube.com/@orbitcouplings8194/videos
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const DRY_RUN = process.argv.includes("--dry-run");

// Video mappings by product slug
// Each product can have multiple videos, with optional size labels
const VIDEO_MAPPINGS: Record<string, Array<{ youtubeId: string; title: string; sizeLabel?: string; isPrimary?: boolean }>> = {
  // Flex Grip S (Short coupling) - already has 22 videos
  "flex-grip-s-pipe-coupling": [
    { youtubeId: "QdwN94vqorE", title: "110mm pipe coupling Flex Grip S", sizeLabel: "110.0mm", isPrimary: true },
    { youtubeId: "xDGnYRfNX7I", title: "26.7mm pipe coupling Flex Grip S", sizeLabel: "26.7mm" },
    { youtubeId: "0-S7U35W9WM", title: "180.3mm pipe coupling Flex Grip S", sizeLabel: "180.3mm" },
    { youtubeId: "9BtB63x4Gwg", title: "231.1mm pipe coupling Flex Grip S", sizeLabel: "231.1mm" },
    { youtubeId: "Gzsxku8ijcc", title: "280mm pipe coupling Flex Grip S", sizeLabel: "280.0mm" },
    { youtubeId: "udsrPE3kILU", title: "285mm pipe coupling Flex Grip S", sizeLabel: "285.0mm" },
    { youtubeId: "m660Dv0M_qc", title: "88.9mm pipe coupling Flex Grip S", sizeLabel: "88.9mm" },
    { youtubeId: "Jb6wCkvh4A0", title: "168.3mm pipe coupling Flex Grip S", sizeLabel: "168.3mm" },
    { youtubeId: "HyZgIqZP8SQ", title: "219.1mm pipe coupling Flex Grip S", sizeLabel: "219.1mm" },
    { youtubeId: "iTK4TcIyGFM", title: "114.3mm pipe coupling Flex Grip S", sizeLabel: "114.3mm" },
    { youtubeId: "2LvLMkJS0GY", title: "133.0mm pipe coupling Flex Grip S", sizeLabel: "133.0mm" },
    { youtubeId: "g2MHEeNYOEQ", title: "368.0mm Flex Grip S pipe coupling", sizeLabel: "368.0mm" },
    { youtubeId: "QzYyqmGZ9Xw", title: "141.3mm pipe coupling Flex Grip S", sizeLabel: "141.3mm" },
    { youtubeId: "pcDoCrtrtdM", title: "400.0mm pipe coupling Flex Grip S", sizeLabel: "400.0mm" },
    { youtubeId: "icFpNFJmXis", title: "243.0mm pipe coupling Flex Grip S", sizeLabel: "243.0mm" },
    { youtubeId: "eSSeDh_di0s", title: "273.0mm Orbit Couplings Flex Grip S", sizeLabel: "273.0mm" },
    { youtubeId: "IsWBYOqbkl4", title: "141.3mm pipe coupling Flex Grip S", sizeLabel: "141.3mm" },
    { youtubeId: "imuMXjNC1K8", title: "139.7mm pipe coupling Flex Grip S", sizeLabel: "139.7mm" },
    { youtubeId: "sUjiGf8LbFo", title: "140.0mm pipe coupling Flex Grip S", sizeLabel: "140.0mm" },
    { youtubeId: "GMlOAafIniM", title: "127.0mm pipe coupling Flex Grip S", sizeLabel: "127.0mm" },
    { youtubeId: "7JX8VW53Z1A", title: "469.0mm pipe coupling Flex Grip S", sizeLabel: "469.0mm" },
    { youtubeId: "v9P7cQW66wU", title: "126.3mm pipe coupling Flex Grip S", sizeLabel: "126.3mm" },
  ],

  // Flex Grip L (Long coupling) - already has 1 video
  "flex-grip-l-pipe-coupling": [
    { youtubeId: "sUyxmHis4gg", title: "114.3mm Flex Grip L pipe coupling", sizeLabel: "114.3mm", isPrimary: true },
  ],

  // Flex Grip Open L - already has 12 videos
  "flex-grip-open-l": [
    { youtubeId: "cMtEdPqz0kY", title: "Flex Grip Open L - Orbit Couplings", isPrimary: true },
    { youtubeId: "K39yAsBdb5g", title: "315.0mm Flex Grip Open L", sizeLabel: "315.0mm" },
    { youtubeId: "xIQ1-8v516o", title: "280.0mm Flex Grip Open L", sizeLabel: "280.0mm" },
    { youtubeId: "K5BVQGjFjpU", title: "250.0mm Flex Grip Open L", sizeLabel: "250.0mm" },
    { youtubeId: "XYFkJc8yXaA", title: "225.0mm Flex Grip Open L", sizeLabel: "225.0mm" },
    { youtubeId: "pkgr_q1fIbE", title: "110.0mm Flex Grip Open L", sizeLabel: "110.0mm" },
    { youtubeId: "44VzKWjSGJ8", title: "90.0mm Flex Grip Open L", sizeLabel: "90.0mm" },
    { youtubeId: "JLBKSYGCB-E", title: "160.0mm Flex Grip Open L", sizeLabel: "160.0mm" },
    { youtubeId: "hG3xyRt0z0Q", title: "168.3mm Orbit Flex Grip Open L", sizeLabel: "168.3mm" },
    { youtubeId: "RTKKD85xdWo", title: "88.9mm Orbit Flex Grip Open L", sizeLabel: "88.9mm" },
    { youtubeId: "emWNSIvONzc", title: "114.3mm Flex Grip Open L", sizeLabel: "114.3mm" },
    { youtubeId: "-VsBwhB7mbA", title: "150mm Flex Grip Open L", sizeLabel: "150.0mm" },
    { youtubeId: "-CeT0rnRDBk", title: "323.9mm Orbit Flex Grip Open 2 L", sizeLabel: "323.9mm" },
    { youtubeId: "YdsWp-ba1L0", title: "Orbit Flex Grip Open S 231.1mm coupling", sizeLabel: "231.1mm" },
    { youtubeId: "j6C4K2tA3ew", title: "290mm Flex Grip Open S", sizeLabel: "290.0mm" },
  ],

  // Flex Grip 2 S (Short 2-bolt) - already has 4 videos
  "flex-grip-2-s": [
    { youtubeId: "e_NDojKLRak", title: "180.3mm Orbit Flex Grip 2 S rated PN16", sizeLabel: "180.3mm", isPrimary: true },
    { youtubeId: "MbtPXwtJE50", title: "Orbit Couplings Flex Grip 2 S 231.1mm", sizeLabel: "231.1mm" },
    { youtubeId: "0fuVelXmUMQ", title: "Orbit Flex Grip 2 S 355.6mm pipe coupling", sizeLabel: "355.6mm" },
    { youtubeId: "bSXu-OCqFSc", title: "Orbit Flex Grip 2 S 400.0mm", sizeLabel: "400.0mm" },
  ],

  // Flex Grip 2 L (Long 2-bolt) - already has 7 videos
  "flex-grip-2-l": [
    { youtubeId: "j81Igi4y8pE", title: "Flex Grip 2P Long model by Orbit Couplings 114.3mm", sizeLabel: "114.3mm", isPrimary: true },
    { youtubeId: "-Oc5JZAjJH0", title: "560.0mm Orbit Couplings Flex Grip 2 L EPDM/316SS PN9", sizeLabel: "560.0mm" },
    { youtubeId: "kNVu-zUJ9T0", title: "Orbit Flex Grip 2 L 585.0mm pipe coupling", sizeLabel: "585.0mm" },
    { youtubeId: "yD4zYWItuew", title: "Orbit Couplings Flex Grip 2 L 114.3mm", sizeLabel: "114.3mm" },
    { youtubeId: "aWJGN4mKYRw", title: "114.3mm Flex Grip 2 L", sizeLabel: "114.3mm" },
    { youtubeId: "CQwUmfww_64", title: "350.0mm Flex Grip 2 L", sizeLabel: "350.0mm" },
    { youtubeId: "QkIi9G5VkhI", title: "177mm pipe coupling Orbit Flex Grip 2 L", sizeLabel: "177.0mm" },
    { youtubeId: "fvrqb7Kynns", title: "259mm pipe coupling Orbit Flex Grip 2 L", sizeLabel: "259.0mm" },
  ],

  // Metal Lock S - already has 4 videos
  "metal-lock-s-pipe-coupling": [
    { youtubeId: "EEhU2EZc9uA", title: "105.0mm pipe coupling Metal Lock S", sizeLabel: "105.0mm", isPrimary: true },
    { youtubeId: "AVeiQHUmMwk", title: "457.2mm Metal Lock S pipe coupling", sizeLabel: "457.2mm" },
    { youtubeId: "ewArOaNvrb4", title: "508.0mm Metal Lock S pipe coupling", sizeLabel: "508.0mm" },
    { youtubeId: "Ljeh5AHQgI8", title: "323.9mm Metal Lock S", sizeLabel: "323.9mm" },
    { youtubeId: "KHisoComvno", title: "114.3mm Metal Lock L - Orbit Couplings", sizeLabel: "114.3mm" },
    { youtubeId: "GZ8oE70yTXU", title: "159.0mm pipe coupling Metal Lock L", sizeLabel: "159.0mm" },
  ],

  // Repair Clamp 55mm (Series 1)
  "orbit-pipe-repair-clamp-series-1-and-55mm-long": [
    { youtubeId: "HcHSWrGxwDU", title: "Orbit Repair Clamp size 48.3mm x 100mm wide", sizeLabel: "48.3mm", isPrimary: true },
    { youtubeId: "VRei4m3c3Ck", title: "48.3mm Orbit repair clamp 55mm wide", sizeLabel: "48.3mm" },
    { youtubeId: "V6DefwmNeS4", title: "Orbit Repair Clamp 139.7mm", sizeLabel: "139.7mm" },
    { youtubeId: "T29C_Orb2r4", title: "88.9mm Orbit Repair clamp 400mm wide", sizeLabel: "88.9mm" },
    { youtubeId: "Ivx-jpiawi4", title: "168.3mm Orbit Repair Clamp", sizeLabel: "168.3mm" },
    { youtubeId: "Td-AeF_HXww", title: "84.0mm Orbit repair clamp", sizeLabel: "84.0mm" },
    { youtubeId: "NIVPuHxjeJY", title: "79.5mm Orbit repair clamp", sizeLabel: "79.5mm" },
    { youtubeId: "AxrtcrRwfXw", title: "76.1mm Orbit Repair Clamp", sizeLabel: "76.1mm" },
    { youtubeId: "KmgvHRrJkXw", title: "75.0mm Orbit repair clamp", sizeLabel: "75.0mm" },
    { youtubeId: "N8rv9N0O4Qc", title: "73.0mm Orbit repair clamp", sizeLabel: "73.0mm" },
    { youtubeId: "CQGknanirvU", title: "70.0mm Orbit Repair Clamp", sizeLabel: "70.0mm" },
    { youtubeId: "aO3GPO14zQw", title: "66.6mm Orbit repair clamp", sizeLabel: "66.6mm" },
    { youtubeId: "AonHFT_1TG0", title: "63.0mm Orbit Repair Clamp", sizeLabel: "63.0mm" },
    { youtubeId: "6P1uv8uRHLQ", title: "60.3mm Orbit Repair Clamp", sizeLabel: "60.3mm" },
    { youtubeId: "12JzTmWWvRc", title: "57.0mm Orbit repair clamp", sizeLabel: "57.0mm" },
    { youtubeId: "E0_Y51QU6ik", title: "54.0mm Orbit repair clamp", sizeLabel: "54.0mm" },
    { youtubeId: "ZM15liEFlsg", title: "50.0mm Orbit repair clamp", sizeLabel: "50.0mm" },
    { youtubeId: "4t8UYLsxM3U", title: "88.9mm Orbit Repair Clamp", sizeLabel: "88.9mm" },
    { youtubeId: "-QmB6IEJ3eM", title: "Orbit Repair Clamp - Seal leaks in pipes effectively" },
    { youtubeId: "ctiUyjr2p2I", title: "Pipe repair solutions with clamps" },
  ],

  // Repair Clamp 200mm Wide
  "orbit-pipe-repair-clamp-200mm-wide": [
    { youtubeId: "y1trgAG_KYs", title: "200.0mm Orbit Repair Clamp x 300mm long", sizeLabel: "200.0mm", isPrimary: true },
    { youtubeId: "Uy7au488-k0", title: "219.1mm Orbit Pipe Repair Clamp", sizeLabel: "219.1mm" },
  ],

  // D-Series Encapsulating Clamp (0 videos)
  "d-series-encapsulating-clamp": [
    { youtubeId: "ZzbJpJhqVNo", title: "88.9mm Encapsulating Pipe Repair Clamp - D Series", sizeLabel: "88.9mm", isPrimary: true },
    { youtubeId: "7Odvbmgc7Jg", title: "Encapsulating Pipe Repair Clamp" },
  ],

  // Orbit Pipe Repair Clamp 55mm wide (0 videos)
  "orbit-pipe-repair-clamp-55mm-wide": [
    { youtubeId: "VRei4m3c3Ck", title: "48.3mm Orbit repair clamp 55mm wide", sizeLabel: "48.3mm", isPrimary: true },
    { youtubeId: "HcHSWrGxwDU", title: "Orbit Repair Clamp size 48.3mm x 100mm wide", sizeLabel: "48.3mm" },
  ],

  // Elbow Repair Clamp - already has 1 video
  "elbow-repair-clamp": [
    { youtubeId: "0PK4Yczgw3U", title: "Elbow Repair Clamp Type 1", isPrimary: true },
    { youtubeId: "3zcwg_p2z2k", title: "Elbow Repair Clamp Type 2" },
    { youtubeId: "ZgWn312aFM8", title: "48.3mm pipe elbow repair clamp", sizeLabel: "48.3mm" },
    { youtubeId: "4hVELaH0LeM", title: "60.3mm pipe elbow repair clamp", sizeLabel: "60.3mm" },
    { youtubeId: "gKumIZBxzJQ", title: "76.1mm pipe elbow repair clamp", sizeLabel: "76.1mm" },
    { youtubeId: "Izl2qIW4Be4", title: "88.9mm pipe elbow repair clamp", sizeLabel: "88.9mm" },
    { youtubeId: "6yL1x2oY3uM", title: "114.3mm pipe elbow repair clamp", sizeLabel: "114.3mm" },
  ],

  // Fire Protection Coupling (0 videos)
  "fire-protection-coupling": [
    { youtubeId: "hCKGRmYVpW0", title: "Buy the best couplings and clamps for your pipe", isPrimary: true },
    { youtubeId: "rNEvt2Y8fhs", title: "Combo Lock Pipe Coupling by Orbit Couplings" },
  ],
};

async function main() {
  console.log("Importing Orbit Couplings YouTube videos to database...");
  if (DRY_RUN) {
    console.log("DRY RUN MODE - no changes will be made\n");
  }

  // Get all Orbit products from database
  const orbitProducts = await sql`
    SELECT p.id, p.slug, p.name, p.sku,
           (SELECT COUNT(*) FROM product_videos WHERE product_id = p.id) as video_count
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    WHERE b.slug = 'orbit'
    ORDER BY p.name
  `;

  console.log("Found " + orbitProducts.length + " Orbit products in database\n");

  // Display current state
  console.log("=== CURRENT STATE ===\n");
  console.log("Slug".padEnd(50) + "Name".padEnd(40) + "Videos");
  console.log("-".repeat(100));

  for (const product of orbitProducts) {
    const videoCount = parseInt(String(product.video_count)) || 0;
    console.log(
      String(product.slug).padEnd(50) +
      String(product.name).substring(0, 38).padEnd(40) +
      String(videoCount)
    );
  }

  // Create lookup map
  const productBySlug = new Map<string, typeof orbitProducts[0]>();
  for (const p of orbitProducts) {
    productBySlug.set(String(p.slug), p);
  }

  // Count videos to add
  let totalVideosToAdd = 0;
  const videosToInsert: Array<{
    productId: number;
    youtubeId: string;
    title: string;
    sizeLabel: string | null;
    isPrimary: boolean;
    displayOrder: number;
  }> = [];

  console.log("\n=== VIDEOS TO ADD ===\n");

  for (const [slug, videos] of Object.entries(VIDEO_MAPPINGS)) {
    const product = productBySlug.get(slug);
    if (!product) {
      console.log("  Product not found: " + slug);
      continue;
    }

    const existingVideoCount = parseInt(String(product.video_count)) || 0;
    if (existingVideoCount > 0) {
      console.log("  Skipping " + slug + " - already has " + existingVideoCount + " videos");
      continue;
    }

    console.log("\n" + product.name + " (" + slug + "):");

    videos.forEach((video, index) => {
      const sizeInfo = video.sizeLabel ? " - " + video.sizeLabel : "";
      console.log("   " + (index + 1) + ". " + video.title + " [" + video.youtubeId + "]" + sizeInfo);
      videosToInsert.push({
        productId: Number(product.id),
        youtubeId: video.youtubeId,
        title: video.title,
        sizeLabel: video.sizeLabel || null,
        isPrimary: video.isPrimary || false,
        displayOrder: index,
      });
      totalVideosToAdd++;
    });
  }

  console.log("\n=== SUMMARY ===");
  console.log("Total videos to add: " + totalVideosToAdd);

  if (totalVideosToAdd === 0) {
    console.log("No new videos to add.");
    return;
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would add " + totalVideosToAdd + " videos.");
    return;
  }

  // Insert videos
  console.log("\nInserting videos...");

  for (const video of videosToInsert) {
    await sql`
      INSERT INTO product_videos (product_id, youtube_id, title, size_label, is_primary, display_order, is_active)
      VALUES (${video.productId}, ${video.youtubeId}, ${video.title}, ${video.sizeLabel}, ${video.isPrimary}, ${video.displayOrder}, true)
    `;
  }

  console.log("\nSuccessfully added " + totalVideosToAdd + " videos!");

  // Verify
  const newCounts = await sql`
    SELECT p.slug, COUNT(pv.id) as video_count
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_videos pv ON pv.product_id = p.id
    WHERE b.slug = 'orbit'
    GROUP BY p.slug
    ORDER BY p.slug
  `;

  console.log("\n=== FINAL STATE ===\n");
  for (const row of newCounts) {
    console.log(row.slug + ": " + row.video_count + " videos");
  }
}

main().catch(console.error);
