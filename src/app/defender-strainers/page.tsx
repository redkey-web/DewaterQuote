import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Filter, Shield, Gauge, Wrench } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Defender Strainers Australia | Industrial Pipeline Strainers | Dewater Products",
  description:
    "Defender industrial pipeline strainers in 316 stainless steel. Y strainers, simplex and duplex basket strainers, flanged suction strainers. Australia-wide delivery.",
  keywords: [
    "Defender Strainers",
    "pipeline strainers",
    "Y strainers",
    "basket strainers",
    "duplex strainers",
    "suction strainers",
    "316 stainless steel strainers",
  ],
  openGraph: {
    title: "Defender Strainers - Industrial Pipeline Strainers | Dewater Products",
    description: "Quality industrial strainers for protecting pumps, valves, and equipment.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/defender-strainers",
  },
}

export const revalidate = 60

const features = [
  {
    icon: Shield,
    title: "316 Stainless Steel",
    description: "Premium 316SS construction for corrosion resistance in harsh environments.",
  },
  {
    icon: Filter,
    title: "Multiple Mesh Options",
    description: "Various mesh sizes available to suit your filtration requirements.",
  },
  {
    icon: Gauge,
    title: "High Pressure Rated",
    description: "Designed for industrial pressure ratings up to PN40.",
  },
  {
    icon: Wrench,
    title: "Easy Maintenance",
    description: "Quick-opening covers for easy basket access and cleaning.",
  },
]

const strainerTypes = [
  { name: "Y Strainers", href: "/y-strainers", description: "Compact inline strainers for horizontal or vertical installation" },
  { name: "Simplex Basket Strainers", href: "/basket-strainers", description: "Single basket strainers with top-opening access" },
  { name: "Duplex Basket Strainers", href: "/duplex-basket-strainers", description: "Dual basket system for continuous operation during cleaning" },
  { name: "Flanged Suction Strainers", href: "/flanged-suction-strainers", description: "Large capacity strainers for pump suction lines" },
]

const applications = [
  "Pump protection",
  "Process water filtration",
  "Chemical processing",
  "HVAC systems",
  "Fire protection",
  "Industrial wastewater",
]

export default async function DefenderStrainersPage() {
  const products = await getProductsByBrand("defender-strainers")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Defender Strainers", url: "https://dewaterproducts.com.au/defender-strainers" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section - extends behind header */}
      <div className="relative overflow-hidden border-b -mt-[44px] pt-[44px]">
        {/* Animated blob background - Teal/Cyan theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-800 to-cyan-600" />
          {/* Blob 1 - Teal (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#14b8a6' }}
          />
          {/* Blob 2 - Cyan accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#22d3ee' }}
          />
          {/* Blob 3 - Dark teal (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#134e4a' }}
          />
          {/* Blob 4 - Dark cyan (center-left) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#0d9488' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/defender-strainers-logo.png"
                alt="Defender Strainers"
                width={192}
                height={72}
                className="h-[72px] w-auto mb-6 brightness-0 invert"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500 text-white text-sm font-medium mb-4">
                <Filter className="w-4 h-4" />
                Pipeline Filtration
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Defender Strainers
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Industrial pipeline strainers to protect pumps, valves, and equipment from debris.
                Y strainers, basket strainers, and suction strainers in 316 stainless steel.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/OSSBS/OSSBS_1.png"
                  alt="Defender Strainer"
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
        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Defender Strainer Products</h2>
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
                Contact us for Defender Strainer pricing and availability.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Choose Defender Strainers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-lg bg-card border border-border">
                <feature.icon className="w-10 h-10 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strainer Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Strainer Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strainerTypes.map((type) => (
              <Link key={type.name} href={type.href}>
                <div className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Pages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/strainers">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">All Strainers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/industrial-valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Industrial Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Strainer?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the right strainer type and mesh size for your application.
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
