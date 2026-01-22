import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, CheckCircle } from "lucide-react"
import type { Metadata } from "next"
import {
  getSubcategoryBySlug,
  getProductsBySubcategory,
} from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"

// SEO content for expansion joint subcategories
const subcategoryContent: Record<string, {
  title: string
  metaDescription: string
  heroDescription: string
  longDescription: string
  features?: string[]
  applications?: string[]
}> = {
  "single-sphere": {
    title: "Single Sphere Rubber Expansion Joints",
    metaDescription: "Single sphere rubber expansion joints. EPDM rubber with zinc or 316SS flanges. Absorbs vibration and thermal expansion. PN16 rated. Australia-wide delivery.",
    heroDescription: "Flexible rubber joints for absorbing thermal expansion, vibration, and pipe misalignment. Single sphere design for standard movement requirements.",
    longDescription: "Single sphere rubber expansion joints provide flexible connections that absorb thermal expansion, reduce vibration transmission, and accommodate pipe misalignment. EPDM rubber construction with nylon reinforcement. Available with zinc-plated steel or 316 stainless steel flanges.",
    features: [
      "Absorbs thermal expansion",
      "Reduces vibration transmission",
      "EPDM rubber construction",
      "Nylon fabric reinforcement",
      "Zinc or 316SS flanges available",
      "PN16 pressure rating"
    ],
    applications: ["Pump connections", "HVAC systems", "Chiller plants", "Water treatment"],
  },
  "twin-sphere": {
    title: "Twin Sphere Rubber Expansion Joints",
    metaDescription: "Twin sphere rubber expansion joints for greater movement absorption. EPDM rubber with zinc or 316SS flanges. Ideal for high-vibration applications. PN16 rated.",
    heroDescription: "Double sphere design for increased axial movement and superior vibration absorption. Ideal for high-vibration pump connections.",
    longDescription: "Twin sphere expansion joints provide greater flexibility and movement absorption than single sphere designs. The dual arch configuration allows for higher axial compression and extension, making them ideal for pump connections and high-vibration equipment.",
    features: [
      "Greater axial movement than single sphere",
      "Superior vibration absorption",
      "EPDM rubber construction",
      "Double arch flexibility",
      "Zinc or 316SS flanges available",
      "PN16 pressure rating"
    ],
    applications: ["High-vibration pumps", "Compressor connections", "Marine applications", "Industrial piping"],
  },
  "single-arch": {
    title: "Single Arch Rubber Expansion Joints",
    metaDescription: "Single arch rubber expansion joints for controlled lateral movement. Higher pressure ratings. EPDM rubber with reinforced flanges. Industrial piping systems.",
    heroDescription: "Higher pressure rated expansion joints with controlled lateral and angular movement. Suited for industrial piping systems.",
    longDescription: "Single arch expansion joints feature a wider arch profile providing higher pressure ratings and controlled movement characteristics. The reinforced construction handles demanding industrial applications while providing vibration isolation and thermal expansion compensation.",
    features: [
      "Higher pressure ratings",
      "Controlled lateral movement",
      "Angular movement capability",
      "Reinforced construction",
      "Industrial grade EPDM",
      "Multiple flange options"
    ],
    applications: ["Industrial piping", "Power generation", "Chemical plants", "Mining operations"],
  },
  "double-arch": {
    title: "Double Arch Rubber Expansion Joints",
    metaDescription: "Double arch rubber expansion joints for maximum movement capability. Handles significant thermal expansion. EPDM with 316SS flanges for demanding applications.",
    heroDescription: "Maximum movement capability for applications requiring significant thermal expansion compensation and vibration absorption.",
    longDescription: "Double arch expansion joints provide the highest movement capability in the range. The dual arch design accommodates significant thermal expansion, angular misalignment, and lateral movement while maintaining pressure integrity. Ideal for long pipeline runs and equipment with high thermal cycling.",
    features: [
      "Maximum axial movement",
      "High angular capability",
      "Significant lateral movement",
      "Long pipeline applications",
      "Thermal cycling resistance",
      "Heavy-duty construction"
    ],
    applications: ["Long pipeline runs", "High-temperature systems", "Thermal power plants", "Large pump stations"],
  },
  "reducing": {
    title: "Reducing Rubber Expansion Joints",
    metaDescription: "Reducing rubber expansion joints for connecting different pipe sizes. EPDM rubber construction. Absorbs vibration while reducing pipe diameter. Various size combinations.",
    heroDescription: "Connects different pipe sizes while absorbing vibration and movement. Available in various size combinations.",
    longDescription: "Reducing expansion joints combine the benefits of flexible joints with pipe size reduction. They connect pumps, valves, and equipment with different inlet and outlet sizes while providing vibration isolation and thermal expansion compensation. Custom size combinations available.",
    features: [
      "Connects different pipe sizes",
      "Vibration absorption",
      "Thermal expansion compensation",
      "Custom sizes available",
      "EPDM rubber construction",
      "Multiple flange standards"
    ],
    applications: ["Pump connections", "Reducer transitions", "Equipment connections", "System modifications"],
  },
}

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string
  }>
}

// Generate static params for expansion joint subcategories
export async function generateStaticParams() {
  return Object.keys(subcategoryContent).map((slug) => ({
    subcategory: slug,
  }))
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = await params
  const content = subcategoryContent[subcategory]

  if (!content) {
    return { title: "Not Found" }
  }

  return {
    title: `${content.title} | Dewater Products`,
    description: content.metaDescription,
    openGraph: {
      title: `${content.title} - Dewater Products`,
      description: content.metaDescription,
      type: "website",
      url: `https://dewaterproducts.com.au/expansion-joints/${subcategory}`,
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/expansion-joints/${subcategory}`,
    },
  }
}

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function ExpansionJointSubcategoryPage({ params }: SubcategoryPageProps) {
  const { subcategory } = await params
  const content = subcategoryContent[subcategory]

  if (!content) {
    notFound()
  }

  // Get subcategory data and products from the rubber-expansion-joints category
  const subcategoryData = await getSubcategoryBySlug(subcategory)
  const products = await getProductsBySubcategory("rubber-expansion-joints", subcategory)

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Expansion Joints", url: "https://dewaterproducts.com.au/expansion-joints" },
    { name: content.title, url: `https://dewaterproducts.com.au/expansion-joints/${subcategory}` },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      {/* Dark grey strip under header/ticker */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-500 h-12" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/expansion-joints" className="hover:text-foreground transition-colors">
            Expansion Joints
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
        </div>

        {/* Products Section */}
        <div className="mb-10">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">
                We're currently adding products to this category.
              </p>
              <Link
                href="/expansion-joints"
                className="text-primary hover:underline font-medium"
              >
                View all Expansion Joints →
              </Link>
            </div>
          )}
        </div>

        {/* Description & Features */}
        <div className="mb-10">
          <div className="mb-6 prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-3">About {content.title}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{content.longDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.features && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <div className="space-y-3">
                  {content.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.applications && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Applications</h3>
                <div className="space-y-3">
                  {content.applications.map((app) => (
                    <div key={app} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right expansion joint for your application.
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
