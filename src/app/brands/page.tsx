import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Brands - Straub, Orbit, Teekay, Bore-Flex, Defender | DeWater Products",
  description: "Browse industrial pipe fittings by brand. Authorised distributors for Straub, Orbit Couplings, Teekay, Bore-Flex Rubber, Defender Valves, and Defender Strainers.",
}

const brands = [
  {
    slug: "straub",
    href: "/straub-couplings",
    name: "Straub",
    logo: "/images/brands/straub-logo.png",
    description: "Global leader in pipe coupling technology, offering innovative solutions for secure and maintenance-free pipe connections across all industries.",
    specialties: ["Pipe Couplings", "Repair Clamps", "Flange Adaptors"],
  },
  {
    slug: "orbit",
    href: "/orbit-couplings",
    name: "Orbit Couplings",
    logo: "/images/brands/orbit-couplings.png",
    description: "High-quality pipe couplings and fittings designed for demanding industrial applications. Known for reliability and precision engineering.",
    specialties: ["Grip Couplings", "Transition Couplings", "Repair Clamps"],
  },
  {
    slug: "teekay",
    href: "/teekay",
    name: "Teekay",
    logo: "/images/brands/teekay-logo.png",
    description: "Specialists in pipe couplings, flexible connectors, and flange adapters. High-quality stainless steel couplings for water, process, and marine applications.",
    specialties: ["Pipe Couplings", "Flexible Couplings", "Repair Couplings", "Flange Adapters"],
  },
  {
    slug: "defender-valves",
    href: "/defender-valves",
    name: "Defender Valves",
    logo: "/images/brands/defender-valves-logo.png",
    description: "High-performance industrial butterfly valves with PTFE lining, offering superior chemical resistance and reliable flow control.",
    specialties: ["Butterfly Valves", "PTFE Lined Valves", "Stainless Steel Valves"],
  },
  {
    slug: "bore-flex-rubber",
    href: "/bore-flex",
    name: "Bore-Flex Rubber",
    logo: "/images/brands/bore-flex-rubber-logo.png",
    description: "High-quality rubber expansion joints and flexible pipe connectors for vibration isolation, thermal expansion compensation, and noise reduction in piping systems.",
    specialties: ["Expansion Joints", "Rubber Bellows", "Vibration Isolators"],
  },
  {
    slug: "defender-strainers",
    href: "/defender-strainers",
    name: "Defender Strainers",
    logo: "/images/brands/defender-strainers-logo.png",
    description: "Industrial pipeline strainers including Y strainers, simplex and duplex basket strainers, and suction strainers. Quality filtration solutions for protecting pumps and equipment.",
    specialties: ["Y Strainers", "Basket Strainers", "Duplex Strainers", "Suction Strainers"],
  },
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            DeWater Products is an authorised distributor for leading industrial pipe fitting manufacturers. 
            Browse products by brand below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link key={brand.slug} href={brand.href}>
              <Card className="group h-full p-8 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/30">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 flex items-center justify-center mb-6">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.slug === "bore-flex-rubber" ? 1440 : brand.slug === "orbit" ? 270 : brand.slug === "defender-strainers" ? 192 : 160}
                      height={brand.slug === "bore-flex-rubber" ? 540 : brand.slug === "orbit" ? 90 : brand.slug === "defender-strainers" ? 72 : 60}
                      className={brand.slug === "bore-flex-rubber" ? "h-[144px] w-auto object-contain" : brand.slug === "orbit" ? "h-[84px] w-auto object-contain" : brand.slug === "defender-strainers" ? "h-[74px] w-auto object-contain" : brand.slug === "defender-valves" ? "h-[50px] w-auto object-contain" : "h-14 w-auto object-contain"}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{brand.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {brand.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {brand.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
                    View {brand.name} Products
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
