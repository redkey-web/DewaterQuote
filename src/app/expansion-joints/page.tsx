import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
import SubcategoryTiles from "@/components/SubcategoryTiles"
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
  title: "Rubber Expansion Joints | Single Sphere, Twin Sphere, Arch | Dewater Products",
  description:
    "Rubber expansion joints for thermal expansion, vibration absorption, and pipe misalignment. Single sphere, twin sphere, arch and reducing types. EPDM rubber with zinc or 316SS flanges. PN16 rated. Australia-wide delivery.",
  openGraph: {
    title: "Rubber Expansion Joints - Dewater Products",
    description: "Rubber expansion joints for pumps, HVAC, and industrial piping systems.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/expansion-joints",
  },
}

export const revalidate = 60

export default async function ExpansionJointsPage() {
  const [expansionProducts, expansionSubcategories] = await Promise.all([
    getProductsByCategory("rubber-expansion-joints"),
    getSubcategoriesByCategory("rubber-expansion-joints"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Expansion Joints", url: "https://dewaterproducts.com.au/expansion-joints" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Rubber Expansion Joints</h1>
          <p className="text-muted-foreground">
            Designed to reduce pipeline stress, absorb vibration, and compensate for thermal movement.
          </p>
        </div>

        {/* Joint Types - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Expansion Joint Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {jointTypes.map((type) => (
              <Link key={type.name} href={type.url} className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="rubber-expansion-joints"
          subcategories={expansionSubcategories}
          title="Search by Type"
          basePath="/expansion-joints"
        />

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Expansion Joint Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
