"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trash2, Send, TrendingDown, Plus, Minus } from "lucide-react"
import {
  getQuoteItemPrice,
  getQuoteItemSKU,
  getQuoteItemSizeLabel,
  getQuoteItemSubtotal,
  getQuoteItemDiscountedSubtotal,
  getQuoteItemSavings,
  getDiscountPercentage,
} from "@/lib/quote"
import { useQuote } from "@/context/QuoteContext"
import OrderBumps from "./OrderBumps"

export default function QuoteCart() {
  const router = useRouter()
  const { items, isCartOpen, closeCart, removeItem, updateItemQuantity, addItem } = useQuote()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setIsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isCartOpen])

  const pricedItems = items.filter((item) => getQuoteItemPrice(item) !== undefined)
  const unpricedItems = items.filter((item) => getQuoteItemPrice(item) === undefined)
  const subtotal = pricedItems.reduce((sum, item) => sum + (getQuoteItemSubtotal(item) || 0), 0)
  const discountedSubtotal = pricedItems.reduce(
    (sum, item) => sum + (getQuoteItemDiscountedSubtotal(item) || 0),
    0
  )
  const totalSavings = pricedItems.reduce((sum, item) => sum + getQuoteItemSavings(item), 0)

  const handleSubmitQuote = () => {
    closeCart()
    router.push("/request-quote")
  }

  if (!isVisible) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={closeCart}
        data-testid="overlay-quote-cart"
      />
      <div
        className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-background border-l border-border shadow-xl z-50 flex flex-col transition-transform duration-200 ease-out"
        style={{ transform: isAnimating ? "translateX(0)" : "translateX(100%)" }}
        data-testid="panel-quote-cart"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quote Request</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} added
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} data-testid="button-close-cart">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your quote is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add products to request a quote</p>
            </div>
          ) : (
            <>
              {pricedItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Items with Pricing</h3>
                  <div className="space-y-3">
                    {pricedItems.map((item) => {
                      const price = getQuoteItemPrice(item)
                      const sku = getQuoteItemSKU(item)
                      const sizeLabel = getQuoteItemSizeLabel(item)
                      const itemSubtotal = getQuoteItemSubtotal(item)
                      const itemDiscountedSubtotal = getQuoteItemDiscountedSubtotal(item)
                      const savings = getQuoteItemSavings(item)
                      const discountPercentage = getDiscountPercentage(item.quantity)
                      const hasDiscount = discountPercentage > 0

                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-card border border-card-border rounded-md"
                          data-testid={`quote-item-${item.id}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm truncate">{item.name}</h4>
                              {hasDiscount && (
                                <Badge
                                  variant="secondary"
                                  className="bg-destructive/10 text-destructive shrink-0 text-xs"
                                >
                                  {discountPercentage}% OFF
                                </Badge>
                              )}
                            </div>
                            {sizeLabel && (
                              <p className="text-xs text-muted-foreground">Size: {sizeLabel}</p>
                            )}
                            <p className="text-xs text-muted-foreground font-mono">{sku}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {hasDiscount ? (
                                <>
                                  <p
                                    className="text-sm line-through text-destructive"
                                    data-testid={`text-original-price-${item.id}`}
                                  >
                                    ${price?.toFixed(2)}
                                  </p>
                                  <p
                                    className="text-sm font-bold text-primary"
                                    data-testid={`text-discounted-price-${item.id}`}
                                  >
                                    ${(price! * (1 - discountPercentage / 100)).toFixed(2)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm font-bold text-primary">${price?.toFixed(2)}</p>
                              )}
                            </div>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                                  }
                                  disabled={item.quantity <= 1}
                                  data-testid={`button-decrease-${item.id}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  data-testid={`button-increase-${item.id}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              {item.quantity > 1 && (
                                <span className="text-sm text-muted-foreground">
                                  ={" "}
                                  {hasDiscount ? (
                                    <span className="font-semibold text-primary">
                                      ${itemDiscountedSubtotal?.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="font-semibold">${itemSubtotal?.toFixed(2)}</span>
                                  )}
                                </span>
                              )}
                            </div>
                            {hasDiscount && savings > 0 && (
                              <p
                                className="text-xs text-destructive font-medium mt-1"
                                data-testid={`text-savings-${item.id}`}
                              >
                                You save ${savings.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    {totalSavings > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground line-through">Original Total:</span>
                          <span
                            className="text-muted-foreground line-through"
                            data-testid="text-original-total"
                          >
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-destructive font-medium flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            Volume Discount:
                          </span>
                          <span className="text-destructive font-medium" data-testid="text-total-savings">
                            -${totalSavings.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="font-bold">Total:</span>
                          <span
                            className="text-xl font-bold text-primary"
                            data-testid="text-discounted-total"
                          >
                            ${discountedSubtotal.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    {totalSavings === 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Subtotal:</span>
                        <span className="text-xl font-bold text-primary" data-testid="text-subtotal">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                      {totalSavings > 0
                        ? `You're saving $${totalSavings.toFixed(2)} with volume discounts!`
                        : "Add 2+ items of the same product to unlock volume discounts (5-15% off)"}
                    </p>
                  </div>
                </div>
              )}

              {unpricedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">Prices to be Confirmed</h3>
                    <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
                      Upon Enquiry
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {unpricedItems.map((item) => {
                      const sku = getQuoteItemSKU(item)
                      const sizeLabel = getQuoteItemSizeLabel(item)

                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-card border border-card-border rounded-md"
                          data-testid={`quote-item-${item.id}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            {sizeLabel && (
                              <p className="text-xs text-muted-foreground">Size: {sizeLabel}</p>
                            )}
                            <p className="text-xs text-muted-foreground font-mono">{sku}</p>
                            <p className="text-sm text-chart-3 font-medium mt-1">Price on request</p>
                            {/* Quantity Controls for Unpriced Items */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                                  }
                                  disabled={item.quantity <= 1}
                                  data-testid={`button-decrease-${item.id}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  data-testid={`button-increase-${item.id}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            {/* Order Bumps - Cross-sell suggestions */}
            <OrderBumps cartItems={items} onAddToQuote={addItem} />
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitQuote}
                data-testid="button-submit-quote"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Quote Request
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
                data-testid="button-continue-browsing"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
