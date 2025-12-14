import { useParams } from "wouter";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ShoppingCart, Package, Clock, Truck, Plus, Minus, TrendingDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import { DiscountCelebration } from "@/components/DiscountCelebration";
import { useToast } from "@/hooks/use-toast";
import { getProductBySlug, getProductsBySubcategory } from "@shared/data/catalog";
import { productToQuoteItem, getDiscountTier, getDiscountPercentage, calculateDiscountedPrice } from "@/lib/quote";
import type { Product, QuoteItem } from "@shared/schema";

interface ProductDetailPageProps {
  onAddToQuote: (item: QuoteItem) => void;
}

export default function ProductDetailPage({ onAddToQuote }: ProductDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [celebration, setCelebration] = useState<{ discount: number; position: { x: number; y: number } } | null>(null);
  const previousTierRef = useRef<number>(0);
  
  const product = getProductBySlug(slug || "");
  
  // Reset image error states when product changes
  useEffect(() => {
    setImageErrors({});
  }, [product?.id]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Get related products from the same subcategory
  const relatedProducts = product.subcategory 
    ? getProductsBySubcategory(product.category, product.subcategory)
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  const handleAddToQuote = () => {
    try {
      const selections = Object.entries(quantities).filter(([, qty]) => qty > 0);
      
      if (selections.length === 0) {
        toast({
          title: "No Variations Selected",
          description: "Please select at least one size and quantity to add to your quote.",
          variant: "destructive",
        });
        return;
      }

      // Add each selected variation to the quote
      selections.forEach(([sizeValue, qty]) => {
        const quoteItem = productToQuoteItem(product, {
          selectedSize: sizeValue,
          quantity: qty,
        });
        onAddToQuote(quoteItem);
      });

      // Show success toast with summary
      const totalItems = selections.reduce((sum, [, qty]) => sum + qty, 0);
      const summary = selections.length === 1
        ? `${selections[0][1]} × ${product.sizeOptions?.find(s => s.value === selections[0][0])?.label || 'item'}`
        : `${selections.length} sizes (${totalItems} total items)`;

      toast({
        title: "Added to Quote",
        description: `${product.name} - ${summary} added to your quote request.`,
      });

      // Reset quantities after adding to quote
      setQuantities({});
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to quote",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = useCallback((sizeValue: string, delta: number, event?: React.MouseEvent) => {
    setQuantities(prev => {
      const currentQty = prev[sizeValue] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const oldTotal = Object.values(prev).reduce((sum, q) => sum + q, 0);
      const newTotal = oldTotal - currentQty + newQty;
      
      const oldDiscount = getDiscountPercentage(oldTotal);
      const newDiscount = getDiscountPercentage(newTotal);
      
      if (newDiscount > oldDiscount && event) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setCelebration({
          discount: newDiscount,
          position: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        });
      }
      
      if (newQty === 0) {
        const { [sizeValue]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [sizeValue]: newQty };
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {celebration && (
        <DiscountCelebration 
          discount={celebration.discount}
          triggerPosition={celebration.position}
          onComplete={() => setCelebration(null)}
        />
      )}
      <VolumeDiscountsBar />
      <SEO 
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.brand}, ${product.sku}, ${product.category}, pipe fittings, valves`}
        canonical={`https://dewaterproducts.com.au/products/${product.slug}`}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div 
              className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                transform: 'perspective(1000px) rotateX(2deg)',
              }}
            >
              {product.images[currentImageIndex]?.url ? (
                <img 
                  src={product.images[currentImageIndex].url} 
                  alt={product.images[currentImageIndex].alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
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
                    style={{
                      boxShadow: currentImageIndex === idx 
                        ? '0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)' 
                        : '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
                      transform: 'perspective(500px) rotateX(2deg)',
                    }}
                    className={`aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:scale-105 ${
                      currentImageIndex === idx ? 'ring-2 ring-primary scale-105' : ''
                    }`}
                  >
                    {img.url ? (
                      <img 
                        src={img.url} 
                        alt={img.alt}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Download Datasheet Button - Worksite Tape Style */}
            {product.downloads && product.downloads.length > 0 && (
              <div className="mt-6">
                <button 
                  className="w-full h-11 relative overflow-hidden rounded-md shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  style={{
                    background: `repeating-linear-gradient(
                      -45deg,
                      #D4B32C,
                      #D4B32C 10px,
                      #3A3A3A 10px,
                      #3A3A3A 20px
                    )`,
                  }}
                  data-testid="button-download-datasheet"
                  onClick={() => product.downloads && window.open(product.downloads[0].url, '_blank')}
                >
                  <span 
                    className="absolute inset-0 rounded-md transition-all duration-200"
                    style={{
                      boxShadow: 'inset 0 0 15px rgba(255,255,255,0.25), inset -4px 4px 8px rgba(0,0,0,0.4)',
                    }}
                  />
                  <span 
                    className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4), inset 4px -4px 8px rgba(255,255,255,0.25)',
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.9)' }}>
                    <Download className="mr-2 w-5 h-5" />
                    Download Product Datasheet
                  </span>
                </button>
              </div>
            )}

            {/* Volume Discounts - Prominent Red Section */}
            <div className="mt-6 p-5 bg-red-50 dark:bg-red-950/30 border-2 border-red-500 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-7 h-7 text-red-600" />
                <h3 className="text-xl font-bold text-red-600">Volume Discounts</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white dark:bg-red-950/50 rounded-md p-4 border border-red-200 dark:border-red-800">
                  <div className="text-3xl font-bold text-red-600">5%</div>
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">2-4 items</div>
                </div>
                <div className="bg-white dark:bg-red-950/50 rounded-md p-4 border border-red-200 dark:border-red-800">
                  <div className="text-3xl font-bold text-red-600">10%</div>
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">5-9 items</div>
                </div>
                <div className="bg-white dark:bg-red-950/50 rounded-md p-4 border border-red-200 dark:border-red-800">
                  <div className="text-3xl font-bold text-red-600">15%</div>
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">10+ items</div>
                </div>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center font-medium">
                Discounts applied automatically at checkout
              </p>
            </div>

            {/* Free Delivery Notice */}
            <div className="mt-4 p-5 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-4">
                <Truck className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-xl font-semibold text-primary">Free Delivery</p>
                  <p className="text-base text-muted-foreground">To all metro areas across Australia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-3" data-testid="text-product-title">
              {product.name}
            </h1>

            <Separator className="my-6" />

            <div className="mb-6 relative">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              {product.brand && (
                <img 
                  src={`/images/brands/${product.brand.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                  alt={`${product.brand} logo`}
                  className="h-20 object-contain absolute -top-2 right-0"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('brand-fallback');
                    if (fallback) fallback.style.display = 'inline-flex';
                  }}
                />
              )}
              <Badge variant="secondary" className="hidden absolute -top-2 right-0" id="brand-fallback" data-testid="badge-brand">
                {product.brand}
              </Badge>
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
                  <p className="font-medium">{product.materials.body}{product.materials.seat && `/${product.materials.seat}`}</p>
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
                          idx !== (product.sizeOptions?.length || 0) - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{size.label}</div>
                          {size.sku && (
                            <div className="text-xs text-muted-foreground">SKU: {size.sku}</div>
                          )}
                          {(() => {
                            const qty = quantities[size.value] || 0;
                            const discountPercentage = getDiscountPercentage(qty);
                            const hasDiscount = discountPercentage > 0 && size.price;
                            
                            return (
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                {hasDiscount ? (
                                  <>
                                    <div className="text-sm line-through text-destructive">
                                      ${size.price?.toFixed(2)}
                                    </div>
                                    <div className="text-sm font-semibold text-primary">
                                      ${calculateDiscountedPrice(size.price!, qty).toFixed(2)} ex GST
                                    </div>
                                    <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs">
                                      {discountPercentage}% OFF
                                    </Badge>
                                  </>
                                ) : (
                                  <div className="text-sm font-semibold text-primary">
                                    {size.price ? `$${size.price.toFixed(2)} ex GST` : 'POA'}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleQuantityChange(size.value, -1, e)}
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
                            onClick={(e) => handleQuantityChange(size.value, 1, e)}
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
                <p className="text-xs text-muted-foreground mt-2">
                  Prices shown exclude GST. Use +/- buttons to select quantities.
                </p>
              </div>
            )}

            <div className="mb-6">
              {Object.values(quantities).filter(q => q > 0).length === 0 && (
                <p className="text-sm text-muted-foreground mb-2">
                  Select at least one size and quantity above to add to your quote.
                </p>
              )}
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToQuote}
                  disabled={Object.values(quantities).filter(q => q > 0).length === 0}
                  className="flex-1 h-14 rounded-full relative overflow-hidden font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: Object.values(quantities).filter(q => q > 0).length > 0
                      ? 'linear-gradient(180deg, #2a9baa 0%, #1d7a85 25%, #186870 50%, #1d7a85 75%, #2a9baa 100%)'
                      : 'linear-gradient(180deg, #1e8090 0%, #146570 25%, #0d525c 50%, #146570 75%, #1e8090 100%)',
                    boxShadow: Object.values(quantities).filter(q => q > 0).length > 0
                      ? 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(57,194,217,0.5), 0 0 40px rgba(57,194,217,0.3), 0 4px 12px rgba(0,0,0,0.3)'
                      : 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                    border: Object.values(quantities).filter(q => q > 0).length > 0
                      ? '2px solid #39C2D9'
                      : '2px solid #0d525c',
                  }}
                  data-testid="button-add-to-quote"
                >
                  <span 
                    className="absolute inset-0 rounded-full transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      opacity: Object.values(quantities).filter(q => q > 0).length > 0 ? 0.5 : 0.3,
                    }}
                  />
                  <span className="relative flex items-center justify-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Add to Quote
                    {Object.values(quantities).filter(q => q > 0).length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {Object.values(quantities).reduce((sum, q) => sum + q, 0)}
                      </Badge>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* SKU and Lead Time under button */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>SKU:</span>
                <span className="font-medium text-foreground" data-testid="text-sku">{product.sku}</span>
              </div>
              {product.leadTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Lead Time:</span>
                  <span className="font-medium text-foreground">{product.leadTime}</span>
                </div>
              )}
            </div>

            {/* Applications / Industries */}
            {product.applications && product.applications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Applications / Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-muted rounded-md text-sm text-muted-foreground border border-border"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Approvals / Certifications */}
        {product.certifications && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Approvals / Certifications</h2>
              <p className="text-muted-foreground">
                {product.certifications.split('. ').map((cert, idx, arr) => {
                  const certificationLinks: Record<string, string> = {
                    'ISO 9001': 'https://www.iso.org/iso-9001-quality-management.html',
                    'AS/NZS': 'https://www.standards.org.au/',
                    'AS4087': 'https://www.standards.org.au/standards-catalogue/sa-snz/manufacturing/me-001/as--4087-2011',
                    'API 607': 'https://www.api.org/',
                    'IACS': 'https://www.iacs.org.uk/',
                    'EN ': 'https://www.cen.eu/',
                  };
                  
                  let linkedCert = cert;
                  let hasLink = false;
                  let linkUrl = '';
                  
                  for (const [keyword, url] of Object.entries(certificationLinks)) {
                    if (cert.includes(keyword)) {
                      hasLink = true;
                      linkUrl = url;
                      break;
                    }
                  }
                  
                  const separator = idx < arr.length - 1 ? '. ' : '';
                  
                  if (hasLink) {
                    return (
                      <span key={idx}>
                        <a 
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {cert}
                        </a>
                        {separator}
                      </span>
                    );
                  }
                  
                  return <span key={idx}>{cert}{separator}</span>;
                })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Product Information */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-product-info">
                <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
                <TabsTrigger value="specifications" data-testid="tab-specifications">Specifications</TabsTrigger>
                {product.video && <TabsTrigger value="video" data-testid="tab-video">Video</TabsTrigger>}
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
                      src={product.video.replace('watch?v=', 'embed/')}
                      title="Product Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Watch this video demonstration showing the {product.name} installation and features.
                  </p>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More From This Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover-elevate transition-all">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
                      {relatedProduct.images[0]?.url && !imageErrors[relatedProduct.images[0].url] ? (
                        <img 
                          src={relatedProduct.images[0].url} 
                          alt={relatedProduct.images[0].alt}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={() => setImageErrors(prev => ({ ...prev, [relatedProduct.images[0].url]: true }))}
                        />
                      ) : (
                        <Package className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{relatedProduct.shortName || relatedProduct.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Size From: {relatedProduct.sizeFrom}</div>
                      <div>Body: {relatedProduct.materials.body}</div>
                      <div>Pressure: {relatedProduct.pressureRange}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => window.location.href = `/products/${relatedProduct.slug}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
