/**
 * Restore lost descriptive text to variation labels from original Neto export
 *
 * The previous normalization script stripped out descriptive text like:
 * - "Pipe Outside Diameter sizing"
 * - "DN80 (3") Nominal Bore sizing"
 *
 * This script:
 * 1. Parses the original neto-export.csv
 * 2. Extracts the full "Specific Value 1" column for each variation
 * 3. Separates numeric size from descriptive text
 * 4. Updates the database label field with the descriptive part
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load env BEFORE any other imports that might use DATABASE_URL
dotenv.config({ path: '.env.local' });

// Parse CSV line handling quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

// Extract size and descriptive label from full text
function extractSizeAndLabel(fullText: string): { size: string; label: string } {
  if (!fullText || fullText.trim() === '') {
    return { size: '', label: '' };
  }

  const trimmed = fullText.trim();

  // Pattern 1: "XX.Xmm Descriptive text" - most common
  // Pattern 2: "XXmm DNxx (X") Nominal Bore sizing"
  // Pattern 3: "XXxYY Reducing text" - for reducing couplings

  // Match leading numeric size with mm suffix
  const sizeMatch = trimmed.match(/^(\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?(?:mm)?)\s*/i);

  if (sizeMatch) {
    let size = sizeMatch[1];
    // Ensure mm suffix
    if (!size.toLowerCase().endsWith('mm')) {
      size = size + 'mm';
    }

    // Everything after the size is the descriptive label
    let label = trimmed.substring(sizeMatch[0].length).trim();

    // Clean up common prefixes that shouldn't be in label
    label = label.replace(/^(?:sizing|size)\s*/i, '').trim();

    return { size, label };
  }

  // If no size pattern found, return original as-is
  return { size: trimmed, label: '' };
}

interface OriginalVariation {
  sku: string;
  parentSku: string;
  fullSizeText: string;
}

async function main() {
  console.log('=== Restore Variation Labels from Original Neto Export ===\n');

  // Dynamic imports to ensure env is loaded first
  const { db } = await import('../src/db');
  const { productVariations } = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');

  // Read the original CSV
  const csvPath = path.join(__dirname, '../.planning/audit/neto-export.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  console.log(`Read ${lines.length} lines from CSV\n`);

  // Parse header to find column indices
  const header = parseCSVLine(lines[0]);
  const skuIndex = header.findIndex(h => h === 'SKU*');
  const parentSkuIndex = header.findIndex(h => h === 'Parent SKU');
  const specificValue1Index = header.findIndex(h => h === 'Specific Value 1');

  console.log('Column indices:');
  console.log(`  SKU: ${skuIndex}`);
  console.log(`  Parent SKU: ${parentSkuIndex}`);
  console.log(`  Specific Value 1: ${specificValue1Index}\n`);

  if (skuIndex === -1 || parentSkuIndex === -1 || specificValue1Index === -1) {
    console.error('Could not find required columns in CSV');
    process.exit(1);
  }

  // Extract all variations with their original size text
  const originalVariations: OriginalVariation[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    const sku = fields[skuIndex];
    const parentSku = fields[parentSkuIndex];
    const fullSizeText = fields[specificValue1Index];

    // Only process variations (rows with a parent SKU)
    if (parentSku && parentSku.trim()) {
      originalVariations.push({
        sku: sku.trim(),
        parentSku: parentSku.trim(),
        fullSizeText: fullSizeText?.trim() || ''
      });
    }
  }

  console.log(`Found ${originalVariations.length} variations in original CSV\n`);

  // Show sample of what we're working with
  console.log('Sample of original data patterns:');
  const samples = originalVariations.filter(v => v.fullSizeText.length > 10).slice(0, 10);
  for (const sample of samples) {
    const { size, label } = extractSizeAndLabel(sample.fullSizeText);
    console.log(`  ${sample.sku}:`);
    console.log(`    Original: "${sample.fullSizeText}"`);
    console.log(`    → Size: "${size}", Label: "${label}"`);
  }
  console.log('');

  // Get all variations from database
  const dbVariations = await db.select({
    id: productVariations.id,
    sku: productVariations.sku,
    size: productVariations.size,
    label: productVariations.label
  }).from(productVariations);

  console.log(`Found ${dbVariations.length} variations in database\n`);

  // Create lookup map from original data
  const originalMap = new Map<string, OriginalVariation>();
  for (const v of originalVariations) {
    originalMap.set(v.sku, v);
  }

  // Track updates
  let updated = 0;
  let noChange = 0;
  let notFound = 0;
  const updates: Array<{ sku: string; oldLabel: string; newLabel: string }> = [];

  // Process each database variation
  for (const dbVar of dbVariations) {
    const original = originalMap.get(dbVar.sku || '');

    if (!original) {
      notFound++;
      continue;
    }

    // Extract the proper label from original full text
    const { size, label } = extractSizeAndLabel(original.fullSizeText);

    // Check if label needs updating
    const currentLabel = dbVar.label || '';

    if (label && label !== currentLabel) {
      updates.push({
        sku: dbVar.sku || '',
        oldLabel: currentLabel,
        newLabel: label
      });

      // Update database
      await db.update(productVariations)
        .set({ label })
        .where(eq(productVariations.id, dbVar.id));

      updated++;
    } else {
      noChange++;
    }
  }

  console.log('\n=== Results ===');
  console.log(`Updated: ${updated}`);
  console.log(`No change needed: ${noChange}`);
  console.log(`SKU not found in original: ${notFound}`);

  if (updates.length > 0) {
    console.log('\nSample of updates made:');
    for (const update of updates.slice(0, 20)) {
      console.log(`  ${update.sku}: "${update.oldLabel}" → "${update.newLabel}"`);
    }
    if (updates.length > 20) {
      console.log(`  ... and ${updates.length - 20} more`);
    }
  }

  // Show unique label patterns found
  const uniqueLabels = new Set(updates.map(u => u.newLabel));
  console.log(`\nUnique label patterns restored (${uniqueLabels.size}):`);
  for (const label of Array.from(uniqueLabels).slice(0, 15)) {
    console.log(`  - "${label}"`);
  }

  console.log('\nDone!');
  process.exit(0);
}

main().catch(console.error);
