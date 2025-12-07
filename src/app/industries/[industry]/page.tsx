import { notFound } from "next/navigation"
import { products } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import type { Metadata } from "next"

interface IndustryPageProps {
  params: { industry: string }
}

const industryInfo: Record<
  string,
  {
    name: string
    description: string
    applications: string[]
    recommendedCategories: string[]
  }
> = {
  "water-wastewater": {
    name: "Water & Wastewater",
    description:
      "Complete piping solutions for water treatment plants, sewage systems, and water distribution networks. Our products meet strict standards for potable water and wastewater applications.",
    applications: [
      "Water treatment plants",
      "Sewage pumping stations",
      "Desalination facilities",
      "Stormwater management",
      "Municipal water networks",
    ],
    recommendedCategories: ["valves", "pipe-couplings", "strainers", "rubber-expansion-joints"],
  },
  irrigation: {
    name: "Irrigation",
    description:
      "Reliable irrigation solutions for agricultural and landscaping applications. Products designed for efficient water distribution and long-term durability in outdoor conditions.",
    applications: [
      "Agricultural irrigation systems",
      "Drip irrigation networks",
      "Sprinkler systems",
      "Pivot irrigation",
      "Golf course irrigation",
    ],
    recommendedCategories: ["valves", "pipe-couplings", "strainers"],
  },
  "fire-services": {
    name: "Fire Services",
    description:
      "Fire protection piping components meeting Australian standards for fire safety systems. Trusted by fire protection contractors across Australia.",
    applications: [
      "Fire sprinkler systems",
      "Fire hydrant networks",
      "Fire pump stations",
      "Deluge systems",
      "Fire hose reels",
    ],
    recommendedCategories: ["valves", "pipe-couplings"],
  },
  mining: {
    name: "Mining",
    description:
      "Heavy-duty piping solutions for demanding mining environments. Products engineered to handle abrasive slurries, high pressures, and harsh conditions.",
    applications: [
      "Mine dewatering systems",
      "Slurry transport pipelines",
      "Process water systems",
      "Tailings management",
      "Dust suppression",
    ],
    recommendedCategories: ["valves", "pipe-couplings", "strainers", "rubber-expansion-joints"],
  },
  marine: {
    name: "Marine",
    description:
      "Corrosion-resistant piping components for marine and offshore applications. Designed to withstand saltwater environments and meet maritime standards.",
    applications: [
      "Ship ballast systems",
      "Offshore platforms",
      "Port facilities",
      "Dredging operations",
      "Marine cooling systems",
    ],
    recommendedCategories: ["valves", "pipe-couplings", "strainers"],
  },
  hvac: {
    name: "HVAC",
    description:
      "Heating, ventilation, and air conditioning piping solutions. Products designed for chilled water, hot water, and refrigerant systems in commercial buildings.",
    applications: [
      "Chilled water systems",
      "Hot water circulation",
      "Cooling tower pipework",
      "Air handling units",
      "Building automation",
    ],
    recommendedCategories: ["rubber-expansion-joints", "valves", "strainers", "pipe-couplings"],
  },
  "food-beverage": {
    name: "Food & Beverage",
    description:
      "Hygienic piping solutions meeting food-grade standards. Products suitable for CIP systems, beverage processing, and food manufacturing facilities.",
    applications: [
      "CIP (Clean-in-Place) systems",
      "Beverage production lines",
      "Food processing plants",
      "Dairy facilities",
      "Brewery operations",
    ],
    recommendedCategories: ["valves", "pipe-couplings", "strainers"],
  },
}

export function generateStaticParams() {
  return Object.keys(industryInfo).map((industry) => ({
    industry,
  }))
}

export function generateMetadata({ params }: IndustryPageProps): Metadata {
  const industry = industryInfo[params.industry]
  if (!industry) return { title: "Industry Not Found" }

  return {
    title: `${industry.name} Solutions - Industrial Pipe Fittings`,
    description: `${industry.description} Specialised pipe couplings, valves, and fittings for ${industry.name.toLowerCase()}.`,
  }
}

export default function IndustryPage({ params }: IndustryPageProps) {
  const industry = industryInfo[params.industry]

  if (!industry) {
    notFound()
  }

  // Get products from recommended categories
  const recommendedProducts = products
    .filter((p) => industry.recommendedCategories.includes(p.category))
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{industry.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">{industry.description}</p>

          <div className="bg-card border border-border rounded-md p-6">
            <h3 className="text-xl font-semibold mb-4">Applications</h3>
            <ul className="space-y-2 text-muted-foreground">
              {industry.applications.map((app, index) => (
                <li key={index}>• {app}</li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recommended Products for {industry.name}</h2>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Contact us for product recommendations for your {industry.name.toLowerCase()}{" "}
            application.
          </p>
        )}
      </div>
    </div>
  )
}
