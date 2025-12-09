/**
 * Import Products from Neto
 *
 * Usage: npx tsx scripts/import-neto.ts [--dry-run]
 *
 * Pulls all products from the live Neto store and imports them into the database.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import {
  brands,
  categories,
  subcategories,
  products,
  productVariations,
  productImages,
  productFeatures,
  productSpecifications,
} from '../src/db/schema';

// Neto API configuration
const NETO_API_KEY = process.env.NETO_API_KEY || '6hUfRlWbFqgoDrq1Uaa7GfJdywgNtHE6';
const NETO_DOMAIN = process.env.NETO_API_USERNAME || 'dewaterproducts.com.au';
const NETO_API_URL = `https://${NETO_DOMAIN}/do/WS/NetoAPI`;

const isDryRun = process.argv.includes('--dry-run');

interface NetoProduct {
  ID: string;
  SKU: string;
  Name: string;
  Brand?: string;
  Model?: string;
  DefaultPrice?: number;
  RRP?: number;
  PromotionPrice?: number;
  ShortDescription?: string;
  Description?: string;
  Images?: Array<{ URL: string; ThumbURL?: string }>;
  Categories?: Array<{ CategoryID: string; CategoryName: string }>;
  Specifications?: Array<{ Name: string; Value: string }>;
  Features?: string[];
  IsActive?: boolean;
  Approved?: boolean;
}

async function fetchNetoProducts(): Promise<NetoProduct[]> {
  console.log('Fetching products from Neto API...');
  console.log(`  URL: ${NETO_API_URL}`);

  const requestBody = {
    Filter: {
      IsActive: 'True',
      Approved: 'True',
      Limit: 500,
      OutputSelector: [
        'ID',
        'SKU',
        'Name',
        'Brand',
        'Model',
        'DefaultPrice',
        'RRP',
        'PromotionPrice',
        'ShortDescription',
        'Description',
        'Images',
        'Categories',
        'Specifications',
        'Features',
        'IsActive',
        'Approved',
      ],
    },
  };

  const response = await fetch(NETO_API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'NETOAPI_ACTION': 'GetItem',
      'NETOAPI_KEY': NETO_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neto API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (data.Messages?.Error && data.Messages.Error.length > 0) {
    throw new Error(`Neto API error: ${data.Messages.Error[0].Message}`);
  }

  const products = data.Item || [];
  console.log(`  Found ${products.length} products`);

  return products;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Extract size from SKU (e.g., "OCFG-S21.3" -> "21.3")
function extractSizeFromSKU(sku: string): string | null {
  // Match patterns like: -S21.3, -25.0, -M50, etc.
  const match = sku.match(/[-_]?[SM]?(\d+\.?\d*)\s*$/i);
  return match ? match[1] : null;
}

// Straub equivalent mapping based on product names
// These are the obvious equivalents between Orbit Couplings and Straub
const STRAUB_MAPPING: Record<string, string> = {
  // Standard Flex Grip range
  'Flex Grip S': 'STRAUB-FLEX 1',
  'Flex Grip L': 'STRAUB-FLEX 1L',

  // Metal Lock range
  'Metal Lock S': 'STRAUB-METAL-GRIP',
  'Metal Lock L': 'STRAUB-METAL-GRIP L',
  'Metal Lock XL': 'STRAUB-METAL-GRIP XL',

  // Flex Grip Open (hinged/split couplings)
  'Flex Grip Open S': 'STRAUB-OPEN FLEX',
  'Flex Grip Open L': 'STRAUB-OPEN FLEX L',

  // Flex Grip 2 (double seal / O2 safe) - maps to STRAUB-FLEX 2
  'Flex Grip 2 S': 'STRAUB-FLEX 2',
  'Flex Grip 2 L': 'STRAUB-FLEX 2L',
  'Flex Grip O2 S': 'STRAUB-FLEX 2',
  'Flex Grip O2 M': 'STRAUB-FLEX 2',
  'Flex Grip O2 L': 'STRAUB-FLEX 2L',

  // Specialty products
  'Plast Coupling': 'STRAUB-PLAST-PRO',
  'Fire Protection Coupling': 'STRAUB-FIRE COUPLING',
  'Flange Adapter Flex Grip S': 'STRAUB-FLANGE ADAPTER',

  // Repair clamps - Straub calls theirs STRAUB-REP
  'Orbit Pipe Repair Clamp Series 1 and 55mm long': 'STRAUB-REP 1',
  'Orbit Pipe Repair Clamp 55mm wide': 'STRAUB-REP 1',
  'Repair Clamp 55mm wide': 'STRAUB-REP 1',
  'Orbit Pipe Repair Clamp Series 1 and 200mm long': 'STRAUB-REP 2',
  'Orbit Pipe Repair Clamp 200mm wide': 'STRAUB-REP 2',
  'Repair Clamp 200mm wide': 'STRAUB-REP 2',
};

function getStraubEquivalent(productName: string): string | null {
  return STRAUB_MAPPING[productName] || null;
}

// Group products by base name
interface GroupedProduct {
  baseName: string;
  baseSKU: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  categories?: Array<{ CategoryID: string; CategoryName: string }>;
  images: Array<{ URL: string; ThumbURL?: string }>;
  specifications: Array<{ Name: string; Value: string }>;
  features: string[];
  variations: Array<{
    sku: string;
    size: string;
    price: number | null;
    label: string;
  }>;
}

function groupProducts(netoProducts: NetoProduct[]): GroupedProduct[] {
  const groups = new Map<string, GroupedProduct>();

  for (const product of netoProducts) {
    // Use the product name as the grouping key
    const baseName = product.Name.trim();

    // Extract size from SKU
    const size = extractSizeFromSKU(product.SKU);

    if (!groups.has(baseName)) {
      // Create new group
      groups.set(baseName, {
        baseName,
        baseSKU: product.SKU.replace(/[-_]?[SM]?\d+\.?\d*\s*$/i, '') || product.SKU,
        brand: product.Brand,
        description: product.Description,
        shortDescription: product.ShortDescription,
        categories: product.Categories,
        images: product.Images || [],
        specifications: product.Specifications || [],
        features: product.Features || [],
        variations: [],
      });
    }

    const group = groups.get(baseName)!;

    // Add variation
    group.variations.push({
      sku: product.SKU,
      size: size || 'Standard',
      price: product.DefaultPrice || null,
      label: size ? `${size}mm` : 'Standard',
    });

    // Merge images (avoid duplicates)
    if (product.Images) {
      for (const img of product.Images) {
        if (!group.images.some(i => i.URL === img.URL)) {
          group.images.push(img);
        }
      }
    }

    // Use longest description
    if (product.Description && (!group.description || product.Description.length > group.description.length)) {
      group.description = product.Description;
    }
  }

  // Sort variations by size within each group
  for (const group of groups.values()) {
    group.variations.sort((a, b) => {
      const sizeA = parseFloat(a.size) || 0;
      const sizeB = parseFloat(b.size) || 0;
      return sizeA - sizeB;
    });
  }

  return Array.from(groups.values());
}

async function importProducts() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    // Fetch products from Neto
    const netoProducts = await fetchNetoProducts();

    if (netoProducts.length === 0) {
      console.log('No products found in Neto.');
      return;
    }

    // Group products by name
    const groupedProducts = groupProducts(netoProducts);

    console.log('\n--- Product Summary (Grouped) ---');
    console.log(`Raw products from Neto: ${netoProducts.length}`);
    console.log(`Grouped into: ${groupedProducts.length} unique products\n`);

    groupedProducts.forEach((p, i) => {
      const straub = getStraubEquivalent(p.baseName);
      console.log(`${i + 1}. ${p.baseName} (Base SKU: ${p.baseSKU})`);
      if (straub) console.log(`   ⚡ Straub Equivalent: ${straub}`);
      if (p.brand) console.log(`   Brand: ${p.brand}`);
      if (p.categories?.length) console.log(`   Categories: ${p.categories.map(c => c.CategoryName).join(', ')}`);
      console.log(`   Variations: ${p.variations.length}`);
      p.variations.forEach(v => {
        console.log(`     - ${v.label} (${v.sku}): $${v.price || 'N/A'}`);
      });
      if (p.images.length) console.log(`   Images: ${p.images.length}`);
    });

    if (isDryRun) {
      console.log('\n[DRY RUN] No changes made to database.');
      return;
    }

    console.log('\n--- Importing to Database ---');

    // Get existing brands and categories
    const existingBrands = await db.select().from(brands);
    const existingCategories = await db.select().from(categories);

    const brandMap = new Map(existingBrands.map(b => [b.name.toLowerCase(), b.id]));
    const categoryMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c.id]));

    let imported = 0;
    let skipped = 0;

    for (const group of groupedProducts) {
      const slug = generateSlug(group.baseName);

      // Check if product already exists by slug or SKU
      const [existingBySlug] = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);

      const [existingBySKU] = await db
        .select()
        .from(products)
        .where(eq(products.sku, group.baseSKU))
        .limit(1);

      if (existingBySlug || existingBySKU) {
        console.log(`  [SKIP] ${group.baseName} - already exists (slug: ${!!existingBySlug}, sku: ${!!existingBySKU})`);
        skipped++;
        continue;
      }

      // Get or create brand
      let brandId: number | null = null;
      if (group.brand) {
        const brandKey = group.brand.toLowerCase();
        if (brandMap.has(brandKey)) {
          brandId = brandMap.get(brandKey)!;
        } else {
          const [newBrand] = await db
            .insert(brands)
            .values({
              name: group.brand,
              slug: generateSlug(group.brand),
            })
            .returning();
          brandId = newBrand.id;
          brandMap.set(brandKey, brandId);
          console.log(`  [NEW BRAND] ${group.brand}`);
        }
      }

      // Get category (use first one, or default)
      let categoryId = categoryMap.values().next().value || 1;
      if (group.categories?.length && group.categories[0]?.CategoryName) {
        const catName = group.categories[0].CategoryName.toLowerCase();
        if (categoryMap.has(catName)) {
          categoryId = categoryMap.get(catName)!;
        }
      }

      // Calculate price range
      const prices = group.variations.map(v => v.price).filter((p): p is number => p !== null);
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;
      const priceVaries = minPrice !== maxPrice;

      // Extract size range from variations
      const sizes = group.variations
        .map(v => parseFloat(v.size))
        .filter(s => !isNaN(s))
        .sort((a, b) => a - b);
      const sizeFrom = sizes.length ? `${sizes[0]}mm - ${sizes[sizes.length - 1]}mm` : null;

      // Get Straub equivalent
      const straubEquivalent = getStraubEquivalent(group.baseName);

      // Insert product
      const [newProduct] = await db
        .insert(products)
        .values({
          slug,
          sku: group.baseSKU,
          name: group.baseName,
          shortName: null,
          brandId: brandId || 1,
          categoryId,
          description: group.description || group.shortDescription || '',
          basePrice: minPrice ? String(minPrice) : null,
          priceVaries,
          priceNote: priceVaries && maxPrice ? `$${minPrice} - $${maxPrice}` : null,
          sizeFrom,
          straubEquivalent,
          isActive: true,
        })
        .returning();

      console.log(`  [IMPORTED] ${group.baseName}`);

      // Import variations
      if (group.variations.length > 0) {
        const variationInserts = group.variations.map((v, idx) => ({
          productId: newProduct.id,
          size: v.size,
          label: v.label,
          price: v.price ? String(v.price) : null,
          sku: v.sku,
          displayOrder: idx,
        }));
        await db.insert(productVariations).values(variationInserts);
        console.log(`    - ${variationInserts.length} variations`);
      }

      // Import images
      if (group.images.length > 0) {
        const imageInserts = group.images.map((img, idx) => ({
          productId: newProduct.id,
          url: img.URL,
          alt: group.baseName,
          isPrimary: idx === 0,
          displayOrder: idx,
        }));
        await db.insert(productImages).values(imageInserts);
        console.log(`    - ${imageInserts.length} images`);
      }

      // Import specifications
      if (group.specifications.length > 0) {
        const specInserts = group.specifications.map((spec, idx) => ({
          productId: newProduct.id,
          label: spec.Name,
          value: spec.Value,
          displayOrder: idx,
        }));
        await db.insert(productSpecifications).values(specInserts);
        console.log(`    - ${specInserts.length} specifications`);
      }

      // Import features
      if (group.features.length > 0) {
        const featureInserts = group.features.map((feature, idx) => ({
          productId: newProduct.id,
          feature,
          displayOrder: idx,
        }));
        await db.insert(productFeatures).values(featureInserts);
        console.log(`    - ${featureInserts.length} features`);
      }

      imported++;
    }

    console.log('\n--- Import Complete ---');
    console.log(`  Imported: ${imported} products`);
    console.log(`  Skipped (already exist): ${skipped}`);
    console.log(`  Total variations created: ${groupedProducts.reduce((acc, g) => acc + g.variations.length, 0)}`);

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importProducts();
