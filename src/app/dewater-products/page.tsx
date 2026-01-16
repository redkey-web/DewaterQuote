/**
 * DRAFT PAGE - Not linked in public navigation
 * Visible only via direct URL: /dewater-products
 */

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Package, Truck, ShieldCheck, HeadphonesIcon } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dewater Products | Industrial Pipe Fittings | Australia",
  description:
    "Quality industrial pipe fittings, valves, strainers, and expansion joints. Australian-owned business with Australia-wide delivery. Competitive pricing on all products.",
  robots: "noindex, nofollow", // DRAFT: Don't index until ready
  openGraph: {
    title: "Dewater Products | Industrial Pipe Fittings",
    description: "Quality industrial pipe fittings with Australia-wide delivery.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/dewater-products",
  },
}

export const revalidate = 60

const brandFeatures = [
  {
    icon: Package,
    title: "Quality Products",
    description: "Sourced from trusted manufacturers with rigorous quality standards.",
  },
  {
    icon: Truck,
    title: "Australia-Wide Delivery",
    description: "Fast shipping from our Perth warehouse to anywhere in Australia.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Backed",
    description: "All products backed by manufacturer warranty and our satisfaction guarantee.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Technical advice from experienced pipe fitting specialists.",
  },
]

const productCategories = [
  { name: "Pipe Couplings", href: "/pipe-couplings" },
  { name: "Industrial Valves", href: "/industrial-valves" },
  { name: "Strainers", href: "/strainers" },
  { name: "Expansion Joints", href: "/expansion-joints" },
  { name: "Flange Adaptors", href: "/flange-adaptors" },
]

export default async function DewaterProductsPage() {
  const dewaterProducts = await getProductsByBrand("Dewater Products")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Dewater Products", url: "https://dewaterproducts.com.au/dewater-products" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Draft Banner */}
      <div className="bg-amber-500 text-black text-center py-2 text-sm font-medium">
        ⚠️ DRAFT PAGE - Not published. Visible in admin only.
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Animated blob background - Teal brand color */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-400" />
          {/* Blob 1 - Teal brand color (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#39C5DA' }}
          />
          {/* Blob 2 - Cyan accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#2DD4BF' }}
          />
          {/* Blob 3 - Dark navy (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#0f172a' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39C5DA] text-white text-sm font-medium mb-4">
                <Package className="w-4 h-4" />
                Australian Owned
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Dewater Products
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Quality industrial pipe fittings, valves, and accessories at competitive prices.
                Australia-wide delivery from our Perth warehouse.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                {/* Placeholder for logo/image */}
                <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/60 text-6xl font-bold">DW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Dewater Products?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Product Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center justify-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center font-medium"
              >
                {category.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Products (if any) */}
        {dewaterProducts.length > 0 && (
          <div id="products" className="mb-12 scroll-mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Dewater Products Range</h2>
              <span className="text-muted-foreground">{dewaterProducts.length} products</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dewaterProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* No Products Notice */}
        {dewaterProducts.length === 0 && (
          <div className="mb-12 p-8 rounded-lg bg-muted/50 border border-border text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Products Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently adding Dewater Products branded items to our range.
              Browse our other brands in the meantime.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Finding Products?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team can help you find the right pipe fittings for your application.
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
