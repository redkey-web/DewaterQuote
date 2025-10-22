import { useState } from "react";
import ProductCard, { type Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import productImage1 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";
import productImage2 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";
import productImage3 from "@assets/generated_images/Rubber_expansion_joint_product_f7dd5a35.png";

interface ProductListPageProps {
  onAddToQuote: (product: Product) => void;
}

export default function ProductListPage({ onAddToQuote }: ProductListPageProps) {
  const { toast } = useToast();

  //todo: remove mock functionality - replace with real product data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Duckbill Check Valve DN100",
      sku: "DBV-100-STD",
      price: 245.00,
      image: productImage1,
      category: "Check Valves",
      brand: "Straub",
    },
    {
      id: "2",
      name: "Duckbill Check Valve DN150",
      sku: "DBV-150-STD",
      price: 385.00,
      image: productImage1,
      category: "Check Valves",
      brand: "Straub",
    },
    {
      id: "3",
      name: "Stainless Steel Coupling DN100",
      sku: "SSC-100-HD",
      price: 195.00,
      image: productImage2,
      category: "Pipe Couplings",
      brand: "Orbit",
    },
    {
      id: "4",
      name: "Stainless Steel Coupling DN150",
      sku: "SSC-150-HD",
      image: productImage2,
      category: "Pipe Couplings",
      brand: "Orbit",
    },
    {
      id: "5",
      name: "Rubber Expansion Joint DN100",
      sku: "REJ-100-STD",
      price: 425.00,
      image: productImage3,
      category: "Expansion Joints",
      brand: "Teekay",
    },
    {
      id: "6",
      name: "Rubber Expansion Joint DN200",
      sku: "REJ-200-HD",
      image: productImage3,
      category: "Expansion Joints",
      brand: "Teekay",
    },
    {
      id: "7",
      name: "Ball Check Valve DN80",
      sku: "BCV-80-STD",
      price: 165.00,
      image: productImage1,
      category: "Check Valves",
      brand: "Straub",
    },
    {
      id: "8",
      name: "Pipe Repair Clamp DN100",
      sku: "PRC-100-STD",
      price: 285.00,
      image: productImage2,
      category: "Repair Clamps",
      brand: "Orbit",
    },
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
          <h1 className="text-4xl font-bold mb-4">Check Valves - Duckbill</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Duckbill check valves provide reliable one-way flow control in wastewater, stormwater, and industrial applications. 
            Their unique elastomer design ensures positive sealing with minimal headloss.
          </p>
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

        <div className="mt-12 p-8 bg-card border border-card-border rounded-md">
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Wastewater treatment outfalls</li>
            <li>• Stormwater drainage systems</li>
            <li>• Tidal and flood protection</li>
            <li>• Industrial process piping</li>
            <li>• Pump discharge lines</li>
          </ul>
          <div className="mt-6">
            <Button variant="outline" data-testid="button-download-datasheet">
              Download Technical Datasheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
