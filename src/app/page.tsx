"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  Search,
  ClipboardList,
  Mail,
  TrendingDown,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TestimonialsSection } from "@/components/Testimonials"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HomePage() {

  const productCategories = [
    {
      name: "Valves",
      url: "/valves",
      image: "/images/products/valves/butterfly-valve-cf8m-316ss.jpg",
      alt: "Valves",
    },
    {
      name: "Pipe Couplings",
      url: "/pipe-couplings",
      image: "/images/products/orbit/flex-grip-l.jpg",
      alt: "Pipe Couplings",
    },
    {
      name: "Expansion Joints",
      url: "/rubber-expansion-joints",
      image: "/images/products/orbit/flex-grip-s.jpg",
      alt: "Expansion Joints",
    },
    {
      name: "Strainers & Filters",
      url: "/strainers",
      image: "/images/products/orbit/metal-lock-l.jpg",
      alt: "Strainers and Filters",
    },
  ]

  const industries = [
    {
      name: "Mining",
      url: "/industries/mining",
      image: "/images/industries/mining.webp",
    },
    {
      name: "Construction",
      url: "/industries/construction",
      image: "/images/industries/construction.webp",
    },
    {
      name: "Marine",
      url: "/industries/marine",
      image: "/images/industries/marine.webp",
    },
    {
      name: "Food & Beverage",
      url: "/industries/food-beverage",
      image: "/images/industries/food-beverage.webp",
    },
    {
      name: "Water & Wastewater",
      url: "/industries/water-wastewater",
      image: "/images/industries/water-wastewater.webp",
    },
    {
      name: "Irrigation",
      url: "/industries/irrigation",
      image: "/images/industries/irrigation.webp",
    },
    {
      name: "Fire Services",
      url: "/industries/fire-services",
      image: "/images/industries/fire-services.webp",
    },
    {
      name: "HVAC",
      url: "/industries/hvac",
      image: "/images/industries/hvac.webp",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Volume Discount Ticker */}
        <div
          className="absolute top-0 left-0 right-0 z-20 py-2 overflow-hidden"
          data-testid="section-volume-discounts"
        >
          <div className="ticker-wrapper">
            <div className="ticker-content">
              <div className="flex items-center gap-8 px-8 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">Volume Discounts:</span>
                  <span className="text-white/80">2-4 items</span>
                  <span className="font-bold text-orange-400">5% OFF</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/80">5-9 items</span>
                  <span className="font-bold text-orange-400">10% OFF</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/80">10+ items</span>
                  <span className="font-bold text-orange-400">15% OFF</span>
                </div>
                <span className="text-white/50">•</span>
              </div>
            </div>
            <div className="ticker-content" aria-hidden="true">
              <div className="flex items-center gap-8 px-8 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">Volume Discounts:</span>
                  <span className="text-white/80">2-4 items</span>
                  <span className="font-bold text-orange-400">5% OFF</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/80">5-9 items</span>
                  <span className="font-bold text-orange-400">10% OFF</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/80">10+ items</span>
                  <span className="font-bold text-orange-400">15% OFF</span>
                </div>
                <span className="text-white/50">•</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url(/images/hero-pipeline.webp)",
            backgroundPosition: "center center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/25" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center py-16 md:py-20">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Find & Add Products To Quote Form
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-white/80 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>15+ years experience</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Fast Perth dispatch</span>
            </div>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pipe fittings, valves, couplings..."
              className="w-full h-14 pl-14 pr-6 text-lg rounded-full border-2 border-white/20 bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all"
              data-testid="input-hero-search"
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="bg-white/90 hover:bg-white text-foreground px-6 py-2 text-sm font-medium">
                  Browse by Category
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/valves" className="w-full cursor-pointer">Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pipe-couplings" className="w-full cursor-pointer">Pipe Couplings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/rubber-expansion-joints" className="w-full cursor-pointer">Expansion Joints</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/strainers" className="w-full cursor-pointer">Strainers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pipe-repair" className="w-full cursor-pointer">Repair Clamps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/flange-adaptors" className="w-full cursor-pointer">Flange Adaptors</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/brands" className="text-white/70 hover:text-white text-sm underline underline-offset-2 transition-colors">
              or browse by brand
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category) => (
              <Link key={category.name} href={category.url}>
                <Card className="group overflow-hidden h-80 relative hover-elevate active-elevate-2 transition-all cursor-pointer border-border">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                    <div
                      className="flex items-center text-[hsl(189,68%,32%)] dark:text-[hsl(189,68%,45%)] text-sm font-medium transition-all duration-300 group-hover:text-[hsl(189,68%,52%)] dark:group-hover:text-[hsl(189,68%,65%)]"
                      style={{ textShadow: "0 0 16px hsla(189, 68%, 52%, 0.6)" }}
                    >
                      View all <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-12 px-6 lg:px-8 bg-muted/50 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">Authorised distributor for</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <Link href="/brands/straub" className="opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/brands/straub-logo.png"
                alt="Straub"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <Link href="/brands/orbit" className="opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/brands/orbit-couplings.png"
                alt="Orbit Couplings"
                width={150}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <Link href="/brands/teekay" className="opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/brands/teekay-logo.png"
                alt="Teekay"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
              simple process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HOW IT WORKS</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Request a quote in three easy steps and receive competitive pricing with detailed lead times
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">1. Browse & Select</h4>
              <p className="text-muted-foreground">
                Browse our product range and add items to your quote request form
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">2. Submit Request</h4>
              <p className="text-muted-foreground">
                Fill out the quote form with your contact details and project requirements
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">3. Receive Quote</h4>
              <p className="text-muted-foreground">
                Get your final quote with trade discounts and accurate lead times via email
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">INDUSTRY SOLUTIONS</h2>
            <p className="text-lg text-muted-foreground">
              No matter what field you're in, we have the perfect solution for you.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry) => (
              <Link key={industry.name} href={industry.url}>
                <Card
                  className="group overflow-hidden h-56 relative hover-elevate active-elevate-2 transition-all cursor-pointer border-border"
                  data-testid={`card-industry-${industry.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${industry.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-semibold text-white text-center">
                      {industry.name}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
              why choose us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Dewater Products</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Trusted by civil contractors, water authorities, irrigation specialists, and industrial maintenance companies across Australia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Locally Stocked</h4>
              <p className="text-sm text-muted-foreground">
                Fast dispatch from Perth warehouse, ready to ship
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Certified Quality</h4>
              <p className="text-sm text-muted-foreground">
                AS/NZS, WRAS, and ISO certified products
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Fast Nationwide Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Quick turnaround times across Australia
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Engineering Support</h4>
              <p className="text-sm text-muted-foreground">Talk to a specialist on call</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                who we are
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">ABOUT US</h2>
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                The leader in industrial pipe fittings and valves
              </h3>
              <p className="text-base text-foreground/80 mb-6 leading-relaxed">
                Recognised as industry leaders in industrial pipe fittings engineering, we are an Australian owned and operated business. deWater Products specialises in premium pipe couplings, valves, expansion joints, and strainers from trusted brands like Straub, Orbit, and Teekay.
              </p>
              <p className="text-base text-foreground/80 mb-8 leading-relaxed">
                Supplying the Australian market since 2015, our commitment to quality ensures we provide the most reliable solutions for water treatment, mining, irrigation, and industrial applications.
              </p>
              <Link href="/about">
                <Button size="lg" data-testid="button-learn-more">
                  Learn More <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Authorised Distributor</h4>
                <p className="text-muted-foreground mb-4">
                  Exclusive partnerships with Straub, Orbit, and Teekay ensure genuine products and factory support
                </p>
              </Card>
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Technical Transparency</h4>
                <p className="text-muted-foreground mb-4">
                  Detailed specs, drawings, and pressure ratings available for every product to support your approval process
                </p>
              </Card>
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Trade Accounts Welcome</h4>
                <p className="text-muted-foreground">
                  Competitive trade pricing and bulk ordering for contractors and industrial clients
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Brands Section */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FEATURED BRANDS</h2>
            <p className="text-lg text-muted-foreground">
              Authorised distributor of industry-leading manufacturers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/brands/straub">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <Image
                  src="/images/brands/straub-logo.png"
                  alt="Straub logo"
                  width={160}
                  height={64}
                  className="h-16 mx-auto object-contain"
                />
              </Card>
            </Link>
            <Link href="/brands/orbit">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <Image
                  src="/images/brands/orbit-couplings.png"
                  alt="Orbit Couplings logo"
                  width={160}
                  height={64}
                  className="h-16 mx-auto object-contain p-0 m-0"
                />
              </Card>
            </Link>
            <Link href="/brands/teekay">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <Image
                  src="/images/brands/teekay-logo.png"
                  alt="Teekay logo"
                  width={160}
                  height={64}
                  className="h-16 mx-auto object-contain"
                />
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
              got questions?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our products and services
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                What brands do you stock?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                We are authorized distributors for Straub, Orbit Couplings, and Teekay - all
                industry-leading manufacturers of pipe fittings, couplings, valves, and expansion
                joints. All products are genuine and come with full factory support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                How do I request a quote?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Simply browse our product catalog, add items to your quote cart, and submit the
                request form with your contact details and project requirements. Our team will
                respond with competitive pricing and lead times within 24 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do you offer volume discounts?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes! We offer automatic volume discounts: 5% off for 2-4 items, 10% off for 5-9
                items, and 15% off for 10+ items. Discounts apply to your entire order and are
                calculated automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Where do you deliver?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                We deliver Australia-wide with FREE delivery to all metro areas. Items are
                dispatched from our Perth warehouse with fast turnaround times across the country.
                Express delivery options are available for urgent requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Are technical specifications available?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Absolutely. Every product page includes detailed technical specifications, pressure
                ratings, material certifications, and downloadable PDF datasheets. We provide
                complete transparency to support your approval and engineering processes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do you offer trade accounts?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes, we welcome trade accounts for contractors, industrial clients, and water
                authorities. Trade customers receive competitive pricing, bulk ordering options,
                and dedicated account management. Contact us to set up your account.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
}
