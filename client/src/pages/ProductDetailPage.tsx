import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ShoppingCart, Package, Clock, FileText, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { getProductBySlug, getProductsBySubcategory } from "@shared/data/catalog";
import type { Product } from "@shared/schema";

interface ProductDetailPageProps {
  onAddToQuote: (product: any) => void;
}

export default function ProductDetailPage({ onAddToQuote }: ProductDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
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
    onAddToQuote({
      id: product.id,
      name: product.name,
      sku: product.sku,
      image: product.images[0]?.url || "/placeholder.jpg",
      sizeFrom: product.sizeFrom,
      pressureRange: product.pressureRange,
      materials: `${product.materials.body}/${product.materials.seat || product.materials.sleeve || ''}`,
    });

    toast({
      title: "Added to Quote",
      description: `${product.name} has been added to your quote request.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
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
            <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
              {product.images[0]?.url ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.images[0].alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <Package className="w-32 h-32 text-muted-foreground" />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
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
                  </div>
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
                  <span className="text-sm text-muted-foreground">Size From:</span>
                  <p className="font-medium">{product.sizeFrom}</p>
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

            {/* Size and Pricing Options */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="mb-6">
                {product.priceVaries ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Sizes & Pricing</h3>
                    {product.priceNote && (
                      <p className="text-sm text-muted-foreground mb-4">{product.priceNote}</p>
                    )}
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-semibold">Size</th>
                            {product.sizeOptions?.some(s => s.sku) && (
                              <th className="text-left p-3 font-semibold">SKU</th>
                            )}
                            <th className="text-right p-3 font-semibold">Price (ex GST)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizeOptions?.map((size, idx) => (
                            <tr key={size.value} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                              <td className="p-3">{size.label}</td>
                              {product.sizeOptions?.some(s => s.sku) && (
                                <td className="p-3 text-sm text-muted-foreground">{size.sku || '-'}</td>
                              )}
                              <td className="p-3 text-right font-medium">
                                {size.price ? `$${size.price.toFixed(2)}` : 'POA'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Prices shown exclude GST. Add your required sizes to quote for final pricing.</p>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Size - please check product sizing before ordering
                    </label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger data-testid="select-size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizeOptions.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <Button 
                size="lg" 
                onClick={handleAddToQuote}
                className="flex-1"
                data-testid="button-add-to-quote"
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Add to Quote
              </Button>
              {product.downloads && product.downloads.length > 0 && (
                <Button size="lg" variant="outline" data-testid="button-download">
                  <Download className="mr-2 w-5 h-5" />
                  Downloads
                </Button>
              )}
            </div>

            {/* SKU and Lead Time under button */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
          </div>
        </div>

        {/* Description and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground mb-6" data-testid="text-description">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Specifications */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                <div className="space-y-3">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="border-b border-border pb-2 last:border-0">
                      <div className="text-sm text-muted-foreground">{spec.label}</div>
                      <div className="font-medium">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
