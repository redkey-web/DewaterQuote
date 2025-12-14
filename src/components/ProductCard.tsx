"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, TrendingDown } from "lucide-react"
import type { Product } from "@/types"
import { productToQuoteItem } from "@/lib/quote"
import { useToast } from "@/hooks/use-toast"
import { useQuote } from "@/context/QuoteContext"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useQuote()
  const mainImage = product.images?.[0]?.url

  // Check if product has pricing (not POA)
  const hasPrice = product.priceVaries
    ? product.sizeOptions?.some((opt) => opt.price && opt.price > 0)
    : product.price && product.price > 0

  useEffect(() => {
    setImageError(false)
  }, [mainImage])

  const handleAddToQuote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // For products with variable pricing, redirect to detail page to select size
    if (product.priceVaries && product.sizeOptions && product.sizeOptions.length > 0) {
      toast({
        title: "Size Selection Required",
        description: "Please select a size on the product page before adding to quote.",
      })
      router.push(`/${product.slug}`)
      return
    }

    // For single-price products, add directly to quote
    try {
      const quoteItem = productToQuoteItem(product)
      addItem(quoteItem, e.currentTarget)
      toast({
        title: "Added to Quote",
        description: `${product.name} has been added to your quote request.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product to quote",
        variant: "destructive",
      })
    }
  }

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 transition-all border-border"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/${product.slug}`}>
        <div className="cursor-pointer" data-testid={`link-product-${product.id}`}>
          <div className="aspect-square bg-muted overflow-hidden flex items-center justify-center">
            {mainImage && !imageError ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                data-testid={`img-product-${product.id}`}
              />
            ) : (
              <Package
                className="w-20 h-20 text-muted-foreground/30"
                data-testid={`icon-placeholder-${product.id}`}
              />
            )}
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="font-semibold text-base line-clamp-2 break-words min-w-0 flex-1"
                  data-testid={`text-product-name-${product.id}`}
                >
                  {product.shortName || product.name}
                </h3>
                {hasPrice && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary shrink-0 text-xs flex items-center gap-1"
                  >
                    <TrendingDown className="w-3 h-3" />
                    Discounts
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p
                  className="text-xs text-muted-foreground font-mono"
                  data-testid={`text-sku-${product.id}`}
                >
                  {product.sku}
                </p>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-brand-${product.id}`}>
                  {product.brand}
                </Badge>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToQuote}
          data-testid={`button-add-to-quote-${product.id}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {product.priceVaries ? "Select Size" : "Add to Quote"}
        </Button>
      </CardFooter>
    </Card>
  )
}
