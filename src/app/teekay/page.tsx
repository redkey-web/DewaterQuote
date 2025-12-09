import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Droplets, Shield, Waves, Zap } from "lucide-react"
import { products } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teekay Products Australia | Duckbill Check Valves & Expansion Joints | Dewater Products",
  description:
    "Teekay duckbill check valves and rubber expansion joints for stormwater, wastewater, and industrial applications. EPDM, Neoprene, Viton options. Australia-wide delivery.",
  keywords: [
    "Teekay",
    "duckbill check valve",
    "Teekay duckbill",
    "rubber check valve",
    "stormwater check valve",
    "outfall valve",
    "Teekay Australia",
    "rubber expansion joints",
  ],
  openGraph: {
    title: "Teekay Duckbill Check Valves & Expansion Joints | Dewater Products",
    description:
      "Teekay rubber duckbill check valves for stormwater and wastewater outfalls. Authorised Australian distributor.",
    type: "website",
    images: [
      {
        url: "/images/brands/teekay-og.jpg",
        width: 1200,
        height: 630,
        alt: "Teekay Duckbill Check Valves",
      },
    ],
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/teekay",
  },
}

const teekayFeatures = [
  {
    icon: Droplets,
    title: "Backflow Prevention",
    description: "Duckbill design opens with minimal head pressure and seals automatically against backflow.",
  },
  {
    icon: Shield,
    title: "Multiple Rubber Options",
    description: "Available in EPDM, Neoprene, NBR, and Viton for various chemical and temperature requirements.",
  },
  {
    icon: Waves,
    title: "Stormwater Specialist",
    description: "Ideal for outfalls, tide gates, and stormwater systems where debris and marine growth occur.",
  },
  {
    icon: Zap,
    title: "Zero Maintenance",
    description: "No moving parts or hinges - the flexible rubber design requires no maintenance.",
  },
]

const teekayApplications = [
  "Stormwater outfalls - Prevent tidal or flood backflow",
  "Wastewater discharge - Reliable non-return function",
  "Marine outfalls - Resist marine growth and debris",
  "Pump stations - Prevent siphoning when pumps stop",
  "Industrial discharge - Chemical-resistant options available",
  "Irrigation systems - Prevent contamination from backflow",
]

const faqs = [
  {
    question: "How does a duckbill check valve work?",
    answer:
      "A duckbill check valve has a flexible rubber body that opens when forward flow pressure is applied (as little as 25mm water head). When flow stops or reverses, the rubber naturally closes and seals, preventing backflow. There are no mechanical parts to fail.",
  },
  {
    question: "What rubber material should I choose?",
    answer:
      "EPDM is best for potable water and general applications. Neoprene offers good chemical and ozone resistance. NBR is suitable for oils and hydrocarbons. Viton provides the best chemical resistance for aggressive fluids.",
  },
  {
    question: "Can duckbill valves handle solids?",
    answer:
      "Yes, the flexible rubber design can pass solids and debris that would jam mechanical check valves. The curved bill design is self-cleaning and handles fibrous materials well.",
  },
  {
    question: "How do I size a duckbill check valve?",
    answer:
      "Duckbill valves are sized by pipe OD (outside diameter), not nominal bore. Measure your pipe OD accurately and select the matching size. The valve slips over the pipe end and is secured with a stainless steel clamp.",
  },
]

export default function TeekayPage() {
  // Filter products by Teekay brand
  const teekayProductsList = products.filter((p) =>
    p.brand.toLowerCase().includes("teekay")
  )

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Teekay Products", url: "https://dewater-products.vercel.app/teekay" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/10 border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-4">
                <Waves className="w-4 h-4" />
                Stormwater & Wastewater Specialists
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Teekay Products
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Duckbill check valves and rubber expansion joints for reliable backflow prevention
                in stormwater, wastewater, and industrial applications. Zero-maintenance design
                with multiple rubber options.
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
            <div className="flex-shrink-0">
              <Image
                src="/images/brands/teekay-logo.png"
                alt="Teekay Logo"
                width={256}
                height={128}
                className="w-64 h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Choose Teekay Duckbill Valves?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teekayFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <feature.icon className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teekayApplications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duckbill Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Duckbill Check Valve Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">DB-1 Slip-On</h3>
              <p className="text-muted-foreground mb-4">
                Standard slip-on duckbill valve with flat bottom. Slides over plain pipe end
                and is secured with a 316SS clamp. Curved bill design for better sealing.
              </p>
              <div className="text-sm text-muted-foreground">
                Size range: 88.9mm to 1700mm OD
              </div>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Flanged Models</h3>
              <p className="text-muted-foreground mb-4">
                Flanged duckbill valves for bolted connections. Available in standard flange
                drillings to suit AS, ANSI, and other standards.
              </p>
              <div className="text-sm text-muted-foreground">
                Contact us for flanged options
              </div>
            </div>
          </div>
        </div>

        {/* Rubber Material Guide */}
        <div className="mb-16 p-6 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4">
            Rubber Material Selection Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">EPDM</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Potable water, general purpose, ozone resistant
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">Neoprene</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Chemical resistance, weathering, moderate oils
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">NBR (Nitrile)</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Oils, fuels, hydrocarbons
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">Viton</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Aggressive chemicals, high temperature
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Teekay Products</h2>
            <span className="text-muted-foreground">{teekayProductsList.length} products</span>
          </div>

          {teekayProductsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teekayProductsList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Contact us for Teekay product pricing and availability.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Pages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">All Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/rubber-expansion-joints">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Rubber Expansion Joints</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/strainers">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Strainers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help with Your Stormwater Project?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the right duckbill valve size and rubber material
            for your application. Call us on (08) 9271 2577 or request a quote.
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

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
