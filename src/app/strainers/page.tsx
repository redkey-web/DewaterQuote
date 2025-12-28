import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Pipeline Strainers</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Industrial strainers and filters to protect pumps, valves, and downstream equipment from debris. Our range includes Y strainers for compact installations and basket strainers for high-flow applications requiring frequent cleaning.
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

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Strainer?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you find the right strainer for your application, including custom mesh sizes.
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
