import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@shared/data/catalog";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import type { QuoteItem } from "@shared/schema";

interface ExpansionJointsPageProps {
  onAddToQuote: (item: QuoteItem) => void;
}

export default function ExpansionJointsPage({ onAddToQuote }: ExpansionJointsPageProps) {
  const { toast } = useToast();

  const expansionProducts = getProductsByCategory("rubber-expansion-joints");

  const subcategories = [
    { name: "Rubber Expansion Joints", url: "/rubber-expansion-joints/rubber" },
    { name: "PTFE Expansion Joints", url: "/rubber-expansion-joints/ptfe" },
    { name: "Stainless/Fabric Joints", url: "/rubber-expansion-joints/stainless-fabric" },
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
          <h1 className="text-4xl font-bold mb-4">Expansion Joints</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Flexible pipe connections for thermal expansion, vibration absorption, and misalignment compensation. 
            Available in rubber, PTFE, stainless steel, and fabric materials.
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
          {expansionProducts.map((product) => (
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
