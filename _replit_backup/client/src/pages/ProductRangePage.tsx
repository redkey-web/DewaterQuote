import { Link } from "wouter";
import { products } from "@shared/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Package, Link as LinkIcon, Wrench, Hammer, Filter, Repeat } from "lucide-react";
import { SEO } from "@/components/SEO";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";

const categoryInfo = {
  "pipe-couplings": {
    title: "Pipe Couplings",
    description: "Flexible pipe couplings from Orbit and Straub for connecting and sealing pipes",
    Icon: LinkIcon
  },
  "valves": {
    title: "Valves",
    description: "Industrial valves including butterfly, check, and foot valves",
    Icon: Wrench
  },
  "pipe-repair-clamps": {
    title: "Pipe Repair Clamps",
    description: "Heavy-duty repair clamps for emergency and permanent pipe repairs",
    Icon: Hammer
  },
  "strainers": {
    title: "Strainers",
    description: "Y-strainers and filters for protecting equipment and pipelines",
    Icon: Filter
  },
  "rubber-expansion-joints": {
    title: "Rubber Expansion Joints",
    description: "Flexible expansion joints for absorbing movement and vibration",
    Icon: Repeat
  }
};

export default function ProductRangePage() {
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Sort categories by priority
  const categoryOrder = ["pipe-couplings", "valves", "pipe-repair-clamps", "rubber-expansion-joints", "strainers"];
  const sortedCategories = categoryOrder.filter(cat => productsByCategory[cat]);

  const formatPriceRange = (product: typeof products[0]) => {
    if (product.priceVaries && product.sizeOptions && product.sizeOptions.length > 0) {
      const prices = product.sizeOptions
        .map(opt => opt.price)
        .filter((p): p is number => typeof p === 'number' && p > 0);
      
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max 
          ? `$${min.toFixed(2)}` 
          : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
      }
    }
    return "Price on Application";
  };

  return (
    <div className="min-h-screen bg-background">
      <VolumeDiscountsBar />
      <SEO 
        title="Product Range - Industrial Pipe Fittings & Valves"
        description="Browse our complete range of industrial pipe couplings, valves, repair clamps, expansion joints and strainers. Orbit, Straub, and premium brands for Australian industry."
        keywords="pipe couplings, valves, repair clamps, expansion joints, strainers, industrial products, Orbit, Straub"
        canonical="https://dewaterproducts.com.au/products"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-product-range">
            Complete Product Range
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Browse our comprehensive selection of industrial pipe fittings, valves, and accessories. 
            All products available for immediate quotation with fast Australia-wide delivery.
          </p>
        </div>
      </section>

      {/* Products by Category */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {sortedCategories.map((categoryKey) => {
          const categoryProducts = productsByCategory[categoryKey];
          const info = categoryInfo[categoryKey as keyof typeof categoryInfo];
          
          if (!info || !categoryProducts || categoryProducts.length === 0) return null;

          return (
            <section key={categoryKey} className="mb-16" data-testid={`section-${categoryKey}`}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <info.Icon className="w-8 h-8 text-primary" />
                    {info.title}
                  </h2>
                  <p className="text-muted-foreground">{info.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                  </Badge>
                </div>
                <Link href={`/${categoryKey}`} data-testid={`link-view-all-${categoryKey}`}>
                  <Button variant="outline" data-testid={`button-view-all-${categoryKey}`}>
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="hover-elevate" data-testid={`card-product-${product.id}`}>
                    <CardHeader className="p-0">
                      <Link href={`/products/${product.slug}`} data-testid={`link-product-image-${product.id}`}>
                        <div className="aspect-square bg-muted rounded-t-md overflow-hidden flex items-center justify-center cursor-pointer">
                          {product.images && product.images[0]?.url ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                              loading="lazy"
                            />
                          ) : (
                            <Package className="w-24 h-24 text-muted-foreground" />
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {product.brand}
                      </Badge>
                      <Link href={`/products/${product.slug}`} data-testid={`link-product-title-${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="font-semibold text-lg text-primary">
                            {formatPriceRange(product)}
                          </p>
                          <p className="text-xs text-muted-foreground">excl. GST</p>
                        </div>
                        {product.sizeFrom && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Size from</p>
                            <p className="font-medium text-sm">{product.sizeFrom}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/products/${product.slug}`} className="w-full" data-testid={`link-product-details-${product.id}`}>
                        <Button 
                          variant="cyanGlow" 
                          className="w-full" 
                          data-testid={`button-view-${product.id}`}
                        >
                          View Details <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Section */}
      <section className="bg-muted/50 border-t py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our team can source specialist products and provide custom solutions for your industrial requirements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/request-quote" data-testid="link-request-quote">
              <Button size="lg" variant="cyanGlow" data-testid="button-request-quote">
                Request a Quote
              </Button>
            </Link>
            <Link href="/contact" data-testid="link-contact">
              <Button size="lg" variant="outline" data-testid="button-contact">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
