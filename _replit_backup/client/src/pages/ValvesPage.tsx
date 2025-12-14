import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { products, getProductsByCategory } from "@shared/data/catalog";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import type { QuoteItem } from "@shared/schema";

interface ValvesPageProps {
  onAddToQuote: (item: QuoteItem) => void;
}

export default function ValvesPage({ onAddToQuote }: ValvesPageProps) {
  const { toast } = useToast();

  const valveProducts = getProductsByCategory("valves");

  const subcategories = [
    { name: "Duckbill Check Valves", url: "/valves/check-valves/duckbill" },
    { name: "Ball Check Valves", url: "/valves/check-valves/ball" },
    { name: "Swing Check Valves", url: "/valves/check-valves/swing" },
    { name: "Gate Valves", url: "/valves/gate-valves" },
    { name: "Ball Valves", url: "/valves/ball-valves" },
    { name: "Air Release / Non-Return", url: "/valves/air-release" },
  ];

  const handleAddToQuote = (item: QuoteItem) => {
    onAddToQuote(item);
    toast({
      title: "Added to Quote",
      description: `${item.name} has been added to your quote request.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <VolumeDiscountsBar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Valves</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Industrial valves including check valves, gate valves, and ball valves for precise flow control. 
            Engineered for reliable performance in demanding applications.
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
          {valveProducts.map((product) => (
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
