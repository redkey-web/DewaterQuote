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
import CurvedText from "@/components/CurvedText"
import ScrambleCycleText from "@/components/ScrambleCycleText"
import OrderingGuide from "@/components/OrderingGuide"

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
  const [isMobile, setIsMobile] = useState(false)
  const heroSearchRef = useRef<HTMLDivElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

  // Search placeholder phrases for typewriter effect
  const searchPhrasesDesktop = [
    "Search pipe fittings, valves",
    "Butterfly valves, check valves",
    "Straub, Orbit flex-grip",
    "Y strainers, basket strainers",
    "Expansion joints, pipe repair",
  ]

  // Shorter phrases for mobile to prevent line wrap
  const searchPhrasesMobile = [
    "Search fittings, valves",
    "Butterfly valves",
    "Straub, Orbit",
    "Y strainers",
    "Expansion joints",
  ]

  const searchPhrases = isMobile ? searchPhrasesMobile : searchPhrasesDesktop

  // Detect mobile viewport for shorter typewriter phrases
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-focus removed - cursor should not be in search bar on page load

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

      {/* Ordering Guide - sticky frosted glass popup */}
      <OrderingGuide />

      {/* Hero Section */}
      <FluidHero
        photoSrc="/images/hero-pipeline.webp"
        radius={320}
        effect="radial"
        underlayBrightness={0.6}
        className="-mt-[90px] pb-16 min-h-[calc(60vh+90px+110px)] md:min-h-[calc(65vh+90px+110px)] lg:min-h-[calc(70vh+90px+130px)] flex items-center justify-center"
      >
        {/* Typewriter text ABOVE Pipeline Repairs */}
        <div className="absolute left-[-344px] bottom-[-171px] z-20 pointer-events-none hidden md:block">
          <div className="relative">
            <span
              className="absolute inset-0 text-[12px] font-semibold tracking-[0.25em] text-white/15 uppercase whitespace-nowrap"
              style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.4)', transform: 'translate(1px, 1px)' }}
              aria-hidden="true"
            >
              <TypewriterPlaceholder
                phrases={['Engineering Supply', 'All components inspected before dispatch']}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2500}
              />
            </span>
            <span
              className="relative font-mono text-[11px] font-bold tracking-[0.25em] text-cyan-300/70 uppercase whitespace-nowrap"
              style={{ textShadow: '0 0 15px rgba(103, 232, 249, 0.5)' }}
            >
              <TypewriterPlaceholder
                phrases={['Engineering Supply', 'All components inspected before dispatch']}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2500}
                isShadowLayer={false}
                brokenLetters={[{ word: 'dispatch', letterIndex: 4 }]}
              />
            </span>
          </div>
        </div>

        {/* Pipeline Repairs & Maintenance - scramble cycle effect */}
        <div className="absolute left-[-344px] bottom-[-191px] z-20 pointer-events-none hidden md:block">
          <div className="relative">
            <span
              className="absolute inset-0 text-[14px] font-medium tracking-[0.3em] text-white/40 uppercase whitespace-nowrap animate-anemic-flicker"
              style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)', transform: 'translate(1px, 1px)' }}
              aria-hidden="true"
            >
              <ScrambleCycleText
                phrases={['FOR PIPELINE REPAIRS & MAINTENANCE', 'INDUSTRIAL PIPE FITTINGS SPECIALISTS']}
                interval={10000}
              />
            </span>
            <span
              className="relative font-mono text-[13px] font-bold tracking-[0.3em] uppercase whitespace-nowrap text-cyan-300/70"
              style={{ textShadow: '0 0 20px rgba(103, 232, 249, 0.5)' }}
            >
              <ScrambleCycleText
                phrases={['FOR PIPELINE REPAIRS & MAINTENANCE', 'INDUSTRIAL PIPE FITTINGS SPECIALISTS']}
                interval={10000}
                isShadowLayer={false}
                brokenLetters={[
                  { word: 'MAINTENANCE', letterIndex: 2 },
                  { word: 'FITTINGS', letterIndex: -1 },
                  { word: 'SPECIALISTS', letterIndex: -1 }
                ]}
              />
            </span>
          </div>
        </div>

        {/* Typewriter text BELOW Pipeline Repairs */}
        <div className="absolute left-[-344px] bottom-[-211px] z-20 pointer-events-none hidden md:block">
          <div className="relative">
            <span
              className="absolute inset-0 text-[12px] font-semibold tracking-[0.25em] text-white/15 uppercase whitespace-nowrap"
              style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.4)', transform: 'translate(1px, 1px)' }}
              aria-hidden="true"
            >
              <TypewriterPlaceholder
                phrases={['Range of materials including SS316', 'Materials certificates available']}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2500}
              />
            </span>
            <span
              className="relative font-mono text-[11px] font-bold tracking-[0.25em] text-cyan-300/70 uppercase whitespace-nowrap"
              style={{ textShadow: '0 0 15px rgba(103, 232, 249, 0.5)' }}
            >
              <TypewriterPlaceholder
                phrases={['Range of materials including SS316', 'Materials certificates available']}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2500}
              />
            </span>
          </div>
        </div>

        {/* Orbiting curved text - Set 1 - teal layer (desktop only) */}
        {/* Positioned on pipe coupling's circular opening, scales with viewport */}
        <div className="hidden md:block absolute z-0 pointer-events-none top-[79%] left-[23%] -translate-x-1/2 -translate-y-1/2 scale-[0.77] md:scale-[0.93] lg:scale-[1.05] xl:scale-[1.16] origin-center">
          <div style={{ perspective: '1200px', transform: 'rotateX(10deg) rotateY(20deg)' }}>
            <div className="animate-orbit-3d-11" style={{ transformOrigin: 'center center' }}>
              <div style={{ filter: 'drop-shadow(0 0 12px rgba(103, 232, 249, 0.4))' }}>
                {/* Mobile version - smaller */}
                <div className="block md:hidden">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE"
                    width={320} height={320} radius={105} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-cyan-300 text-[10px] font-bold tracking-[0.1em] font-mono"
                    letterOpacities={[0.5, 0.65, 0.45, 0.7, 0.55, 0.4, 0.6, 0.5, 0.75, 0.45, 0.55, 0.65, 0.4, 0.7, 0.5, 0.6, 0.45, 0.55, 0.7, 0.4]}
                  />
                </div>
                {/* Desktop version - full size */}
                <div className="hidden md:block">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE • FOOD & BEVERAGE • WATER & WASTEWATER • IRRIGATION"
                    width={561} height={561} radius={182} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-cyan-300 text-[14px] font-bold tracking-[0.12em] font-mono"
                    letterOpacities={[0.5, 0.65, 0.45, 0.7, 0.55, 0.4, 0.6, 0.5, 0.75, 0.45, 0.55, 0.65, 0.4, 0.7, 0.5, 0.6, 0.45, 0.55, 0.7, 0.4]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting curved text - Set 1 - white layer (desktop only) */}
        <div className="hidden md:block absolute z-0 pointer-events-none top-[79%] left-[23%] -translate-x-1/2 -translate-y-1/2 scale-[0.77] md:scale-[0.93] lg:scale-[1.05] xl:scale-[1.16] origin-center">
          <div style={{ perspective: '1200px', transform: 'rotateX(10deg) rotateY(20deg) translateZ(20px)' }}>
            <div className="animate-orbit-3d-11" style={{ transformOrigin: 'center center', animationDelay: '0.04s' }}>
              <div style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))' }}>
                {/* Mobile version - smaller */}
                <div className="block md:hidden">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE"
                    width={320} height={320} radius={105} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-white text-[10px] font-bold tracking-[0.1em] font-mono"
                    letterOpacities={[0.25, 0.3, 0, 0.2, 0.35, 0.15, 0, 0.25, 0.3, 0.1, 0.2, 0.35, 0.25, 0, 0.3, 0.2, 0.15, 0.35, 0, 0.25, 0.3, 0.1, 0.2, 0, 0.25]}
                  />
                </div>
                {/* Desktop version - full size */}
                <div className="hidden md:block">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE • FOOD & BEVERAGE • WATER & WASTEWATER • IRRIGATION"
                    width={561} height={561} radius={182} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-white text-[14px] font-bold tracking-[0.12em] font-mono"
                    letterOpacities={[0.25, 0.3, 0, 0.2, 0.35, 0.15, 0, 0.25, 0.3, 0.1, 0.2, 0.35, 0.25, 0, 0.3, 0.2, 0.15, 0.35, 0, 0.25, 0.3, 0.1, 0.2, 0, 0.25]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting curved text - Set 2 (enlarged 2x) - teal layer (mobile only) */}
        <div className="block md:hidden absolute z-0 pointer-events-none top-[66%] left-[32%] -translate-x-1/2 -translate-y-1/2 scale-[1.60] md:scale-[1.90] lg:scale-[2.12] xl:scale-[2.36] origin-center">
          <div style={{ perspective: '1200px', transform: 'rotateX(10deg) rotateY(20deg)' }}>
            <div className="animate-orbit-3d-11" style={{ transformOrigin: 'center center' }}>
              <div style={{ filter: 'drop-shadow(0 0 12px rgba(103, 232, 249, 0.4))' }}>
                <div className="block md:hidden">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE"
                    width={320} height={320} radius={105} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-cyan-300 text-[10px] font-bold tracking-[0.1em] font-mono"
                    letterOpacities={[0.5, 0.65, 0.45, 0.7, 0.55, 0.4, 0.6, 0.5, 0.75, 0.45, 0.55, 0.65, 0.4, 0.7, 0.5, 0.6, 0.45, 0.55, 0.7, 0.4]}
                  />
                </div>
                <div className="hidden md:block">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE • FOOD & BEVERAGE • WATER & WASTEWATER • IRRIGATION"
                    width={561} height={561} radius={182} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-cyan-300 text-[14px] font-bold tracking-[0.12em] font-mono"
                    letterOpacities={[0.5, 0.65, 0.45, 0.7, 0.55, 0.4, 0.6, 0.5, 0.75, 0.45, 0.55, 0.65, 0.4, 0.7, 0.5, 0.6, 0.45, 0.55, 0.7, 0.4]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Set 2 - white layer (mobile only) */}
        <div className="block md:hidden absolute z-0 pointer-events-none top-[66%] left-[32%] -translate-x-1/2 -translate-y-1/2 scale-[1.60] md:scale-[1.90] lg:scale-[2.12] xl:scale-[2.36] origin-center">
          <div style={{ perspective: '1200px', transform: 'rotateX(10deg) rotateY(20deg) translateZ(20px)' }}>
            <div className="animate-orbit-3d-11" style={{ transformOrigin: 'center center', animationDelay: '0.04s' }}>
              <div style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))' }}>
                <div className="block md:hidden">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE"
                    width={320} height={320} radius={105} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-white text-[10px] font-bold tracking-[0.1em] font-mono"
                    letterOpacities={[0.25, 0.3, 0, 0.2, 0.35, 0.15, 0, 0.25, 0.3, 0.1, 0.2, 0.35, 0.25, 0, 0.3, 0.2, 0.15, 0.35, 0, 0.25, 0.3, 0.1, 0.2, 0, 0.25]}
                  />
                </div>
                <div className="hidden md:block">
                  <CurvedText
                    text="WE SUPPLY • MINING • CONSTRUCTION • MARINE • FOOD & BEVERAGE • WATER & WASTEWATER • IRRIGATION"
                    width={561} height={561} radius={182} arcAngle={340} startAngle={170} startOffset="50%"
                    className="overflow-visible"
                    textClassName="fill-white text-[14px] font-bold tracking-[0.12em] font-mono"
                    letterOpacities={[0.25, 0.3, 0, 0.2, 0.35, 0.15, 0, 0.25, 0.3, 0.1, 0.2, 0.35, 0.25, 0, 0.3, 0.2, 0.15, 0.35, 0, 0.25, 0.3, 0.1, 0.2, 0, 0.25]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical red text - R083R7 - always visible */}
        <div className="absolute right-4 md:right-8 top-[105%] font-mono text-red-500 text-xs z-20" style={{ writingMode: "vertical-rl" }}>
          R083R7
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 text-center py-16 md:py-20 pt-[calc(25vh+50px)] md:pt-[110px] relative">
          {/* Headline - H1 for SEO */}
          <h1 className="font-comfortaa text-xl md:text-2xl font-bold mb-4 tracking-wide drop-shadow-md text-white/90">
            Industrial Pipe Fittings & Valves Australia
          </h1>

          <div className="relative left-1/2 -translate-x-1/2 w-[calc(100vw-40px)] md:w-[calc(100%+160px)] max-w-[1260px] md:max-w-[1500px]" ref={heroSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              {/* Search Bar */}
              <div className="relative">
                {isSearching ? (
                  <Loader2 className={`absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 animate-spin z-10 transition-colors ${isSearchFocused ? "text-gray-700" : "text-white"}`} />
                ) : (
                  <Image
                    src="/images/dewater-icon.webp"
                    alt=""
                    width={32}
                    height={32}
                    className={`absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 transition-opacity -scale-y-100 w-6 h-6 md:w-8 md:h-8 ${isSearchFocused ? "opacity-70" : "opacity-100"}`}
                  />
                )}
                <input
                  ref={heroInputRef}
                  type="text"
                  className="relative w-full h-11 md:h-16 pl-12 md:pl-[72px] pr-4 md:pr-6 text-base md:text-lg font-mono font-normal text-gray-700 rounded-xl md:rounded-2xl bg-gray-100/70 backdrop-blur-[2px] border-2 border-primary shadow-[inset_0_0_6px_rgba(0,77,77,0.75),inset_0_3px_8px_rgba(255,255,255,0.4),inset_0_0_2px_rgba(255,255,255,0.15),0_12px_48px_rgba(0,0,0,0.25),0_2px_2px_rgba(57,197,218,0.12)] focus:outline-none focus:bg-white focus:text-gray-900 focus:border-primary focus:shadow-[inset_0_2px_6px_rgba(0,0,0,0.08),0_4px_20px_rgba(57,197,218,0.25)] transition-all"
                  data-testid="input-hero-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    if (searchResults.length > 0) setShowResults(true)
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {/* Static placeholder - shows when empty and not focused */}
                {!searchQuery && !isSearchFocused && (
                  <div className="absolute left-12 md:left-[72px] top-1/2 -translate-y-1/2 text-base md:text-lg font-mono font-normal text-gray-700 pointer-events-none">
                    <span>Search products...</span>
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
        </div>
      </FluidHero>

      {/* Brand Logos - Infinite Scroll Carousel (4 copies for seamless loop) */}
      <section className="pb-0 pt-2 overflow-hidden relative -mt-[60px] z-10 brand-carousel-gradient-blur brand-scroll-3d">
        <div className="brand-carousel-wrapper">
          <div className="brand-carousel-track-seamless">
            {/* 4 copies for truly seamless infinite scroll */}
            {[0, 1, 2, 3].map((copyIndex) => (
              <div
                key={copyIndex}
                className="brand-carousel-content"
                aria-hidden={copyIndex > 0}
              >
                <Link href="/straub-couplings" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/straub-logo.png"
                    alt="Straub"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                    priority={copyIndex === 0}
                  />
                </Link>
                <Link href="/orbit-couplings" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/orbit-couplings.png"
                    alt="Orbit Couplings"
                    width={270}
                    height={90}
                    className="h-[51px] w-auto object-contain"
                    priority={copyIndex === 0}
                  />
                </Link>
                <Link href="/teekay" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/teekay-logo.png"
                    alt="Teekay"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <Link href="/defender-valves" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/defender-valves-logo.png"
                    alt="Defender Valves"
                    width={200}
                    height={60}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <Link href="/bore-flex" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/bore-flex-rubber-logo.png"
                    alt="Bore-Flex Rubber"
                    width={1080}
                    height={360}
                    className="h-[88px] w-auto object-contain"
                  />
                </Link>
                <Link href="/defender-strainers" className="flex-shrink-0 px-8 brand-logo-link" tabIndex={copyIndex > 0 ? -1 : undefined}>
                  <Image
                    src="/images/brands/defender-strainers-logo.png"
                    alt="Defender Strainers"
                    width={414}
                    height={142}
                    className="h-[46px] w-auto object-contain"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="sr-only">Browse Pipe Fittings by Category</h2>
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
            backgroundImage: 'url(/images/why-choose-bg.webp)',
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
                We specialise in <Link href="/pipe-couplings" className="text-primary hover:underline">pipe couplings</Link>, <Link href="/industrial-valves" className="text-primary hover:underline">industrial valves</Link>, <Link href="/expansion-joints" className="text-primary hover:underline">expansion joints</Link>, and <Link href="/strainers" className="text-primary hover:underline">strainers</Link> from world-leading manufacturers including Straub, Orbit, Teekay, Defender Valves, and Bore-Flex. Every product is genuine, backed by full factory support and detailed technical specifications.
              </p>
              <p className="text-base text-foreground/80 mb-8 leading-relaxed">
                Based in Perth, Western Australia, we've been supplying water treatment, mining, irrigation, and industrial projects across Australia since 2015. Our warehouse stocks a comprehensive range with fast delivery to all metro areas and expert technical support for every application.
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
        {/* Floating blob group 1 - cyan/teal */}
        <div className="absolute -left-32 top-1/4 w-96 h-96 pointer-events-none animate-blob-float-1">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-transparent blur-3xl" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-cyan-400/25 to-transparent blur-2xl" />
        </div>
        {/* Floating blob group 2 - blue/purple */}
        <div className="absolute -right-32 bottom-1/4 w-80 h-80 pointer-events-none animate-blob-float-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-blue-500/25 via-indigo-400/20 to-transparent blur-3xl" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-tl from-blue-400/20 to-transparent blur-2xl" />
        </div>
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

      {/* FAQPage Schema for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What brands do you stock?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We are authorized distributors for Straub, Orbit Couplings, Teekay, and Defender Valves - all industry-leading manufacturers of pipe fittings, couplings, valves, and expansion joints. All products are genuine and come with full factory support."
                }
              },
              {
                "@type": "Question",
                name: "How do I request a quote?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simply browse our product catalog, add items to your quote cart, and submit the request form with your contact details and project requirements. Our team will respond with competitive pricing and lead times within 24 hours."
                }
              },
              {
                "@type": "Question",
                name: "Do you offer bulk pricing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! We offer automatic bulk discounts: 5% off when you buy 2-4, 10% off for 5-9, and 15% off for 10+. Discounts are calculated automatically and shown in your quote."
                }
              },
              {
                "@type": "Question",
                name: "Where do you deliver?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We deliver Australia-wide with FREE delivery to all metro areas. Items are dispatched from our Perth warehouse with fast turnaround times across the country. Express delivery options are available for urgent requirements."
                }
              },
              {
                "@type": "Question",
                name: "Are technical specifications available?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. Every product page includes detailed technical specifications, pressure ratings, material certifications, and downloadable PDF datasheets. We provide complete transparency to support your approval and engineering processes."
                }
              }
            ]
          })
        }}
      />
    </div>
  )
}
