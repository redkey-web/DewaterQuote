import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@shared/data/catalog";
import type { Product } from "@shared/schema";

interface StrainersPageProps {
  onAddToQuote: (product: Product) => void;
}

export default function StrainersPage({ onAddToQuote }: StrainersPageProps) {
  const { toast } = useToast();

  const strainerProducts = getProductsByCategory("strainers");

  const subcategories = [
    { name: "Y Strainers", url: "/strainers/y-strainers" },
    { name: "Basket Strainers", url: "/strainers/basket" },
    { name: "T Strainers", url: "/strainers/t-strainers" },
    { name: "Duplex Strainers", url: "/strainers/duplex" },
  ];

  const handleAddToQuote = (product: Product) => {
    onAddToQuote(product);
    toast({
      title: "Added to Quote",
      description: `${product.name} has been added to your quote request.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Strainers & Filters</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Industrial strainers and filters to protect equipment and maintain system efficiency. 
            Y strainers, basket strainers, T strainers, and duplex configurations available.
          </p>
        </div>

        {/* Subcategory Links */}
        <div className="mb-8 flex flex-wrap gap-3">
          {subcategories.map((subcat, index) => (
            <Link key={subcat.name} href={subcat.url}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover-elevate active-elevate-2 transition-all cursor-pointer" data-testid={`link-subcategory-${index}`}>
                <span className="font-medium">{subcat.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {strainerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToQuote={handleAddToQuote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
