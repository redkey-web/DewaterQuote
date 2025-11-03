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

  // Subcategory-specific product data
  const subcategoryProducts: Record<string, Product[]> = {
    "pipe-couplings": [
      { id: "pc-1", name: "Stainless Steel Coupling DN100", sku: "SSC-100-HD", price: 195.00, image: productImage2, category: "Pipe Couplings", brand: "Orbit" },
      { id: "pc-2", name: "Stainless Steel Coupling DN150", sku: "SSC-150-HD", price: 245.00, image: productImage2, category: "Pipe Couplings", brand: "Orbit" },
      { id: "pc-3", name: "Ductile Iron Coupling DN100", sku: "DIC-100-STD", price: 175.00, image: productImage2, category: "Pipe Couplings", brand: "Straub" },
      { id: "pc-4", name: "Ductile Iron Coupling DN150", sku: "DIC-150-STD", image: productImage2, category: "Pipe Couplings", brand: "Straub" },
    ],
    "pipe-repair-clamps": [
      { id: "prc-1", name: "Pipe Repair Clamp DN100", sku: "PRC-100-STD", price: 285.00, image: productImage2, category: "Repair Clamps", brand: "Orbit" },
      { id: "prc-2", name: "Pipe Repair Clamp DN150", sku: "PRC-150-STD", price: 365.00, image: productImage2, category: "Repair Clamps", brand: "Orbit" },
      { id: "prc-3", name: "Heavy Duty Repair Clamp DN200", sku: "HDRC-200-HD", price: 485.00, image: productImage2, category: "Repair Clamps", brand: "Straub" },
      { id: "prc-4", name: "Emergency Repair Clamp DN80", sku: "ERC-80-STD", image: productImage2, category: "Repair Clamps", brand: "Orbit" },
    ],
    "muff-couplings": [
      { id: "mc-1", name: "Muff Coupling DN100", sku: "MC-100-STD", price: 165.00, image: productImage2, category: "Muff Couplings", brand: "Orbit" },
      { id: "mc-2", name: "Muff Coupling DN150", sku: "MC-150-STD", price: 215.00, image: productImage2, category: "Muff Couplings", brand: "Orbit" },
      { id: "mc-3", name: "Sleeve Coupling DN200", sku: "SC-200-HD", price: 295.00, image: productImage2, category: "Muff Couplings", brand: "Straub" },
      { id: "mc-4", name: "Sleeve Coupling DN80", sku: "SC-80-STD", image: productImage2, category: "Muff Couplings", brand: "Orbit" },
    ],
    "flange-adaptors": [
      { id: "fa-1", name: "Flange Adaptor DN100", sku: "FA-100-STD", price: 225.00, image: productImage2, category: "Flange Adaptors", brand: "Orbit" },
      { id: "fa-2", name: "Flange Adaptor DN150", sku: "FA-150-STD", price: 295.00, image: productImage2, category: "Flange Adaptors", brand: "Orbit" },
      { id: "fa-3", name: "Wide Range Flange Adaptor DN100", sku: "WRFA-100-HD", price: 315.00, image: productImage2, category: "Flange Adaptors", brand: "Straub" },
      { id: "fa-4", name: "Wide Range Flange Adaptor DN200", sku: "WRFA-200-HD", image: productImage2, category: "Flange Adaptors", brand: "Straub" },
    ],
    "duckbill": [
      { id: "db-1", name: "Duckbill Check Valve DN100", sku: "DBV-100-STD", price: 245.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "db-2", name: "Duckbill Check Valve DN150", sku: "DBV-150-STD", price: 385.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "db-3", name: "Duckbill Check Valve DN80", sku: "DBV-80-STD", price: 195.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "db-4", name: "Duckbill Check Valve DN200", sku: "DBV-200-STD", image: productImage1, category: "Check Valves", brand: "Straub" },
    ],
    "ball": [
      { id: "bcv-1", name: "Ball Check Valve DN80", sku: "BCV-80-STD", price: 165.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "bcv-2", name: "Ball Check Valve DN100", sku: "BCV-100-STD", price: 215.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "bcv-3", name: "Ball Check Valve DN150", sku: "BCV-150-STD", price: 295.00, image: productImage1, category: "Check Valves", brand: "Orbit" },
      { id: "bcv-4", name: "Ball Check Valve DN200", sku: "BCV-200-STD", image: productImage1, category: "Check Valves", brand: "Orbit" },
    ],
    "swing": [
      { id: "scv-1", name: "Swing Check Valve DN100", sku: "SCV-100-STD", price: 325.00, image: productImage1, category: "Check Valves", brand: "Orbit" },
      { id: "scv-2", name: "Swing Check Valve DN150", sku: "SCV-150-STD", price: 425.00, image: productImage1, category: "Check Valves", brand: "Orbit" },
      { id: "scv-3", name: "Swing Check Valve DN200", sku: "SCV-200-HD", price: 565.00, image: productImage1, category: "Check Valves", brand: "Straub" },
      { id: "scv-4", name: "Swing Check Valve DN80", sku: "SCV-80-STD", image: productImage1, category: "Check Valves", brand: "Orbit" },
    ],
    "gate-valves": [
      { id: "gv-1", name: "Gate Valve DN100", sku: "GV-100-STD", price: 385.00, image: productImage1, category: "Gate Valves", brand: "Orbit" },
      { id: "gv-2", name: "Gate Valve DN150", sku: "GV-150-STD", price: 485.00, image: productImage1, category: "Gate Valves", brand: "Orbit" },
      { id: "gv-3", name: "Gate Valve DN200", sku: "GV-200-HD", price: 625.00, image: productImage1, category: "Gate Valves", brand: "Straub" },
      { id: "gv-4", name: "Gate Valve DN80", sku: "GV-80-STD", image: productImage1, category: "Gate Valves", brand: "Orbit" },
    ],
    "ball-valves": [
      { id: "bv-1", name: "Ball Valve DN80", sku: "BV-80-STD", price: 285.00, image: productImage1, category: "Ball Valves", brand: "Straub" },
      { id: "bv-2", name: "Ball Valve DN100", sku: "BV-100-STD", price: 345.00, image: productImage1, category: "Ball Valves", brand: "Straub" },
      { id: "bv-3", name: "Ball Valve DN150", sku: "BV-150-STD", price: 445.00, image: productImage1, category: "Ball Valves", brand: "Orbit" },
      { id: "bv-4", name: "Ball Valve DN200", sku: "BV-200-HD", image: productImage1, category: "Ball Valves", brand: "Orbit" },
    ],
    "air-release": [
      { id: "ar-1", name: "Air Release Valve DN50", sku: "ARV-50-STD", price: 195.00, image: productImage1, category: "Air Release Valves", brand: "Orbit" },
      { id: "ar-2", name: "Air Release Valve DN80", sku: "ARV-80-STD", price: 265.00, image: productImage1, category: "Air Release Valves", brand: "Orbit" },
      { id: "ar-3", name: "Combined Air Release & Non-Return DN50", sku: "CARNR-50-STD", price: 285.00, image: productImage1, category: "Air Release Valves", brand: "Straub" },
      { id: "ar-4", name: "Combined Air Release & Non-Return DN80", sku: "CARNR-80-STD", image: productImage1, category: "Air Release Valves", brand: "Straub" },
    ],
    "rubber": [
      { id: "rej-1", name: "Rubber Expansion Joint DN100", sku: "REJ-100-STD", price: 425.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "rej-2", name: "Rubber Expansion Joint DN150", sku: "REJ-150-STD", price: 525.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "rej-3", name: "Rubber Expansion Joint DN200", sku: "REJ-200-HD", price: 685.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "rej-4", name: "Rubber Expansion Joint DN80", sku: "REJ-80-STD", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "ptfe": [
      { id: "pej-1", name: "PTFE Expansion Joint DN80", sku: "PEJ-80-STD", price: 685.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "pej-2", name: "PTFE Expansion Joint DN100", sku: "PEJ-100-STD", price: 825.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "pej-3", name: "PTFE Expansion Joint DN150", sku: "PEJ-150-HD", price: 1125.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "pej-4", name: "PTFE Expansion Joint DN50", sku: "PEJ-50-STD", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "stainless-fabric": [
      { id: "sfj-1", name: "Stainless Steel Expansion Joint DN100", sku: "SSEJ-100-STD", price: 925.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "sfj-2", name: "Stainless Steel Expansion Joint DN150", sku: "SSEJ-150-STD", price: 1225.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "sfj-3", name: "Fabric Expansion Joint DN200", sku: "FEJ-200-HD", price: 1485.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "sfj-4", name: "Fabric Expansion Joint DN300", sku: "FEJ-300-HD", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "y-strainers": [
      { id: "ys-1", name: "Y Strainer DN80", sku: "YS-80-STD", price: 245.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "ys-2", name: "Y Strainer DN100", sku: "YS-100-STD", price: 295.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "ys-3", name: "Y Strainer DN150", sku: "YS-150-STD", price: 385.00, image: productImage1, category: "Strainers", brand: "Straub" },
      { id: "ys-4", name: "Y Strainer DN200", sku: "YS-200-HD", image: productImage1, category: "Strainers", brand: "Straub" },
    ],
    "basket": [
      { id: "bs-1", name: "Basket Strainer DN100", sku: "BS-100-STD", price: 485.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "bs-2", name: "Basket Strainer DN150", sku: "BS-150-STD", price: 625.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "bs-3", name: "Basket Strainer DN200", sku: "BS-200-HD", price: 825.00, image: productImage1, category: "Strainers", brand: "Straub" },
      { id: "bs-4", name: "Basket Strainer DN80", sku: "BS-80-STD", image: productImage1, category: "Strainers", brand: "Orbit" },
    ],
    "t-strainers": [
      { id: "ts-1", name: "T Strainer DN100", sku: "TS-100-STD", price: 365.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "ts-2", name: "T Strainer DN150", sku: "TS-150-STD", price: 465.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "ts-3", name: "T Strainer DN200", sku: "TS-200-HD", price: 595.00, image: productImage1, category: "Strainers", brand: "Straub" },
      { id: "ts-4", name: "T Strainer DN80", sku: "TS-80-STD", image: productImage1, category: "Strainers", brand: "Orbit" },
    ],
    "duplex": [
      { id: "ds-1", name: "Duplex Strainer DN100", sku: "DS-100-STD", price: 1285.00, image: productImage1, category: "Strainers", brand: "Straub" },
      { id: "ds-2", name: "Duplex Strainer DN150", sku: "DS-150-STD", price: 1685.00, image: productImage1, category: "Strainers", brand: "Straub" },
      { id: "ds-3", name: "Duplex Strainer DN200", sku: "DS-200-HD", price: 2185.00, image: productImage1, category: "Strainers", brand: "Orbit" },
      { id: "ds-4", name: "Duplex Strainer DN80", sku: "DS-80-STD", image: productImage1, category: "Strainers", brand: "Straub" },
    ],
  };

  const mockProducts = subcategoryProducts[subcategoryKey] || subcategoryProducts["duckbill"];

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
