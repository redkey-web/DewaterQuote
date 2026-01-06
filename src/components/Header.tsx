"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClipboardList, Menu, X, ChevronDown, ChevronRight, Phone, Mail, Search, Loader2 } from "lucide-react"
import { useQuote } from "@/context/QuoteContext"

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

export default function Header() {
  const router = useRouter()
  const { itemCount: cartItemCount, openCart } = useQuote()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
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

  const productsMenu = [
    {
      title: "Couplings & Repair",
      url: "/pipe-couplings",
      items: [
        { name: "Pipe Couplings", url: "/pipe-couplings" },
        { name: "Pipe Repair Clamps", url: "/pipe-repair" },
        { name: "Flange Adaptors", url: "/flange-adaptors" },
        { name: "Muff Couplings", url: "/muff-couplings" },
      ],
    },
    {
      title: "Valves",
      url: "/industrial-valves",
      items: [
        { name: "Butterfly Valves", url: "/butterfly-valves" },
        { name: "Check Valves", url: "/check-valves" },
        { name: "Duckbill Valves", url: "/duckbill-check-valves" },
        { name: "Gate Valves", url: "/gate-valves" },
        { name: "Ball Valves", url: "/ball-valves" },
        { name: "Float Valves", url: "/float-valves" },
        { name: "Foot Valves", url: "/foot-valves" },
      ],
    },
    {
      title: "Expansion Joints",
      url: "/expansion-joints",
      items: [
        { name: "Single Sphere", url: "/single-sphere-expansion-joints" },
        { name: "Twin Sphere", url: "/twin-sphere-expansion-joints" },
        { name: "Single Arch", url: "/single-arch-expansion-joints" },
        { name: "Double Arch", url: "/double-arch-expansion-joints" },
        { name: "Reducing", url: "/reducing-expansion-joints" },
      ],
    },
    {
      title: "Strainers",
      url: "/strainers",
      items: [
        { name: "Y Strainers", url: "/y-strainers" },
        { name: "Basket Strainers", url: "/basket-strainers" },
        { name: "Duplex Strainers", url: "/duplex-strainers" },
      ],
    },
  ]

  const industriesMenu = [
    { name: "Mining", url: "/industries/mining" },
    { name: "Construction", url: "/industries/construction" },
    { name: "Marine", url: "/industries/marine" },
    { name: "Food & Beverage", url: "/industries/food-beverage" },
    { name: "Water & Wastewater", url: "/industries/water-wastewater" },
    { name: "Irrigation", url: "/industries/irrigation" },
    { name: "Fire Services", url: "/industries/fire-services" },
    { name: "HVAC", url: "/industries/hvac" },
  ]

  const brandsMenu = [
    { name: "Straub", url: "/straub-couplings" },
    { name: "Orbit", url: "/orbit-couplings" },
    { name: "Teekay", url: "/brands/teekay" },
    { name: "Bore-Flex", url: "/brands/bore-flex-rubber" },
    { name: "Defender Valves", url: "/brands/defender-valves" },
    { name: "Defender Strainers", url: "/brands/defender-strainers" },
  ]

  const moreMenu = [
    { name: "Contact", url: "/contact" },
    { name: "About Us", url: "/about" },
    { name: "Meet the Team", url: "/meet-the-team" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/10 dark:bg-gray-950/10 backdrop-blur-sm overflow-visible">
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
        <div className="flex items-center justify-between py-0 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" data-testid="link-home">
            <Image
              src="/images/logo-new.png"
              alt="Dewater Products - Fluid Piping Components"
              width={480}
              height={160}
              className="h-[143px] md:h-[172px] w-auto object-contain -mt-[23px] -mb-[33px] md:-mt-[30px] md:-mb-[40px]"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:block relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-48 xl:w-64 h-9"
                data-testid="input-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
              />
            </form>
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full text-left px-3 py-2 hover:bg-primary hover:text-white border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-sm truncate">{result.name}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-white/80">{result.brand}</div>
                  </button>
                ))}
                {searchQuery.trim() && (
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary hover:text-white transition-colors font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                )}
              </div>
            )}
            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg p-4 z-50">
                <p className="text-sm text-muted-foreground">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center">
                <Link
                  href="/products"
                  className="text-foreground nav-link-hover-transparent px-3 py-2 rounded-md text-sm"
                  data-testid="link-products"
                >
                  Products
                </Link>
                <button
                  className="flex items-center justify-center text-foreground hover:bg-muted/50 p-1 rounded-md border-l border-border/50"
                  data-testid="button-products-menu"
                  aria-label="Open products menu"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {activeMenu === "products" && (
                <>
                  {/* Invisible bridge to maintain hover */}
                  <div className="absolute top-full left-0 w-full h-4" />
                  <div
                    className="fixed top-[72px] left-1/2 -translate-x-1/2 glass rounded-md shadow-lg p-4 lg:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-[95vw] lg:w-[700px] max-w-[750px] z-50 max-h-[80vh] overflow-y-auto"
                    onMouseEnter={() => setActiveMenu("products")}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                  {productsMenu.map((category) => (
                    <div key={category.title}>
                      <Link
                        href={category.url}
                        className="font-semibold text-sm mb-3 block hover:text-primary"
                        data-testid={`link-category-${category.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {category.title}
                      </Link>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.url}
                              className="block text-sm text-muted-foreground px-2 py-1 rounded nav-dropdown-item"
                              data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                </>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("industries")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground nav-link-hover-transparent px-3 py-2 rounded-md text-sm"
                data-testid="button-industries-menu"
              >
                Industries <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "industries" && (
                <div className="absolute top-full left-0 mt-0 glass rounded-md shadow-lg p-4 w-56">
                  <ul className="space-y-2">
                    {industriesMenu.map((industry) => (
                      <li key={industry.name}>
                        <Link
                          href={industry.url}
                          className="block text-sm text-muted-foreground px-2 py-1 rounded nav-dropdown-item"
                          data-testid={`link-industry-${industry.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {industry.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("brands")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground nav-link-hover-transparent px-3 py-2 rounded-md text-sm"
                data-testid="button-brands-menu"
              >
                Brands <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "brands" && (
                <div className="absolute top-full left-0 mt-0 glass rounded-md shadow-lg p-4 w-48">
                  <ul className="space-y-2">
                    {brandsMenu.map((brand) => (
                      <li key={brand.name}>
                        <Link
                          href={brand.url}
                          className="block text-sm text-muted-foreground px-2 py-1 rounded nav-dropdown-item"
                          data-testid={`link-brand-${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("more")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground nav-link-hover-transparent px-3 py-2 rounded-md text-sm"
                data-testid="button-more-menu"
              >
                More <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "more" && (
                <div className="absolute top-full left-0 mt-0 glass rounded-md shadow-lg p-4 w-48">
                  <ul className="space-y-2">
                    {moreMenu.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.url}
                          className="block text-sm text-muted-foreground px-2 py-1 rounded nav-dropdown-item"
                          data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Contact Info & Quote */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col gap-1">
              <a
                href="tel:1300271290"
                className="flex items-center gap-2 transition-colors text-xs"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-semibold" style={{
                  color: 'white',
                  letterSpacing: '0.05em',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5)'
                }}>1300 271 290</span>
              </a>
              <a
                href="mailto:sales@dewaterproducts.com.au"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span className="hidden xl:inline">sales@dewaterproducts.com.au</span>
                <span className="xl:hidden">Email Us</span>
              </a>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={openCart}
              className="relative"
              data-testid="button-quote"
            >
              <ClipboardList className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button & Quote */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={openCart}
              className="relative"
              data-testid="button-quote-mobile"
            >
              <ClipboardList className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-white dark:bg-gray-950 overflow-y-auto">
            <div className="px-6 py-4">
              <div className="mb-4" ref={mobileSearchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  {isSearching ? (
                    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-9 w-full"
                    data-testid="input-search-mobile"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  />
                </form>
                {/* Mobile Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="mt-2 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.slice(0, 5).map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          handleResultClick(result.slug)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-primary hover:text-white border-b border-border last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-sm truncate">{result.name}</div>
                        <div className="text-xs text-muted-foreground">{result.brand}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <nav className="space-y-1">
              {/* Brands */}
              <div className="py-2">
                <Link href="/brands" className="block text-foreground px-3 py-2 rounded-md font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Brands
                </Link>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {brandsMenu.map((brand) => (
                    <Link
                      key={brand.name}
                      href={brand.url}
                      className="block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="py-2 border-t border-border">
                <Link href="/products" className="block text-foreground px-3 py-2 rounded-md font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </Link>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {productsMenu.map((category) => (
                    <div key={category.title}>
                      <button
                        onClick={() => setExpandedMobileCategory(
                          expandedMobileCategory === category.title ? null : category.title
                        )}
                        className="flex items-center justify-between w-full text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors"
                      >
                        <span>{category.title}</span>
                        {expandedMobileCategory === category.title ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {expandedMobileCategory === category.title && (
                        <div className="pl-4 space-y-1 border-l border-border/50 ml-3 mb-2">
                          <Link
                            href={category.url}
                            className="block text-xs text-primary hover:text-primary/80 px-3 py-1.5 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            View All {category.title}
                          </Link>
                          {category.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.url}
                              className="block text-xs text-muted-foreground hover:bg-primary hover:text-white px-3 py-1.5 rounded-md transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="py-2 border-t border-border">
                <Link href="/industries" className="block text-foreground px-3 py-2 rounded-md font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Industries
                </Link>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {industriesMenu.map((industry) => (
                    <Link key={industry.name} href={industry.url} className="block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      {industry.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="py-2 border-t border-border space-y-1">
                <Link href="/about" className="block text-foreground px-3 py-2 rounded-md font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" className="block text-foreground px-3 py-2 rounded-md font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </div>

              {/* Contact Info */}
              <div className="py-4 border-t border-border">
                <div className="flex flex-col gap-3 px-3">
                  <a
                    href="tel:1300271290"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-semibold">1300 271 290</span>
                  </a>
                  <a
                    href="mailto:sales@dewaterproducts.com.au"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-sm">sales@dewaterproducts.com.au</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
      </div>
    </header>
  )
}
