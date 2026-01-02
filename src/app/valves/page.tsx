import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
import SubcategoryTiles from "@/components/SubcategoryTiles"
import type { Metadata } from "next"

const applications = [
  "Potable water distribution systems",
  "Pump control and isolation",
  "Sewage and stormwater systems",
  "Chemical handling and process pipelines",
  "HVAC regulation and control",
  "Fire protection systems",
  "Abrasive material and slurry control",
]

const valveTypes = [
  { name: "Butterfly Valves", description: "Compact flow control valves with a rotating disc, ideal for large diameter pipes." },
  { name: "Check Valves", description: "Non-return valves that prevent reverse flow. Includes swing, ball, and duckbill types." },
  { name: "Float Valves", description: "Level control valves that maintain liquid levels in tanks and reservoirs." },
  { name: "Foot Valves", description: "Non-return valves with strainers designed for the suction side of pumps." },
  { name: "Gate Valves", description: "Full-bore shutoff valves ideal for isolation in water and slurry systems." },
  { name: "Ball Valves", description: "Quarter-turn valves providing tight shutoff for on/off control applications." },
]

export const metadata: Metadata = {
  title: "Industrial Valves | Check, Gate, Ball & Butterfly Valves | Dewater Products",
  description:
    "Industrial valves including butterfly valves, duckbill check valves, gate valves, ball valves, and foot valves. 316 stainless steel and ductile iron. Australia-wide delivery.",
  openGraph: {
    title: "Industrial Valves - Dewater Products",
    description: "Industrial valves for water, process, and HVAC applications. Butterfly, gate, ball, and check valves.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/valves",
  },
}

export const revalidate = 60

export default async function ValvesPage() {
  const [valveProducts, valveSubcategories] = await Promise.all([
    getProductsByCategory("valves"),
    getSubcategoriesByCategory("valves"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Valves", url: "https://dewater-products.vercel.app/valves" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Industrial Valves</h1>
          <p className="text-muted-foreground">
            Industrial-grade valves for fluid control, isolation, and backflow prevention.
          </p>
        </div>

        {/* Valve Types - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Valve Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {valveTypes.map((type) => (
              <div key={type.name} className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="valves"
          subcategories={valveSubcategories}
          title="Search by Type"
          basePath="/valves"
        />

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Valve Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {valveProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Valve?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you find the right valve for your application.
            Call us on (08) 9271 2577 or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
