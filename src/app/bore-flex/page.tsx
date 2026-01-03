import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Award } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import SubcategoryTiles from "@/components/SubcategoryTiles"
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
  title: "Bore-Flex Rubber Expansion Joints | Single, Twin, Arch & Reducing | Dewater Products",
  description:
    "Bore-Flex rubber expansion joints for thermal expansion, vibration absorption, and pipe misalignment. Single sphere, twin sphere, arch and reducing types. EPDM rubber with zinc or 316SS flanges. PN16 rated. Australia-wide delivery.",
  openGraph: {
    title: "Bore-Flex Rubber Expansion Joints - Dewater Products",
    description: "Bore-Flex flexible rubber joints for pumps, HVAC, and industrial piping systems.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/bore-flex",
  },
}

export const revalidate = 60

export default async function BoreFlexPage() {
  const [expansionProducts, expansionSubcategories] = await Promise.all([
    getProductsByCategory("rubber-expansion-joints"),
    getSubcategoriesByCategory("rubber-expansion-joints"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Bore-Flex Expansion Joints", url: "https://dewaterproducts.com.au/bore-flex" },
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
              <Image
                src="/images/brands/bore-flex-rubber-logo.png"
                alt="Bore-Flex Rubber"
                width={200}
                height={67}
                className="w-48 h-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Premium Rubber Expansion Joints
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Bore-Flex Expansion Joints
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Designed to reduce pipeline stress, absorb vibration, and compensate for thermal movement.
                Available in EPDM, Neoprene, NBR, Viton, and Hypalon with multiple flange options.
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
                  src="/images/products/expansion-joints/fsf-single-sphere.jpg"
                  alt="Bore-Flex Single Sphere Expansion Joint"
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
          categorySlug="rubber-expansion-joints"
          subcategories={expansionSubcategories}
          title="Search by Type"
          basePath="/bore-flex"
        />

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Bore-Flex Expansion Joints</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {expansionProducts.map((product) => (
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

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right expansion joint for your application, including custom flanges and movement requirements.
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
