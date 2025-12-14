import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Users, Award, Clock, Search, ClipboardList, Mail } from "lucide-react";
import TypewriterText from "@/components/TypewriterText";
import { TestimonialsSection } from "@/components/Testimonials";
import { VolumeDiscountsBar } from "@/components/VolumeDiscountsBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import constructionImage from "@assets/CONSTRUCTION DEWATERING PRODUCTS-min_1762663874717.webp";
import fireServicesImage from "@assets/FIRE PIPELINE PRODUCTS-min_1762663874717.webp";
import foodBeverageImage from "@assets/FOOD INDUSTRY PIPELINE SUPPLIES-min_1762663874717.webp";
import hvacImage from "@assets/HVAC PIPES AND VALVES ONLINE-min_1762663874717.webp";
import irrigationImage from "@assets/IRRIGATION PIPELINE SUPPLIES-min_1762663874717.webp";
import marineImage from "@assets/MARINE INDUSTRY PIPELINE SUPPLIES-min_1762663874717.webp";
import miningImage from "@assets/MINING INDUSTRY VALVES AND PIPELINE PRODUCTS-min_1762663874717.webp";
import wastewaterImage from "@assets/WASTEWATER PIPELINE SUPPLIER_1762664220723.webp";
import heroImage from "@assets/hero-new.webp";

