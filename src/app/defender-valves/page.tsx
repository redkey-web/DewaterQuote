import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, Gauge, Thermometer, Droplets } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Defender Valves Australia | Industrial Butterfly Valves | Dewater Products",
  description:
    "Defender industrial butterfly valves in 316 stainless steel. PTFE lined, wafer and lugged patterns. DN50 to DN600. PN16 rated. Australia-wide delivery.",
  keywords: [
    "Defender Valves",
    "butterfly valves",
    "industrial butterfly valves",
    "PTFE lined valves",
    "316 stainless steel valves",
    "wafer butterfly valve",
    "lugged butterfly valve",
  ],
  openGraph: {
    title: "Defender Valves - Industrial Butterfly Valves | Dewater Products",
    description: "High-performance industrial butterfly valves with PTFE lining and 316SS construction.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/defender-valves",
  },
}

export const revalidate = 60
export const dynamic = "force-dynamic"

const features = [
  {
    icon: Shield,
    title: "316 Stainless Steel",
    description: "Premium 316SS construction for superior corrosion resistance in demanding environments.",
  },
  {
    icon: Thermometer,
    title: "PTFE Lined",
    description: "PTFE seat and disc coating for excellent chemical resistance and low friction operation.",
  },
  {
    icon: Gauge,
    title: "Various Pressure Ratings",
    description: "Rated for most industrial applications.",
  },
  {
    icon: Droplets,
    title: "Bi-Directional",
    description: "Designed for bi-directional flow with reliable sealing in both directions.",
  },
]

const applications = [
  "Water treatment plants",
  "Chemical processing",
  "HVAC systems",
  "Food and beverage",
  "Pharmaceutical",
  "Marine and offshore",
]

export default async function DefenderValvesPage() {
  const products = await getProductsByBrand("defender-valves")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Defender Valves", url: "https://dewaterproducts.com.au/defender-valves" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section - extends behind header */}
      <div className="relative overflow-hidden border-b bg-white -mt-[44px] pt-[44px]">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/defender-valves-logo.png"
                alt="Defender Valves"
                width={180}
                height={60}
                className="h-12 w-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Industrial Flow Control
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-blue-900">
                Defender Valves
              </h1>
              <p className="text-xl text-blue-800/80 max-w-2xl">
                High-performance industrial butterfly valves with PTFE lining and 316 stainless steel construction.
                Reliable flow control for water, chemical, and process applications.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/BCV316TE/BCV316TE_1.png"
                  alt="Ball Check Valve - Stainless Steel 316 - Flanged Table E"
                  fill
                  className="object-contain rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Defender Valves Products</h2>
            <span className="text-muted-foreground">{products.length} products</span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Contact us for Defender Valves pricing and availability.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        {/* Related Pages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/industrial-valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">All Industrial Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/butterfly-valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Butterfly Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Choose Defender Valves?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-lg bg-card border border-border">
                <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Valve?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the right butterfly valve for your application.
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
