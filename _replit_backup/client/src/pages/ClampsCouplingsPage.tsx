import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@shared/data/catalog";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import type { QuoteItem } from "@shared/schema";

interface ClampsCouplingsPageProps {
  onAddToQuote: (item: QuoteItem) => void;
}

export default function ClampsCouplingsPage({ onAddToQuote }: ClampsCouplingsPageProps) {
  const { toast } = useToast();

  const couplingProducts = [
    ...getProductsByCategory("pipe-couplings"),
    ...getProductsByCategory("pipe-repair-clamps")
  ];

  const subcategories = [
    { name: "Pipe Couplings", url: "/pipe-couplings/pipe-couplings" },
    { name: "Pipe Repair Clamps", url: "/pipe-repair-clamps/pipe-repair-clamps" },
    { name: "Muff/Sleeve Couplings", url: "/pipe-couplings/muff-couplings" },
    { name: "Flange Adaptors", url: "/pipe-couplings/flange-adaptors" },
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
          <h1 className="text-4xl font-bold mb-4">Clamps & Couplings</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Professional pipe couplings, repair clamps, and flange adaptors for reliable pipe connections. 
            Our range includes solutions from leading brands Straub and Orbit.
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
          {couplingProducts.map((product) => (
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
