import * as fs from 'fs';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';

// Load env from .env.local
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

// Blob URLs from upload
const blobUrls: Record<string, string> = {
  "clamp-one-piece-diagram.png": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/clamp-one-piece-diagram-mSlq4WEB0IsgXm8qidL7eqI37uB3pF.png",
  "clamp-one-piece-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/clamp-one-piece-photo-ZWwwkmxmJynyYZfxeTylFYgiz2QpAr.jpg",
  "clamp-two-piece-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/clamp-two-piece-diagram-ZkeIHfH6wUh60S0mIfGL2RZxwHuQay.jpg",
  "clamp-two-piece-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/clamp-two-piece-photo-wYETzyzltoJnQGsRnDiuveFdEu7A8m.jpg",
  "combi-grip-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/combi-grip-diagram-4Up6NFwRlPUyruzsGECJRER6LLAUZR.jpg",
  "combi-grip-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/combi-grip-photo-vWfT35zzZQuksXV1iUD8TUhWuAo1h9.jpg",
  "flex-1l-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/flex-1l-diagram-7LxM3EX5s7zcaZyX3H6noZEhdD5pgX.jpg",
  "flex-2-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/flex-2-diagram-uOP5wuLrmIH6jIdoQR3diRDx9CMkKe.jpg",
  "flex-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/flex-photo-4YYLV4bCneIBbtiExqiFNdGTZnhrbz.jpg",
  "grip-l-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/grip-l-diagram-10utEoHmXlwRWvlNZreruioofGONb7.jpg",
  "grip-l-large-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/grip-l-large-diagram-VOE1hXqPdI8xbFEvB9CN9rF1Q05mg6.jpg",
  "grip-l-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/grip-l-photo-VNYdE52tCn7NS8Ffw2pj0mP9jHiut3.jpg",
  "metal-grip-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/metal-grip-diagram-Mxhcn3Mf9carS6xx7wa5RuR7k77XjT.jpg",
  "metal-grip-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/metal-grip-photo-ZQ8xAnQICLI9NwOH3oll1dHF44xZO7.jpg",
  "open-flex-1l-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/open-flex-1l-diagram-mI7SYZoy2ySjDB1SVJ5Wzb5dQ6bs9T.jpg",
  "open-flex-2-diagram.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/open-flex-2-diagram-TVMxho1SOrOXjMCigG4PDwSeYLwi0w.jpg",
  "open-flex-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/open-flex-photo-eHTRhEqjp1qJQ7SlBTchwL1Fwu9PdZ.jpg",
  "plastic-grip-photo.jpg": "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/straub/plastic-grip-photo-jUTtAbbeHZ9LXv9pTFkC6w8lwjL8Vp.jpg"
};

