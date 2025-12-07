import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Industrial Valves - Check, Gate & Ball Valves",
  description:
    "Industrial valves including check valves, gate valves, and ball valves for precise flow control. Engineered for reliable performance in demanding applications.",
}

const subcategories = [
  { name: "Duckbill Check Valves", url: "/valves/check-valves/duckbill" },
  { name: "Ball Check Valves", url: "/valves/check-valves/ball" },
  { name: "Swing Check Valves", url: "/valves/check-valves/swing" },
  { name: "Gate Valves", url: "/valves/gate-valves" },
  { name: "Ball Valves", url: "/valves/ball-valves" },
  { name: "Air Release / Non-Return", url: "/valves/air-release" },
]

export default function ValvesPage() {
  const valveProducts = getProductsByCategory("valves")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Valves</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Industrial valves including check valves, gate valves, and ball valves for precise flow
            control. Engineered for reliable performance in demanding applications.
          </p>
        </div>

        {/* Subcategory Links */}
        <div className="mb-8 flex flex-wrap gap-3">
          {subcategories.map((subcat, index) => (
            <Link key={subcat.name} href={subcat.url}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover-elevate active-elevate-2 transition-all cursor-pointer"
                data-testid={`link-subcategory-${index}`}
              >
                <span className="font-medium">{subcat.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {valveProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
