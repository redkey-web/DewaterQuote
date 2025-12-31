/**
 * Update displayOrder for all product variations based on numeric size
 *
 * This script:
 * 1. Groups variations by product
 * 2. Sorts each product's variations by numeric size
 * 3. Updates displayOrder to match the sorted order (0, 1, 2, ...)
 *
 * This ensures variations are always displayed in size order across:
 * - Admin inventory page
 * - Product admin pages
 * - Frontend product pages
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Import size sorting utility
function extractNumericSize(size: string | null | undefined): number {
  if (!size) return Infinity;
  const trimmed = size.trim();

  // Pattern 1: Leading decimal number
  const leadingDecimal = trimmed.match(/^(\d+(?:\.\d+)?)/);
  if (leadingDecimal) {
    return parseFloat(leadingDecimal[1]);
  }

  // Pattern 2: DN format
  const dnMatch = trimmed.match(/DN(\d+)/i);
  if (dnMatch) {
    return parseInt(dnMatch[1], 10);
  }

  // Pattern 3: Any number in the string
  const anyNumber = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (anyNumber) {
    return parseFloat(anyNumber[1]);
  }

  return Infinity;
}

interface Variation {
  id: number;
  productId: number;
  size: string | null;
  displayOrder: number | null;
}

async function main() {
  console.log('=== Update Variation Display Order by Numeric Size ===\n');

  // Dynamic imports
  const { db } = await import('../src/db');
  const { productVariations } = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');

  // Get all variations
  const allVariations = await db.select({
    id: productVariations.id,
    productId: productVariations.productId,
    size: productVariations.size,
    displayOrder: productVariations.displayOrder,
  }).from(productVariations);

  console.log(`Found ${allVariations.length} variations total\n`);

  // Group by product
  const byProduct = new Map<number, Variation[]>();
  for (const v of allVariations) {
    const existing = byProduct.get(v.productId) || [];
    existing.push(v);
    byProduct.set(v.productId, existing);
  }

  console.log(`Grouped into ${byProduct.size} products\n`);

  // Track updates
  let updatedCount = 0;
  let skippedCount = 0;

  // Process each product
  for (const [productId, variations] of byProduct) {
    // Sort by numeric size
    const sorted = [...variations].sort((a, b) => {
      const aNum = extractNumericSize(a.size);
      const bNum = extractNumericSize(b.size);
      if (aNum !== bNum) return aNum - bNum;
      // Secondary sort by string for ties
      return (a.size || '').localeCompare(b.size || '');
    });

    // Update displayOrder for each variation
    for (let i = 0; i < sorted.length; i++) {
      const variation = sorted[i];
      const newDisplayOrder = i;

      // Only update if different
      if (variation.displayOrder !== newDisplayOrder) {
        await db.update(productVariations)
          .set({ displayOrder: newDisplayOrder })
          .where(eq(productVariations.id, variation.id));
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  }

  console.log('=== Results ===');
  console.log(`Updated: ${updatedCount} variations`);
  console.log(`Skipped (already correct): ${skippedCount} variations`);
  console.log(`Total: ${allVariations.length} variations`);

  // Show a few examples
  console.log('\n=== Sample of sorted products ===');
  let sampleCount = 0;
  for (const [productId, variations] of byProduct) {
    if (variations.length >= 3 && sampleCount < 3) {
      const sorted = [...variations].sort((a, b) => {
        const aNum = extractNumericSize(a.size);
        const bNum = extractNumericSize(b.size);
        return aNum - bNum;
      });
      console.log(`\nProduct ${productId} (${sorted.length} sizes):`);
      for (const v of sorted.slice(0, 5)) {
        console.log(`  ${v.displayOrder} → ${extractNumericSize(v.size).toFixed(1).padStart(6)} : "${v.size}"`);
      }
      if (sorted.length > 5) {
        console.log(`  ... and ${sorted.length - 5} more`);
      }
      sampleCount++;
    }
  }

  console.log('\nDone!');
  process.exit(0);
}

main().catch(console.error);
