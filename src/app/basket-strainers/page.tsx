import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"

const content = {
  title: "Basket Strainers",
  metaDescription: "Basket strainer in stainless steel strainer basket design. Simplex and duplex basket strainers with 316SS construction. Higher flow rates, easy basket removal. Australia-wide.",
  heroDescription: "Single and duplex basket strainer with stainless steel strainer basket for larger filtration area than Y strainers. Easy basket removal for frequent cleaning.",
  longDescription: "Basket strainers offer higher flow rates and easier maintenance than Y strainers, making them ideal for applications requiring frequent cleaning. Our stainless steel strainer basket design provides more filtration area with less pressure drop. 316SS basket strainer construction ensures corrosion resistance.",
  features: ["Larger filtration area", "Stainless steel strainer basket", "Easy top-access basket removal", "Lower pressure drop than Y strainers", "316 stainless steel construction", "Quick-open cover option", "Multiple mesh sizes available"],
  applications: ["High-flow applications", "Process water filtration", "Food & beverage", "Pharmaceuticals", "Chemical processing"],
}

export const metadata: Metadata = {
  title: "Basket Strainer | Stainless Steel Strainer Basket | Australia",
  description: content.metaDescription,
  keywords: [
    "basket strainer",
    "stainless steel strainer basket",
    "316 stainless steel basket strainer",
    "simplex basket strainer",
    "duplex basket strainer",
    "industrial basket strainer",
    "pipeline basket strainer",
  ],
  alternates: { canonical: "https://dewaterproducts.com.au/basket-strainers" },
}

export const revalidate = 60

export default async function BasketStrainersPage() {
  const products = await getProductsBySubcategory("strainers", "simplex-basket-strainer")
  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Strainers", url: "https://dewaterproducts.com.au/strainers" },
    { name: content.title, url: "https://dewaterproducts.com.au/basket-strainers" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/strainers" className="hover:text-foreground transition-colors">Strainers</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
        </div>
        <div className="mb-10">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">We&apos;re currently adding products.</p>
              <Link href="/strainers" className="text-primary hover:underline font-medium">View all Strainers →</Link>
            </div>
          )}
        </div>
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
              {content.features.map((f, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary">✓</span><span className="text-muted-foreground">{f}</span></li>)}
            </ul>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help?</h2>
          <p className="text-muted-foreground mb-6">Call <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">Contact Us</Link>
            <Link href="/request-quote" className="px-6 py-3 bg-card border rounded-md font-medium hover:bg-accent">Request Quote</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
