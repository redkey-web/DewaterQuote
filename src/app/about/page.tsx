import type { Metadata } from "next"
import Link from "next/link"
import { Factory, Droplets, Ship, HardHat, Fuel, Building } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Dewater Products",
  description: "Dewater Products - supplying quality pipe fittings and valves to Australian industry since 2015. Water, mining, offshore, civil, and oil & gas sectors.",
}

const industries = [
  { name: "Water & Wastewater", icon: Droplets, description: "Treatment plants and distribution networks" },
  { name: "Mining", icon: HardHat, description: "Process water and slurry pipelines" },
  { name: "Offshore & Marine", icon: Ship, description: "Platform piping and marine systems" },
  { name: "Civil Infrastructure", icon: Building, description: "Municipal water and drainage" },
  { name: "Oil & Gas", icon: Fuel, description: "Processing facilities and pipelines" },
  { name: "Industrial", icon: Factory, description: "Manufacturing and process plants" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">About Dewater Products</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-lg">
            Dewater Products Pty Ltd has been a trusted supplier of industrial pipe fittings,
            couplings, and valves to Australian industry since 2015. Based in Perth, Western
            Australia, we serve customers across the nation.
          </p>

          <p>
            We specialise in pipe joining solutions including Straub and Orbit mechanical
            couplings, flange adaptors, rubber expansion joints, and industrial valves. Our
            products are sourced from leading manufacturers and backed by technical support
            from our experienced team.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-6">Industries We Serve</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="p-4 rounded-lg bg-card border border-border"
              >
                <industry.icon className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold">{industry.name}</h3>
                <p className="text-sm text-muted-foreground">{industry.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Why Choose Us</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Quality products from trusted manufacturers</li>
            <li>Competitive pricing with transparent quotes</li>
            <li>Technical support and product advice</li>
            <li>Fast delivery across Australia</li>
            <li>Stock held locally in Perth</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p>
            Have questions? Our team is here to help with product selection and technical enquiries.
          </p>
          <div className="not-prose flex gap-4 mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Contact Us
            </Link>
            <a
              href="tel:1300271290"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
            >
              Call 1300 271 290
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
