import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Circle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import SubcategoryTiles from "@/components/SubcategoryTiles"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flange Adaptors | 316SS Flange Adapters | Dewater Products",
  description:
    "316 stainless steel flange adaptors for connecting plain-ended pipes to flanged equipment. EPDM seals. Wide size range 30mm to 4064mm OD. WRAS approved. Australia-wide delivery.",
  openGraph: {
    title: "Flange Adaptors - Dewater Products",
    description: "Stainless steel flange adaptors for pipe-to-flange connections.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/flange-adaptors",
  },
}

export const revalidate = 60

const features = [
  "316 stainless steel construction",
  "EPDM rubber seals (NBR/Viton available)",
  "Size range: 30mm to 4064mm OD",
  "WRAS approved for potable water",
  "Suitable for steel, ductile iron, PVC, PE, and concrete pipes",
  "Available in Table D, Table E, and ANSI flange patterns",
]

const applications = [
  "Connect plain-ended pipes to flanged valves",
  "Pump and equipment connections",
  "Transition between pipe materials",
  "Replace bolted gland adaptors",
  "Water and wastewater systems",
  "Industrial process piping",
]

export default async function FlangeAdaptorsPage() {
  const [flangeProducts, flangeSubcategories] = await Promise.all([
    getProductsByCategory("flange-adaptors"),
    getSubcategoriesByCategory("flange-adaptors"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Pipe Couplings", url: "https://dewaterproducts.com.au/pipe-couplings" },
    { name: "Flange Adaptors", url: "https://dewaterproducts.com.au/flange-adaptors" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-transparent dark:from-purple-950/30 dark:via-purple-900/10 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                <Circle className="w-4 h-4" />
                Pipe-to-Flange Connections
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Flange Adaptors
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                316 stainless steel adaptors for connecting plain-ended pipes to flanged equipment.
                Quick installation without welding or threading, with reliable EPDM sealing.
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
                  src="/images/products/flange-adaptors/ss-flange-adapter-316.png"
                  alt="316 Stainless Steel Flange Adaptor"
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/pipe-couplings" className="hover:text-foreground transition-colors">Pipe Couplings</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">Flange Adaptors</span>
        </nav>
        {/* Key Features - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="flange-adaptors"
          subcategories={flangeSubcategories}
          title="Search by Type"
          hideEmpty={true}
          urlMap={{
            'flange-adaptor': '/flange-adaptors',
          }}
        />

        {/* All Products */}
        <div id="products" className="mb-6 scroll-mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Flange Adaptor Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {flangeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/bore-flex">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Bore-Flex Expansion Joints</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need a Custom Flange Adaptor?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We can supply flange adaptors in custom sizes and flange standards.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
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
