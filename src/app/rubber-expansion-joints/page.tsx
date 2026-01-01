import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
import type { Metadata } from "next"

const features = [
  "Size range from DN25 to DN3500",
  "Materials: EPDM, Neoprene, NBR, Viton, Hypalon, natural rubber",
  "Pressure ratings up to 25 BAR",
  "Vacuum ratings to 750 mm Hg",
  "Optional PTFE linings, vacuum rings, and control rods",
  "Flange options: zinc plated, galvanised, 304/316 stainless steel, epoxy-coated",
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

export const metadata: Metadata = {
  title: "Rubber Expansion Joints | Single, Twin, Arch & Reducing | Dewater Products",
  description:
    "Rubber expansion joints for thermal expansion, vibration absorption, and pipe misalignment. Single sphere, twin sphere, arch and reducing types. EPDM rubber with zinc or 316SS flanges. PN16 rated. Australia-wide delivery.",
  openGraph: {
    title: "Rubber Expansion Joints - Dewater Products",
    description: "Flexible rubber joints for pumps, HVAC, and industrial piping systems.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/rubber-expansion-joints",
  },
}

export const revalidate = 60

export default async function ExpansionJointsPage() {
  const [expansionProducts, expansionSubcategories] = await Promise.all([
    getProductsByCategory("rubber-expansion-joints"),
    getSubcategoriesByCategory("rubber-expansion-joints"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Rubber Expansion Joints", url: "https://dewater-products.vercel.app/rubber-expansion-joints" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Rubber Expansion Joints</h1>
          <p className="text-muted-foreground max-w-3xl">
            Designed to reduce pipeline stress, absorb vibration, and compensate for thermal movement,
            rubber expansion joints are a critical part of many industrial and infrastructure piping systems.
          </p>
        </div>

        {/* Subcategory Links */}
        {expansionSubcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Type</h2>
            <div className="flex flex-wrap gap-3">
              {expansionSubcategories.map((subcat, index) => (
                <Link key={subcat.slug} href={`/rubber-expansion-joints/${subcat.slug}`}>
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
          <h2 className="text-2xl font-semibold mb-4">All Expansion Joint Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expansionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Features & Applications */}
        <div className="mt-12 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
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
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right expansion joint for your application, including custom flanges and movement requirements.
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
