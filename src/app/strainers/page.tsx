import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

const strainerTypes = [
  { name: "Y Strainer", description: "Compact design suitable for horizontal or vertical installation with moderate pressure loss and manual maintenance access." },
  { name: "Simplex Basket Strainer", description: "Horizontal unit featuring top-opening basket access, medium-to-high debris capacity, and low pressure loss for general inline filtration." },
  { name: "Duplex Basket Strainer", description: "Dual-basket system allowing continuous flow during maintenance without downtime, ideal for systems requiring uninterrupted operation." },
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Pipeline Strainers</h1>
          <p className="text-muted-foreground">
            Industrial strainers to protect pumps, valves, and equipment from debris.
          </p>
        </div>

        {/* Subcategory Links */}
        {strainerSubcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Type</h2>
            <div className="flex flex-wrap gap-3">
              {strainerSubcategories.map((subcat, index) => (
                <Link key={subcat.slug} href={`/strainers/${subcat.slug}`}>
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer"
                    data-testid={`link-subcategory-${index}`}
                  >
                    <span className="font-medium">{subcat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Strainer Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {strainerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Strainer Types */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-bold mb-6">Strainer Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strainerTypes.map((type) => (
              <div key={type.name} className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
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
