"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, HelpCircle, Plus, Minus, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product, QuoteItem, CustomSizeRequest as CustomSizeRequestType } from "@/types"
import { nanoid } from "nanoid"

interface CustomSizeRequestProps {
  product: Product
  onAddToQuote: (item: QuoteItem) => void
}

export default function CustomSizeRequest({ product, onAddToQuote }: CustomSizeRequestProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [requestedSize, setRequestedSize] = useState("")
  const [additionalSpecs, setAdditionalSpecs] = useState("")
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleAddToQuote = () => {
    if (!requestedSize.trim()) return

    const customSizeRequest: CustomSizeRequestType = {
      requestedSize: requestedSize.trim(),
      additionalSpecs: additionalSpecs.trim() || undefined,
      isCustomRequest: true,
    }

    const quoteItem: QuoteItem = {
      id: nanoid(),
      productId: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.images[0]?.url || "/placeholder.jpg",
      priceVaries: false,
      basePrice: undefined, // POA
      baseSku: product.sku,
      quantity,
      leadTime: product.leadTime,
      customSizeRequest,
    }

    onAddToQuote(quoteItem)

    // Reset form
    setRequestedSize("")
    setAdditionalSpecs("")
    setQuantity(1)
    setIsOpen(false)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors",
            "border-border/60 bg-muted/30 hover:bg-muted/50",
            "text-sm text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Can&apos;t see your size?
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 p-4 rounded-lg border border-border/60 bg-muted/20 space-y-4">
          <p className="text-sm text-muted-foreground">
            Tell us what you need and we&apos;ll get back to you with a solution.
          </p>

          {/* Size/Dimensions Required */}
          <div>
            <label htmlFor="custom-size" className="text-sm font-medium mb-2 block">
              Size/Dimensions Required <span className="text-red-500">*</span>
            </label>
            <Input
              id="custom-size"
              type="text"
              value={requestedSize}
              onChange={(e) => setRequestedSize(e.target.value)}
              placeholder="e.g., 150mm OD, DN200, 6 inch"
              className="h-10"
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label htmlFor="custom-specs" className="text-sm font-medium mb-2 block">
              Additional Requirements <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="custom-specs"
              value={additionalSpecs}
              onChange={(e) => setAdditionalSpecs(e.target.value)}
              placeholder="Material, pressure rating, application details..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Quantity & Add Button */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Qty:</span>
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                  type="button"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="h-8 w-8"
                  type="button"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex-1" />

            <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-semibold px-3 py-1">
              POA
            </Badge>
          </div>

          <Button
            onClick={handleAddToQuote}
            disabled={!requestedSize.trim()}
            className="w-full"
            variant="secondary"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Quote - POA
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
