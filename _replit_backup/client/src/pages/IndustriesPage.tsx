import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";

import miningImage from "@assets/stock_images/mining_industry_indu_d07affe4.jpg";
import constructionImage from "@assets/stock_images/construction_site_bu_b1aad781.jpg";
import marineImage from "@assets/stock_images/marine_ship_port_har_66fa843f.jpg";
import foodBeverageImage from "@assets/stock_images/food_beverage_manufa_e1985646.jpg";
import waterWastewaterImage from "@assets/stock_images/water_treatment_plan_f784980f.jpg";
import irrigationImage from "@assets/stock_images/irrigation_agricultu_51d43feb.jpg";
import fireServicesImage from "@assets/stock_images/fire_sprinkler_syste_f32b1ecd.jpg";
import hvacImage from "@assets/stock_images/hvac_air_conditionin_068b600a.jpg";

const industries = [
  {
    name: "Mining",
    description: "Heavy-duty solutions for harsh mining environments and abrasive materials.",
    url: "/industries/mining",
    image: miningImage
  },
  {
    name: "Construction",
    description: "Durable fittings for commercial and residential construction projects.",
    url: "/industries/construction",
    image: constructionImage
  },
  {
    name: "Marine",
    description: "Corrosion-resistant solutions for marine and coastal applications.",
    url: "/industries/marine",
    image: marineImage
  },
  {
    name: "Food & Beverage",
    description: "Hygienic pipe connections for food processing and beverage production.",
    url: "/industries/food-beverage",
    image: foodBeverageImage
  },
  {
    name: "Water & Wastewater",
    description: "Reliable solutions for water treatment and distribution systems.",
    url: "/industries/water-wastewater",
    image: waterWastewaterImage
  },
  {
    name: "Irrigation",
    description: "Efficient systems for agricultural and landscape irrigation.",
    url: "/industries/irrigation",
    image: irrigationImage
  },
  {
    name: "Fire Services",
    description: "Critical components for fire protection and suppression systems.",
    url: "/industries/fire-services",
    image: fireServicesImage
  },
  {
    name: "HVAC",
    description: "Flexible connections for heating, ventilation and air conditioning.",
    url: "/industries/hvac",
    image: hvacImage
  }
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Industries We Serve"
        description="Specialised pipe fittings, valves, and couplings for mining, construction, marine, food & beverage, water, irrigation, fire services, and HVAC industries across Australia."
        keywords="industrial pipe fittings, mining valves, construction plumbing, marine fittings, HVAC connections, Australia"
        canonical="https://dewaterproducts.com.au/industries"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Industries We Serve</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We supply specialised pipe fittings, valves, couplings, and strainers to a wide range of industries across Australia. Our products are designed to meet the unique demands of each sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <Link key={industry.name} href={industry.url}>
              <Card className="group overflow-hidden h-80 relative hover-elevate active-elevate-2 transition-all cursor-pointer border-border">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${industry.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{industry.description}</p>
                  <div className="flex items-center text-primary text-sm font-medium transition-all duration-300 group-hover:text-primary/80">
                    View solutions <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
