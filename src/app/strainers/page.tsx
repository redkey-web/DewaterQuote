import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Filter } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
import SubcategoryTiles from "@/components/SubcategoryTiles"
import type { Metadata } from "next"

const strainerTypes = [
  { name: "Y Strainer", url: "/y-strainers", description: "Compact design suitable for horizontal or vertical installation with moderate pressure loss and manual maintenance access." },
  { name: "Simplex Basket Strainer", url: "/basket-strainers", description: "Horizontal unit featuring top-opening basket access, medium-to-high debris capacity, and low pressure loss for general inline filtration." },
  { name: "Duplex Basket Strainer", url: "/basket-strainers", description: "Dual-basket system allowing continuous flow during maintenance without downtime, ideal for systems requiring uninterrupted operation." },
  { name: "Flanged Suction Strainer", url: "/basket-strainers", description: "Installed at pump suction end to prevent large debris entering the system. 316SS construction with large size range up to DN900." },
]

const applications = [
  "Process water filtration",
  "Pump and valve protection",
  "Cooling systems",
  "Industrial wastewater",
  "Fire protection systems",
  "Chemical manufacturing processes",
]

const selectionFactors = [
  "Flow rate capacity requirements",
  "Debris accumulation patterns",
  "Installation space constraints",
  "Cleaning frequency needs",
  "Material compatibility (316SS, cast steel, ductile iron)",
]

export const metadata: Metadata = {
  title: "Strainers | Y Strainers & Basket Strainers | Dewater Products",
  description:
    "Industrial pipeline strainers in 316 stainless steel and cast iron. Y strainers, simplex basket strainers, and duplex strainers. Protect pumps and equipment. Australia-wide delivery.",
  openGraph: {
    title: "Pipeline Strainers - Dewater Products",
    description: "Y strainers and basket strainers for pipeline filtration and equipment protection.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/strainers",
  },
}

export const revalidate = 60

export default async function StrainersPage() {
  const [strainerProducts, strainerSubcategories] = await Promise.all([
    getProductsByCategory("strainers"),
    getSubcategoriesByCategory("strainers"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Strainers", url: "https://dewater-products.vercel.app/strainers" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-transparent dark:from-green-950/30 dark:via-green-900/10 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                <Filter className="w-4 h-4" />
                Pipeline Filtration
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Pipeline Strainers
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Industrial strainers to protect pumps, valves, and equipment from debris.
                Y strainers and basket strainers in 316 stainless steel and cast iron.
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
                  src="/images/products/strainers/y-strainer-316ss.jpg"
                  alt="316 Stainless Steel Y Strainer"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Strainer Types - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Strainer Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {strainerTypes.map((type) => (
              <Link key={type.name} href={type.url} className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="strainers"
          subcategories={strainerSubcategories}
          title="Search by Type"
          hideEmpty={true}
          urlMap={{
            'y-strainer': '/y-strainers',
            'simplex-basket-strainer': '/basket-strainers',
            'duplex-basket-strainer': '/basket-strainers',
            'flanged-suction-strainer': '/basket-strainers',
          }}
        />

        {/* All Products */}
        <div id="products" className="mb-6 scroll-mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Strainer Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {strainerProducts.map((product) => (
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
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Strainer?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you find the right strainer for your application, including custom mesh sizes.
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
