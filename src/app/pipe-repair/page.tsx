import Link from "next/link"
import { ArrowRight, CheckCircle, AlertTriangle, Clock, Shield, Wrench } from "lucide-react"
import { products } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Repair Clamps & Couplings | Emergency Repairs | Dewater Products",
  description:
    "Pipe repair clamps and couplings for emergency and permanent leak repairs. Straub and Orbit repair solutions. No pipe cutting required. 316 stainless steel. Fast Australia-wide delivery.",
  keywords: [
    "pipe repair clamps",
    "pipe repair couplings",
    "emergency pipe repair",
    "leak repair clamps",
    "pipe leak repair",
    "Straub repair clamps",
    "Orbit repair clamps",
    "pipe crack repair",
  ],
  openGraph: {
    title: "Pipe Repair Clamps & Couplings | Dewater Products",
    description: "Emergency and permanent pipe repair solutions. No pipe cutting, no shutdown required.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/pipe-repair",
  },
}

const repairBenefits = [
  {
    icon: Clock,
    title: "Fast Installation",
    description: "Repair leaks in minutes. No pipe cutting, no welding, no special tools required.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Ready",
    description: "Keep stock on hand for emergency repairs. Seal leaks under pressure in many cases.",
  },
  {
    icon: Shield,
    title: "Permanent Solution",
    description: "Not just a band-aid fix. Properly installed repairs last the lifetime of the pipe.",
  },
  {
    icon: Wrench,
    title: "Multi-Purpose",
    description: "Same couplings used for joining can repair leaks, cracks, and damaged sections.",
  },
]

const repairScenarios = [
  {
    problem: "Pinhole Leaks",
    solution: "Repair clamp or coupling slides over the leak area and seals with EPDM gasket.",
    products: ["Orbit Repair Clamps", "Straub REP"],
  },
  {
    problem: "Cracked Pipes",
    solution: "Use a repair clamp wide enough to span the entire crack for complete sealing.",
    products: ["100mm, 150mm, 200mm, 300mm width clamps"],
  },
  {
    problem: "Corroded Sections",
    solution: "Pipe couplings can bridge damaged sections without cutting out the pipe.",
    products: ["Flex Grip L", "Metal Lock L", "Straub FLEX/GRIP"],
  },
  {
    problem: "Joint Failures",
    solution: "Replace failed mechanical joints with reliable coupling connections.",
    products: ["All coupling types"],
  },
]

const faqs = [
  {
    question: "Can I repair a pipe without shutting down the system?",
    answer:
      "In many cases, yes. Repair clamps can be installed on pressurised systems for small leaks. For larger repairs, you may need to depressurise but typically don't need to drain the system.",
  },
  {
    question: "What's the difference between repair clamps and couplings?",
    answer:
      "Repair clamps are specifically designed to wrap around a damaged section of pipe. Couplings join two pipe ends but can also be used for repair by sliding over a damaged area. Both seal with EPDM gaskets.",
  },
  {
    question: "How do I choose the right width repair clamp?",
    answer:
      "The clamp should be wide enough to fully cover the damaged area plus 50mm on each side. For cracks, ensure the entire crack length is within the sealing area. 55mm clamps suit pinholes, 150-300mm for larger damage.",
  },
  {
    question: "Are these repairs permanent or temporary?",
    answer:
      "Both repair clamps and couplings provide permanent repairs when properly installed. The stainless steel construction and EPDM seals are designed for long-term service.",
  },
]

export default function PipeRepairPage() {
  // Get all products that can be used for repair (couplings and repair clamps)
  const repairProducts = products.filter(
    (p) => p.category === "pipe-couplings" || p.category === "pipe-repair-clamps"
  )

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Pipe Repair", url: "https://dewater-products.vercel.app/pipe-repair" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-900/10 border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              Emergency & Permanent Solutions
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Pipe Repair Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Seal leaks, repair cracks, and fix damaged pipes without cutting or welding.
              Our repair clamps and couplings provide fast, permanent repairs that last
              the lifetime of the pipe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#products"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                View Repair Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
              >
                Emergency Support: (08) 9271 2577
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Use Pipe Repair Clamps?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {repairBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <benefit.icon className="w-10 h-10 text-red-600 dark:text-red-400 mb-4" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Repair Scenarios */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Repair Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repairScenarios.map((scenario) => (
              <div key={scenario.problem} className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{scenario.problem}</h3>
                <p className="text-muted-foreground mb-4">{scenario.solution}</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.products.map((product) => (
                    <span key={product} className="px-2 py-1 bg-muted rounded text-xs">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shop by Brand */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Shop Repair Products by Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/straub">
              <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Straub Repair Solutions</h3>
                <p className="text-muted-foreground mb-4">
                  Swiss-engineered GRIP and FLEX couplings plus dedicated REP repair clamps.
                  Premium quality for critical applications.
                </p>
                <div className="flex items-center text-primary font-medium">
                  View Straub Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
            <Link href="/orbit">
              <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Orbit Repair Clamps</h3>
                <p className="text-muted-foreground mb-4">
                  Australian industrial repair clamps in 55mm to 300mm widths.
                  Straub-compatible at competitive prices.
                </p>
                <div className="flex items-center text-primary font-medium">
                  View Orbit Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Repair Products</h2>
            <span className="text-muted-foreground">{repairProducts.length} products</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {repairProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Pipe Repair FAQs</h2>
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
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/straub">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Straub Products</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/orbit">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Orbit Products</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Emergency Pipe Repair?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Call our team for urgent assistance. We can advise on the right repair solution
            and arrange fast dispatch from our Perth warehouse.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="tel:0892712577"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Call (08) 9271 2577
            </a>
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
