import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
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
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Flange Adaptors", url: "https://dewater-products.vercel.app/flange-adaptors" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title + Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Flange Adaptors</h1>
          <p className="text-muted-foreground max-w-3xl">
            316 stainless steel adaptors for connecting plain-ended pipes to flanged equipment.
            Quick installation without welding or threading, with reliable EPDM sealing.
          </p>
        </div>

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
          basePath="/flange-adaptors"
        />

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Flange Adaptor Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
