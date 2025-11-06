import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import { Link } from "wouter";
import type { Product as CatalogProduct } from "@shared/schema";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price?: number;
  image: string;
  category: string;
  brand: string;
}

interface ProductCardProps {
  product: CatalogProduct;
  onAddToQuote?: (product: CatalogProduct) => void;
}

export default function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const mainImage = product.images?.[0]?.url;

  useEffect(() => {
    setImageError(false);
  }, [mainImage]);

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="cursor-pointer" data-testid={`link-product-${product.id}`}>
          <CardContent className="p-6">
            <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid={`img-product-${product.id}`}
                />
              ) : (
                <Package className="w-16 h-16 text-muted-foreground/30" data-testid={`icon-placeholder-${product.id}`} />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-2 break-words min-w-0 flex-1" data-testid={`text-product-name-${product.id}`}>
                  {product.shortName || product.name}
                </h3>
                <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0" data-testid={`badge-brand-${product.id}`}>
                  {product.brand}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono" data-testid={`text-sku-${product.id}`}>
                SKU: {product.sku}
              </p>
              <p className="text-sm text-chart-3 font-medium" data-testid={`text-price-on-request-${product.id}`}>
                Price on request
              </p>
            </div>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            onAddToQuote?.(product);
          }}
          data-testid={`button-add-to-quote-${product.id}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Quote
        </Button>
      </CardFooter>
    </Card>
  );
}
