import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

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
  product: Product;
  onAddToQuote?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  return (
    <Card className="hover-elevate transition-all" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-6">
        <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-brand-${product.id}`}>
              {product.brand}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono" data-testid={`text-sku-${product.id}`}>
            SKU: {product.sku}
          </p>
          {product.price ? (
            <p className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-chart-3 font-medium" data-testid={`text-price-on-request-${product.id}`}>
              Price on request
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToQuote?.(product)}
          data-testid={`button-add-to-quote-${product.id}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Quote
        </Button>
      </CardFooter>
    </Card>
  );
}
