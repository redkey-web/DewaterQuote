import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"

// Subcategory slug → database subcategory slug mapping
const subcategoryDbMap: Record<string, string> = {
  "y-strainers": "y-strainer",
  "basket-strainers": "simplex-basket-strainer",
  "duplex-strainers": "duplex-basket-strainer",
  "suction-strainers": "flanged-suction-strainer",
}

// SEO content for strainer subcategories
const subcategoryContent: Record<string, {
  title: string
  metaDescription: string
  heroDescription: string
  longDescription: string
  features: string[]
  applications: string[]
  keywords?: string[]
}> = {
  "y-strainers": {
    title: "Y Strainers",
    metaDescription: "Y strainer filter in 316 stainless steel and cast iron. Inline strainer for pump protection, line strainer applications. Y strainers Australia-wide delivery.",
    heroDescription: "Compact Y strainer filter for continuous inline pipeline filtration. Protects pumps, valves, and equipment from debris with efficient strainer filter design.",
    longDescription: "Y strainers provide economical inline strainer filtration where debris levels are low. The Y-shaped body allows horizontal or vertical installation as a line strainer. 316SS strainer filter for corrosive fluids, cast iron for general water service. Our y strainer range includes multiple sizes and pressure ratings.",
    features: ["Compact Y strainer design", "Horizontal or vertical inline strainer install", "316SS or cast iron construction", "Removable SS mesh strainer filter screen", "1mm mesh standard", "ANSI 150LB / PN16 flanged"],
    applications: ["Pre-pump protection", "Process water line strainer", "Chemical plants", "HVAC inline strainer systems"],
    keywords: [
      "y strainer",
      "y strainer filter",
      "y strainers",
      "y-strainer",
      "inline strainer",
      "line strainer",
      "strainer filter",
      "pipeline strainer",
      "316 stainless steel strainer",
    ],
  },
  "basket-strainers": {
    title: "Basket Strainers",
    metaDescription: "Basket strainer in stainless steel strainer basket design. Simplex and duplex basket strainers with 316SS construction. Higher flow rates, easy basket removal. Australia-wide.",
    heroDescription: "Single and duplex basket strainer with stainless steel strainer basket for larger filtration area than Y strainers. Easy basket removal for frequent cleaning.",
    longDescription: "Basket strainers offer higher flow rates and easier maintenance than Y strainers, making them ideal for applications requiring frequent cleaning. Our stainless steel strainer basket design provides more filtration area with less pressure drop. 316SS basket strainer construction ensures corrosion resistance.",
    features: ["Larger filtration area", "Stainless steel strainer basket", "Easy top-access basket removal", "Lower pressure drop than Y strainers", "316 stainless steel construction", "Quick-open cover option", "Multiple mesh sizes available"],
    applications: ["High-flow applications", "Process water filtration", "Food & beverage", "Pharmaceuticals", "Chemical processing"],
    keywords: [
      "basket strainer",
      "stainless steel strainer basket",
      "316 stainless steel basket strainer",
      "simplex basket strainer",
      "duplex basket strainer",
      "industrial basket strainer",
      "pipeline basket strainer",
    ],
  },
  "duplex-strainers": {
    title: "Duplex Basket Strainers",
    metaDescription: "Duplex basket strainers for continuous flow applications. Switch between baskets without stopping flow. 316 stainless steel construction.",
    heroDescription: "Dual-basket strainers allowing continuous operation. Clean one basket while the other remains in service.",
    longDescription: "Duplex basket strainers feature two parallel filter chambers with a diverter valve, allowing one basket to be cleaned or replaced while the other continues filtering. Essential for continuous process applications where system shutdown is not an option.",
    features: ["Continuous filtration capability", "No system shutdown for cleaning", "Easy basket switchover", "316 stainless steel", "High flow capacity", "Multiple basket mesh options"],
    applications: ["Continuous process lines", "Critical systems", "Water treatment", "Chemical processing", "Food & beverage"],
  },
  "suction-strainers": {
    title: "Flanged Suction Strainers",
    metaDescription: "Flanged suction strainers and filter strainer for hydraulic pump suction strainer applications. Inline filter strainer installation with flanged connections. 316SS mesh.",
    heroDescription: "Inline suction filter strainer with flanged connections for easy installation on pump suction lines. Ideal hydraulic pump suction strainer solution.",
    longDescription: "Flanged suction strainers are installed on pump suction lines as a filter strainer to protect pumps from debris and particles. Our hydraulic pump suction strainer range features flanged connections for easy integration into existing pipework. The filter strainer basket can be removed for cleaning without disconnecting the unit.",
    features: ["Flanged connections", "Hydraulic pump suction strainer protection", "Easy inline filter strainer installation", "316 stainless steel mesh", "Removable basket", "Low pressure drop design"],
    applications: ["Hydraulic pump suction strainer", "Pump suction lines", "Water supply filter strainer", "Industrial processing", "Irrigation systems"],
    keywords: [
      "flanged suction strainer",
      "filter strainer",
      "hydraulic pump suction strainer",
      "pump suction strainer",
      "suction line strainer",
      "inline filter strainer",
    ],
  },
}

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string
  }>
}

// Generate static params for strainer subcategories
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

  const metadata: Metadata = {
    title: content.keywords
      ? `${content.title} | ${content.keywords[0]} | Dewater Products`
      : `${content.title} | Dewater Products`,
    description: content.metaDescription,
    openGraph: {
      title: `${content.title} - Dewater Products`,
      description: content.metaDescription,
      type: "website",
      url: `https://dewaterproducts.com.au/strainers/${subcategory}`,
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/strainers/${subcategory}`,
    },
  }

  if (content.keywords) {
    metadata.keywords = content.keywords
  }

  return metadata
}

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function StrainerSubcategoryPage({ params }: SubcategoryPageProps) {
  const { subcategory } = await params
  const content = subcategoryContent[subcategory]

  if (!content) {
    notFound()
  }

  const dbSubcategory = subcategoryDbMap[subcategory] || subcategory
  const products = await getProductsBySubcategory("strainers", dbSubcategory)

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Strainers", url: "https://dewaterproducts.com.au/strainers" },
    { name: content.title, url: `https://dewaterproducts.com.au/strainers/${subcategory}` },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900 gradient-top-dark">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/strainers" className="hover:text-foreground transition-colors">Strainers</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
          <p className="text-sm text-muted-foreground mt-2">
            <Link href="/strainers" className="text-primary hover:underline font-medium">View all Strainers →</Link>
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-10">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">We&apos;re currently adding products.</p>
              <Link href="/strainers" className="text-primary hover:underline font-medium">View all Strainers →</Link>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">About {content.title}</h2>
          <p className="text-muted-foreground mb-6">{content.longDescription}</p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Applications</h3>
            <ApplicationLinks applications={content.applications} />
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {content.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Strainer?</h2>
          <p className="text-muted-foreground mb-6">
            Call <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
              Contact Us
            </Link>
            <Link href="/request-quote" className="px-6 py-3 bg-card border rounded-md font-medium hover:bg-accent">
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
