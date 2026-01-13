"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import GeoStock from "@/components/GeoStock"
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
  Loader2,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import FluidHero from "@/components/FluidHero"
import TypewriterPlaceholder from "@/components/TypewriterPlaceholder"

interface SearchResult {
  id: number
  name: string
  fullName: string
  slug: string
  category: string
  categoryName: string
  brand: string
  description: string
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const heroSearchRef = useRef<HTMLDivElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

  // Search placeholder phrases for typewriter effect
  const searchPhrases = [
    "Search pipe fittings, valves, couplings",
    "Butterfly valves, check valves",
    "Straub couplings, Orbit flex-grip",
    "Y strainers, basket strainers",
    "Expansion joints, pipe repair",
  ]

  // Auto-focus hero search on mount (after a small delay to show typewriter)
  useEffect(() => {
    const timer = setTimeout(() => {
      heroInputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSearchResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleResultClick = (slug: string) => {
    setShowResults(false)
    setSearchQuery("")
    router.push(`/${slug}`)
  }

  const productCategories = [
    {
      name: "Valves",
      url: "/industrial-valves",
      image: "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/BCV316TE/BCV316TE_1.png",
      alt: "Industrial Valves",
    },
    {
      name: "Pipe Couplings",
      url: "/pipe-couplings",
      image: "/images/products/orbit/flex-grip-l.jpg",
      alt: "Pipe Couplings",
    },
    {
      name: "Expansion Joints",
      url: "/expansion-joints",
      image: "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/DAREJ/DAREJ_1.png",
      alt: "Expansion Joints",
    },
    {
      name: "Strainers & Filters",
      url: "/strainers",
      image: "https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/OSSBS/OSSBS_1.png",
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
      <BulkPricingTicker variant="teal" />

      {/* Hero Section - Fluid Cursor Reveal Effect (Easter egg: click red butterfly valve to toggle) */}
      <FluidHero
        photoSrc="/images/hero-pipeline.webp"
        illustrationSrc="/images/hero-illustration-industrial.webp"
        radius={320}
        effect="radial"
        underlayBrightness={0.6}
        className="-mt-[90px] pb-16 min-h-[calc(60vh+90px+110px)] md:min-h-[calc(65vh+90px+110px)] lg:min-h-[calc(70vh+90px+130px)] flex items-center justify-center"
        enableHotspot={{ x: 62, y: 35, width: 15, height: 20 }} // Red butterfly valve position
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center py-16 md:py-20 pt-[106px] md:pt-[110px]">
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-4 tracking-wide drop-shadow-md">
            Australia's Industrial Pipe Fittings Specialists
          </p>
          <div className="relative w-full max-w-2xl mx-auto" ref={heroSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              {/* Search Bar */}
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-spin z-10" />
                ) : (
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary z-10" />
                )}
                <input
                  ref={heroInputRef}
                  type="text"
                  className="relative w-full h-14 md:h-16 pl-14 pr-6 text-lg font-bold rounded-2xl bg-black/30 backdrop-blur-sm border-2 border-primary shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),0_4px_12px_rgba(57,197,218,0.15)] focus:outline-none focus:bg-white focus:border-primary focus:shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),0_4px_20px_rgba(57,197,218,0.25)] transition-all"
                  data-testid="input-hero-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    if (searchResults.length > 0) setShowResults(true)
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {/* Typewriter placeholder - shows when empty and not focused */}
                {!searchQuery && !isSearchFocused && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-400 pointer-events-none">
                    <TypewriterPlaceholder
                      phrases={searchPhrases}
                      typingSpeed={60}
                      deletingSpeed={30}
                      pauseDuration={2500}
                    />
                  </div>
                )}
              </div>
            </form>
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50 text-left">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-foreground">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.brand} • {result.categoryName}</div>
                  </button>
                ))}
                {searchQuery.trim() && (
                  <button
                    onClick={handleSearchSubmit as React.MouseEventHandler}
                    className="w-full text-left px-4 py-3 text-primary hover:bg-primary/10 transition-colors font-medium border-t border-border"
                  >
                    View all results for "{searchQuery}"
                  </button>
                )}
              </div>
            )}
            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-2xl p-4 z-50 text-left">
                <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>
          {/* Category Dropdowns */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
            {/* Couplings */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-normal bg-white/5 rounded-full border border-white/10 hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-200 focus:outline-none">
                Couplings <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/80 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link href="/pipe-couplings" className="w-full cursor-pointer">Pipe Couplings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pipe-repair" className="w-full cursor-pointer">Pipe Repair Clamps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/flange-adaptors" className="w-full cursor-pointer">Flange Adaptors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/muff-couplings" className="w-full cursor-pointer">Muff Couplings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Valves */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-normal bg-white/5 rounded-full border border-white/10 hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-200 focus:outline-none">
                Valves <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/80 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link href="/industrial-valves" className="w-full cursor-pointer">All Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/butterfly-valves" className="w-full cursor-pointer">Butterfly Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/check-valves" className="w-full cursor-pointer">Check Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/duckbill-check-valves" className="w-full cursor-pointer">Duckbill Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/gate-valves" className="w-full cursor-pointer">Gate Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ball-valves" className="w-full cursor-pointer">Ball Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/float-valves" className="w-full cursor-pointer">Float Valves</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/foot-valves" className="w-full cursor-pointer">Foot Valves</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Expansion Joints */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-normal bg-white/5 rounded-full border border-white/10 hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-200 focus:outline-none">
                Expansion Joints <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/80 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link href="/expansion-joints" className="w-full cursor-pointer">All Expansion Joints</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/single-sphere-expansion-joints" className="w-full cursor-pointer">Single Sphere</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/twin-sphere-expansion-joints" className="w-full cursor-pointer">Twin Sphere</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/single-arch-expansion-joints" className="w-full cursor-pointer">Single Arch</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/double-arch-expansion-joints" className="w-full cursor-pointer">Double Arch</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reducing-expansion-joints" className="w-full cursor-pointer">Reducing</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Strainers */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-normal bg-white/5 rounded-full border border-white/10 hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-200 focus:outline-none">
                Strainers <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/80 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link href="/strainers" className="w-full cursor-pointer">All Strainers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/y-strainers" className="w-full cursor-pointer">Y Strainers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/basket-strainers" className="w-full cursor-pointer">Basket Strainers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/duplex-basket-strainers" className="w-full cursor-pointer">Duplex Strainers</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </FluidHero>

      {/* Brand Logos - Infinite Scroll Carousel */}
      <section className="pb-0 pt-2 overflow-hidden relative -mt-[60px] z-10 brand-carousel-gradient-blur brand-scroll-3d">
        <div className="brand-carousel-wrapper">
          <div className="brand-carousel-track">
            {/* First set of logos */}
            <div className="brand-carousel-content">
              <Link href="/straub-couplings" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/straub-logo.png"
                  alt="Straub"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
              <Link href="/orbit-couplings" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/orbit-couplings.png"
                  alt="Orbit Couplings"
                  width={270}
                  height={90}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </Link>
              <Link href="/teekay" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/teekay-logo.png"
                  alt="Teekay"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
              </Link>
              <Link href="/defender-valves" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/defender-valves-logo.png"
                  alt="Defender Valves"
                  width={200}
                  height={60}
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
              </Link>
              <Link href="/bore-flex" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/bore-flex-rubber-logo.png"
                  alt="Bore-Flex Rubber"
                  width={1080}
                  height={360}
                  className="h-[110px] w-auto object-contain"
                  loading="lazy"
                />
              </Link>
              <Link href="/defender-strainers" className="flex-shrink-0 px-8 brand-logo-link">
                <Image
                  src="/images/brands/defender-strainers-logo.png"
                  alt="Defender Strainers"
                  width={414}
                  height={142}
                  className="h-[58px] w-auto object-contain"
                  loading="lazy"
                />
              </Link>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="brand-carousel-content" aria-hidden="true">
              <Link href="/straub-couplings" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/straub-logo.png"
                  alt="Straub"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <Link href="/orbit-couplings" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/orbit-couplings.png"
                  alt="Orbit Couplings"
                  width={270}
                  height={90}
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <Link href="/teekay" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/teekay-logo.png"
                  alt="Teekay"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <Link href="/defender-valves" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/defender-valves-logo.png"
                  alt="Defender Valves"
                  width={200}
                  height={60}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <Link href="/bore-flex" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/bore-flex-rubber-logo.png"
                  alt="Bore-Flex Rubber"
                  width={1080}
                  height={360}
                  className="h-[110px] w-auto object-contain"
                />
              </Link>
              <Link href="/defender-strainers" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={-1}>
                <Image
                  src="/images/brands/defender-strainers-logo.png"
                  alt="Defender Strainers"
                  width={414}
                  height={142}
                  className="h-[58px] w-auto object-contain"
                />
              </Link>
            </div>
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
                      className="flex items-center text-[hsl(189,68%,55%)] dark:text-[hsl(189,68%,60%)] text-sm font-medium transition-all duration-300 group-hover:text-[hsl(189,68%,70%)] dark:group-hover:text-[hsl(189,68%,75%)]"
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

      {/* Why Choose Us - Condensed */}
      <section className="py-8 px-6 lg:px-8 bg-[#3A9CA5] text-white relative overflow-hidden">
        {/* Background overlay - fixed position */}
        <div
          className="absolute inset-0 pointer-events-none grayscale"
          style={{
            backgroundImage: 'url(/images/why-choose-bg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            opacity: 0.12
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-white flex-shrink-0" />
              <GeoStock />
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-white flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Certified Quality</p>
                <p className="text-xs text-white/70">AS/NZS, WRAS, ISO</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-white flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-white/70">Metro Areas Only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-white flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Expert Support</p>
                <p className="text-xs text-white/70"><a href="tel:1300271290" className="hover:text-white transition-colors">Free Call</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                Perth-Based Specialists
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">QUALITY PIPE FITTINGS FOR AUSTRALIAN INDUSTRY</h2>
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                Trusted brands, technical expertise, and genuine factory support
              </h3>
              <p className="text-base text-foreground/80 mb-6 leading-relaxed">
                We specialise in pipe couplings, valves, expansion joints, and strainers from world-leading manufacturers including Straub, Orbit, Teekay, Defender Valves, and Bore-Flex. Every product is genuine, backed by full factory support and detailed technical specifications.
              </p>
              <p className="text-base text-foreground/80 mb-8 leading-relaxed">
                Since 2015, we've been supplying water treatment, mining, irrigation, and industrial projects across Australia. Our Perth warehouse stocks a comprehensive range with fast delivery to all metro areas and expert technical support for every application.
              </p>
              <Link href="/about">
                <Button size="lg" data-testid="button-learn-more">
                  Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Trusted Brands</h4>
                <p className="text-muted-foreground mb-4">
                  Direct partnerships with manufacturers like Straub, Orbit, and Teekay ensuring genuine products with factory support
                </p>
              </Card>
              <Card className="p-8">
                <h4 className="font-semibold text-xl mb-3">Technical Transparency</h4>
                <p className="text-muted-foreground mb-4">
                  Detailed specs, drawings, and pressure ratings available for every product to support your approval process
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
              Quick & Easy
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HOW TO USE OUR QUOTE SYSTEM</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Request a quote in three easy steps and receive competitive pricing with detailed lead times
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),inset_0_-1px_3px_rgba(255,255,255,0.4)]">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">1. Browse & Select</h4>
              <p className="text-muted-foreground">
                Browse our product range and add items to your quote request form
              </p>
            </div>
            <div className="p-8 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),inset_0_-1px_3px_rgba(255,255,255,0.4)]">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">2. Submit Request</h4>
              <p className="text-muted-foreground">
                Fill out the quote form with your contact details and project requirements
              </p>
            </div>
            <div className="p-8 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),inset_0_-1px_3px_rgba(255,255,255,0.4)]">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-xl mb-3">3. Receive Quote</h4>
              <p className="text-muted-foreground">
                Get your final quote with trade discounts and accurate lead times via email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        {/* Glowing pipes pattern underlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'url(/images/hero-pipeline.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'brightness(0.4) contrast(1.2)',
            mixBlendMode: 'screen'
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">INDUSTRY SOLUTIONS</h2>
            <p className="text-lg text-gray-300">
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
                We are authorized distributors for Straub, Orbit Couplings, Teekay, and Defender Valves - all
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
                Do you offer bulk pricing?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes! We offer automatic bulk discounts: 5% off when you buy 2-4, 10% off for 5-9,
                and 15% off for 10+. Discounts are calculated automatically and shown in your quote.
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

          </Accordion>
        </div>
      </section>
    </div>
  )
}
