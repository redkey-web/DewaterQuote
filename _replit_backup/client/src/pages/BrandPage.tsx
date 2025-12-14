import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import type { Product, QuoteItem } from "@shared/schema";
import productImage1 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";
import productImage2 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";

interface BrandPageProps {
  brandName: string;
  description: string;
  onAddToQuote: (item: QuoteItem) => void;
}

export default function BrandPage({ brandName, description, onAddToQuote }: BrandPageProps) {
  const { toast } = useToast();

  // Mock products filtered by brand
  const mockProducts: Product[] = [
    {
      id: `${brandName.toLowerCase()}-1`,
      slug: `${brandName.toLowerCase()}-pipe-coupling-dn100`,
      name: `${brandName} Pipe Coupling DN100`,
      sku: `${brandName.substring(0, 2).toUpperCase()}-PC-100`,
      price: 195.00,
      images: [{ url: productImage1, alt: `${brandName} Pipe Coupling DN100` }],
      category: "pipe-couplings",
      brand: brandName,
      description: "",
      specifications: [],
      materials: { body: "" },
      pressureRange: "",
    },
    {
      id: `${brandName.toLowerCase()}-2`,
      slug: `${brandName.toLowerCase()}-check-valve-dn100`,
      name: `${brandName} Check Valve DN100`,
      sku: `${brandName.substring(0, 2).toUpperCase()}-CV-100`,
      price: 245.00,
      images: [{ url: productImage2, alt: `${brandName} Check Valve DN100` }],
      category: "valves",
      brand: brandName,
      description: "",
      specifications: [],
      materials: { body: "" },
      pressureRange: "",
    },
    {
      id: `${brandName.toLowerCase()}-3`,
      slug: `${brandName.toLowerCase()}-gate-valve-dn100`,
      name: `${brandName} Gate Valve DN100`,
      sku: `${brandName.substring(0, 2).toUpperCase()}-GV-100`,
      images: [{ url: productImage2, alt: `${brandName} Gate Valve DN100` }],
      category: "valves",
      brand: brandName,
      description: "",
      specifications: [],
      materials: { body: "" },
      pressureRange: "",
    },
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
      <SEO 
        title={`${brandName} Products`}
        description={`${description} Browse ${brandName} pipe couplings, valves, and industrial fittings from Dewater Products Australia. Request a quote today.`}
        keywords={`${brandName}, ${brandName} products, pipe couplings, valves, industrial fittings, Australia`}
        canonical={`https://dewaterproducts.com.au${window.location.pathname}`}
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{brandName}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {description}
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Featured {brandName} Products</h2>
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
