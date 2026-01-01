import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Flange Adaptors</h1>
          <p className="text-muted-foreground">
            316 stainless steel adaptors for connecting plain-ended pipes to flanged equipment.
          </p>
        </div>

        {/* Subcategory Links */}
        {flangeSubcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Type</h2>
            <div className="flex flex-wrap gap-3">
              {flangeSubcategories.map((subcat, index) => (
                <Link key={subcat.slug} href={`/flange-adaptors/${subcat.slug}`}>
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
          <h2 className="text-2xl font-semibold mb-4">All Flange Adaptor Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {flangeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Related Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/rubber-expansion-joints">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Rubber Expansion Joints</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
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
