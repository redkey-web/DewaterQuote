import { nanoid } from "nanoid";
import type { Product, QuoteItem, QuoteItemVariation } from "@shared/schema";

export interface ProductToQuoteItemOptions {
  selectedSize?: string;
  quantity?: number;
}

/**
 * Converts a Product to a QuoteItem for adding to the quote cart.
 * Handles products with variations, single prices, and POA.
 */
export function productToQuoteItem(
  product: Product,
  options: ProductToQuoteItemOptions = {}
): QuoteItem {
  const { selectedSize, quantity = 1 } = options;
  
  let variation: QuoteItemVariation | undefined;
  let basePrice: number | undefined;
  let baseSku: string | undefined;
  
  if (product.priceVaries && product.sizeOptions) {
    // Product has size variations - selectedSize is required
    if (!selectedSize) {
      throw new Error("Size selection is required for products with variable pricing");
    }
    
    const sizeOption = product.sizeOptions.find((opt) => opt.value === selectedSize);
    if (!sizeOption) {
      throw new Error(`Invalid size selection: ${selectedSize}`);
    }
    
    variation = {
      size: sizeOption.value,
      sizeLabel: sizeOption.label,
      sku: sizeOption.sku || product.sku,
      unitPrice: sizeOption.price || 0,
    };
  } else {
    // Single price product or POA
    basePrice = product.price;
    baseSku = product.sku;
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
  };
}

/**
 * Gets the display price for a quote item
 */
export function getQuoteItemPrice(item: QuoteItem): number | undefined {
  if (item.variation) {
    return item.variation.unitPrice;
  }
  return item.basePrice;
}

/**
 * Gets the display SKU for a quote item
 */
export function getQuoteItemSKU(item: QuoteItem): string {
  if (item.variation) {
    return item.variation.sku;
  }
  return item.baseSku || "";
}

/**
 * Gets the display size label for a quote item
 */
export function getQuoteItemSizeLabel(item: QuoteItem): string | undefined {
  if (item.variation) {
    return item.variation.sizeLabel;
  }
  return undefined;
}

/**
 * Calculates the subtotal for a quote item
 */
export function getQuoteItemSubtotal(item: QuoteItem): number | undefined {
  const price = getQuoteItemPrice(item);
  if (price === undefined) return undefined;
  return price * item.quantity;
}
