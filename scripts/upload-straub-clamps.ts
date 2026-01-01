import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local before other imports
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
});

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const clampImages = [
  // SCE Clamp (one-piece) - maps to "straub-clamp" products
  {
    localPath: 'public/images/products/straub/clamps/straub-clamp-sce-photo.jpg',
    blobPath: 'products/straub/straub-clamp-sce-photo.jpg',
    type: 'photo',
    productPattern: 'straub-clamp',
    alt: 'Straub Clamp SCE'
  },
  {
    localPath: 'public/images/products/straub/clamps/straub-clamp-sce-diagram.png',
    blobPath: 'products/straub/straub-clamp-sce-diagram.png',
    type: 'diagram',
    productPattern: 'straub-clamp',
    alt: 'Straub Clamp SCE Technical Diagram'
  },
  // SCZ Clamp (two-piece) - maps to "straub-rep-clamp" products
  {
    localPath: 'public/images/products/straub/clamps/straub-clamp-scz-photo.jpg',
    blobPath: 'products/straub/straub-clamp-scz-photo.jpg',
    type: 'photo',
    productPattern: 'straub-rep-clamp',
    alt: 'Straub Rep Clamp SCZ'
  },
  {
    localPath: 'public/images/products/straub/clamps/straub-clamp-scz-diagram.jpg',
    blobPath: 'products/straub/straub-clamp-scz-diagram.jpg',
    type: 'diagram',
    productPattern: 'straub-rep-clamp',
    alt: 'Straub Rep Clamp SCZ Technical Diagram'
  }
];

async function main() {
  console.log('Uploading Straub Clamp images to Vercel Blob...\n');

  const blobUrls: Record<string, string> = {};

  // Upload to Vercel Blob
  for (const image of clampImages) {
    const fullPath = path.join(__dirname, '..', image.localPath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠ File not found: ${image.localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const contentType = image.localPath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    try {
      const blob = await put(image.blobPath, fileBuffer, {
        access: 'public',
        contentType,
        cacheControlMaxAge: 31536000, // 1 year
      });

      blobUrls[image.blobPath] = blob.url;
      console.log(`✓ Uploaded: ${image.blobPath}`);
      console.log(`  URL: ${blob.url}`);
    } catch (err: any) {
      console.error(`✗ Failed to upload ${image.blobPath}:`, err.message);
    }
  }

  console.log('\n--- Updating Database ---\n');

  const sql = neon(process.env.DATABASE_URL!);

  // Get Straub brand ID
  const brands = await sql`SELECT id FROM brands WHERE slug = 'straub'`;
  if (brands.length === 0) {
    console.log('Straub brand not found');
    return;
  }
  const brandId = brands[0].id;

  // Get Straub clamp products
  const products = await sql`
    SELECT id, slug, name FROM products
    WHERE brand_id = ${brandId}
    AND (slug LIKE '%clamp%' OR slug LIKE '%rep-clamp%')
  `;

  console.log(`Found ${products.length} clamp products\n`);

  for (const product of products) {
    console.log(`Processing: ${product.slug} (${product.name})`);

    // Determine which images to use based on product slug
    let photoUrl: string | undefined;
    let diagramUrl: string | undefined;
    let photoAlt: string | undefined;
    let diagramAlt: string | undefined;

    if (product.slug.includes('rep-clamp') || product.slug.includes('scz')) {
      // Two-piece clamp (SCZ)
      photoUrl = blobUrls['products/straub/straub-clamp-scz-photo.jpg'];
      diagramUrl = blobUrls['products/straub/straub-clamp-scz-diagram.jpg'];
      photoAlt = 'Straub Rep Clamp SCZ';
      diagramAlt = 'Straub Rep Clamp SCZ Technical Diagram';
    } else if (product.slug.includes('clamp') || product.slug.includes('sce')) {
      // One-piece clamp (SCE)
      photoUrl = blobUrls['products/straub/straub-clamp-sce-photo.jpg'];
      diagramUrl = blobUrls['products/straub/straub-clamp-sce-diagram.png'];
      photoAlt = 'Straub Clamp SCE';
      diagramAlt = 'Straub Clamp SCE Technical Diagram';
    }

    if (!photoUrl && !diagramUrl) {
      console.log('  ⚠ No matching images found');
      continue;
    }

    // Get current images
    const currentImages = await sql`SELECT id, url, is_primary FROM product_images WHERE product_id = ${product.id}`;
    console.log(`  Current images: ${currentImages.length}`);

    // Update or insert photo (primary image)
    if (photoUrl) {
      const primaryImage = currentImages.find((img: any) => img.is_primary);

      if (primaryImage) {
        await sql`UPDATE product_images SET url = ${photoUrl}, alt = ${photoAlt} WHERE id = ${primaryImage.id}`;
        console.log(`  ✓ Updated primary image`);
      } else {
        await sql`INSERT INTO product_images (product_id, url, alt, is_primary, display_order) VALUES (${product.id}, ${photoUrl}, ${photoAlt}, true, 0)`;
        console.log(`  ✓ Added primary image`);
      }
    }

    // Add diagram as secondary image if not exists
    if (diagramUrl) {
      const hasDiagram = currentImages.some((img: any) => img.url.includes('diagram'));

      if (!hasDiagram) {
        await sql`INSERT INTO product_images (product_id, url, alt, is_primary, display_order) VALUES (${product.id}, ${diagramUrl}, ${diagramAlt}, false, 1)`;
        console.log(`  ✓ Added diagram image`);
      } else {
        // Update existing diagram
        const diagramImage = currentImages.find((img: any) => img.url.includes('diagram'));
        if (diagramImage) {
          await sql`UPDATE product_images SET url = ${diagramUrl}, alt = ${diagramAlt} WHERE id = ${diagramImage.id}`;
          console.log(`  ✓ Updated diagram image`);
        }
      }
    }
  }

  console.log('\n✓ Database updated!');
}

main().catch(console.error);
