"use client"

import { useState, useEffect, useCallback } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  ShoppingCart,
  Package,
  Clock,
  Truck,
  Plus,
  Minus,
  TrendingDown,
} from "lucide-react"
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd"
import { useToast } from "@/hooks/use-toast"
import { getProductBySlug, getProductsBySubcategory } from "@/data/catalog"
import {
  productToQuoteItem,
  getDiscountPercentage,
  calculateDiscountedPrice,
} from "@/lib/quote"
import { useQuote } from "@/context/QuoteContext"

interface ProductDetailPageProps {
  params: { slug: string }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params
  const { toast } = useToast()
  const { addItem } = useQuote()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const product = getProductBySlug(slug || "")

  // Reset image error states when product changes
  useEffect(() => {
    setImageErrors({})
  }, [product?.id])

  if (!product) {
    notFound()
  }

  // Get related products from the same subcategory
  const relatedProducts = product.subcategory
    ? getProductsBySubcategory(product.category, product.subcategory)
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : []

  const handleAddToQuote = () => {
    try {
      const selections = Object.entries(quantities).filter(([, qty]) => qty > 0)

      if (selections.length === 0) {
        toast({
          title: "No Variations Selected",
          description: "Please select at least one size and quantity to add to your quote.",
          variant: "destructive",
        })
        return
      }

      // Add each selected variation to the quote
      selections.forEach(([sizeValue, qty]) => {
        const quoteItem = productToQuoteItem(product, {
          selectedSize: sizeValue,
          quantity: qty,
        })
        addItem(quoteItem)
      })

      // Show success toast with summary
      const totalItems = selections.reduce((sum, [, qty]) => sum + qty, 0)
      const summary =
        selections.length === 1
          ? `${selections[0][1]} × ${product.sizeOptions?.find((s) => s.value === selections[0][0])?.label || "item"}`
          : `${selections.length} sizes (${totalItems} total items)`

      toast({
        title: "Added to Quote",
        description: `${product.name} - ${summary} added to your quote request.`,
      })

      // Reset quantities after adding to quote
      setQuantities({})
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to quote",
        variant: "destructive",
      })
    }
  }

  const handleQuantityChange = useCallback((sizeValue: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[sizeValue] || 0
      const newQty = Math.max(0, currentQty + delta)
      if (newQty === 0) {
        const { [sizeValue]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [sizeValue]: newQty }
    })
  }, [])

  const baseUrl = "https://dewaterproducts.com.au"
  const productUrl = `${baseUrl}/products/${product.slug}`

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Products", url: `${baseUrl}/products` },
    { name: product.name, url: productUrl },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
              {product.images[currentImageIndex]?.url ? (
                <Image
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                  priority
                />
              ) : (
                <Package className="w-32 h-32 text-muted-foreground" />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    data-testid={`button-thumbnail-${idx}`}
                    className={`aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
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
            <Badge variant="secondary" className="mb-2" data-testid="badge-brand">
              {product.brand}
            </Badge>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-product-title">
              {product.name}
            </h1>

            <div className="flex items-center justify-end gap-2 mb-6 text-accent">
              <Truck className="w-8 h-8" />
              <p className="text-2xl font-medium">Free delivery to metro areas</p>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Product Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Size Range:</span>
                  <p className="font-medium">
                    {product.sizeOptions && product.sizeOptions.length > 1
                      ? `${product.sizeOptions[0].value} - ${product.sizeOptions[product.sizeOptions.length - 1].value}`
                      : product.sizeFrom}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Body:</span>
                  <p className="font-medium">
                    {product.materials.body}
                    {product.materials.seat && `/${product.materials.seat}`}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Pressure Range:</span>
                  <p className="font-medium">{product.pressureRange}</p>
                </div>
                {product.temperature && (
                  <div>
                    <span className="text-sm text-muted-foreground">Max Temperature:</span>
                    <p className="font-medium">{product.temperature}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Multi-Variation Selector */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Select Sizes & Quantities</h3>
                {product.priceNote && (
                  <p className="text-sm text-muted-foreground mb-4">{product.priceNote}</p>
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  Select quantities for one or more sizes to add to your quote.
                </p>

                <ScrollArea className="h-[320px] border rounded-md">
                  <div className="p-4">
                    {product.sizeOptions?.map((size, idx) => (
                      <div
                        key={size.value}
                        data-testid={`variation-row-${size.value}`}
                        className={`flex items-center justify-between py-3 ${
                          idx !== (product.sizeOptions?.length || 0) - 1
                            ? "border-b border-border"
                            : ""
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{size.label}</div>
                          {size.sku && (
                            <div className="text-xs text-muted-foreground">SKU: {size.sku}</div>
                          )}
                          {(() => {
                            const qty = quantities[size.value] || 0
                            const discountPercentage = getDiscountPercentage(qty)
                            const hasDiscount = discountPercentage > 0 && size.price

                            return (
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                {hasDiscount ? (
                                  <>
                                    <div className="text-sm line-through text-destructive">
                                      ${size.price?.toFixed(2)}
                                    </div>
                                    <div className="text-sm font-semibold text-primary">
                                      ${calculateDiscountedPrice(size.price!, qty).toFixed(2)} ex
                                      GST
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="bg-destructive/10 text-destructive text-xs"
                                    >
                                      {discountPercentage}% OFF
                                    </Badge>
                                  </>
                                ) : (
                                  <div className="text-sm font-semibold text-primary">
                                    {size.price ? `$${size.price.toFixed(2)} ex GST` : "POA"}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(size.value, -1)}
                            disabled={(quantities[size.value] || 0) <= 0}
                            data-testid={`button-decrease-${size.value}`}
                            className="h-8 w-8"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Badge
                            variant="secondary"
                            className="w-12 h-8 flex items-center justify-center font-semibold"
                            data-testid={`quantity-${size.value}`}
                          >
                            {quantities[size.value] || 0}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(size.value, 1)}
                            data-testid={`button-increase-${size.value}`}
                            className="h-8 w-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <div className="flex items-start gap-2">
                    <TrendingDown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-foreground">Volume Discounts Available:</p>
                      <p className="text-muted-foreground">
                        2-4 items: 5% off | 5-9 items: 10% off | 10+ items: 15% off
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prices shown exclude GST. Use +/- buttons to select quantities.
                </p>
              </div>
            )}

            <div className="mb-6">
              {Object.values(quantities).filter((q) => q > 0).length === 0 && (
                <p className="text-sm text-muted-foreground mb-2">
                  Select at least one size and quantity above to add to your quote.
                </p>
              )}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToQuote}
                  disabled={Object.values(quantities).filter((q) => q > 0).length === 0}
                  className="flex-1"
                  data-testid="button-add-to-quote"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Add to Quote
                  {Object.values(quantities).filter((q) => q > 0).length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {Object.values(quantities).reduce((sum, q) => sum + q, 0)}
                    </Badge>
                  )}
                </Button>
                {product.downloads && product.downloads.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-download"
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

        {/* Tabbed Product Information */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-product-info">
                <TabsTrigger value="description" data-testid="tab-description">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" data-testid="tab-specifications">
                  Specifications
                </TabsTrigger>
                {product.video && (
                  <TabsTrigger value="video" data-testid="tab-video">
                    Video
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground mb-6" data-testid="text-description">
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

              {product.video && (
                <TabsContent value="video" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Product Video</h2>
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
                    ></iframe>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Watch this video demonstration showing the {product.name} installation and
                    features.
                  </p>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Applications */}
        {product.applications && product.applications.length > 0 && (
          <Card className="mb-12">
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

        {/* Approvals / Certifications */}
        {product.certifications && (
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Approvals / Certifications</h2>
              <p className="text-muted-foreground">{product.certifications}</p>
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More From This Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover-elevate transition-all">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
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
                    <Link href={`/products/${relatedProduct.slug}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4">
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
    </div>
  )
}
