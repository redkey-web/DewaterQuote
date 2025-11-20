import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Users, Award, Clock, Search, ClipboardList, Mail, TrendingDown } from "lucide-react";
import TypewriterText from "@/components/TypewriterText";
import constructionImage from "@assets/CONSTRUCTION DEWATERING PRODUCTS-min_1762663874717.webp";
import fireServicesImage from "@assets/FIRE PIPELINE PRODUCTS-min_1762663874717.webp";
import foodBeverageImage from "@assets/FOOD INDUSTRY PIPELINE SUPPLIES-min_1762663874717.webp";
import hvacImage from "@assets/HVAC PIPES AND VALVES ONLINE-min_1762663874717.webp";
import irrigationImage from "@assets/IRRIGATION PIPELINE SUPPLIES-min_1762663874717.webp";
import marineImage from "@assets/MARINE INDUSTRY PIPELINE SUPPLIES-min_1762663874717.webp";
import miningImage from "@assets/MINING INDUSTRY VALVES AND PIPELINE PRODUCTS-min_1762663874717.webp";
import wastewaterImage from "@assets/WASTEWATER PIPELINE SUPPLIER_1762664220723.webp";
const heroImage = "/images/hero-pipes.webp";

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

      {/* Hero Section - Hoseflex Style */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: '60% 15%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/25" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Industry Leading Pipe Fittings & Valves
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-2 max-w-3xl mx-auto font-medium">
            <TypewriterText 
              text="Supplying Australia's pipeline industry since 2015" 
              delay={300}
              speed={20}
              onComplete={() => setHeroComplete(true)}
            />
          </p>
          <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto min-h-[28px]">
            <TypewriterText 
              text="Certified quality • Fast nationwide delivery • Trade pricing" 
              delay={1500}
              speed={15}
              onComplete={() => setHero2Complete(true)}
            />
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Link href="/products">
              <Button 
                size="lg" 
                className="btn-industrial-primary"
                data-testid="button-view-products"
              >
                View Product Range <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/request-quote">
              <Button 
                size="lg" 
                className="btn-industrial-secondary" 
                data-testid="button-request-quote"
              >
                Request a Trade Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar - Brand Logos & USPs */}
      <section className="py-8 px-6 lg:px-8 bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <img src="/images/brands/straub-logo.png" alt="Straub" className="h-8 md:h-10 object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/brands/teekay-logo.png" alt="Teekay" className="h-8 md:h-10 object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/brands/orbit-couplings.png" alt="Orbit Couplings" className="h-8 md:h-10 object-contain p-0 m-0" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>15+ years industry experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Fast Perth warehouse dispatch</span>
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

      {/* Volume Discount Banner */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-y border-primary/20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-6 rounded-full shrink-0">
              <TrendingDown className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Volume Discounts Available</h2>
              <p className="text-muted-foreground mb-4">
                Save more when you order in quantity. Our volume discounts apply automatically to your quote.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-card border border-border rounded-md px-4 py-2">
                  <div className="text-sm text-muted-foreground">2-4 items</div>
                  <div className="text-xl font-bold text-destructive">5% OFF</div>
                </div>
                <div className="bg-card border border-border rounded-md px-4 py-2">
                  <div className="text-sm text-muted-foreground">5-9 items</div>
                  <div className="text-xl font-bold text-destructive">10% OFF</div>
                </div>
                <div className="bg-card border border-border rounded-md px-4 py-2">
                  <div className="text-sm text-muted-foreground">10+ items</div>
                  <div className="text-xl font-bold text-destructive">15% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HOW IT WORKS</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto min-h-[28px]">
              <TypewriterText 
                text="Request a quote in three easy steps and receive competitive pricing with detailed lead times" 
                delay={0}
                speed={15}
              />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">1. Browse & Select</h4>
              <p className="text-muted-foreground min-h-[48px]">
                <TypewriterText 
                  text="Browse our product range and add items to your quote request form" 
                  delay={0}
                  speed={12}
                />
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">2. Submit Request</h4>
              <p className="text-muted-foreground min-h-[48px]">
                <TypewriterText 
                  text="Fill out the quote form with your contact details and project requirements" 
                  delay={1200}
                  speed={12}
                />
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">3. Receive Quote</h4>
              <p className="text-muted-foreground min-h-[48px]">
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
                    <h3 className="text-base font-semibold text-white text-center">{industry.name}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* Brands Section */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FEATURED BRANDS</h2>
            <p className="text-lg text-muted-foreground min-h-[28px]">
              <TypewriterText 
                text="Authorised distributor of industry-leading manufacturers" 
                delay={0}
                speed={15}
              />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/brands/straub">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <div>
                  <img 
                    src="/images/brands/straub-logo.png" 
                    alt="Straub" 
                    className="h-16 mx-auto object-contain"
                  />
                </div>
              </Card>
            </Link>
            <Link href="/brands/orbit">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <div>
                  <img 
                    src="/images/brands/orbit-couplings.png" 
                    alt="Orbit Couplings" 
                    className="h-16 mx-auto object-contain p-0 m-0"
                  />
                </div>
              </Card>
            </Link>
            <Link href="/brands/teekay">
              <Card className="p-8 text-center hover-elevate active-elevate-2 transition-all cursor-pointer">
                <div>
                  <img 
                    src="/images/brands/teekay-logo.png" 
                    alt="Teekay" 
                    className="h-16 mx-auto object-contain"
                  />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
