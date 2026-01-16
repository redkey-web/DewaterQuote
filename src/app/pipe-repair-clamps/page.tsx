import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wrench, AlertTriangle, Clock, Shield } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Repair Clamps | Emergency & Permanent Repairs | Dewater Products",
  description:
    "Pipe repair clamps in 316 stainless steel for emergency and permanent leak repairs. Orbit repair clamps. WRAS approved EPDM seals. 55mm to 300mm widths. Australia-wide delivery.",
  openGraph: {
    title: "Pipe Repair Clamps - Dewater Products",
    description: "Stainless steel pipe repair clamps for leak sealing and crack repairs.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/pipe-repair-clamps",
  },
}

export const revalidate = 60

const repairBenefits = [
  {
    icon: Clock,
    title: "Fast Installation",
    description: "No welding, no prep, no special tools. Only a torque wrench required to install.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Ready",
    description: "Safely and reliably seal damaged pipes. Stock on hand for emergency repairs.",
  },
  {
    icon: Shield,
    title: "Permanent Solution",
    description: "Not just a band-aid fix. Properly installed repairs last the lifetime of the pipe.",
  },
  {
    icon: Wrench,
    title: "All Pipe Materials",
    description: "Works on steel, cast iron, ductile iron, fibre cement, and plastic pipes.",
  },
]

export default async function PipeRepairClampsPage() {
  const [repairProducts, repairSubcategories] = await Promise.all([
    getProductsByCategory("pipe-repair-clamps"),
    getSubcategoriesByCategory("pipe-repair-clamps"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Pipe Repair Clamps", url: "https://dewaterproducts.com.au/pipe-repair-clamps" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      {/* Hero Section - extends under header */}
      <div className="relative overflow-hidden border-b -mt-[88px] pt-[88px]">
        {/* Animated blob background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark base for white text, lighter at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-400" />
          {/* Blob 1 - Cyan brand color (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#39C5DA' }}
          />
          {/* Blob 2 - Teal accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#2DD4BF' }}
          />
          {/* Blob 3 - Dark navy (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#0f172a' }}
          />
          {/* Blob 4 - Dark slate (center-left, behind text) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#1e293b' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39C5DA] text-white text-sm font-medium mb-4">
                <AlertTriangle className="w-4 h-4" />
                Emergency & Permanent Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Pipe Repair Clamps
              </h1>
              <p className="text-xl text-white/80 mb-6 max-w-2xl">
                Repair clamps designed to safely and reliably seal damaged pipes made from steel, cast iron, ductile iron, and plastic. No welding, no prep - just fast, permanent repairs.
              </p>
              <a
                href="tel:1300271290"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors border border-red-600"
              >
                Emergency: 1300 271 290
              </a>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/orbit/orbit-pipe-repair-clamp-series-1-and-55mm-long-uKfRTbBbeKCFx1u9Gr8kiFP9gm0U3p.png"
                  alt="Orbit Pipe Repair Clamp 55mm"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-stone-300 dark:bg-stone-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {repairBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-lg bg-white dark:bg-stone-900 shadow-sm"
              >
                <benefit.icon className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">

        {/* Subcategory Links */}
        {repairSubcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Brand</h2>
            <div className="flex flex-wrap gap-3">
              {repairSubcategories.map((subcat, index) => (
                <Link key={subcat.slug} href={`/pipe-repair-clamps/${subcat.slug}`}>
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
          </div>
        </div>

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Pipe Repair Clamps</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {repairProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Emergency Repair Required?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our pipe repair clamps provide fast, reliable repairs without pipe removal.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> for urgent assistance or request a quote.
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
