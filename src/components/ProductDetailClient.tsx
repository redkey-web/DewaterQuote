"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Picker from "react-mobile-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  Thermometer,
  CircleDot,
} from "lucide-react"
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd"
import { useToast } from "@/hooks/use-toast"
import { useGeo } from "@/hooks/useGeo"
import {
  productToQuoteItem,
  getDiscountPercentage,
  getDiscountTier,
  calculateDiscountedPrice,
  isCustomSpecsBrand,
  DISCOUNT_TIERS,
} from "@/lib/quote"
import type { CustomSpecs, QuoteItem } from "@/types"
import { useQuote } from "@/context/QuoteContext"
import { trackProductView, trackAddToQuote } from "@/components/GoogleAnalytics"
import type { Product } from "@/types"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"
import CustomSizeRequest from "@/components/CustomSizeRequest"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { toast } = useToast()
  const { addItem, totalQuantity: cartTotalQuantity } = useQuote()
  const { isAustralia } = useGeo()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [materialTestCert, setMaterialTestCert] = useState<boolean>(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Custom specs for Straub/Teekay products
  const [customPipeOd, setCustomPipeOd] = useState<string>("")
  const [customRubberMaterial, setCustomRubberMaterial] = useState<CustomSpecs['rubberMaterial']>("EPDM")
  const [customPressure, setCustomPressure] = useState<string>("")
  const [customNotes, setCustomNotes] = useState<string>("")
  const isCustomSpecsProduct = isCustomSpecsBrand(product.brand)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)

  // Deduplicate images by URL only (don't filter by alt text - "duplicate" marking was overly aggressive)
  const uniqueImages = product.images
    .filter((img, idx, arr) => arr.findIndex((i) => i.url === img.url) === idx)

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
      'strainers': 'Strainers',
      'expansion-joints': 'Expansion Joints',
      'check-valves': 'Check Valves',
      'butterfly-valves': 'Butterfly Valves',
      'foot-valves': 'Foot Valves',
      'float-valves': 'Float Valves',
      'pipe-repair-clamps': 'Pipe Repair Clamps',
    }
    return names[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Helper to get human-readable subcategory name
  const getSubcategoryDisplayName = (slug: string): string => {
    const names: Record<string, string> = {
      'flex-grip': 'Flex Grip Couplings',
      'open-flex': 'Open Flex Couplings',
      'plast-grip': 'Plast Grip Couplings',
      'y-strainer': 'Y Strainers',
      'basket-strainer': 'Basket Strainers',
      'simplex-basket-strainer': 'Basket Strainers',
      'duplex-basket-strainer': 'Duplex Basket Strainers',
      'flanged-suction-strainer': 'Flanged Suction Strainers',
      'butterfly-valve': 'Butterfly Valves',
      'check-valve': 'Check Valves',
      'check-valves': 'Check Valves',
      'foot-valve': 'Foot Valves',
      'float-valve': 'Float Valves',
      'ball-valve': 'Ball Valves',
      'gate-valve': 'Gate Valves',
      'rubber-expansion-joint': 'Rubber Expansion Joints',
      'duckbill-check-valve': 'Duckbill Check Valves',
      'single-sphere': 'Single Sphere Expansion Joints',
      'twin-sphere': 'Twin Sphere Expansion Joints',
      'single-arch': 'Single Arch Expansion Joints',
      'double-arch': 'Double Arch Expansion Joints',
      'triple-arch': 'Triple Arch Expansion Joints',
      'quadruple-arch': 'Quadruple Arch Expansion Joints',
      'reducing': 'Reducing Expansion Joints',
      'ptfe-lined': 'PTFE Lined Expansion Joints',
    }
    return names[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Helper to get actual page URL for subcategory
  const getSubcategoryUrl = (slug: string): string => {
    const urls: Record<string, string> = {
      // Expansion joints - subcategory slug to page URL
      'single-sphere': 'single-sphere-expansion-joints',
      'twin-sphere': 'twin-sphere-expansion-joints',
      'single-arch': 'single-arch-expansion-joints',
      'double-arch': 'double-arch-expansion-joints',
      'triple-arch': 'triple-arch-expansion-joints',
      'quadruple-arch': 'quadruple-arch-expansion-joints',
      'reducing': 'reducing-expansion-joints',
      'ptfe-lined': 'ptfe-lined-expansion-joints',
      // Valves
      'butterfly-valve': 'butterfly-valves',
      'check-valve': 'check-valves',
      'check-valves': 'check-valves',
      'foot-valve': 'foot-valves',
      'float-valve': 'float-valves',
      'ball-valve': 'ball-valves',
      'gate-valve': 'gate-valves',
      'duckbill-check-valve': 'duckbill-check-valves',
      // Strainers
      'y-strainer': 'y-strainers',
      'basket-strainer': 'basket-strainers',
      'simplex-basket-strainer': 'basket-strainers',
      'duplex-basket-strainer': 'duplex-basket-strainers',
      'flanged-suction-strainer': 'flanged-suction-strainers',
      // Couplings
      'muff-coupling': 'muff-couplings',
    }
    return urls[slug] || slug
  }

  // Helper to get actual page URL for category (when DB slug differs from route)
  const getCategoryUrl = (slug: string): string => {
    const urls: Record<string, string> = {
      'valves': 'industrial-valves',
      'repair-clamps': 'pipe-repair-clamps',
    }
    return urls[slug] || slug
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
    // Reset custom specs
    setCustomPipeOd("")
    setCustomRubberMaterial("EPDM")
    setCustomPressure("")
    setCustomNotes("")
  }, [product.id])

  // Track product view in GA4
  useEffect(() => {
    trackProductView(product.name, product.id, product.category)
  }, [product])

  // Get the selected size option details
  const selectedSizeOption = product.sizeOptions?.find((s) => s.value === selectedSize)

  // Calculate cart-aware discount tiers
  const currentCartTier = getDiscountTier(cartTotalQuantity)
  const projectedTotal = cartTotalQuantity + quantity
  const projectedTier = getDiscountTier(projectedTotal)
  const discountPercentage = projectedTier?.percentage || 0
  const hasDiscount = isAustralia && discountPercentage > 0 && selectedSizeOption?.price

  // Calculate items needed for next tier
  const getItemsToNextTier = () => {
    if (discountPercentage >= 15) return null // Already at max tier
    // Find the next tier above current projected percentage
    const sortedTiers = [...DISCOUNT_TIERS].sort((a, b) => a.minQuantity - b.minQuantity)
    for (const tier of sortedTiers) {
      if (tier.percentage > discountPercentage) {
        const itemsNeeded = tier.minQuantity - projectedTotal
        if (itemsNeeded > 0) {
          return { itemsNeeded, tierPercentage: tier.percentage }
        }
      }
    }
    return null
  }
  const nextTierInfo = getItemsToNextTier()

  // Check if product has size options (more than one = needs selector)
  const hasSizeOptions = product.sizeOptions && product.sizeOptions.length > 0
  const needsSizeSelector = product.sizeOptions && product.sizeOptions.length > 1
  const hasSingleSize = product.sizeOptions && product.sizeOptions.length === 1

  const handleAddToQuote = () => {
    try {
      // Validate custom specs for Straub/Teekay products
      if (isCustomSpecsProduct) {
        if (!customPipeOd.trim()) {
          toast({
            title: "Pipe OD Size Required",
            description: "Please enter your pipe outside diameter size.",
            variant: "destructive",
          })
          return
        }
        if (!customPressure.trim()) {
          toast({
            title: "System Pressure Required",
            description: "Please enter your system operating pressure.",
            variant: "destructive",
          })
          return
        }
        if (customPressure.length > 25) {
          toast({
            title: "Pressure Too Long",
            description: "System pressure must be 25 characters or less.",
            variant: "destructive",
          })
          return
        }
      } else {
        // Only require size selection if product has multiple size options
        if (needsSizeSelector && !selectedSize) {
          toast({
            title: "No Size Selected",
            description: "Please select a size to add to your quote.",
            variant: "destructive",
          })
          return
        }
      }

      const quoteItem = productToQuoteItem(product, {
        selectedSize: needsSizeSelector ? selectedSize : (hasSingleSize ? product.sizeOptions![0].value : undefined),
        quantity: quantity,
        materialTestCert: materialTestCert,
        customSpecs: isCustomSpecsProduct ? {
          pipeOd: customPipeOd.trim(),
          rubberMaterial: customRubberMaterial,
          pressure: customPressure.trim(),
          notes: customNotes.trim() || undefined,
        } : undefined,
      })
      addItem(quoteItem, addToQuoteButtonRef.current)

      // Track add to quote in GA4
      trackAddToQuote(product.name, isCustomSpecsProduct ? customPipeOd : (selectedSize || "POA"), quantity)

      // Reset after adding
      setSelectedSize("")
      setQuantity(1)
      setMaterialTestCert(false)
      // Reset custom specs
      setCustomPipeOd("")
      setCustomRubberMaterial("EPDM")
      setCustomPressure("")
      setCustomNotes("")
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

  // Build breadcrumb trail: Home > Category > Subcategory (if exists) > Product
  const categoryUrl = getCategoryUrl(product.category)
  const breadcrumbItems = [
    { name: "Home", url: baseUrl, slug: "" },
    { name: getCategoryDisplayName(product.category), url: `${baseUrl}/${categoryUrl}`, slug: categoryUrl },
  ]
  if (product.subcategory) {
    breadcrumbItems.push({
      name: getSubcategoryDisplayName(product.subcategory),
      url: `${baseUrl}/${getSubcategoryUrl(product.subcategory)}`,
      slug: getSubcategoryUrl(product.subcategory),
    })
  }
  breadcrumbItems.push({ name: product.name, url: productUrl, slug: product.slug })

  // For JSON-LD (simpler format)
  const breadcrumbs = breadcrumbItems.map(item => ({ name: item.name, url: item.url }))

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Dark grey strip behind header */}
      <div className="h-[44px] bg-zinc-500 -mt-[44px]" />
      <BulkPricingTicker variant="teal" />
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb Navigation - Middle items hidden on mobile */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbItems.flatMap((item, index) => {
              // Hide middle items (category/subcategory) on mobile, show only Home > Product
              const isMiddle = index > 0 && index < breadcrumbItems.length - 1
              const isLast = index === breadcrumbItems.length - 1
              const elements = [
                <BreadcrumbItem key={item.slug || 'home'} className={isMiddle ? 'hidden md:inline-flex' : ''}>
                  {isLast ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.url.replace(baseUrl, '') || '/'}>{item.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ]
              if (!isLast) {
                elements.push(
                  <BreadcrumbSeparator key={`sep-${item.slug || 'home'}`} className={isMiddle ? 'hidden md:block' : ''} />
                )
              }
              return elements
            })}
          </BreadcrumbList>
        </Breadcrumb>

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

            <Separator className="my-6" />

            {/* Short Description - first 1-2 sentences only */}
            {product.description && (
              <p className="text-muted-foreground mb-6">
                {(() => {
                  // Split on sentence endings (period followed by space or newline)
                  const sentences = product.description.split(/\.[\s\n]+/)
                  // Take first 1-2 sentences, max ~200 chars
                  let short = sentences[0]
                  if (sentences.length > 1 && short.length < 100) {
                    short += '. ' + sentences[1]
                  }
                  // Truncate if still too long
                  if (short.length > 200) {
                    short = short.substring(0, 200).replace(/\s+\S*$/, '') + '...'
                  } else {
                    short += '.'
                  }
                  return short
                })()}
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
              {product.temperature && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                  <Thermometer className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">Max Temp:</span>
                  <span className="font-medium">{product.temperature}</span>
                </div>
              )}
            </div>

            {/* Bulk Pricing Info - AU only */}
            {isAustralia && (
              <div className="py-2 px-3 rounded-lg mb-4 carbon-fiber">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                  <span className="font-semibold text-white whitespace-nowrap">
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 inline mr-1" />
                    Bulk Pricing:
                  </span>
                  <span className={`whitespace-nowrap ${discountPercentage === 5 ? 'ring-1 ring-white/50 rounded px-1 bg-white/10' : ''}`}>
                    <span className="text-gray-300">2-4 qty</span>
                    <span className="font-bold ml-1" style={{ color: '#ccff00', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>5% off</span>
                  </span>
                  <span className={`whitespace-nowrap ${discountPercentage === 10 ? 'ring-1 ring-white/50 rounded px-1 bg-white/10' : ''}`}>
                    <span className="text-gray-300">5-9 qty</span>
                    <span className="font-bold ml-1" style={{ color: '#ff6600' }}>10% off</span>
                  </span>
                  <span className={`whitespace-nowrap ${discountPercentage === 15 ? 'ring-1 ring-white/50 rounded px-1 bg-white/10' : ''}`}>
                    <span className="text-gray-300">10+ qty</span>
                    <span className="font-bold ml-1" style={{ color: '#E91E63' }}>15% off</span>
                  </span>
                </div>
              </div>
            )}
            {/* Discount note - below carbon container */}
            {isAustralia && (
              <p className="text-center text-xs text-muted-foreground mb-6">
                Discounts apply to your total order quantity across all products
              </p>
            )}

            {/* Custom Specs Form for Straub/Teekay OR Size & Quantity Selector */}
            {isCustomSpecsProduct ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Your Pipe Specifications</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-semibold px-3 py-1">
                      POA
                    </Badge>
                    {product.leadTime && (
                      <Badge className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold px-3 py-1 text-xs">
                        Lead time: {product.leadTime}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your pipe specifications below. All fields except comments are required.
                </p>

                {/* Custom Specs Fields */}
                <div className="space-y-4">
                  {/* Pipe OD Size */}
                  <div>
                    <label htmlFor="pipe-od" className="text-sm font-medium mb-2 block">
                      Pipe OD Size (Outside Diameter) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="pipe-od"
                      type="text"
                      value={customPipeOd}
                      onChange={(e) => setCustomPipeOd(e.target.value)}
                      placeholder="e.g., 48.3mm, 2 inch, DN50"
                      className={`h-12 ${!customPipeOd.trim() ? "ring-2 ring-primary border-primary" : ""}`}
                    />
                  </div>

                  {/* Rubber Material Dropdown */}
                  <div>
                    <label htmlFor="rubber-material" className="text-sm font-medium mb-2 block">
                      Rubber Material <span className="text-red-500">*</span>
                    </label>
                    <Select value={customRubberMaterial} onValueChange={(v) => setCustomRubberMaterial(v as CustomSpecs['rubberMaterial'])}>
                      <SelectTrigger className="w-full h-12" id="rubber-material">
                        <SelectValue placeholder="Select rubber material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EPDM">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">EPDM</span>
                            <span className="text-xs text-muted-foreground">Water, steam, general purpose (-40°C to +120°C)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="NBR">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">NBR</span>
                            <span className="text-xs text-muted-foreground">Oil, fuel, hydraulic fluids (-30°C to +100°C)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Viton">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Viton (FKM)</span>
                            <span className="text-xs text-muted-foreground">High temp, chemical resistant (-20°C to +200°C)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="GORE-TEX">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">GORE-TEX</span>
                            <span className="text-xs text-muted-foreground">Universal chemical resistance, food-grade (-40°C to +230°C)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* System Operating Pressure */}
                  <div>
                    <label htmlFor="pressure" className="text-sm font-medium mb-2 block">
                      System Operating Pressure <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="pressure"
                      type="text"
                      value={customPressure}
                      onChange={(e) => setCustomPressure(e.target.value.slice(0, 25))}
                      placeholder="e.g., 16 bar, 250 psi"
                      maxLength={25}
                      className={`h-12 ${!customPressure.trim() ? "ring-2 ring-primary border-primary" : ""}`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{customPressure.length}/25 characters</p>
                  </div>

                  {/* Additional Comments */}
                  <div>
                    <label htmlFor="notes" className="text-sm font-medium mb-2 block">
                      Additional Comments <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Textarea
                      id="notes"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="Any additional specifications or requirements..."
                      rows={3}
                    />
                  </div>

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
              </div>
            ) : hasSizeOptions ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Select Size & Quantity</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary hover:bg-primary text-white font-semibold px-3 py-1">
                      Ex GST
                    </Badge>
                    {product.leadTime && (
                      <Badge className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold px-3 py-1 text-xs">
                        Lead time: {product.leadTime}
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
                          <div className="relative" style={{ height: 252 }}>
                            <Picker
                              value={{ size: selectedSize || product.sizeOptions?.[0]?.value || "" }}
                              onChange={(newValue) => setSelectedSize(newValue.size)}
                              wheelMode="natural"
                              height={252}
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
                                          {isAustralia ? (size.price ? `$${size.price.toFixed(2)}` : "POA") : ""}
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
                                {isAustralia && (
                                  <span className="text-right text-muted-foreground tabular-nums font-medium min-w-[80px]">
                                    {size.price ? `$${size.price.toFixed(2)}` : "POA"}
                                  </span>
                                )}
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
                        {/* Next tier hint */}
                        {isAustralia && nextTierInfo && (
                          <span className="text-xs text-amber-600">
                            Add {nextTierInfo.itemsNeeded} more for {nextTierInfo.tierPercentage}% off
                          </span>
                        )}
                      </div>
                      {/* Show total when qty > 1 or discount applies - AU only */}
                      {isAustralia && selectedSizeOption.price && (quantity > 1 || hasDiscount) && (
                        <div className="text-right">
                          {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              ${(selectedSizeOption.price * quantity).toFixed(2)}
                            </span>
                          )}
                          <span className="text-lg font-bold text-primary">
                            ${(hasDiscount
                              ? calculateDiscountedPrice(selectedSizeOption.price, projectedTotal) * quantity
                              : selectedSizeOption.price * quantity
                            ).toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <p className="text-xs text-green-600 mt-0.5">
                              You save ${((selectedSizeOption.price * quantity) - (calculateDiscountedPrice(selectedSizeOption.price, projectedTotal) * quantity)).toFixed(2)}
                            </p>
                          )}
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
                      <Badge className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold px-3 py-1 text-xs">
                        Lead time: {product.leadTime}
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
                  {/* Next tier hint for POA products */}
                  {isAustralia && nextTierInfo && (
                    <span className="text-xs text-amber-600">
                      Add {nextTierInfo.itemsNeeded} more for {nextTierInfo.tierPercentage}% off
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Custom Size Request - for products with size options (not Straub/Teekay) */}
            {hasSizeOptions && !isCustomSpecsProduct && (
              <CustomSizeRequest
                product={product}
                onAddToQuote={(item: QuoteItem) => {
                  addItem(item, addToQuoteButtonRef.current)
                }}
              />
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
                      Add Material Test Certificate{isAustralia && " (+$350)"}
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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  ref={addToQuoteButtonRef}
                  size="lg"
                  onClick={handleAddToQuote}
                  disabled={isCustomSpecsProduct
                    ? (!customPipeOd.trim() || !customPressure.trim())
                    : (hasSizeOptions && !selectedSize)
                  }
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
                    className="glass-button w-full sm:w-auto"
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
              <TabsList className={`grid w-full mb-6 ${(product.video || (product.videos && product.videos.length > 0) || installationVideo) ? 'grid-cols-3' : 'grid-cols-2'} ${product.brand === 'Bore-Flex Rubber' ? 'bg-black' : ''}`} data-testid="tabs-product-info">
                <TabsTrigger value="description" className={`${product.brand === 'Bore-Flex Rubber' ? 'text-[#FEA4A1] data-[state=active]:text-[#FEA4A1]' : ''} ${product.brand === 'Defender Strainers' ? 'text-[15px]' : ''}`} data-testid="tab-description">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className={`${product.brand === 'Bore-Flex Rubber' ? 'text-[#FEA4A1] data-[state=active]:text-[#FEA4A1]' : ''} ${product.brand === 'Defender Strainers' ? 'text-[15px]' : ''}`} data-testid="tab-specifications">
                  Specifications
                </TabsTrigger>
                {(product.video || (product.videos && product.videos.length > 0) || installationVideo) && (
                  <TabsTrigger value="video" className={`${product.brand === 'Bore-Flex Rubber' ? 'text-[#FEA4A1] data-[state=active]:text-[#FEA4A1]' : ''} ${product.brand === 'Defender Strainers' ? 'text-[15px]' : ''}`} data-testid="tab-video">
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
                <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                {product.downloads && product.downloads.length > 0 && (
                  <a
                    href={product.downloads[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {product.downloads[0].label || "Product Datasheet"}
                  </a>
                )}
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
              <ApplicationLinks applications={product.applications} variant="list" />
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
