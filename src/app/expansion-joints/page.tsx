import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Maximize2 } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import JointTypeChips from "@/components/JointTypeChips"
import type { Metadata } from "next"

const jointTypes = [
  { name: "Single Sphere", url: "/single-sphere-expansion-joints", description: "Standard expansion joint for moderate axial movement and vibration absorption. Ideal for pump connections." },
  { name: "Twin Sphere", url: "/twin-sphere-expansion-joints", description: "Greater axial movement and flexibility than single sphere. Excellent for high-vibration applications." },
  { name: "Single Arch", url: "/single-arch-expansion-joints", description: "Higher pressure rating with controlled lateral and angular movement. Suited for industrial piping systems." },
  { name: "Double Arch", url: "/double-arch-expansion-joints", description: "Maximum movement capability for demanding applications requiring significant thermal expansion compensation." },
  { name: "Reducing", url: "/reducing-expansion-joints", description: "Connects different pipe sizes while absorbing vibration and movement. Available in various size combinations." },
]

const applications = [
  "Pump vibration isolation",
  "HVAC systems",
  "Marine and shipboard piping",
  "Chemical processing",
  "Slurry pipelines",
  "Mining and dredging",
  "Water treatment plants",
]

const selectionFactors = [
  "Required axial, lateral, and angular movement",
  "Operating pressure and temperature range",
  "Media compatibility (water, chemicals, slurry)",
  "Flange type and material requirements",
  "Vacuum rating requirements",
]

export const metadata: Metadata = {
  title: "Expansion Joints | Rubber Expansion Bellows | Australia | Dewater Products",
  description:
    "Rubber expansion joints and expansion bellows for thermal expansion, vibration absorption, and pipe misalignment. Single sphere, twin sphere, arch and reducing rubber bellows. EPDM rubber with zinc or 316SS flanges. PN16 rated. Australia-wide delivery.",
  keywords: [
    "expansion joints",
    "rubber expansion joints",
    "expansion bellows",
    "rubber bellows",
    "flexible pipe connectors",
    "vibration isolators",
    "pipe expansion joints australia",
  ],
  openGraph: {
    title: "Expansion Joints & Rubber Bellows | Dewater Products Australia",
    description: "Rubber expansion joints and expansion bellows for pumps, HVAC, and industrial piping systems. Australia-wide delivery.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/expansion-joints",
  },
}

export const revalidate = 60

export default async function ExpansionJointsPage() {
  const expansionProducts = await getProductsByCategory("rubber-expansion-joints")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Expansion Joints", url: "https://dewaterproducts.com.au/expansion-joints" },
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
                <Maximize2 className="w-4 h-4" />
                Vibration & Movement Control
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Expansion Joints & Rubber Bellows
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Rubber expansion joints and expansion bellows designed to reduce pipeline stress, absorb vibration, and compensate for thermal movement.
                EPDM rubber bellows with zinc or 316SS flanges, PN16 rated.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/TAREJ/TAREJ_1.png"
                  alt="Triple Arch Rubber Expansion Joint"
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
        {/* Joint Types - Compact Chips */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Expansion Joint Types</h2>
          <JointTypeChips jointTypes={jointTypes} />
        </div>

        {/* All Products */}
        <div id="products" className="mb-6 scroll-mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Expansion Joints</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {expansionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Applications & Selection */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Applications</h2>
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Selection Factors</h2>
            <div className="space-y-3">
              {selectionFactors.map((factor) => (
                <div key={factor} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right expansion joint for your application, including custom flanges and movement requirements.
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
