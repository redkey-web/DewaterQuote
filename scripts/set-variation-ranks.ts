/**
 * Migration script: Set default ranks (displayOrder) for existing variations
 *
 * This script:
 * 1. Groups variations by productId
 * 2. For each product, sorts variations by extracting numeric value from size
 * 3. Assigns ranks: 100, 200, 300, ... (gap numbering for future insertions)
 *
 * Run with: npx tsx scripts/set-variation-ranks.ts
 */

import { db } from '../src/db';
import { productVariations as variationsTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Extract numeric value from size string (e.g., "48.3mm" -> 48.3, "DN100" -> 100)
function extractNumericSize(size: string): number {
  // Try to extract first number from the string
  const match = size.match(/(\d+\.?\d*)/);
  if (match) {
    return parseFloat(match[1]);
  }
  return 0;
}

async function setVariationRanks() {
  console.log('Starting variation rank migration...\n');

  // Get all variations grouped by product
  const allVariations = await db.select().from(variationsTable);

  // Group by productId
  const variationsByProduct = new Map<number, typeof allVariations>();
  for (const v of allVariations) {
    const existing = variationsByProduct.get(v.productId) || [];
    existing.push(v);
    variationsByProduct.set(v.productId, existing);
  }

  console.log(`Found ${variationsByProduct.size} products with variations\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const [productId, prodVariations] of variationsByProduct) {
    try {
      // Sort variations by numeric size value
      const sorted = prodVariations.slice().sort((a, b) => {
        return extractNumericSize(a.size) - extractNumericSize(b.size);
      });

      // Assign ranks: 100, 200, 300, ...
      for (let i = 0; i < sorted.length; i++) {
        const newRank = (i + 1) * 100;
        const variation = sorted[i];

        // Only update if rank is different (currently uses sequential 0,1,2...)
        if (variation.displayOrder !== newRank) {
          await db
            .update(variationsTable)
            .set({ displayOrder: newRank })
            .where(eq(variationsTable.id, variation.id));
          updatedCount++;
        }
      }

      // Log progress every 100 variations
      if (variationsByProduct.size > 10 && updatedCount % 100 === 0 && updatedCount > 0) {
        console.log(`  Processed ${updatedCount} variations...`);
      }
    } catch (error) {
      console.error(`  Error processing product ${productId}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   - Updated: ${updatedCount} variations`);
  console.log(`   - Errors: ${errorCount}`);

  process.exit(0);
}

setVariationRanks().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
