import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rubber Expansion Joints | Single & Twin Sphere | Dewater Products",
  description:
    "Rubber expansion joints for thermal expansion, vibration absorption, and pipe misalignment. EPDM rubber with zinc or 316SS flanges. WRAS approved. PN16 rated. Australia-wide delivery.",
  openGraph: {
    title: "Rubber Expansion Joints - Dewater Products",
    description: "Flexible rubber joints for pumps, HVAC, and industrial piping systems.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/rubber-expansion-joints",
  },
}

export default function ExpansionJointsPage() {
  const expansionProducts = getProductsByCategory("rubber-expansion-joints")
  const expansionSubcategories = getSubcategoriesByCategory("rubber-expansion-joints")

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Rubber Expansion Joints", url: "https://dewater-products.vercel.app/rubber-expansion-joints" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Rubber Expansion Joints</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Flexible rubber expansion joints for absorbing thermal expansion, reducing vibration transmission, and accommodating pipe misalignment. Essential for pump connections, HVAC systems, and industrial piping where movement occurs.
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

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
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
