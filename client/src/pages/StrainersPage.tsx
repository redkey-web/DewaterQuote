import ProductCard, { type Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import productImage from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";

interface StrainersPageProps {
  onAddToQuote: (product: Product) => void;
}

export default function StrainersPage({ onAddToQuote }: StrainersPageProps) {
  const { toast } = useToast();

  const mockProducts: Product[] = [
    {
      id: "s-1",
      name: "Y Strainer DN100",
      sku: "YS-100-STD",
      price: 285.00,
      image: productImage,
      category: "Y Strainers",
      brand: "Orbit",
    },
    {
      id: "s-2",
      name: "Y Strainer DN150",
      sku: "YS-150-STD",
      price: 385.00,
      image: productImage,
      category: "Y Strainers",
      brand: "Orbit",
    },
    {
      id: "s-3",
      name: "Basket Strainer DN100",
      sku: "BS-100-STD",
      price: 445.00,
      image: productImage,
      category: "Basket Strainers",
      brand: "Straub",
    },
    {
      id: "s-4",
      name: "T Strainer DN100",
      sku: "TS-100-STD",
      price: 325.00,
      image: productImage,
      category: "T Strainers",
      brand: "Orbit",
    },
    {
      id: "s-5",
      name: "Duplex Strainer DN100",
      sku: "DS-100-STD",
      image: productImage,
      category: "Duplex Strainers",
      brand: "Straub",
    },
  ];

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
