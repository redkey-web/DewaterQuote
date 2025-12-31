/**
 * Utility functions for sorting product variations by numeric size
 */

/**
 * Extract numeric value from a size string for sorting purposes
 *
 * Examples:
 * - "21.3mm" → 21.3
 * - "100.0mm" → 100.0
 * - "114.3mm Pipe Outside Diameter" → 114.3
 * - "125x100" → 125 (uses first number for reducing sizes)
 * - "DN50" → 50
 * - "50mm DN50 (2")" → 50
 *
 * @param size The size string to parse
 * @returns Numeric value for sorting, or Infinity if no number found
 */
export function extractNumericSize(size: string | null | undefined): number {
  if (!size) return Infinity;

  const trimmed = size.trim();

  // Pattern 1: Leading decimal number (most common) - "21.3mm", "100.0mm"
  const leadingDecimal = trimmed.match(/^(\d+(?:\.\d+)?)/);
  if (leadingDecimal) {
    return parseFloat(leadingDecimal[1]);
  }

  // Pattern 2: DN format - "DN50", "DN100"
  const dnMatch = trimmed.match(/DN(\d+)/i);
  if (dnMatch) {
    return parseInt(dnMatch[1], 10);
  }

  // Pattern 3: Any number in the string
  const anyNumber = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (anyNumber) {
    return parseFloat(anyNumber[1]);
  }

  // No number found - sort to end
  return Infinity;
}

/**
 * Compare function for sorting variations by size
 * Use with Array.sort() or as comparator
 *
 * @param a First variation (needs .size property)
 * @param b Second variation (needs .size property)
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function compareSizes<T extends { size: string | null }>(a: T, b: T): number {
  const aNum = extractNumericSize(a.size);
  const bNum = extractNumericSize(b.size);

  // Primary sort by numeric value
  if (aNum !== bNum) {
    return aNum - bNum;
  }

  // Secondary sort by string (for ties like "50mm" vs "DN50")
  const aStr = (a.size || '').toLowerCase();
  const bStr = (b.size || '').toLowerCase();
  return aStr.localeCompare(bStr);
}

/**
 * Sort an array of variations by size (ascending)
 * Returns a new sorted array, does not mutate original
 *
 * @param variations Array of variations with .size property
 * @returns New sorted array
 */
export function sortVariationsBySize<T extends { size: string | null }>(variations: T[]): T[] {
  return [...variations].sort(compareSizes);
}
