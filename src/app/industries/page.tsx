import Link from "next/link"
import { ArrowRight, Droplets, Wheat, Flame, Mountain, Wrench, Anchor, Wind, Apple } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Industries We Serve | Pipe Fittings & Valves | Dewater Products",
  description:
    "Industrial pipe fittings, valves, and couplings for water treatment, mining, construction, HVAC, marine, fire services, irrigation, and food processing. Australia-wide delivery.",
  keywords: [
    "industrial pipe fittings",
    "water treatment valves",
    "mining pipe fittings",
    "construction plumbing",
    "HVAC pipe fittings",
    "marine valves",
    "fire protection fittings",
    "irrigation supplies",
  ],
  openGraph: {
    title: "Industries We Serve | Dewater Products",
    description:
      "Industrial pipe fittings and valves for water, mining, construction, HVAC, marine, fire services, and more.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/industries",
  },
}

const industries = [
  {
    slug: "water-wastewater",
    name: "Water & Wastewater",
    tagline: "Reliable Solutions for Critical Water Infrastructure",
    description:
      "Pipe fittings for water treatment plants, sewage systems, and water distribution networks. AS/NZS 4020 compliant products.",
    icon: Droplets,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    slug: "mining",
    name: "Mining",
    tagline: "Heavy-Duty Solutions for Demanding Environments",
    description:
      "Heavy-duty piping for dewatering, slurry transport, and process water. Built to handle abrasive and high-pressure applications.",
    icon: Mountain,
    color: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    slug: "construction",
    name: "Construction",
    tagline: "Reliable Pipe Solutions for Building Projects",
    description:
      "Industrial piping for commercial buildings and civil engineering. Quick-install couplings and certified components.",
    icon: Wrench,
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    slug: "fire-services",
    name: "Fire Services",
    tagline: "Certified Components for Life Safety Systems",
    description:
      "Fire protection piping components meeting Australian standards for sprinkler systems, hydrants, and pump stations.",
    icon: Flame,
    color: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    slug: "hvac",
    name: "HVAC",
    tagline: "Precision Components for Climate Control Systems",
    description:
      "Heating, ventilation, and air conditioning piping solutions. Expansion joints and strainers for mechanical systems.",
    icon: Wind,
    color: "from-sky-500/20 to-indigo-500/20",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    slug: "marine",
    name: "Marine",
    tagline: "Corrosion-Resistant Solutions for Maritime Applications",
    description:
      "316 stainless steel fittings for saltwater environments. Valves and couplings for vessels and offshore installations.",
    icon: Anchor,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    slug: "irrigation",
    name: "Irrigation",
    tagline: "Durable Products for Agricultural Water Management",
    description:
      "Reliable irrigation solutions for farms and landscaping. UV-resistant valves, foot valves, and strainers.",
    icon: Wheat,
    color: "from-green-500/20 to-lime-500/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    tagline: "Hygienic Solutions for Process Industries",
    description:
      "Hygienic piping meeting food-grade standards. FDA compliant materials for breweries, wineries, and food processing.",
    icon: Apple,
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
]

export default function IndustriesPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Industries", url: "https://dewater-products.vercel.app/industries" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Industries We Serve</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Industrial pipe fittings, valves, expansion joints, and couplings for every sector.
              From water treatment to mining, construction to food processing - we supply quality
              products with Australia-wide delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/request-quote"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {industries.map((industry) => {
            const IconComponent = industry.icon
            return (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group block"
              >
                <div
                  className={`h-full p-6 rounded-lg bg-gradient-to-br ${industry.color} border ${industry.borderColor} hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]`}
                >
                  <IconComponent className={`w-10 h-10 ${industry.iconColor} mb-4`} />
                  <h2 className="text-xl font-bold mb-2">{industry.name}</h2>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {industry.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{industry.description}</p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* What We Supply Section */}
        <div className="mb-16 p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-bold mb-6">What We Supply</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Pipe Couplings</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Straub GRIP &amp; FLEX</li>
                <li>Orbit couplings</li>
                <li>Repair clamps</li>
                <li>Transition couplings</li>
              </ul>
              <Link
                href="/pipe-couplings"
                className="inline-flex items-center text-primary text-sm mt-3 hover:underline"
              >
                View Range <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Valves</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Butterfly valves</li>
                <li>Check valves</li>
                <li>Gate valves</li>
                <li>Foot valves</li>
              </ul>
              <Link
                href="/industrial-valves"
                className="inline-flex items-center text-primary text-sm mt-3 hover:underline"
              >
                View Range <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Expansion Joints</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Single sphere</li>
                <li>Twin sphere</li>
                <li>Flanged rubber joints</li>
                <li>Reducing expansion joints</li>
              </ul>
              <Link
                href="/expansion-joints"
                className="inline-flex items-center text-primary text-sm mt-3 hover:underline"
              >
                View Range <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Strainers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Y-strainers</li>
                <li>Basket strainers</li>
                <li>Suction strainers</li>
                <li>Pump protection</li>
              </ul>
              <Link
                href="/strainers"
                className="inline-flex items-center text-primary text-sm mt-3 hover:underline"
              >
                View Range <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Finding the Right Products?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you select the right pipe fittings, valves, and couplings
            for your specific industry application. Call us on{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">
              1300 271 290
            </a>{" "}
            or request a quote.
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
