import { nanoid } from "nanoid"
import { endOfMonth, addMonths } from "date-fns"
import type { Product, QuoteItem, QuoteItemVariation, CustomSpecs } from "@/types"

/**
 * Gets the quote expiry date - end of the following month
 * Example: Quote created on Jan 15 expires Jan 31 of following year (actually Feb 28/29)
 * Correction: Quote created Jan 15 → expires Feb 28/29 (end of following month)
 *
 * @param createdAt - The date the quote was created (defaults to now)
 * @returns The expiry date (last day of the following month)
 */
export function getQuoteExpiry(createdAt: Date = new Date()): Date {
  // Add one month, then get end of that month
  const nextMonth = addMonths(createdAt, 1)
  return endOfMonth(nextMonth)
}

/**
 * Brands that require custom specifications instead of predefined sizes
 */
export const CUSTOM_SPECS_BRANDS = ['Straub', 'Teekay']

/**
 * Check if a brand requires custom specifications
 */
export function isCustomSpecsBrand(brand: string): boolean {
  return CUSTOM_SPECS_BRANDS.includes(brand)
}

export interface ProductToQuoteItemOptions {
  selectedSize?: string
  quantity?: number
  materialTestCert?: boolean
  customSpecs?: CustomSpecs
}

/**
 * Converts a Product to a QuoteItem for adding to the quote cart.
 * Handles products with variations, single prices, POA, and custom specs (Straub/Teekay).
 */
export function productToQuoteItem(
  product: Product,
  options: ProductToQuoteItemOptions = {}
): QuoteItem {
  const { selectedSize, quantity = 1, materialTestCert = false, customSpecs } = options

  let variation: QuoteItemVariation | undefined
  let basePrice: number | undefined
  let baseSku: string | undefined

  // Straub/Teekay products use custom specs instead of predefined sizes
  if (isCustomSpecsBrand(product.brand)) {
    // These are always POA products - no price lookup needed
    baseSku = product.sku
    basePrice = undefined // Always POA
  } else if (product.priceVaries && product.sizeOptions) {
    // Product has size variations - selectedSize is required
    if (!selectedSize) {
      throw new Error("Size selection is required for products with variable pricing")
    }

    const sizeOption = product.sizeOptions.find((opt) => opt.value === selectedSize)
    if (!sizeOption) {
      throw new Error(`Invalid size selection: ${selectedSize}`)
    }

    variation = {
      size: sizeOption.value,
      sizeLabel: sizeOption.label,
      sku: sizeOption.sku || product.sku,
      unitPrice: sizeOption.price || 0,
    }
  } else {
    // Single price product or POA
    basePrice = product.price
    baseSku = product.sku

    // For single-size products, still capture the size info if available
    if (product.sizeOptions && product.sizeOptions.length === 1) {
      const singleSize = product.sizeOptions[0]
      variation = {
        size: singleSize.value,
        sizeLabel: singleSize.label,
        sku: singleSize.sku || product.sku,
        unitPrice: singleSize.price || basePrice || 0,
      }
    } else if (product.sizeOptions && product.sizeOptions.length > 1 && selectedSize) {
      // Multiple sizes but priceVaries is false - use selected size for label
      const sizeOption = product.sizeOptions.find((opt) => opt.value === selectedSize)
      if (sizeOption) {
        variation = {
          size: sizeOption.value,
          sizeLabel: sizeOption.label,
          sku: sizeOption.sku || product.sku,
          unitPrice: sizeOption.price || basePrice || 0,
        }
      }
    }
  }

  return {
    id: nanoid(),
    productId: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    image: product.images[0]?.url || "/placeholder.jpg",
    basePrice,
    baseSku,
    priceVaries: product.priceVaries || false,
    variation,
    quantity,
    materialTestCert,
    leadTime: product.leadTime,
    customSpecs,
  }
}

/**
 * Gets the display price for a quote item
 */
export function getQuoteItemPrice(item: QuoteItem): number | undefined {
  if (item.variation) {
    return item.variation.unitPrice
  }
  return item.basePrice
}

/**
 * Gets the display SKU for a quote item
 */
export function getQuoteItemSKU(item: QuoteItem): string {
  if (item.variation) {
    return item.variation.sku
  }
  return item.baseSku || ""
}

