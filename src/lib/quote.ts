import { nanoid } from "nanoid"
import type { Product, QuoteItem, QuoteItemVariation } from "@/types"

export interface ProductToQuoteItemOptions {
  selectedSize?: string
  quantity?: number
}

/**
 * Converts a Product to a QuoteItem for adding to the quote cart.
 * Handles products with variations, single prices, and POA.
 */
export function productToQuoteItem(
  product: Product,
  options: ProductToQuoteItemOptions = {}
): QuoteItem {
  const { selectedSize, quantity = 1 } = options

  let variation: QuoteItemVariation | undefined
  let basePrice: number | undefined
  let baseSku: string | undefined

  if (product.priceVaries && product.sizeOptions) {
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
 */
export function getQuoteItemSizeLabel(item: QuoteItem): string | undefined {
  if (item.variation) {
    return item.variation.sizeLabel
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
 * Calculates the discounted subtotal for a quote item
 */
export function getQuoteItemDiscountedSubtotal(item: QuoteItem): number | undefined {
  const price = getQuoteItemPrice(item)
  if (price === undefined) return undefined
  const discountedPrice = calculateDiscountedPrice(price, item.quantity)
  return discountedPrice * item.quantity
}

/**
 * Gets the total savings for a quote item due to volume discount
 */
export function getQuoteItemSavings(item: QuoteItem): number {
  const originalSubtotal = getQuoteItemSubtotal(item)
  const discountedSubtotal = getQuoteItemDiscountedSubtotal(item)
  if (originalSubtotal === undefined || discountedSubtotal === undefined) return 0
  return originalSubtotal - discountedSubtotal
}
