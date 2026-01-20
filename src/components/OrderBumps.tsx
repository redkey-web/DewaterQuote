"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, X, ChevronDown } from "lucide-react"
import { products } from "@/data/catalog"
import type { QuoteItem } from "@/types"

interface OrderBumpsProps {
  cartItems: QuoteItem[]
  onAddToQuote?: (item: QuoteItem) => void // Made optional since we no longer use it
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
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  // Collapsed state - show minimal expand button
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors border-t border-border"
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span>Show suggestions</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    )
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h4 className="text-sm font-semibold">You May Also Need</h4>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Hide suggestions"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Complementary products often used together:
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
              <Link
                href={`/${product.slug}`}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
