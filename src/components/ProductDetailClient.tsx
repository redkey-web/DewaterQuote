"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Picker from "react-mobile-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Download,
  ShoppingCart,
  Package,
  Clock,
  Truck,
  Plus,
  Minus,
  TrendingDown,
  FileCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Award,
  Play,
  X,
  Expand,
  Ruler,
  Gauge,
  Thermometer,
  CircleDot,
} from "lucide-react"
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd"
import { useToast } from "@/hooks/use-toast"
import {
  productToQuoteItem,
  getDiscountPercentage,
  calculateDiscountedPrice,
} from "@/lib/quote"
import { useQuote } from "@/context/QuoteContext"
import { trackProductView, trackAddToQuote } from "@/components/GoogleAnalytics"
import type { Product } from "@/types"
import BulkPricingTicker from "@/components/BulkPricingTicker"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { toast } = useToast()
  const { addItem } = useQuote()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [materialTestCert, setMaterialTestCert] = useState<boolean>(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)

  // Deduplicate images by URL and filter out duplicate images
  const uniqueImages = product.images
    .filter((img, idx, arr) => arr.findIndex((i) => i.url === img.url) === idx)
    .filter((img) => {
      const urlLower = img.url.toLowerCase()
      const altLower = img.alt.toLowerCase()
      // Filter out duplicate images (alt_1 is usually same as main product image)
      const isDuplicate = urlLower.includes('/alt_1/') || altLower.includes('duplicate')
      return !isDuplicate
    })

  // Navigation functions for image gallery
  const goToPrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else {
      setCurrentImageIndex(uniqueImages.length - 1)
    }
  }, [currentImageIndex, uniqueImages.length])

  const goToNext = useCallback(() => {
    if (currentImageIndex < uniqueImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else {
      setCurrentImageIndex(0)
    }
  }, [currentImageIndex, uniqueImages.length])

  // Helper to get human-readable category name
  const getCategoryDisplayName = (slug: string): string => {
    const names: Record<string, string> = {
      'pipe-couplings': 'Pipe Couplings',
      'valves': 'Industrial Valves',
      'repair-clamps': 'Pipe Repair Clamps',
      'dismantling-joints': 'Dismantling Joints',
    }
    return names[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // SEO-optimized alt text for main image
  const mainImageAlt = `${product.name} - ${getCategoryDisplayName(product.category)} | Australia-wide delivery`

  // Brand logo mapping
  const getBrandLogo = (brand: string): string | null => {
    const logos: Record<string, string> = {
      'Orbit': '/images/brands/orbit-couplings.png',
      'Straub': '/images/brands/straub-logo.png',
      'Teekay': '/images/brands/teekay-logo.png',
    }
    return logos[brand] || null
  }
  const brandLogo = getBrandLogo(product.brand)

  // Straub installation video mapping
  const getStraubInstallationVideo = (slug: string): string | null => {
    if (product.brand !== 'Straub') return null
    const slugLower = slug.toLowerCase()
    if (slugLower.includes('metal-grip') || slugLower.includes('grip-ff') || slugLower.includes('straub-grip')) {
      return '/videos/straub/metal-grip-installation.mp4'
    }
    if (slugLower.includes('open-flex')) {
      return '/videos/straub/open-flex-1l-installation.mp4'
    }
    if (slugLower.includes('flex') && !slugLower.includes('open') && !slugLower.includes('rep') && !slugLower.includes('step') && !slugLower.includes('square')) {
      return '/videos/straub/flex-1l-installation.mp4'
    }
    if (slugLower.includes('rep-flex') || slugLower.includes('rep-clamp')) {
      return '/videos/straub/rep-flex-installation.mp4'
    }
    if (slugLower.includes('plast-pro')) {
      return '/videos/straub/plast-pro-installation.mp4'
    }
    if (slugLower.includes('clamp')) {
      return '/videos/straub/clamp-installation.mp4'
    }
    return null
  }
  const installationVideo = getStraubInstallationVideo(product.slug)

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const addToQuoteButtonRef = useRef<HTMLButtonElement>(null)

  // Reset states when product changes
  useEffect(() => {
    setImageErrors({})
    setSelectedSize("")
    setQuantity(1)
    setMaterialTestCert(false)
    setIsPickerOpen(false)
  }, [product.id])

  // Track product view in GA4
  useEffect(() => {
    trackProductView(product.name, product.id, product.category)
  }, [product])

  // Get the selected size option details
  const selectedSizeOption = product.sizeOptions?.find((s) => s.value === selectedSize)
  const discountPercentage = getDiscountPercentage(quantity)
  const hasDiscount = discountPercentage > 0 && selectedSizeOption?.price

  // Check if product has size options
  const hasSizeOptions = product.sizeOptions && product.sizeOptions.length > 0

  const handleAddToQuote = () => {
    try {
      // Only require size selection if product has size options
      if (hasSizeOptions && !selectedSize) {
        toast({
          title: "No Size Selected",
          description: "Please select a size to add to your quote.",
          variant: "destructive",
        })
        return
      }

      const quoteItem = productToQuoteItem(product, {
        selectedSize: hasSizeOptions ? selectedSize : "POA - Contact for sizing",
        quantity: quantity,
        materialTestCert: materialTestCert,
      })
      addItem(quoteItem, addToQuoteButtonRef.current)

      // Track add to quote in GA4
      trackAddToQuote(product.name, selectedSize || "POA", quantity)

      // Reset after adding
      setSelectedSize("")
      setQuantity(1)
      setMaterialTestCert(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to quote",
        variant: "destructive",
      })
    }
  }

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }, [])

  const baseUrl = "https://dewaterproducts.com.au"
  const productUrl = `${baseUrl}/${product.slug}`

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: product.name, url: productUrl },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BulkPricingTicker />
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mobile-only: Product name above images */}
        <div className="lg:hidden mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt={product.brand}
                width={100}
                height={40}
                className={`w-auto object-contain ${product.brand === 'Orbit' ? 'h-10' : 'h-6'}`}
                data-testid="brand-logo-mobile"
              />
            ) : (
              <Badge variant="secondary" data-testid="badge-brand-mobile">
                {product.brand}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold" data-testid="text-product-title-mobile">
            {product.name}
          </h1>
        </div>

        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images & Video */}
          <div>
            <div className="aspect-square glass rounded-lg mb-4 overflow-hidden flex items-center justify-center shadow-md relative group">
              {uniqueImages[currentImageIndex]?.url ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full cursor-zoom-in"
                >
                  <Image
                    src={uniqueImages[currentImageIndex].url}
                    alt={currentImageIndex === 0 ? mainImageAlt : uniqueImages[currentImageIndex].alt}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                    priority
                  />
                </button>
              ) : (
                <Package className="w-32 h-32 text-muted-foreground" />
              )}

              {/* Navigation Arrows - show when more than 1 image */}
              {uniqueImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Expand icon - show on images only */}
              {uniqueImages[currentImageIndex]?.url && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Enlarge image"
                >
                  <Expand className="w-4 h-4" />
                </button>
              )}

              {/* Image counter */}
              {uniqueImages.length > 1 && (
                <div className="absolute bottom-3 left-3 bg-background/80 text-foreground px-2 py-1 rounded-md text-xs font-medium">
                  {currentImageIndex + 1} / {uniqueImages.length}
                </div>
              )}
            </div>
            {uniqueImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    data-testid={`button-thumbnail-${idx}`}
                    className={`aspect-square glass-subtle rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary shadow-sm ${
                      currentImageIndex === idx ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.alt}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="hidden lg:flex flex-wrap items-center gap-2 mb-2">
              {brandLogo ? (
                <Image
                  src={brandLogo}
                  alt={product.brand}
                  width={120}
                  height={48}
                  className={`w-auto object-contain ${product.brand === 'Orbit' ? 'h-12' : 'h-8'}`}
                  data-testid="brand-logo"
                />
              ) : (
                <Badge variant="secondary" data-testid="badge-brand">
                  {product.brand}
                </Badge>
              )}
            </div>
            <h1 className="hidden lg:block text-4xl font-bold mb-4" data-testid="text-product-title">
              {product.name}
            </h1>

            <div className="flex items-center justify-start gap-2 mb-4 text-orange-500">
              <p className="text-base font-medium">Free delivery to metro areas</p>
              <Truck className="w-5 h-5" />
            </div>

            {/* Bulk Pricing Info */}
            <div className="py-2 px-3 border border-border rounded-md mb-6">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                <span className="font-semibold text-foreground whitespace-nowrap">
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-primary inline mr-1" />
                  Bulk Pricing:
                </span>
                <span className="whitespace-nowrap">
                  <span className="text-muted-foreground">2-4 qty</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-500 ml-1">5% off</span>
                </span>
                <span className="whitespace-nowrap">
                  <span className="text-muted-foreground">5-9 qty</span>
                  <span className="font-bold text-orange-600 dark:text-orange-500 ml-1">10% off</span>
                </span>
                <span className="whitespace-nowrap">
                  <span className="text-muted-foreground">10+ qty</span>
                  <span className="font-bold text-rose-600 dark:text-rose-500 ml-1">15% off</span>
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Short Description - first sentence only */}
            {product.description && (
              <p className="text-muted-foreground mb-6">
                {product.description.split('. ')[0]}.
              </p>
            )}

            {/* Product Specs Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">
                  {product.sizeOptions && product.sizeOptions.length > 1
                    ? `${product.sizeOptions?.[0]?.value} - ${product.sizeOptions?.[product.sizeOptions.length - 1]?.value}`
                    : product.sizeFrom}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                <CircleDot className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Body:</span>
                <span className="font-medium">
                  {product.materials.body}
                  {product.materials.seat && `/${product.materials.seat}`}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                <Gauge className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Pressure:</span>
                <span className="font-medium">{product.pressureRange}</span>
              </div>
              {product.temperature && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                  <Thermometer className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">Max Temp:</span>
                  <span className="font-medium">{product.temperature}</span>
                </div>
              )}
            </div>

            {/* Size & Quantity Selector */}
            {hasSizeOptions ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Select Size & Quantity</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary hover:bg-primary text-white font-semibold px-3 py-1">
                      Ex GST
                    </Badge>
                    {product.leadTime && (
                      <Badge className="bg-orange-500 hover:bg-orange-500 text-white font-semibold px-3 py-1 text-xs">
                        {product.leadTime}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Please check product sizing carefully before ordering.
                </p>

                {/* Size Selector */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Size</label>

                    {/* Mobile: Wheel Picker */}
                    <div className="lg:hidden">
                      {!isPickerOpen ? (
                        <button
                          onClick={() => setIsPickerOpen(true)}
                          className={`w-full h-12 px-4 flex items-center justify-between rounded-lg border bg-card text-left ${!selectedSize ? "ring-2 ring-primary border-primary" : ""}`}
                        >
                          <span className={selectedSize ? "text-foreground" : "text-muted-foreground"}>
                            {selectedSize
                              ? (() => {
                                  const opt = product.sizeOptions?.find(s => s.value === selectedSize);
                                  return opt ? `${opt.value}${opt.label ? ` - ${opt.label}` : ''}` : selectedSize;
                                })()
                              : "Tap to choose a size..."}
                          </span>
                          <span className="text-muted-foreground">▼</span>
                        </button>
                      ) : (
                        <div className={`rounded-lg border bg-card overflow-hidden ${!selectedSize ? "ring-2 ring-primary border-primary" : ""}`}>
                          {/* Picker container */}
                          <div className="relative" style={{ height: 180 }}>
                            <Picker
                              value={{ size: selectedSize || product.sizeOptions?.[0]?.value || "" }}
                              onChange={(newValue) => setSelectedSize(newValue.size)}
                              wheelMode="natural"
                              height={180}
                            >
                              <Picker.Column name="size">
                                {product.sizeOptions?.map((size) => (
                                  <Picker.Item key={size.value} value={size.value}>
                                    {({ selected }) => (
                                      <div className={`grid grid-cols-[1fr_auto] w-full gap-4 px-4 items-center ${selected ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                                        <span className="text-left truncate">
                                          {size.value}
                                          {size.label && <span className="opacity-70 ml-1">- {size.label}</span>}
                                        </span>
                                        <span className={`text-right tabular-nums ${selected ? "text-primary" : ""}`}>
                                          {size.price ? `$${size.price.toFixed(2)}` : "POA"}
                                        </span>
                                      </div>
                                    )}
                                  </Picker.Item>
                                ))}
                              </Picker.Column>
                            </Picker>
                            {/* Selection highlight bar - centered in picker only */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 border-y border-primary/20 bg-primary/5 pointer-events-none" />
                          </div>
                          {/* Confirm button - outside picker container */}
                          <button
                            onClick={() => {
                              if (!selectedSize && product.sizeOptions?.[0]) {
                                setSelectedSize(product.sizeOptions?.[0]?.value || "")
                              }
                              setIsPickerOpen(false)
                            }}
                            className="w-full py-3 bg-primary text-primary-foreground font-medium"
                          >
                            Confirm Size
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Desktop: Dropdown */}
                    <div className="hidden lg:block">
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className={`w-full h-12 ${!selectedSize ? "ring-2 ring-primary border-primary" : ""}`} data-testid="select-size">
                          <SelectValue placeholder="Choose a size..." />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizeOptions?.map((size, index) => (
                            <SelectItem
                              key={size.value}
                              value={size.value}
                              className={`rounded-none ${index % 2 === 0 ? "bg-muted/40" : "bg-transparent"}`}
                            >
                              <div className="grid grid-cols-[1fr_auto] w-full gap-6 items-center">
                                <span className="text-left">
                                  {size.value}
                                  {size.label && <span className="text-muted-foreground ml-1">- {size.label}</span>}
                                </span>
                                <span className="text-right text-muted-foreground tabular-nums font-medium min-w-[80px]">
                                  {size.price ? `$${size.price.toFixed(2)}` : "POA"}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity Controls - only show when size selected */}
                  {selectedSizeOption && (
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Qty</label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            data-testid="button-decrease-qty"
                            className="h-9 w-9"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-bold min-w-[2.5rem] text-center" data-testid="quantity-display">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(1)}
                            data-testid="button-increase-qty"
                            className="h-9 w-9"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {hasDiscount && (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs">
                            {discountPercentage}% OFF
                          </Badge>
                        )}
                      </div>
                      {/* Show total when qty > 1 or discount applies */}
                      {selectedSizeOption.price && (quantity > 1 || hasDiscount) && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">
                            ${(hasDiscount
                              ? calculateDiscountedPrice(selectedSizeOption.price, quantity) * quantity
                              : selectedSizeOption.price * quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Products without size options - POA pricing */
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Request Quote</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-semibold px-3 py-1">
                      POA
                    </Badge>
                    {product.leadTime && (
                      <Badge className="bg-orange-500 hover:bg-orange-500 text-white font-semibold px-3 py-1 text-xs">
                        {product.leadTime}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Price on Application. Add to your quote and we&apos;ll provide pricing based on your requirements.
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 py-2">
                  <label className="text-sm font-medium">Qty</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-9 w-9"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-bold min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      className="h-9 w-9"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 space-y-4">
              {/* Material Test Certificate Option */}
              <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="material-test-cert"
                    checked={materialTestCert}
                    onCheckedChange={(checked) => setMaterialTestCert(checked === true)}
                    className="mt-0.5"
                  />
                  <div className="space-y-1 flex-1">
                    <label
                      htmlFor="material-test-cert"
                      className="text-sm font-medium cursor-pointer flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-primary" />
                      Add Material Test Certificate (+$350)
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Applies once per product type. May extend lead time.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 pl-6">
                  Please select now if required—certificates cannot be added after quote submission.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  ref={addToQuoteButtonRef}
                  size="lg"
                  onClick={handleAddToQuote}
                  disabled={hasSizeOptions && !selectedSize}
                  className="flex-1"
                  data-testid="button-add-to-quote"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {hasSizeOptions ? "Add to Quote" : "Request Quote"}
                  {quantity > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                      {quantity}
                    </Badge>
                  )}
                </Button>
                {product.downloads && product.downloads.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-download"
                    className="glass-button"
                    onClick={() =>
                      product.downloads && window.open(product.downloads[0].url, "_blank")
                    }
                  >
                    <Download className="mr-2 w-5 h-5" />
                    {product.downloads[0].label}
                  </Button>
                )}
              </div>
            </div>

            {/* SKU and Lead Time under button */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>SKU:</span>
                <span className="font-medium text-foreground" data-testid="text-sku">
                  {product.sku}
                </span>
              </div>
              {product.leadTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Lead Time:</span>
                  <span className="font-medium text-foreground">{product.leadTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Approvals / Certifications - Collapsible */}
        {product.certifications && (
          <Collapsible open={certOpen} onOpenChange={setCertOpen} className="mb-8">
            <Card className="glass shadow-md">
              <CollapsibleTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Approvals / Certifications</h2>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${certOpen ? 'rotate-180' : ''}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 px-4">
                  <p className="text-muted-foreground">{product.certifications}</p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Tabbed Product Information */}
        <Card className="mb-12 glass shadow-lg">
          <CardContent className="p-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className={`grid w-full mb-6 ${(product.video || (product.videos && product.videos.length > 0) || installationVideo) ? 'grid-cols-3' : 'grid-cols-2'}`} data-testid="tabs-product-info">
                <TabsTrigger value="description" data-testid="tab-description">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" data-testid="tab-specifications">
                  Specifications
                </TabsTrigger>
                {(product.video || (product.videos && product.videos.length > 0) || installationVideo) && (
                  <TabsTrigger value="video" data-testid="tab-video">
                    Video{product.videos && product.videos.length > 1 ? 's' : ''}
                    {product.videos && product.videos.length > 1 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {product.videos.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground mb-6 whitespace-pre-line" data-testid="text-description">
                      {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-0">
                <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="border-b border-border pb-3">
                      <div className="text-sm text-muted-foreground mb-1">{spec.label}</div>
                      <div className="font-medium text-lg">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {(product.video || (product.videos && product.videos.length > 0) || installationVideo) && (
                <TabsContent value="video" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">
                    {installationVideo && !product.video && !(product.videos && product.videos.length > 0)
                      ? 'Installation Video'
                      : `Product Video${product.videos && product.videos.length > 1 ? 's' : ''}`}
                    {product.videos && product.videos.length > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        {product.videos.length} videos
                      </Badge>
                    )}
                  </h2>

                  {/* Straub Installation Video */}
                  {installationVideo && (
                    <div className="mb-8">
                      {(product.video || (product.videos && product.videos.length > 0)) && (
                        <h3 className="text-lg font-semibold mb-3">Installation Guide</h3>
                      )}
                      <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          poster={`/images/products/straub/${product.slug.replace('straub-', '')}-photo.jpg`}
                        >
                          <source src={installationVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Watch this installation video to see how to properly fit the {product.name}.
                      </p>
                    </div>
                  )}

                  {/* Single video or primary video display */}
                  {product.videos && product.videos.length > 0 ? (
                    <div className="space-y-6">
                      {/* Main video player - shows selected or primary */}
                      <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${product.videos[0].youtubeId}`}
                          title={product.videos[0].title || "Product Video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      {product.videos[0].title && (
                        <p className="text-sm text-muted-foreground">
                          {product.videos[0].title}
                        </p>
                      )}

                      {/* Video gallery for multiple videos */}
                      {product.videos.length > 1 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-3">More Videos</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {product.videos.slice(1).map((video) => (
                              <a
                                key={video.id}
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                              >
                                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border hover:border-primary transition-colors">
                                  <Image
                                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                    alt={video.title || "Video thumbnail"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                    <div className="bg-white/90 rounded-full p-2">
                                      <Play className="h-6 w-6 text-primary fill-primary" />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {video.sizeLabel || video.title || `Video ${video.id}`}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : product.video ? (
                    <>
                      <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={product.video.replace("watch?v=", "embed/")}
                          title="Product Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Watch this video demonstration showing the {product.name} installation and
                        features.
                      </p>
                    </>
                  ) : null}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Applications */}
        {product.applications && product.applications.length > 0 && (
          <Card className="mb-12 glass shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Applications</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.applications.map((app, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">{app}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More From This Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="glass hover-elevate transition-all shadow-md">
                  <CardContent className="p-6">
                    <div className="aspect-square glass-subtle rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {relatedProduct.images[0]?.url &&
                      !imageErrors[relatedProduct.images[0].url] ? (
                        <Image
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.images[0].alt}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain"
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [relatedProduct.images[0].url]: true,
                            }))
                          }
                        />
                      ) : (
                        <Package className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2">
                      {relatedProduct.shortName || relatedProduct.name}
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Size From: {relatedProduct.sizeFrom}</div>
                      <div>Body: {relatedProduct.materials.body}</div>
                      <div>Pressure: {relatedProduct.pressureRange}</div>
                    </div>
                    <Link href={`/${relatedProduct.slug}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4 glass-button">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-background/95 backdrop-blur-sm border-0">
          <div className="relative w-full aspect-square md:aspect-video flex items-center justify-center">
            {uniqueImages[currentImageIndex]?.url && (
              <Image
                src={uniqueImages[currentImageIndex].url}
                alt={currentImageIndex === 0 ? mainImageAlt : uniqueImages[currentImageIndex].alt}
                fill
                className="object-contain p-4"
                priority
              />
            )}

            {/* Navigation Arrows in Lightbox */}
            {uniqueImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-3 rounded-full shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter in lightbox */}
            {uniqueImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 text-foreground px-3 py-1 rounded-md text-sm font-medium">
                {currentImageIndex + 1} / {uniqueImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
