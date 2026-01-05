import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, Award, Wrench } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/JsonLd"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Straub Couplings & Repair Clamps Australia | GRIP & FLEX Pipe Couplings | Dewater Products",
  description:
    "Official Straub coupling distributor in Australia. Swiss-engineered GRIP and FLEX pipe couplings for joining, repair, and transition applications. 316 stainless steel. PN16 rated. Fast delivery Australia-wide.",
  keywords: [
    "Straub couplings",
    "Straub GRIP",
    "Straub FLEX",
    "Straub pipe couplings",
    "Straub repair clamps",
    "Straub Australia",
    "Straub distributor",
    "Swiss pipe couplings",
    "pipe repair couplings",
  ],
  openGraph: {
    title: "Straub Couplings & Repair Clamps - Official Australian Distributor | Dewater Products",
    description:
      "Swiss-engineered Straub GRIP and FLEX pipe couplings. Authorised distributor with fast Australia-wide delivery.",
    type: "website",
    images: [
      {
        url: "/images/brands/straub-og.jpg",
        width: 1200,
        height: 630,
        alt: "Straub Pipe Couplings",
      },
    ],
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/brand/straub-couplings",
  },
}

export const revalidate = 60

const straubFeatures = [
  {
    icon: Shield,
    title: "Swiss Engineering",
    description: "Precision-manufactured in Switzerland with over 50 years of pipe coupling innovation.",
  },
  {
    icon: Award,
    title: "Certified Quality",
    description: "ISO 9001 certified. WRAS approved for potable water. Fire-rated options available.",
  },
  {
    icon: Wrench,
    title: "Multi-Purpose Design",
    description: "Same coupling works for joining, repair, and transition applications - reducing stock requirements.",
  },
  {
    icon: CheckCircle,
    title: "Maintenance-Free",
    description: "No re-tightening required. Set-and-forget installation with 25+ year service life.",
  },
]

const straubApplications = [
  "Pipe joining - Connect pipes of same or different materials",
  "Pipe repair - Seal leaks and cracks without pipe replacement",
  "Transition couplings - Join different pipe ODs and materials",
  "Vibration absorption - Isolate equipment from pipe stress",
  "Process pipelines - Chemical and food-grade applications",
]

const faqs = [
  {
    question: "What is the difference between Straub GRIP and FLEX couplings?",
    answer:
      "Straub GRIP couplings provide axial restraint (grip the pipe) and are used where pipes may be subject to axial loads. Straub FLEX couplings allow axial movement and are used for vibration absorption and thermal expansion.",
  },
  {
    question: "Are Straub couplings approved for potable water?",
    answer:
      "Yes, Straub couplings with EPDM seals are WRAS approved for potable water applications. They meet AS/NZS 4020 requirements for products in contact with drinking water.",
  },
  {
    question: "Can Straub couplings be used for pipe repair?",
    answer:
      "Yes, Straub couplings are ideal for pipe repair. They can seal leaks, cracks, and damaged sections without cutting out the pipe - just clean the surface, slide on the coupling, and tighten.",
  },
  {
    question: "What pressure rating do Straub couplings have?",
    answer:
      "Standard Straub couplings are rated to PN16 (16 bar / 232 psi). Higher pressure ratings are available for specific applications.",
  },
]

export default async function StraubCouplingsRepairClampsPage() {
  // Get products by Straub brand from database
  const straubProducts = await getProductsByBrand("straub")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Straub Couplings & Repair Clamps", url: "https://dewaterproducts.com.au/brand/straub-couplings" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <OrganizationJsonLd />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/straub-logo.png"
                alt="Straub"
                width={160}
                height={80}
                className="w-40 h-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Authorised Australian Distributor
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Straub Couplings & Repair Clamps
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Swiss-engineered pipe couplings trusted worldwide for joining, repair, and transition applications.
                Over 50 years of innovation in maintenance-free pipe connection technology.
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
                  src="/images/products/straub/straub-combi-grip.png"
                  alt="Straub Combi-Grip Pipe Coupling"
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
          <h2 className="text-2xl font-bold mb-8">Why Choose Straub Couplings?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {straubFeatures.map((feature) => (
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

        {/* Applications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Straub Coupling Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {straubApplications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Straub Products</h2>
            <span className="text-muted-foreground">{straubProducts.length} products</span>
          </div>

          {straubProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {straubProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Straub products are available on request. Contact us for pricing and availability.
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

        {/* Equivalent Products Note */}
        <div className="mb-16 p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Looking for Straub Equivalents?
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            We also stock Orbit couplings which are compatible alternatives to Straub at competitive prices.
            Many products show their Straub equivalent on the product page.
          </p>
          <Link
            href="/orbit-couplings"
            className="inline-flex items-center text-blue-700 dark:text-blue-300 font-medium hover:underline"
          >
            View Orbit Couplings
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
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
            <Link href="/orbit-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Orbit Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Straub Coupling?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the correct Straub coupling for your application.
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
