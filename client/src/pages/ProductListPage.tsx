import { useState } from "react";
import { useRoute } from "wouter";
import ProductCard, { type Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import productImage1 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";
import productImage2 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";
import productImage3 from "@assets/generated_images/Rubber_expansion_joint_product_f7dd5a35.png";

interface ProductListPageProps {
  onAddToQuote: (product: Product) => void;
}

// Subcategory content configuration
const subcategoryContent: Record<string, { title: string; description: string; applications: string[] }> = {
  "pipe-couplings": {
    title: "Pipe Couplings",
    description: "High-quality pipe couplings for secure pipe connections. Available in various materials and sizes to suit diverse applications.",
    applications: ["Water distribution", "Industrial process piping", "HVAC systems", "Fire protection", "Mining applications"]
  },
  "pipe-repair-clamps": {
    title: "Pipe Repair Clamps",
    description: "Emergency and permanent pipe repair solutions. Quick installation repair clamps for leaking or damaged pipes.",
    applications: ["Emergency leak repair", "Permanent pipe rehabilitation", "Water main repairs", "Industrial pipe maintenance"]
  },
  "muff-couplings": {
    title: "Muff/Sleeve Couplings",
    description: "Sleeve-type couplings for joining plain-end pipes. Reliable connection solutions for various pipe materials.",
    applications: ["Water supply lines", "Sewer systems", "Industrial piping", "Municipal infrastructure"]
  },
  "flange-adaptors": {
    title: "Flange Adaptors",
    description: "Adapt between different pipe connection types. Versatile flange adaptors for mixed piping systems.",
    applications: ["Pipe-to-flange transitions", "Mixed material connections", "Retrofit applications", "System upgrades"]
  },
  "duckbill": {
    title: "Duckbill Check Valves",
    description: "Duckbill check valves provide reliable one-way flow control in wastewater, stormwater, and industrial applications. Their unique elastomer design ensures positive sealing with minimal headloss.",
    applications: ["Wastewater treatment outfalls", "Stormwater drainage systems", "Tidal and flood protection", "Industrial process piping", "Pump discharge lines"]
  },
  "ball": {
    title: "Ball Check Valves",
    description: "Ball check valves offering reliable backflow prevention. Precision-engineered for optimal performance and durability.",
    applications: ["Pump systems", "Water treatment", "Industrial processes", "HVAC applications"]
  },
  "swing": {
    title: "Swing Check Valves",
    description: "Swing check valves for low-resistance backflow prevention. Ideal for large diameter applications.",
    applications: ["Main water lines", "Industrial pipelines", "Fire protection systems", "Pump discharge"]
  },
  "gate-valves": {
    title: "Gate Valves",
    description: "Heavy-duty gate valves for on/off flow control. Reliable shut-off in critical applications.",
    applications: ["Water distribution", "Oil and gas", "Industrial processes", "Municipal systems"]
  },
  "ball-valves": {
    title: "Ball Valves",
    description: "Quarter-turn ball valves for quick shut-off. Versatile flow control in numerous applications.",
    applications: ["Process control", "Water systems", "HVAC", "Chemical processing"]
  },
  "air-release": {
    title: "Air Release / Non-Return Valves",
    description: "Combined air release and non-return functionality. Prevent air locks and backflow in piping systems.",
    applications: ["Water distribution", "Pump systems", "Irrigation", "Process piping"]
  },
  "rubber": {
    title: "Rubber Expansion Joints",
    description: "Flexible rubber expansion joints for thermal expansion compensation. Absorbs vibration and reduces noise.",
    applications: ["HVAC systems", "Pump connections", "Cooling towers", "Industrial piping"]
  },
  "ptfe": {
    title: "PTFE Expansion Joints",
    description: "Chemical-resistant PTFE expansion joints. Ideal for corrosive and high-temperature applications.",
    applications: ["Chemical processing", "Pharmaceutical", "Food and beverage", "Corrosive environments"]
  },
  "stainless-fabric": {
    title: "Stainless Steel & Fabric Joints",
    description: "High-temperature expansion joints with stainless steel or fabric construction.",
    applications: ["Exhaust systems", "High-temperature processes", "Industrial furnaces", "Power generation"]
  },
  "y-strainers": {
    title: "Y Strainers",
    description: "Y-pattern strainers for efficient debris removal. Compact design suitable for horizontal and vertical lines.",
    applications: ["Steam systems", "Liquid filtration", "Gas filtration", "Process protection"]
  },
  "basket": {
    title: "Basket Strainers",
    description: "Large capacity basket strainers for heavy debris loads. Easy maintenance and high flow capacity.",
    applications: ["Water intake", "Cooling systems", "Process water", "Industrial filtration"]
  },
  "t-strainers": {
    title: "T Strainers",
    description: "T-pattern strainers for straight-through flow. Minimal pressure drop and easy maintenance.",
    applications: ["Process lines", "Water treatment", "Industrial systems", "HVAC"]
  },
  "duplex": {
    title: "Duplex Strainers",
    description: "Duplex strainers allowing continuous operation during maintenance. Switch between baskets without shutting down.",
    applications: ["Critical processes", "Continuous operations", "Chemical plants", "Refineries"]
  }
};

export default function ProductListPage({ onAddToQuote }: ProductListPageProps) {
  const { toast } = useToast();
  
  // Get route params
  const [, params] = useRoute("/clamps-couplings/:subcategory");
  const [, params2] = useRoute("/valves/:subcategory");
  const [, params3] = useRoute("/valves/check-valves/:type");
  const [, params4] = useRoute("/expansion-joints/:subcategory");
  const [, params5] = useRoute("/strainers/:subcategory");
  
  const subcategoryKey = params?.subcategory || params2?.subcategory || params3?.type || params4?.subcategory || params5?.subcategory || "duckbill";
  const content = subcategoryContent[subcategoryKey] || subcategoryContent["duckbill"];

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
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {content.description}
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
            {content.applications.map((app, index) => (
              <li key={index} data-testid={`application-${index}`}>• {app}</li>
            ))}
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
