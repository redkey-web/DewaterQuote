import ProductCard, { type Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import productImage1 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";
import productImage2 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";
import productImage3 from "@assets/generated_images/Rubber_expansion_joint_product_f7dd5a35.png";

interface IndustryPageProps {
  industryName: string;
  description: string;
  applications: string[];
  onAddToQuote: (product: Product) => void;
}

export default function IndustryPage({ industryName, description, applications, onAddToQuote }: IndustryPageProps) {
  const { toast } = useToast();

  // Industry-specific product variations
  const industryProductData: Record<string, Product[]> = {
    "Water & Wastewater": [
      { id: "ww-1", name: "Wastewater Check Valve DN100", sku: "WW-CV-100", price: 285.00, image: productImage2, category: "Check Valves", brand: "Straub" },
      { id: "ww-2", name: "Water Main Coupling DN150", sku: "WM-PC-150", price: 325.00, image: productImage1, category: "Pipe Couplings", brand: "Orbit" },
      { id: "ww-3", name: "Treatment Plant Strainer DN100", sku: "TP-YS-100", price: 265.00, image: productImage1, category: "Y Strainers", brand: "Orbit" },
      { id: "ww-4", name: "Pump Station Expansion Joint DN100", sku: "PS-REJ-100", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "Irrigation": [
      { id: "irr-1", name: "Agricultural Ball Valve DN100", sku: "AG-BV-100", price: 295.00, image: productImage2, category: "Ball Valves", brand: "Straub" },
      { id: "irr-2", name: "Drip System Coupling DN80", sku: "DS-PC-80", price: 185.00, image: productImage1, category: "Pipe Couplings", brand: "Orbit" },
      { id: "irr-3", name: "Irrigation Filter DN100", sku: "IR-YS-100", price: 245.00, image: productImage1, category: "Y Strainers", brand: "Orbit" },
      { id: "irr-4", name: "Field Check Valve DN100", sku: "FC-CV-100", image: productImage2, category: "Check Valves", brand: "Straub" },
    ],
    "Fire Services": [
      { id: "fs-1", name: "Fire Sprinkler Check Valve DN100", sku: "FS-CV-100", price: 385.00, image: productImage2, category: "Check Valves", brand: "Straub" },
      { id: "fs-2", name: "Fire Main Gate Valve DN150", sku: "FM-GV-150", price: 485.00, image: productImage2, category: "Gate Valves", brand: "Orbit" },
      { id: "fs-3", name: "Hydrant Coupling DN100", sku: "HD-PC-100", price: 295.00, image: productImage1, category: "Pipe Couplings", brand: "Straub" },
      { id: "fs-4", name: "Fire Protection Strainer DN100", sku: "FP-BS-100", image: productImage1, category: "Basket Strainers", brand: "Orbit" },
    ],
    "Mining": [
      { id: "min-1", name: "Heavy Duty Slurry Valve DN150", sku: "HD-GV-150", price: 685.00, image: productImage2, category: "Gate Valves", brand: "Orbit" },
      { id: "min-2", name: "Abrasion Resistant Coupling DN150", sku: "AR-PC-150", price: 445.00, image: productImage1, category: "Pipe Couplings", brand: "Straub" },
      { id: "min-3", name: "Mine Dewatering Strainer DN150", sku: "MD-BS-150", price: 585.00, image: productImage1, category: "Basket Strainers", brand: "Orbit" },
      { id: "min-4", name: "Tailings Expansion Joint DN150", sku: "TL-REJ-150", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "Marine": [
      { id: "mar-1", name: "Stainless Marine Coupling DN100", sku: "SM-PC-100", price: 425.00, image: productImage1, category: "Pipe Couplings", brand: "Orbit" },
      { id: "mar-2", name: "Corrosion Resistant Valve DN100", sku: "CR-BV-100", price: 385.00, image: productImage2, category: "Ball Valves", brand: "Straub" },
      { id: "mar-3", name: "Saltwater Strainer DN100", sku: "SW-BS-100", price: 465.00, image: productImage1, category: "Basket Strainers", brand: "Orbit" },
      { id: "mar-4", name: "Shipboard Expansion Joint DN100", sku: "SB-REJ-100", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
    "HVAC": [
      { id: "hvac-1", name: "Chiller Expansion Joint DN100", sku: "CH-REJ-100", price: 385.00, image: productImage3, category: "Expansion Joints", brand: "Teekay" },
      { id: "hvac-2", name: "HVAC Ball Valve DN80", sku: "HV-BV-80", price: 295.00, image: productImage2, category: "Ball Valves", brand: "Straub" },
      { id: "hvac-3", name: "Air Handler Strainer DN100", sku: "AH-YS-100", price: 265.00, image: productImage1, category: "Y Strainers", brand: "Orbit" },
      { id: "hvac-4", name: "Cooling Tower Coupling DN100", sku: "CT-PC-100", image: productImage1, category: "Pipe Couplings", brand: "Orbit" },
    ],
    "Food & Beverage": [
      { id: "fb-1", name: "Sanitary Check Valve DN80", sku: "SAN-CV-80", price: 385.00, image: productImage2, category: "Check Valves", brand: "Straub" },
      { id: "fb-2", name: "Food Grade Coupling DN100", sku: "FG-PC-100", price: 345.00, image: productImage1, category: "Pipe Couplings", brand: "Orbit" },
      { id: "fb-3", name: "Hygienic Strainer DN80", sku: "HY-YS-80", price: 325.00, image: productImage1, category: "Y Strainers", brand: "Orbit" },
      { id: "fb-4", name: "CIP System Expansion Joint DN100", sku: "CIP-REJ-100", image: productImage3, category: "Expansion Joints", brand: "Teekay" },
    ],
  };

  const mockProducts = industryProductData[industryName] || industryProductData["Water & Wastewater"];

  const handleAddToQuote = (product: Product) => {
    onAddToQuote(product);
    toast({
      title: "Added to Quote",
      description: `${product.name} has been added to your quote request.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${industryName} Solutions`}
        description={`${description} Specialised pipe couplings, valves, and fittings for ${industryName.toLowerCase()}. Request a quote from Dewater Products Australia.`}
        keywords={`${industryName.toLowerCase()}, ${applications.join(', ')}, industrial pipe fittings, valves, Australia`}
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
