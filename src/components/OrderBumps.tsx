"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles } from "lucide-react"
import { products } from "@/data/catalog"
import type { QuoteItem } from "@/types"

interface OrderBumpsProps {
  cartItems: QuoteItem[]
  onAddToQuote: (item: QuoteItem) => void
}

const complementaryCategories: Record<string, string[]> = {
  valves: ["pipe-couplings", "rubber-expansion-joints", "strainers"],
  "pipe-couplings": ["rubber-expansion-joints", "pipe-repair-clamps", "valves"],
  "pipe-repair-clamps": ["pipe-couplings", "valves"],
  "rubber-expansion-joints": ["pipe-couplings", "valves", "flange-adaptors"],
  strainers: ["valves", "pipe-couplings"],
  "flange-adaptors": ["pipe-couplings", "rubber-expansion-joints"],
}

export default function OrderBumps({ cartItems, onAddToQuote }: OrderBumpsProps) {
  if (cartItems.length === 0) return null

  const cartProductIds = new Set(cartItems.map((item) => item.productId))
  const cartCategories = new Set<string>()

  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (product?.category) {
      cartCategories.add(product.category)
    }
  })

  const suggestedCategories = new Set<string>()
  cartCategories.forEach((category) => {
    const complements = complementaryCategories[category] || []
    complements.forEach((c) => suggestedCategories.add(c))
  })

  cartCategories.forEach((c) => suggestedCategories.delete(c))

  const suggestions = products
    .filter(
      (product) =>
        suggestedCategories.has(product.category) &&
        !cartProductIds.has(product.id) &&
        product.images?.[0]?.url
    )
    .slice(0, 3)

  if (suggestions.length === 0) return null

  const handleQuickAdd = (product: (typeof products)[0]) => {
    const firstSize = product.sizeOptions?.[0]
    const quoteItem: QuoteItem = {
      id: `bump-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      brand: product.brand || "",
      category: product.category,
      image: product.images?.[0]?.url || "",
      priceVaries: !!product.priceVaries,
      basePrice: firstSize?.price || product.price,
      baseSku: firstSize?.sku || product.sku,
      variation: firstSize
        ? {
            size: firstSize.value,
            sizeLabel: firstSize.label,
            sku: firstSize.sku || product.sku || "",
            unitPrice: firstSize.price || 0,
          }
        : undefined,
      quantity: 1,
    }
    onAddToQuote(quoteItem)
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h4 className="text-sm font-semibold">Complete Your Order</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Customers often add these complementary products:
      </p>
      <div className="space-y-2">
        {suggestions.map((product) => {
          const price = product.sizeOptions?.[0]?.price || product.price
          const categoryLabel = product.category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          return (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 bg-background rounded overflow-hidden flex-shrink-0 relative">
                <Image
                  src={product.images?.[0]?.url || ""}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium line-clamp-1">
                  {product.shortName || product.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {categoryLabel}
                  </Badge>
                  {price ? (
                    <span className="text-xs text-primary font-semibold">From ${price}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">POA</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 px-2 flex-shrink-0"
                onClick={() => handleQuickAdd(product)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
