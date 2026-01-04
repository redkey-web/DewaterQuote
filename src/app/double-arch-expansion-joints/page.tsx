import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
import ApplicationLinks from "@/components/ApplicationLinks"

const content = {
  title: "Double Arch Expansion Joints",
  metaDescription: "Double arch rubber expansion joints for maximum movement capability. Handles significant thermal expansion. Heavy-duty applications.",
  heroDescription: "Maximum movement capability for applications requiring significant thermal expansion compensation and vibration absorption.",
  longDescription: "Double arch expansion joints provide the highest movement capability. The dual arch design accommodates significant thermal expansion, angular misalignment, and lateral movement while maintaining pressure integrity.",
  features: ["Maximum axial movement", "High angular capability", "Significant lateral movement", "Long pipeline applications", "Thermal cycling resistance", "Heavy-duty construction"],
  applications: ["Long pipeline runs", "High-temperature systems", "Thermal power plants", "Large pump stations"],
}

export const metadata: Metadata = {
  title: `${content.title} | Dewater Products`,
  description: content.metaDescription,
  alternates: { canonical: "https://dewaterproducts.com.au/double-arch-expansion-joints" },
}

export const revalidate = 60

export default async function DoubleArchExpansionJointsPage() {
  const products = await getProductsBySubcategory("rubber-expansion-joints", "double-arch")
  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: content.title, url: "https://dewaterproducts.com.au/double-arch-expansion-joints" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">{products.length > 0 ? `${content.title} Products` : "Products Coming Soon"}</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">We&apos;re currently adding products.</p>
              <Link href="/expansion-joints" className="text-primary hover:underline font-medium">View all Expansion Joints →</Link>
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
