import ProductCard, { type Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import productImage from "@assets/generated_images/Rubber_expansion_joint_product_f7dd5a35.png";

interface ExpansionJointsPageProps {
  onAddToQuote: (product: Product) => void;
}

export default function ExpansionJointsPage({ onAddToQuote }: ExpansionJointsPageProps) {
  const { toast } = useToast();

  const mockProducts: Product[] = [
    {
      id: "ej-1",
      name: "Rubber Expansion Joint DN100",
      sku: "REJ-100-STD",
      price: 425.00,
      image: productImage,
      category: "Expansion Joints",
      brand: "Teekay",
    },
    {
      id: "ej-2",
      name: "Rubber Expansion Joint DN150",
      sku: "REJ-150-STD",
      price: 545.00,
      image: productImage,
      category: "Expansion Joints",
      brand: "Teekay",
    },
    {
      id: "ej-3",
      name: "PTFE Expansion Joint DN100",
      sku: "PTFE-100-STD",
      price: 685.00,
      image: productImage,
      category: "PTFE Joints",
      brand: "Teekay",
    },
    {
      id: "ej-4",
      name: "Stainless Steel Expansion Joint DN100",
      sku: "SSEJ-100-STD",
      image: productImage,
      category: "Stainless Joints",
      brand: "Orbit",
    },
    {
      id: "ej-5",
      name: "Fabric Expansion Joint DN150",
      sku: "FEJ-150-STD",
      image: productImage,
      category: "Fabric Joints",
      brand: "Teekay",
    },
  ];

  const subcategories = [
    { name: "Rubber Expansion Joints", url: "/expansion-joints/rubber" },
    { name: "PTFE Expansion Joints", url: "/expansion-joints/ptfe" },
    { name: "Stainless/Fabric Joints", url: "/expansion-joints/stainless-fabric" },
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
