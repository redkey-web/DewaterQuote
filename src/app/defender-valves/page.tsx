import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Shield } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
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
  { name: "Butterfly Valves", slug: "butterfly-valve", description: "Compact flow control valves with a rotating disc, ideal for large diameter pipes." },
  { name: "Check Valves", slug: "check-valves", description: "Non-return valves that prevent reverse flow. Includes swing, ball, and duckbill types." },
  { name: "Float Valves", slug: "float-valve", description: "Level control valves that maintain liquid levels in tanks and reservoirs." },
  { name: "Foot Valves", slug: "foot-valve", description: "Non-return valves with strainers designed for the suction side of pumps." },
  { name: "Gate Valves", slug: "gate-valve", description: "Full-bore shutoff valves ideal for isolation in water and slurry systems." },
  { name: "Ball Valves", slug: "ball-valve", description: "Quarter-turn valves providing tight shutoff for on/off control applications." },
]

export const metadata: Metadata = {
  title: "Defender Valves | Check, Gate, Ball & Butterfly Valves | Dewater Products",
  description:
    "Defender Valves including butterfly valves, duckbill check valves, gate valves, ball valves, and foot valves. 316 stainless steel and ductile iron. Australia-wide delivery.",
  openGraph: {
    title: "Defender Valves - Dewater Products",
    description: "Defender Valves for water, process, and HVAC applications. Butterfly, gate, ball, and check valves.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/defender-valves",
  },
}

export const revalidate = 60

export default async function DefenderValvesPage() {
  const [valveProducts, valveSubcategories] = await Promise.all([
    getProductsByCategory("valves"),
    getSubcategoriesByCategory("valves"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Defender Valves", url: "https://dewaterproducts.com.au/defender-valves" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-transparent dark:from-blue-950/30 dark:via-blue-900/10 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/defender-valves-logo.png"
                alt="Defender Valves"
                width={200}
                height={60}
                className="w-48 h-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Industrial Flow Control
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Defender Valves
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Industrial-grade valves for fluid control, isolation, and backflow prevention.
                Butterfly, gate, ball, check, and specialty valves in 316SS and ductile iron.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  View Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="/images/products/valves/butterfly-valve-cf8m-316ss.jpg"
                  alt="Defender Butterfly Valve 316SS"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Valve Types - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Valve Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {valveTypes.map((type) => (
              <Link key={type.name} href={`/defender-valves/${type.slug}`} className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="valves"
          subcategories={valveSubcategories}
          title="Search by Type"
          basePath="/defender-valves"
        />

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Defender Valve Products</h2>
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
            Call us on 1300 271 290 or request a quote.
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
