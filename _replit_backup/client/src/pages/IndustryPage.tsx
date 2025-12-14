import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import type { Product, QuoteItem } from "@shared/schema";
import productImage1 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";
import productImage2 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";
import productImage3 from "@assets/generated_images/Rubber_expansion_joint_product_f7dd5a35.png";

interface IndustryPageProps {
  industryName: string;
  description: string;
  applications: string[];
  onAddToQuote: (item: QuoteItem) => void;
}

export default function IndustryPage({ industryName, description, applications, onAddToQuote }: IndustryPageProps) {
  const { toast } = useToast();

  // Industry-specific product variations
  const industryProductData: Record<string, Product[]> = {
    "Water & Wastewater": [
      { id: "ww-1", slug: "ww-check-valve-dn100", name: "Wastewater Check Valve DN100", sku: "WW-CV-100", price: 285.00, images: [{ url: productImage2, alt: "Wastewater Check Valve DN100" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "ww-2", slug: "ww-coupling-dn150", name: "Water Main Coupling DN150", sku: "WM-PC-150", price: 325.00, images: [{ url: productImage1, alt: "Water Main Coupling DN150" }], category: "pipe-couplings", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "ww-3", slug: "ww-strainer-dn100", name: "Treatment Plant Strainer DN100", sku: "TP-YS-100", price: 265.00, images: [{ url: productImage1, alt: "Treatment Plant Strainer DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "ww-4", slug: "ww-expansion-joint-dn100", name: "Pump Station Expansion Joint DN100", sku: "PS-REJ-100", images: [{ url: productImage3, alt: "Pump Station Expansion Joint DN100" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Irrigation": [
      { id: "irr-1", slug: "irr-ball-valve-dn100", name: "Agricultural Ball Valve DN100", sku: "AG-BV-100", price: 295.00, images: [{ url: productImage2, alt: "Agricultural Ball Valve DN100" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "irr-2", slug: "irr-coupling-dn80", name: "Drip System Coupling DN80", sku: "DS-PC-80", price: 185.00, images: [{ url: productImage1, alt: "Drip System Coupling DN80" }], category: "pipe-couplings", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "irr-3", slug: "irr-filter-dn100", name: "Irrigation Filter DN100", sku: "IR-YS-100", price: 245.00, images: [{ url: productImage1, alt: "Irrigation Filter DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "irr-4", slug: "irr-check-valve-dn100", name: "Field Check Valve DN100", sku: "FC-CV-100", images: [{ url: productImage2, alt: "Field Check Valve DN100" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Fire Services": [
      { id: "fs-1", slug: "fs-check-valve-dn100", name: "Fire Sprinkler Check Valve DN100", sku: "FS-CV-100", price: 385.00, images: [{ url: productImage2, alt: "Fire Sprinkler Check Valve DN100" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fs-2", slug: "fs-gate-valve-dn150", name: "Fire Main Gate Valve DN150", sku: "FM-GV-150", price: 485.00, images: [{ url: productImage2, alt: "Fire Main Gate Valve DN150" }], category: "valves", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fs-3", slug: "fs-coupling-dn100", name: "Hydrant Coupling DN100", sku: "HD-PC-100", price: 295.00, images: [{ url: productImage1, alt: "Hydrant Coupling DN100" }], category: "pipe-couplings", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fs-4", slug: "fs-strainer-dn100", name: "Fire Protection Strainer DN100", sku: "FP-BS-100", images: [{ url: productImage1, alt: "Fire Protection Strainer DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Mining": [
      { id: "min-1", slug: "min-slurry-valve-dn150", name: "Heavy Duty Slurry Valve DN150", sku: "HD-GV-150", price: 685.00, images: [{ url: productImage2, alt: "Heavy Duty Slurry Valve DN150" }], category: "valves", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "min-2", slug: "min-coupling-dn150", name: "Abrasion Resistant Coupling DN150", sku: "AR-PC-150", price: 445.00, images: [{ url: productImage1, alt: "Abrasion Resistant Coupling DN150" }], category: "pipe-couplings", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "min-3", slug: "min-strainer-dn150", name: "Mine Dewatering Strainer DN150", sku: "MD-BS-150", price: 585.00, images: [{ url: productImage1, alt: "Mine Dewatering Strainer DN150" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "min-4", slug: "min-expansion-joint-dn150", name: "Tailings Expansion Joint DN150", sku: "TL-REJ-150", images: [{ url: productImage3, alt: "Tailings Expansion Joint DN150" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Marine": [
      { id: "mar-1", slug: "mar-coupling-dn100", name: "Stainless Marine Coupling DN100", sku: "SM-PC-100", price: 425.00, images: [{ url: productImage1, alt: "Stainless Marine Coupling DN100" }], category: "pipe-couplings", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "mar-2", slug: "mar-valve-dn100", name: "Corrosion Resistant Valve DN100", sku: "CR-BV-100", price: 385.00, images: [{ url: productImage2, alt: "Corrosion Resistant Valve DN100" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "mar-3", slug: "mar-strainer-dn100", name: "Saltwater Strainer DN100", sku: "SW-BS-100", price: 465.00, images: [{ url: productImage1, alt: "Saltwater Strainer DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "mar-4", slug: "mar-expansion-joint-dn100", name: "Shipboard Expansion Joint DN100", sku: "SB-REJ-100", images: [{ url: productImage3, alt: "Shipboard Expansion Joint DN100" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "HVAC": [
      { id: "hvac-1", slug: "hvac-expansion-joint-dn100", name: "Chiller Expansion Joint DN100", sku: "CH-REJ-100", price: 385.00, images: [{ url: productImage3, alt: "Chiller Expansion Joint DN100" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "hvac-2", slug: "hvac-ball-valve-dn80", name: "HVAC Ball Valve DN80", sku: "HV-BV-80", price: 295.00, images: [{ url: productImage2, alt: "HVAC Ball Valve DN80" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "hvac-3", slug: "hvac-strainer-dn100", name: "Air Handler Strainer DN100", sku: "AH-YS-100", price: 265.00, images: [{ url: productImage1, alt: "Air Handler Strainer DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "hvac-4", slug: "hvac-coupling-dn100", name: "Cooling Tower Coupling DN100", sku: "CT-PC-100", images: [{ url: productImage1, alt: "Cooling Tower Coupling DN100" }], category: "pipe-couplings", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Food & Beverage": [
      { id: "fb-1", slug: "fb-check-valve-dn80", name: "Sanitary Check Valve DN80", sku: "SAN-CV-80", price: 385.00, images: [{ url: productImage2, alt: "Sanitary Check Valve DN80" }], category: "valves", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fb-2", slug: "fb-coupling-dn100", name: "Food Grade Coupling DN100", sku: "FG-PC-100", price: 345.00, images: [{ url: productImage1, alt: "Food Grade Coupling DN100" }], category: "pipe-couplings", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fb-3", slug: "fb-strainer-dn80", name: "Hygienic Strainer DN80", sku: "HY-YS-80", price: 325.00, images: [{ url: productImage1, alt: "Hygienic Strainer DN80" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "fb-4", slug: "fb-expansion-joint-dn100", name: "CIP System Expansion Joint DN100", sku: "CIP-REJ-100", images: [{ url: productImage3, alt: "CIP System Expansion Joint DN100" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
    "Construction": [
      { id: "con-1", slug: "con-coupling-dn100", name: "Building Services Coupling DN100", sku: "BS-PC-100", price: 285.00, images: [{ url: productImage1, alt: "Building Services Coupling DN100" }], category: "pipe-couplings", brand: "Straub", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "con-2", slug: "con-gate-valve-dn80", name: "Commercial Gate Valve DN80", sku: "CM-GV-80", price: 325.00, images: [{ url: productImage2, alt: "Commercial Gate Valve DN80" }], category: "valves", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "con-3", slug: "con-strainer-dn100", name: "Plumbing Y Strainer DN100", sku: "PL-YS-100", price: 245.00, images: [{ url: productImage1, alt: "Plumbing Y Strainer DN100" }], category: "strainers", brand: "Orbit", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
      { id: "con-4", slug: "con-expansion-joint-dn100", name: "Riser Expansion Joint DN100", sku: "RS-REJ-100", images: [{ url: productImage3, alt: "Riser Expansion Joint DN100" }], category: "rubber-expansion-joints", brand: "Teekay", description: "", specifications: [], materials: { body: "" }, pressureRange: "" },
    ],
  };

  const mockProducts = industryProductData[industryName] || industryProductData["Water & Wastewater"];

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
        title={`${industryName} Solutions`}
        description={`${description} Specialised pipe couplings, valves, and fittings for ${industryName.toLowerCase()}. Request a quote from Dewater Products Australia.`}
        keywords={`${industryName.toLowerCase()}, ${applications.join(', ')}, industrial pipe fittings, valves, Australia`}
        canonical={`https://dewaterproducts.com.au${window.location.pathname}`}
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{industryName}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {description}
          </p>
          
          <div className="bg-card border border-border rounded-md p-6">
            <h3 className="text-xl font-semibold mb-4">Applications</h3>
            <ul className="space-y-2 text-muted-foreground">
              {applications.map((app, index) => (
                <li key={index}>• {app}</li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recommended Products for {industryName}</h2>
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