/**
 * Gets the display size label for a quote item
 * Falls back to size value if sizeLabel is empty
 */
export function getQuoteItemSizeLabel(item: QuoteItem): string | undefined {
  if (item.variation) {
    // Return sizeLabel if it has content, otherwise fall back to size value
    if (item.variation.sizeLabel && item.variation.sizeLabel.trim() !== '') {
      return item.variation.sizeLabel
    }
    // Fall back to size value (e.g., "48.3mm")
    if (item.variation.size) {
      return item.variation.size
    }
  }
  return undefined
}

/**
 * Calculates the subtotal for a quote item
 */
export function getQuoteItemSubtotal(item: QuoteItem): number | undefined {
  const price = getQuoteItemPrice(item)
  if (price === undefined) return undefined
  return price * item.quantity
}

/**
 * Discount tier thresholds
 * 2-4 items: 5% discount
 * 5-9 items: 10% discount
 * 10+ items: 15% discount
 */
export interface DiscountTier {
  minQuantity: number
  percentage: number
  label: string
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { minQuantity: 10, percentage: 15, label: "10+ items" },
  { minQuantity: 5, percentage: 10, label: "5+ items" },
  { minQuantity: 2, percentage: 5, label: "2+ items" },
]

/**
 * Gets the applicable discount tier for a given quantity
 */
export function getDiscountTier(quantity: number): DiscountTier | null {
  for (const tier of DISCOUNT_TIERS) {
    if (quantity >= tier.minQuantity) {
      return tier
    }
  }
  return null
}

/**
 * Gets the discount percentage for a given quantity
 */
export function getDiscountPercentage(quantity: number): number {
  const tier = getDiscountTier(quantity)
  return tier ? tier.percentage : 0
}

/**
 * Calculates the discounted price based on quantity
 */
export function calculateDiscountedPrice(unitPrice: number, quantity: number): number {
  const discountPercentage = getDiscountPercentage(quantity)
  if (discountPercentage === 0) return unitPrice
  return unitPrice * (1 - discountPercentage / 100)
}

/**
 * Calculates the discounted subtotal for a quote item.
 * @param item - The quote item
 * @param totalCartQuantity - Total quantity across ALL items in cart (for bulk discount)
 *                            If not provided, uses item.quantity (legacy per-item behavior)
 */
export function getQuoteItemDiscountedSubtotal(
  item: QuoteItem,
  totalCartQuantity?: number
): number | undefined {
  const price = getQuoteItemPrice(item)
  if (price === undefined) return undefined
  // Use total cart quantity for discount tier, but multiply by item's own quantity
  const quantityForDiscount = totalCartQuantity ?? item.quantity
  const discountedPrice = calculateDiscountedPrice(price, quantityForDiscount)
  return discountedPrice * item.quantity
}

/**
 * Gets the total savings for a quote item due to bulk pricing discount.
 * @param item - The quote item
 * @param totalCartQuantity - Total quantity across ALL items in cart (for bulk discount)
 */
export function getQuoteItemSavings(
  item: QuoteItem,
  totalCartQuantity?: number
): number {
  const originalSubtotal = getQuoteItemSubtotal(item)
  const discountedSubtotal = getQuoteItemDiscountedSubtotal(item, totalCartQuantity)
  if (originalSubtotal === undefined || discountedSubtotal === undefined) return 0
  return originalSubtotal - discountedSubtotal
}

/**
 * Material Test Certificate fee (applies once per unique SKU)
 */
export const MATERIAL_CERT_FEE = 350

/**
 * Calculates the total material test certificate fee for quote items.
 * Fee applies once per unique SKU that has materialTestCert = true.
 */
export function calculateMaterialCertFee(items: QuoteItem[]): number {
  const skusWithCert = new Set(
    items
      .filter((item) => item.materialTestCert)
      .map((item) => getQuoteItemSKU(item))
  )
  return skusWithCert.size * MATERIAL_CERT_FEE
}

/**
 * Gets the count of unique SKUs with material test certificates
 */
export function getMaterialCertCount(items: QuoteItem[]): number {
  const skusWithCert = new Set(
    items
      .filter((item) => item.materialTestCert)
      .map((item) => getQuoteItemSKU(item))
  )
  return skusWithCert.size
}
