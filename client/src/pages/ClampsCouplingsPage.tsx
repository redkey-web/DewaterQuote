import ProductCard, { type Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import productImage from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";

interface ClampsCouplingsPageProps {
  onAddToQuote: (product: Product) => void;
}

export default function ClampsCouplingsPage({ onAddToQuote }: ClampsCouplingsPageProps) {
  const { toast } = useToast();

  const mockProducts: Product[] = [
    {
      id: "cc-1",
      name: "Straub Pipe Coupling DN100",
      sku: "SPC-100-STD",
      price: 195.00,
      image: productImage,
      category: "Pipe Couplings",
      brand: "Straub",
    },
    {
      id: "cc-2",
      name: "Straub Pipe Coupling DN150",
      sku: "SPC-150-STD",
      price: 245.00,
      image: productImage,
      category: "Pipe Couplings",
      brand: "Straub",
    },
    {
      id: "cc-3",
      name: "Pipe Repair Clamp DN100",
      sku: "PRC-100-STD",
      price: 285.00,
      image: productImage,
      category: "Repair Clamps",
      brand: "Orbit",
    },
    {
      id: "cc-4",
      name: "Pipe Repair Clamp DN150",
      sku: "PRC-150-STD",
      price: 345.00,
      image: productImage,
      category: "Repair Clamps",
      brand: "Orbit",
    },
    {
      id: "cc-5",
      name: "Flange Adaptor DN100",
      sku: "FA-100-STD",
      price: 225.00,
      image: productImage,
      category: "Flange Adaptors",
      brand: "Straub",
    },
    {
      id: "cc-6",
      name: "Muff Coupling DN100",
      sku: "MC-100-STD",
      image: productImage,
      category: "Muff Couplings",
      brand: "Orbit",
    },
  ];

  const subcategories = [
    { name: "Pipe Couplings", url: "/clamps-couplings/pipe-couplings" },
    { name: "Pipe Repair Clamps", url: "/clamps-couplings/pipe-repair-clamps" },
    { name: "Muff/Sleeve Couplings", url: "/clamps-couplings/muff-couplings" },
    { name: "Flange Adaptors", url: "/clamps-couplings/flange-adaptors" },
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
          {mockProducts.map((product) => (
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