export default function HomePage() {
  const [heroComplete, setHeroComplete] = useState(false);
  const [hero2Complete, setHero2Complete] = useState(false);

  const productCategories = [
    {
      name: "Valves",
      url: "/valves",
      image: "/images/products/valves/butterfly-valve-cf8m-316ss.jpg",
    },
    {
      name: "Pipe Couplings",
      url: "/pipe-couplings/pipe-couplings",
      image: "/images/products/orbit/flex-grip-l.jpg",
    },
    {
      name: "Expansion Joints",
      url: "/rubber-expansion-joints",
      image: "/images/products/orbit/flex-grip-s.jpg",
    },
    {
      name: "Strainers & Filters",
      url: "/strainers",
      image: "/images/products/orbit/metal-lock-l.jpg",
    },
  ];

  const industries = [
    { 
      name: "Mining", 
      url: "/industries/mining",
      image: miningImage
    },
    { 
      name: "Construction", 
      url: "/industries/construction",
      image: constructionImage
    },
    { 
      name: "Marine", 
      url: "/industries/marine",
      image: marineImage
    },
    { 
      name: "Food & Beverage", 
      url: "/industries/food-beverage",
      image: foodBeverageImage
    },
    { 
      name: "Water & Wastewater", 
      url: "/industries/water-wastewater",
      image: wastewaterImage
    },
    { 
      name: "Irrigation", 
      url: "/industries/irrigation",
      image: irrigationImage
    },
    { 
      name: "Fire Services", 
      url: "/industries/fire-services",
      image: fireServicesImage
    },
    { 
      name: "HVAC", 
      url: "/industries/hvac",
      image: hvacImage
    },
  ];

  return (
    <div>
      <SEO 
        title="Industrial Pipe Couplings, Valves & Repair Clamps"
        description="Australia's experts in pipe couplings, valves, and repair clamps. Perth-based supplier offering Straub, Orbit, and Defender products for mining, water treatment, irrigation, and industrial applications. Request a quote today."
        keywords="pipe couplings, valves, repair clamps, expansion joints, strainers, industrial valves, Perth, Australia, Straub, Orbit, Defender"
        canonical="https://dewaterproducts.com.au/"
      />

      {/* Volume Discounts Scrolling Bar */}
      <VolumeDiscountsBar />

      {/* Hero Section - Responsive hero image */}
      <section className="relative w-full z-10" style={{ marginTop: '-41px' }}>
        <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]">
          <img
            src={heroImage}
            alt="Industrial pipe couplings, valves, and fittings"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Industrial pipeline shading effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-4xl text-center drop-shadow-lg mb-4">
            Industry Leading Pipe Fittings & Valves
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg lg:text-xl text-white/90 text-center font-medium drop-shadow-md mb-6">
            <TypewriterText
              text="Supplying Australia's pipeline industry since 2015"
              delay={300}
              speed={20}
              onComplete={() => setHeroComplete(true)}
            />
          </p>

          {/* Buttons */}
          <style>{`
            @keyframes water-flow {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 200% 50%;
              }
            }
            .water-ripple-button {
              background: linear-gradient(
                90deg,
                #14555F 0%,
                #1F7A8A 20%,
                #2B9CAF 40%,
                #39C2D9 60%,
                #2B9CAF 80%,
                #1F7A8A 90%,
                #14555F 100%
              );
              background-size: 200% 100%;
              animation: water-flow 4s linear infinite;
              box-shadow: none !important;
              transition: opacity 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
              text-shadow: 0 0 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8);
            }
            .water-ripple-button:hover {
              box-shadow: none !important;
              opacity: 0.7;
              color: #000000 !important;
              text-shadow: 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 0 1px 2px rgba(255,255,255,0.8) !important;
            }
            .trade-quote-button {
              transition: all 0.3s ease;
            }
            .trade-quote-button:hover {
              color: #ffffff !important;
              box-shadow: 0 0 12px 4px rgba(255, 255, 255, 0.6), 0 0 18px 6px rgba(255, 255, 255, 0.4) !important;
            }
          `}</style>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link href="/products">
              <button 
                className="h-11 px-8 rounded-md font-semibold text-base transition-all hover:scale-105 relative overflow-hidden inline-flex items-center justify-center"
                style={{
                  backgroundImage: 'url(/images/pipe-coupling-button.png)',
                  backgroundSize: '200%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '2px solid #666',
                  color: '#000000',
                  textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 0 1px 2px rgba(255,255,255,0.8)',
                  boxShadow: '0 0 12px 4px rgba(0, 0, 0, 0.6), 0 0 18px 6px rgba(0, 0, 0, 0.4)',
                }}
                data-testid="button-view-products"
              >
                <span className="absolute inset-0 bg-[#39C2D9]/50 z-0"></span>
                <span className="relative z-10 font-bold">View Products</span>
              </button>
            </Link>
            <Link href="/request-quote">
              <button 
                className="h-11 px-8 rounded-md font-semibold text-base transition-all hover:scale-105 relative overflow-hidden inline-flex items-center justify-center trade-quote-button"
                style={{
                  backgroundImage: 'url(/images/pipe-coupling-button.png)',
                  backgroundSize: '200%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '2px solid #666',
                  color: '#000000',
                  textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 0 1px 2px rgba(255,255,255,0.8)',
                  boxShadow: '0 0 12px 4px rgba(0, 0, 0, 0.6), 0 0 18px 6px rgba(0, 0, 0, 0.4)',
                }}
                data-testid="button-request-quote"
              >
                <span className="relative z-10 font-bold">Request a Quote</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section - Below Hero */}
      <section className="py-8 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            <div className="flex items-center gap-3">
              <img src="/images/brands/straub-logo.png" alt="Straub" className="h-12 md:h-16 object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/brands/orbit-couplings-logo.png" alt="Orbit Couplings" className="h-12 md:h-16 object-contain p-0 m-0" style={{ transform: 'scale(1.44)', paddingLeft: '20px' }} />
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/brands/teekay-logo.png" alt="Teekay" className="h-12 md:h-16 object-contain" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-base md:text-lg text-foreground mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">15+ years industry experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">Fast Perth warehouse dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories - Large Image Cards (Hoseflex Style) */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category) => (
              <Link key={category.name} href={category.url}>
                <Card className="group overflow-hidden h-80 relative hover-elevate active-elevate-2 transition-all cursor-pointer border-border">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                    <div className="flex items-center text-[hsl(189,68%,32%)] dark:text-[hsl(189,68%,45%)] text-sm font-medium transition-all duration-300 group-hover:text-[hsl(189,68%,52%)] dark:group-hover:text-[hsl(189,68%,65%)]" style={{ textShadow: '0 0 16px hsla(189, 68%, 52%, 0.6)' }}>
                      View all <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-base uppercase tracking-wider text-primary font-semibold mb-3">simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HOW IT WORKS</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto min-h-[28px]">
              <TypewriterText 
                text="Request a quote in three easy steps and receive competitive pricing with detailed lead times" 
                delay={0}
                speed={15}
              />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-semibold text-xl md:text-2xl mb-3">1. Browse & Select</h4>
              <p className="text-base md:text-lg text-muted-foreground min-h-[56px]">
                <TypewriterText 
                  text="Browse our product range and add items to your quote request form" 
                  delay={0}
                  speed={12}
                />
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <ClipboardList className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-semibold text-xl md:text-2xl mb-3">2. Submit Request</h4>
              <p className="text-base md:text-lg text-muted-foreground min-h-[56px]">
                <TypewriterText 
                  text="Fill out the quote form with your contact details and project requirements" 
                  delay={1200}
                  speed={12}
                />
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-semibold text-xl md:text-2xl mb-3">3. Receive Quote</h4>
              <p className="text-base md:text-lg text-muted-foreground min-h-[56px]">
                <TypewriterText 
                  text="Get your final quote with trade discounts and accurate lead times via email" 
                  delay={2400}
                  speed={12}
                />
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">INDUSTRY SOLUTIONS</h2>
            <p className="text-lg text-muted-foreground min-h-[28px]">
              <TypewriterText 
                text="No matter what field you're in, we have the perfect solution for you." 
                delay={0}
                speed={15}
              />
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry) => (
              <Link key={industry.name} href={industry.url}>
                <Card className="group overflow-hidden h-56 relative hover-elevate active-elevate-2 transition-all cursor-pointer border-border" data-testid={`card-industry-${industry.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${industry.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-semibold text-white text-center">{industry.name}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Why Choose Dewater Products */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">why choose us</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Dewater Products</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto min-h-[28px]">
              <TypewriterText 
                text="Trusted by civil contractors, water authorities, irrigation specialists, and industrial maintenance companies across Australia" 
                delay={0}
                speed={12}
              />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Locally Stocked</h4>
              <p className="text-sm text-muted-foreground">Fast dispatch from Perth warehouse, ready to ship</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Certified Quality</h4>
              <p className="text-sm text-muted-foreground">AS/NZS, WRAS, and ISO certified products</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Fast Nationwide Delivery</h4>
              <p className="text-sm text-muted-foreground">Quick turnaround times across Australia</p>
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
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">who we are</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">ABOUT US</h2>
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                The leader in industrial pipe fittings and valves
              </h3>
              <p className="text-base text-foreground/80 mb-6 leading-relaxed min-h-[72px]">
                <TypewriterText 
                  text="Recognised as industry leaders in industrial pipe fittings engineering, we are an Australian owned and operated business. deWater Products specialises in premium pipe couplings, valves, expansion joints, and strainers from trusted brands like Straub, Orbit, and Teekay." 
                  delay={0}
                  speed={12}
                />
              </p>
              <p className="text-base text-foreground/80 mb-8 leading-relaxed min-h-[48px]">
                <TypewriterText 
                  text="Supplying the Australian market since 2015, our commitment to quality ensures we provide the most reliable solutions for water treatment, mining, irrigation, and industrial applications." 
                  delay={2500}
                  speed={12}
                />
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
                <p className="text-muted-foreground mb-4 min-h-[48px]">
                  <TypewriterText 
                    text="Exclusive partnerships with Straub, Orbit, and Teekay ensure genuine products and factory support" 
                    delay={0}
                    speed={12}
                  />
                </p>
              </Card>
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Technical Transparency</h4>
                <p className="text-muted-foreground mb-4 min-h-[48px]">
                  <TypewriterText 
                    text="Detailed specs, drawings, and pressure ratings available for every product to support your approval process" 
                    delay={1200}
                    speed={12}
                  />
                </p>
              </Card>
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Trade Accounts Welcome</h4>
                <p className="text-muted-foreground min-h-[48px]">
                  <TypewriterText 
                    text="Competitive trade pricing and bulk ordering for contractors and industrial clients" 
                    delay={2400}
                    speed={12}
                  />
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">got questions?</p>
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
                We are authorized distributors for Straub, Orbit Couplings, and Teekay - all industry-leading manufacturers of pipe fittings, couplings, valves, and expansion joints. All products are genuine and come with full factory support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                How do I request a quote?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Simply browse our product catalog, add items to your quote cart, and submit the request form with your contact details and project requirements. Our team will respond with competitive pricing and lead times within 24 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do you offer volume discounts?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes! We offer automatic volume discounts: 5% off for 2-4 items, 10% off for 5-9 items, and 15% off for 10+ items. Discounts apply to your entire order and are calculated automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Where do you deliver?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                We deliver Australia-wide with FREE delivery to all metro areas. Items are dispatched from our Perth warehouse with fast turnaround times across the country. Express delivery options are available for urgent requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Are technical specifications available?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Absolutely. Every product page includes detailed technical specifications, pressure ratings, material certifications, and downloadable PDF datasheets. We provide complete transparency to support your approval and engineering processes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do you offer trade accounts?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes, we welcome trade accounts for contractors, industrial clients, and water authorities. Trade customers receive competitive pricing, bulk ordering options, and dedicated account management. Contact us to set up your account.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