// Product slug to image mapping
const productImageMapping: Record<string, { photo?: string; diagram?: string }> = {
  'straub-metal-grip': { photo: 'metal-grip-photo.jpg', diagram: 'metal-grip-diagram.jpg' },
  'straub-grip': { photo: 'grip-l-photo.jpg', diagram: 'grip-l-diagram.jpg' },
  'straub-grip-l': { photo: 'grip-l-photo.jpg', diagram: 'grip-l-diagram.jpg' },
  'straub-combi-grip': { photo: 'combi-grip-photo.jpg', diagram: 'combi-grip-diagram.jpg' },
  'straub-plast-grip': { photo: 'plastic-grip-photo.jpg', diagram: 'combi-grip-diagram.jpg' },
  'straub-flex-1l': { photo: 'flex-photo.jpg', diagram: 'flex-1l-diagram.jpg' },
  'straub-flex-2': { photo: 'flex-photo.jpg', diagram: 'flex-2-diagram.jpg' },
  'straub-flex-3': { photo: 'flex-photo.jpg', diagram: 'flex-2-diagram.jpg' },
  'straub-flex-35': { photo: 'flex-photo.jpg', diagram: 'flex-2-diagram.jpg' },
  'straub-open-flex-1l': { photo: 'open-flex-photo.jpg', diagram: 'open-flex-1l-diagram.jpg' },
  'straub-open-flex-100l': { photo: 'open-flex-photo.jpg', diagram: 'open-flex-1l-diagram.jpg' },
  'straub-open-flex-2': { photo: 'open-flex-photo.jpg', diagram: 'open-flex-2-diagram.jpg' },
  'straub-open-flex-300l': { photo: 'open-flex-photo.jpg', diagram: 'open-flex-2-diagram.jpg' },
  'straub-clamp': { photo: 'clamp-one-piece-photo.jpg', diagram: 'clamp-one-piece-diagram.png' },
  'straub-rep-clamp': { photo: 'clamp-two-piece-photo.jpg', diagram: 'clamp-two-piece-diagram.jpg' },
};

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  // Get Straub brand ID
  const brands = await sql`SELECT id FROM brands WHERE slug = 'straub'`;
  if (brands.length === 0) {
    console.log('Straub brand not found');
    return;
  }
  const brandId = brands[0].id;
  console.log('Straub brand ID:', brandId);

  // Get all Straub products
  const products = await sql`SELECT id, slug, name FROM products WHERE brand_id = ${brandId}`;
  console.log(`\nFound ${products.length} Straub products\n`);

  for (const product of products) {
    console.log(`\nProcessing: ${product.slug} (${product.name})`);

    // Find matching image mapping
    let imageFiles: { photo?: string; diagram?: string } | undefined;
    for (const [pattern, files] of Object.entries(productImageMapping)) {
      if (product.slug.includes(pattern) || pattern.includes(product.slug)) {
        imageFiles = files;
        break;
      }
    }

    // Try partial matching
    if (!imageFiles) {
      if (product.slug.includes('metal-grip')) {
        imageFiles = productImageMapping['straub-metal-grip'];
      } else if (product.slug.includes('grip') && !product.slug.includes('combi') && !product.slug.includes('plast')) {
        imageFiles = productImageMapping['straub-grip'];
      } else if (product.slug.includes('combi')) {
        imageFiles = productImageMapping['straub-combi-grip'];
      } else if (product.slug.includes('plast')) {
        imageFiles = productImageMapping['straub-plast-grip'];
      } else if (product.slug.includes('open-flex')) {
        imageFiles = product.slug.includes('100') || product.slug.includes('1l')
          ? productImageMapping['straub-open-flex-1l']
          : productImageMapping['straub-open-flex-2'];
      } else if (product.slug.includes('flex')) {
        imageFiles = product.slug.includes('1l')
          ? productImageMapping['straub-flex-1l']
          : productImageMapping['straub-flex-2'];
      } else if (product.slug.includes('clamp') || product.slug.includes('rep')) {
        imageFiles = productImageMapping['straub-clamp'];
      }
    }

    if (!imageFiles) {
      console.log('  ⚠ No image mapping found');
      continue;
    }

    // Get current images
    const currentImages = await sql`SELECT id, url, is_primary FROM product_images WHERE product_id = ${product.id}`;
    console.log(`  Current images: ${currentImages.length}`);

    // Update or insert photo (primary image)
    if (imageFiles.photo && blobUrls[imageFiles.photo]) {
      const photoUrl = blobUrls[imageFiles.photo];
      const primaryImage = currentImages.find((img: any) => img.is_primary);

      if (primaryImage) {
        await sql`UPDATE product_images SET url = ${photoUrl}, alt = ${product.name} WHERE id = ${primaryImage.id}`;
        console.log(`  ✓ Updated primary image`);
      } else {
        await sql`INSERT INTO product_images (product_id, url, alt, is_primary, display_order) VALUES (${product.id}, ${photoUrl}, ${product.name}, true, 0)`;
        console.log(`  ✓ Added primary image`);
      }
    }

    // Add diagram as secondary image if not exists
    if (imageFiles.diagram && blobUrls[imageFiles.diagram]) {
      const diagramUrl = blobUrls[imageFiles.diagram];
      const hasDiagram = currentImages.some((img: any) => img.url.includes('diagram'));

      if (!hasDiagram) {
        await sql`INSERT INTO product_images (product_id, url, alt, is_primary, display_order) VALUES (${product.id}, ${diagramUrl}, ${product.name + ' Technical Diagram'}, false, 1)`;
        console.log(`  ✓ Added diagram image`);
      }
    }
  }

  console.log('\n✓ Database updated!');
}

main().catch(console.error);
