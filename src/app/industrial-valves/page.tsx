import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Shield } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
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
  { name: "Butterfly Valves", slug: "/butterfly-valves", description: "Compact flow control valves with a rotating disc, ideal for large diameter pipes." },
  { name: "Check Valves", slug: "/check-valves", description: "Non-return valves that prevent reverse flow. Includes swing, ball, and duckbill types." },
  { name: "Float Valves", slug: "/float-valves", description: "Level control valves that maintain liquid levels in tanks and reservoirs." },
  { name: "Foot Valves", slug: "/foot-valves", description: "Non-return valves with strainers designed for the suction side of pumps." },
  { name: "Gate Valves", slug: "/gate-valves", description: "Full-bore shutoff valves ideal for isolation in water and slurry systems." },
  { name: "Ball Valves", slug: "/ball-valves", description: "Quarter-turn valves providing tight shutoff for on/off control applications." },
]

export const metadata: Metadata = {
  title: "Industrial Valves | Check, Gate, Ball & Butterfly Valves | Dewater Products",
  description:
    "Industrial valves including butterfly valves, check valves, gate valves, ball valves, and foot valves. 316 stainless steel and ductile iron. Australia-wide delivery.",
  openGraph: {
    title: "Industrial Valves - Dewater Products",
    description: "Industrial valves for water, process, and HVAC applications. Butterfly, gate, ball, and check valves.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/industrial-valves",
  },
}

export const revalidate = 60

export default async function IndustrialValvesPage() {
  const valveProducts = await getProductsByCategory("valves")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Industrial Valves", url: "https://dewaterproducts.com.au/industrial-valves" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section - extends under header */}
      <div className="relative overflow-hidden border-b -mt-[88px] pt-[88px]">
        {/* Animated blob background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark base for white text, lighter at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-400" />
          {/* Blob 1 - Cyan brand color (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#39C5DA' }}
          />
          {/* Blob 2 - Teal accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#2DD4BF' }}
          />
          {/* Blob 3 - Dark navy (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#0f172a' }}
          />
          {/* Blob 4 - Dark slate (center-left, behind text) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#1e293b' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39C5DA] text-white text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Industrial Flow Control
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Industrial Valves
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Industrial-grade valves for fluid control, isolation, and backflow prevention.
                Butterfly, gate, ball, check, and specialty valves in 316SS and ductile iron.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/cf8mdafv/main-wSg1UuLIMcZJ4tm2PUFULSyNFgxTVt.png"
                  alt="CF8M Flanged Float Valve AS4087 PN16"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Valve Types - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Valve Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {valveTypes.map((type) => (
              <Link key={type.name} href={type.slug} className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div id="products" className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Industrial Valve Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
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
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
