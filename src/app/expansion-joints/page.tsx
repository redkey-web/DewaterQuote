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
  { name: "Single Sphere", url: "/expansion-joints/single-sphere", description: "Standard rubber bellows for moderate axial movement and vibration absorption. Ideal for pump connections." },
  { name: "Twin Sphere", url: "/expansion-joints/twin-sphere", description: "Double sphere rubber bellows with greater axial movement. Excellent for high-vibration applications." },
  { name: "Single Arch", url: "/expansion-joints/single-arch", description: "Higher pressure rubber bellows with controlled lateral and angular movement. Suited for industrial piping." },
  { name: "Double Arch", url: "/expansion-joints/double-arch", description: "Maximum movement rubber bellows for demanding applications requiring significant thermal expansion compensation." },
  { name: "Reducing", url: "/expansion-joints/reducing", description: "Reducing rubber bellows connecting different pipe sizes while absorbing vibration and movement." },
]

const applications = [
  "Pump vibration isolation",
  "Chilled water pipe systems (HVAC)",
  "Steam pipe expansion control",
  "Thermal expansion in hot water systems",
  "Marine and shipboard piping",
  "Chemical processing pipelines",
  "Slurry and mining pipelines",
  "Water treatment plants",
  "Grooved pipe connections",
]

const selectionFactors = [
  "Required axial, lateral, and angular movement",
  "Operating pressure and temperature range",
  "Media compatibility (water, chemicals, slurry)",
  "Flange type and material requirements",
  "Vacuum rating requirements",
]

export const metadata: Metadata = {
  title: "Pipe Expansion Joints | Rubber Bellows for Pipe | Australia | Dewater Products",
  description:
    "Pipe expansion joints and rubber bellows for thermal expansion, vibration absorption, and pipe movement. Rubber pipe expansion joints for chilled water, steam, HVAC and industrial piping. EPDM bellows with PN16 flanges. Australia-wide delivery.",
  keywords: [
    "rubber bellows",
    "rubber bellows Australia",
    "pipe rubber bellows",
    "rubber bellows for pipes",
    "rubber bellows expansion joint",
    "pipe expansion joints",
    "expansion joints for pipe",
    "rubber expansion joints for pipe",
    "rubber pipe expansion joints",
    "thermal expansion joints pipe",
    "chilled water pipe expansion joints",
    "steam pipe expansion joints",
    "expansion bellows",
    "flexible rubber bellows",
    "EPDM rubber bellows",
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
export const dynamic = "force-dynamic"

export default async function ExpansionJointsPage() {
  const expansionProducts = await getProductsByCategory("rubber-expansion-joints")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Expansion Joints", url: "https://dewaterproducts.com.au/expansion-joints" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

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
                Pipe Expansion Joints & Rubber Bellows
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Rubber pipe expansion joints and bellows designed to reduce pipeline stress, absorb vibration, and compensate for thermal expansion in pipe systems.
                EPDM pipe rubber bellows with zinc or 316SS flanges, PN16 rated for industrial piping applications.
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

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* What is an Expansion Joint - SEO content section */}
        <div className="mb-12 bg-white dark:bg-stone-800 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">What is an Expansion Joint?</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              An expansion joint (also called a rubber bellows or flexible connector) is a pipe fitting designed to absorb thermal expansion, vibration, and movement in piping systems. Pipe expansion joints prevent stress on pipes, pumps, and connected equipment by providing flexibility where rigid connections would fail.
            </p>
            <p className="text-muted-foreground mb-4">
              Rubber expansion joints for pipe systems use an EPDM or NBR rubber bellows element between metal flanges. The pipe rubber bellows absorbs axial compression and extension, lateral offset, and angular misalignment. This makes rubber pipe expansion joints essential for pump connections, HVAC systems, and any application where thermal movement or vibration occurs.
            </p>
            <p className="text-muted-foreground">
              We supply pipe expansion joints for a wide range of applications including <strong>chilled water pipe expansion joints</strong> for HVAC cooling systems, <strong>thermal expansion joints</strong> for hot water and heating pipelines, and <strong>steam pipe expansion joints</strong> for high-temperature industrial processes. Our rubber expansion joints for pipe are available in sizes from DN25 to DN600 with PN16 pressure ratings.
            </p>
          </div>
        </div>

        {/* Joint Types - Compact Chips */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Pipe Expansion Joint Types</h2>
          <JointTypeChips jointTypes={jointTypes} />
        </div>

        {/* All Products */}
        <div id="products" className="mb-6 scroll-mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Pipe Expansion Joints</h2>
          <p className="text-muted-foreground mb-4">Browse our range of rubber pipe expansion joints and bellows from leading manufacturers. All expansion joints for pipe systems are available with zinc-plated or 316 stainless steel flanges.</p>
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

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-couplings" className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all">
              <span className="font-medium">Pipe Couplings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/industrial-valves" className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all">
              <span className="font-medium">Industrial Valves</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/strainers" className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all">
              <span className="font-medium">Strainers & Filters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Pipe Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            As authorised distributors for leading pipe expansion joints manufacturers, our technical team can help you specify the right rubber bellows for your application-whether it's thermal expansion joints for pipe heating systems, chilled water expansion joints, or steam pipe applications.
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
