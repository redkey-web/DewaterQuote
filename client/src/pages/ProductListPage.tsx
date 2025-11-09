import { useState } from "react";
import { useRoute } from "wouter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { getProductsBySubcategory } from "@shared/data/catalog";
import type { QuoteItem } from "@shared/schema";

interface ProductListPageProps {
  onAddToQuote: (item: QuoteItem) => void;
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
  "butterfly-valves": {
    title: "Butterfly Valves",
    description: "High-performance butterfly valves for flow control and isolation. Available in wafer and lug designs with various seat materials including EPDM and PTFE.",
    applications: ["Water treatment", "HVAC systems", "Chemical processing", "Industrial processes", "Fire protection"]
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
  
  // Get route params - match the NEW URL structure from App.tsx
  const [, pipeCouplingParams] = useRoute("/pipe-couplings/:subcategory");
  const [, pipeRepairParams] = useRoute("/pipe-repair-clamps/:subcategory");
  const [, valvesParams] = useRoute("/valves/:subcategory");
  const [, checkValvesParams] = useRoute("/valves/check-valves/:type");
  const [, expansionParams] = useRoute("/rubber-expansion-joints/:subcategory");
  const [, strainersParams] = useRoute("/strainers/:subcategory");
  
  // Determine category and subcategory from route
  let categoryKey: string;
  let subcategoryKey: string;
  
  if (pipeCouplingParams) {
    categoryKey = "pipe-couplings";
    subcategoryKey = pipeCouplingParams.subcategory;
  } else if (pipeRepairParams) {
    categoryKey = "pipe-repair-clamps";
    subcategoryKey = pipeRepairParams.subcategory;
  } else if (valvesParams) {
    categoryKey = "valves";
    subcategoryKey = valvesParams.subcategory;
  } else if (checkValvesParams) {
    categoryKey = "valves";
    subcategoryKey = checkValvesParams.type;
  } else if (expansionParams) {
    categoryKey = "rubber-expansion-joints";
    subcategoryKey = expansionParams.subcategory;
  } else if (strainersParams) {
    categoryKey = "strainers";
    subcategoryKey = strainersParams.subcategory;
  } else {
    categoryKey = "valves";
    subcategoryKey = "duckbill";
  }
  
  const content = subcategoryContent[subcategoryKey] || subcategoryContent["duckbill"];

  // Map URL subcategory keys to catalog subcategory identifiers
  const catalogSubcategory =
    subcategoryKey === "butterfly-valves" ? "butterfly-valve" :
    subcategoryKey === "duckbill" ? "duckbill-check-valve" :
    subcategoryKey === "ball" ? "ball-check-valve" :
    subcategoryKey === "swing" ? "swing-check-valve" :
    subcategoryKey === "gate-valves" ? "gate-valve" :
    subcategoryKey === "ball-valves" ? "ball-valve" :
    subcategoryKey === "air-release" ? "air-release-valve" :
    subcategoryKey === "rubber" ? "single-sphere" :
    subcategoryKey === "ptfe" ? "ptfe-expansion" :
    subcategoryKey === "stainless-fabric" ? "stainless-fabric" :
    subcategoryKey === "y-strainers" ? "y-strainer" :
    subcategoryKey === "basket" ? "basket-strainer" :
    subcategoryKey === "t-strainers" ? "t-strainer" :
    subcategoryKey === "duplex" ? "duplex-strainer" :
    subcategoryKey === "pipe-couplings" ? "orbit-couplings" :
    subcategoryKey === "pipe-repair-clamps" ? "orbit-pipe-repair-clamps" :
    subcategoryKey === "muff-couplings" ? "muff-couplings" :
    subcategoryKey === "flange-adaptors" ? "flange-adaptors" :
    subcategoryKey;

  // Get products from catalog based on category and subcategory
  const subcategoryProducts = getProductsBySubcategory(categoryKey, catalogSubcategory);

  const handleAddToQuote = (item: QuoteItem) => {
    onAddToQuote(item);
    toast({
      title: "Added to Quote",
      description: `${item.name} has been added to your quote request.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={content.title}
        description={`${content.description} Available in multiple sizes and specifications. Request a quote for ${content.title.toLowerCase()} in Australia.`}
        keywords={`${content.title.toLowerCase()}, ${content.applications.join(', ')}, pipe fittings, valves, industrial equipment`}
        canonical={`https://dewaterproducts.com.au${window.location.pathname}`}
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subcategoryProducts.length > 0 ? (
            subcategoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToQuote={handleAddToQuote}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products available in this category yet. Please check back soon or contact us for enquiries.</p>
            </div>
          )}
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

        <div className="mt-12 p-8 bg-card border border-card-border rounded-md">
          <h2 className="text-2xl font-bold mb-4">Approvals / Certifications</h2>
          <p className="text-muted-foreground" data-testid="text-certifications">
            {subcategoryKey === "pipe-couplings" || subcategoryKey === "muff-couplings" || subcategoryKey === "flange-adaptors"
              ? "Orbit couplings are fitted with WRAS-approved EPDM rubber seals suitable for potable water applications. Products comply with relevant Australian Standards."
              : "Product certifications and compliance documentation available upon request. Contact our team for specific certification requirements."}
          </p>
        </div>
      </div>
    </div>
  );
}
