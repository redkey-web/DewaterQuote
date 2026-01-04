import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, DollarSign, Package, Wrench } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orbit Couplings Australia | Pipe Couplings & Repair Clamps | Dewater Products",
  description:
    "Orbit pipe couplings and repair clamps - Australian industrial standard. Flex Grip, Metal Lock, and Open Flex couplings. 316 stainless steel. Straub-compatible. Fast delivery Australia-wide.",
  keywords: [
    "Orbit couplings",
    "Orbit pipe couplings",
    "Orbit repair clamps",
    "Orbit Flex Grip",
    "Orbit Metal Lock",
    "pipe couplings Australia",
    "Straub alternative",
    "Straub equivalent",
  ],
  openGraph: {
    title: "Orbit Couplings - Pipe Couplings & Repair Clamps | Dewater Products",
    description:
      "Australian industrial pipe couplings and repair clamps. Straub-compatible alternatives at competitive prices.",
    type: "website",
    images: [
      {
        url: "/images/brands/orbit-og.jpg",
        width: 1200,
        height: 630,
        alt: "Orbit Pipe Couplings",
      },
    ],
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/orbit",
  },
}

export const revalidate = 60

const orbitFeatures = [
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Australian-sourced industrial couplings at competitive prices without compromising quality.",
  },
  {
    icon: Shield,
    title: "316 Stainless Steel",
    description: "All couplings manufactured from marine-grade 316 stainless steel for corrosion resistance.",
  },
  {
    icon: Package,
    title: "Perth Stocked",
    description: "Extensive inventory in our Perth warehouse for fast dispatch across Australia.",
  },
  {
    icon: Wrench,
    title: "Straub Compatible",
    description: "Dimensions compatible with Straub couplings - interchange without modification.",
  },
]

const orbitProducts = [
  {
    name: "Flex Grip",
    description: "Flexible pipe couplings for joining plain-ended pipes with axial movement allowance.",
    types: ["Flex Grip S (Short)", "Flex Grip L (Long)"],
  },
  {
    name: "Metal Lock",
    description: "Axially restrained couplings with internal gripping teeth for secure connections.",
    types: ["Metal Lock S (Short)", "Metal Lock L (Long)"],
  },
  {
    name: "Open Flex",
    description: "Large diameter couplings for pipes from 300mm to 2000mm OD.",
    types: ["Open Flex 300-L", "Open Flex 400-L"],
  },
  {
    name: "Repair Clamps",
    description: "Wrap-around clamps for sealing leaks and cracks in damaged pipes.",
    types: ["55mm width", "100mm width", "150mm width", "200mm width", "300mm width"],
  },
]

const faqs = [
  {
    question: "Are Orbit couplings compatible with Straub?",
    answer:
      "Yes, Orbit couplings are dimensionally compatible with Straub couplings. They can be used interchangeably in most applications. Our product pages show the equivalent Straub model number.",
  },
  {
    question: "What is the difference between Flex Grip and Metal Lock couplings?",
    answer:
      "Flex Grip couplings allow axial movement and are used where thermal expansion or vibration absorption is needed. Metal Lock couplings have internal gripping teeth that provide axial restraint, used where pipes may be subject to thrust forces.",
  },
  {
    question: "What pressure are Orbit couplings rated to?",
    answer:
      "Standard Orbit couplings are rated to PN16 (16 bar). The exact pressure rating depends on the pipe size and coupling model - larger diameter couplings may have reduced pressure ratings.",
  },
  {
    question: "Can I use Orbit couplings for pipe repair?",
    answer:
      "Yes, Orbit couplings are excellent for pipe repair. Both the Flex Grip/Metal Lock couplings and dedicated Repair Clamps can be used to seal leaks and repair damaged pipe sections.",
  },
]

export default async function OrbitPage() {
  // Get products by Orbit brand from database
  const orbitProductsList = await getProductsByBrand("orbit")

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Orbit Couplings", url: "https://dewater-products.vercel.app/orbit" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-transparent dark:from-orange-950/30 dark:via-orange-900/10 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/orbit-couplings.png"
                alt="Orbit Couplings"
                width={180}
                height={60}
                className="w-44 h-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
                <Package className="w-4 h-4" />
                Perth Stocked - Fast Dispatch
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Orbit Couplings
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Australian industrial pipe couplings and repair clamps. Quality 316 stainless steel construction
                at competitive prices. Straub-compatible dimensions for easy specification.
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
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="/images/products/orbit/flex-grip-l.jpg"
                  alt="Orbit Flex Grip Pipe Coupling"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Choose Orbit Couplings?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orbitFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <feature.icon className="w-10 h-10 text-orange-600 dark:text-orange-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Range Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Orbit Product Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orbitProducts.map((product) => (
              <div key={product.name} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2">
                  {product.types.map((type) => (
                    <span key={type} className="px-2 py-1 bg-muted rounded text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Straub Equivalents Note */}
        <div className="mb-16 p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Straub Equivalent Reference
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Orbit couplings are dimensionally compatible with Straub. Each product page shows the
            equivalent Straub model for easy specification and replacement.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300">Flex Grip</span>
              <span className="text-blue-600 dark:text-blue-400"> = Straub FLEX</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Metal Lock</span>
              <span className="text-blue-600 dark:text-blue-400"> = Straub GRIP</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Open Flex</span>
              <span className="text-blue-600 dark:text-blue-400"> = Straub OPEN-FLEX</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Repair Clamp</span>
              <span className="text-blue-600 dark:text-blue-400"> = Straub REP</span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Orbit Products</h2>
            <span className="text-muted-foreground">{orbitProductsList.length} products</span>
          </div>

          {orbitProductsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orbitProductsList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Contact us for Orbit product pricing and availability.
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
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Related Pages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/straub">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Straub Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">All Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/pipe-repair">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Repair Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Coupling?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the correct Orbit coupling for your application.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
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
