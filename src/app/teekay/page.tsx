import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Wrench, Shield, Settings, Zap } from "lucide-react"
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
  title: "Teekay Pipe Couplings Australia | Axilock, Axiflex & PRIMA Range | Dewater Products",
  description:
    "Teekay pipe couplings for joining, repairing and connecting pipes. Axilock, Axiflex, Plastlock and PRIMA range. Stainless steel and plastic options. Australia-wide delivery.",
  keywords: [
    "Teekay",
    "Teekay couplings",
    "Axilock coupling",
    "Axiflex coupling",
    "Plastlock",
    "pipe coupling",
    "pipe repair coupling",
    "Teekay Australia",
    "PRIMA-LOCK",
  ],
  openGraph: {
    title: "Teekay Pipe Couplings | Axilock, Axiflex & PRIMA Range | Dewater Products",
    description:
      "Teekay pipe couplings for joining, repairing and connecting pipes. Authorised Australian distributor.",
    type: "website",
    images: [
      {
        url: "/images/brands/teekay-og.jpg",
        width: 1200,
        height: 630,
        alt: "Teekay Pipe Couplings",
      },
    ],
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/teekay",
  },
}

export const revalidate = 60

const teekayFeatures = [
  {
    icon: Wrench,
    title: "No Welding Required",
    description: "Mechanical grip couplings eliminate the need for hot work - faster, safer pipe connections.",
  },
  {
    icon: Shield,
    title: "Axial Restraint",
    description: "Axilock and PRIMA-LOCK couplings provide full axial restraint without thrust blocks.",
  },
  {
    icon: Settings,
    title: "Flexible Connections",
    description: "Axiflex and PRIMA-FLEX allow angular deflection to accommodate pipe movement and misalignment.",
  },
  {
    icon: Zap,
    title: "Quick Installation",
    description: "Simple bolt-up installation reduces labour time and gets systems operational faster.",
  },
]

const teekayApplications = [
  "Water mains - Join PE, PVC, steel and ductile iron pipes",
  "Fire protection - Axilock-FP couplings for sprinkler systems",
  "Mining & resources - Rugged couplings for harsh environments",
  "Industrial piping - Quick repairs without shutdowns",
  "Pumping systems - Flexible connections absorb vibration",
  "Plastic pipe systems - Plastlock for PE and PVC connections",
]

const faqs = [
  {
    question: "What's the difference between Axilock and Axiflex?",
    answer:
      "Axilock provides a rigid, axially restrained connection that prevents pipe pull-out. Axiflex allows angular deflection (typically ±4°) to accommodate pipe movement, thermal expansion, and minor misalignment while still providing a secure seal.",
  },
  {
    question: "Can Teekay couplings join different pipe materials?",
    answer:
      "Yes, Teekay couplings are designed to join dissimilar pipe materials. You can connect steel to PE, ductile iron to PVC, or any combination. The internal sealing gasket accommodates different OD tolerances.",
  },
  {
    question: "What's the pressure rating of Teekay couplings?",
    answer:
      "Standard Teekay couplings are rated to PN16 (16 bar / 232 psi). Higher pressure ratings are available for specific applications. The PRIMA range offers premium performance for demanding installations.",
  },
  {
    question: "How do I size a Teekay coupling?",
    answer:
      "Teekay couplings are sized by pipe outside diameter (OD), not nominal bore. Measure the actual OD of both pipe ends accurately. For stepped couplings or reducers, you'll need both the larger and smaller OD measurements.",
  },
]

export default async function TeekayPage() {
  // Get products by Teekay brand from database
  const teekayProductsList = await getProductsByBrand("teekay")

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Teekay Products", url: "https://dewater-products.vercel.app/teekay" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Animated blob background - Purple/Indigo theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-violet-600" />
          {/* Blob 1 - Indigo (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#6366f1' }}
          />
          {/* Blob 2 - Violet accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#8b5cf6' }}
          />
          {/* Blob 3 - Dark purple (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#312e81' }}
          />
          {/* Blob 4 - Purple (center-left) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#7c3aed' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <Image
            src="/images/brands/teekay-logo.png"
            alt="Teekay"
            width={160}
            height={80}
            className="w-40 h-auto mb-6 brightness-0 invert"
            priority
          />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm font-medium mb-4">
            <Settings className="w-4 h-4" />
            Pipe Coupling Specialists
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Teekay Couplings
          </h1>
          <p className="text-xl text-white/80 mb-6 max-w-3xl">
            Mechanical pipe couplings for joining, repairing and connecting pipes without welding.
            The Axilock, Axiflex, Plastlock and PRIMA ranges cover steel, ductile iron, PE and PVC pipes
            across water, fire protection and industrial applications.
          </p>
          <Link
            href="/request-quote"
            className="btn-swipe btn-swipe-to-white inline-flex items-center px-6 py-3 border rounded-md font-medium shadow-lg"
          >
            Request a Quote
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Products Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Teekay Products</h2>
            <span className="text-muted-foreground">{teekayProductsList.length} products</span>
          </div>

          {teekayProductsList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Choose Teekay Couplings?</h2>
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

        {/* Coupling Ranges */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Teekay Coupling Ranges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Standard Range</h3>
              <p className="text-muted-foreground mb-4">
                <strong>Axilock</strong> - Rigid axially restrained couplings. <strong>Axiflex</strong> - Flexible couplings with angular deflection.
                <strong> Plastlock</strong> - Designed specifically for PE and PVC plastic pipes.
              </p>
              <div className="text-sm text-muted-foreground">
                Size range: 21mm to 2200mm OD
              </div>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">PRIMA Range (Premium)</h3>
              <p className="text-muted-foreground mb-4">
                <strong>PRIMA-LOCK</strong> - Premium rigid coupling. <strong>PRIMA-FLEX</strong> - Premium flexible coupling.
                <strong> PRIMA-PLAST</strong> - Premium plastic pipe coupling. <strong>PRIMA-STEP</strong> - Stepped reducer coupling.
              </p>
              <div className="text-sm text-muted-foreground">
                Premium finish and performance
              </div>
            </div>
          </div>
        </div>

        {/* Pipe Material Compatibility */}
        <div className="mb-16 p-6 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4">
            Pipe Material Compatibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">Steel Pipes</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Carbon steel, stainless steel, galvanised
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">Ductile Iron</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                DI pipes, cast iron, cement lined
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">PE / HDPE</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Use Plastlock or PRIMA-PLAST range
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded">
              <div className="font-medium text-cyan-800 dark:text-cyan-200 mb-1">PVC / uPVC</div>
              <div className="text-cyan-700 dark:text-cyan-300">
                Use Plastlock or PRIMA-PLAST range
              </div>
            </div>
          </div>
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
            <Link href="/industrial-valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/bore-flex">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Bore-Flex Expansion Joints</span>
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
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Coupling?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the right Teekay coupling for your pipe materials and application.
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
