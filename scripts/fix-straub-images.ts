import { config } from 'dotenv';
config({ path: '.env.local' });

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  throw new Error('DATABASE_URL not set');
}
const sql = neon(dbUrl);

// Straub product images to fix - mapped to our product slugs
const imageUpdates = [
  {
    slug: 'straub-flex-2',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/c/b/csm_flex-2_7741368230.png',
    filename: 'straub-flex-2.png',
  },
  {
    slug: 'straub-flex-3',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/a/c/csm_flex-3_17ce969a7a.png',
    filename: 'straub-flex-3.png',
  },
  {
    slug: 'straub-flex-35',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/8/1/csm_flex-3-5_ed185be1e8.png',
    filename: 'straub-flex-35.png',
  },
  {
    slug: 'straub-flex-4',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/1/4/csm_flex-4_261c95159d.png',
    filename: 'straub-flex-4.png',
  },
  {
    slug: 'straub-open-flex-2',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/7/d/csm_open-flex-2_a3773b3bc6.png',
    filename: 'straub-open-flex-2.png',
  },
  {
    slug: 'straub-open-flex-3',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/7/5/csm_open-flex-3_84f5b7bb64.png',
    filename: 'straub-open-flex-3.png',
  },
  {
    slug: 'straub-open-flex-35',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/c/0/csm_open-flex-3-5_5d5d88c31c.png',
    filename: 'straub-open-flex-35.png',
  },
  {
    slug: 'straub-open-flex-4',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/8/a/csm_open-flex-4_b990461bae.png',
    filename: 'straub-open-flex-4.png',
  },
  {
    slug: 'straub-rep-flex',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/7/e/csm_07_repflex_73058cd8f2.jpg',
    filename: 'straub-rep-flex.jpg',
  },
  {
    slug: 'straub-plast-pro',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/1/b/csm_06_plastpro_90ae86126e.jpg',
    filename: 'straub-plast-pro.jpg',
  },
  {
    slug: 'straub-square-flex',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/5/e/csm_square-flex_80795b5c44.png',
    filename: 'straub-square-flex.png',
  },
  {
    slug: 'straub-step-flex-2',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/6/6/csm_step-flex-2_6b9d6a9b52.png',
    filename: 'straub-step-flex-2.png',
  },
  {
    slug: 'straub-step-flex-3',
    sourceUrl: 'https://www.straub.ch/fileadmin/Straub/_processed_/4/8/csm_step-flex-3_b52d1a2cd1.png',
    filename: 'straub-step-flex-3.png',
  },
];

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log('Starting Straub image update...\n');

  for (const item of imageUpdates) {
    console.log(`Processing ${item.slug}...`);

    try {
      // 1. Get product ID
      const products = await sql`
        SELECT id FROM products WHERE slug = ${item.slug}
      `;

      if (products.length === 0) {
        console.log(`  ⚠️  Product not found: ${item.slug}`);
        continue;
      }

      const productId = products[0].id;
      console.log(`  Found product ID: ${productId}`);

      // 2. Download image from Straub
      console.log(`  Downloading from Straub...`);
      const imageBuffer = await downloadImage(item.sourceUrl);
      console.log(`  Downloaded ${(imageBuffer.length / 1024).toFixed(1)} KB`);

      // 3. Upload to Vercel Blob
      console.log(`  Uploading to Vercel Blob...`);
      const blob = await put(`products/straub/${item.filename}`, imageBuffer, {
        access: 'public',
        contentType: item.filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
      });
      console.log(`  Uploaded: ${blob.url}`);

      // 4. Update or insert primary image in database
      // First check if there's an existing primary image
      const existingImages = await sql`
        SELECT id FROM product_images
        WHERE product_id = ${productId} AND is_primary = true
      `;

      if (existingImages.length > 0) {
        // Update existing primary image
        await sql`
          UPDATE product_images
          SET url = ${blob.url}, alt = ${item.slug.replace(/-/g, ' ').replace('straub ', 'STRAUB-').toUpperCase()}
          WHERE id = ${existingImages[0].id}
        `;
        console.log(`  ✅ Updated existing image record`);
      } else {
        // Insert new primary image
        await sql`
          INSERT INTO product_images (product_id, url, alt, is_primary, display_order)
          VALUES (${productId}, ${blob.url}, ${item.slug.replace(/-/g, ' ').replace('straub ', 'STRAUB-').toUpperCase()}, true, 0)
        `;
        console.log(`  ✅ Created new image record`);
      }

      console.log('');
    } catch (error) {
      console.error(`  ❌ Error processing ${item.slug}:`, error);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
