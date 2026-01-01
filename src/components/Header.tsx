"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClipboardList, Menu, X, ChevronDown, Phone, Mail, Search, Loader2 } from "lucide-react"
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
      title: "Brands",
      url: "/brands",
      items: [
        { name: "Straub Couplings", url: "/brands/straub" },
        { name: "Orbit Couplings", url: "/brands/orbit" },
        { name: "Bore-Flex Rubber", url: "/brands/bore-flex-rubber" },
        { name: "Defender Valves", url: "/brands/defender-valves" },
      ],
    },
    {
      title: "Couplings & Repair",
      url: "/pipe-couplings",
      items: [
        { name: "Pipe Couplings", url: "/pipe-couplings" },
        { name: "Pipe Repair Clamps", url: "/pipe-repair" },
        { name: "Flange Adaptors", url: "/flange-adaptors" },
      ],
    },
    {
      title: "Valves",
      url: "/valves",
      items: [
        { name: "Butterfly Valves", url: "/valves/butterfly-valve" },
        { name: "Check Valves", url: "/valves/check-valves" },
        { name: "Gate Valves", url: "/valves/gate-valve" },
        { name: "Ball Valves", url: "/valves/ball-valve" },
        { name: "Float Valves", url: "/valves/float-valve" },
        { name: "Foot Valves", url: "/valves/foot-valve" },
      ],
    },
    {
      title: "Expansion Joints",
      url: "/rubber-expansion-joints",
      items: [
        { name: "Single Sphere", url: "/rubber-expansion-joints/single-sphere" },
        { name: "Twin Sphere", url: "/rubber-expansion-joints/twin-sphere" },
        { name: "Single Arch", url: "/rubber-expansion-joints/single-arch" },
        { name: "Double Arch", url: "/rubber-expansion-joints/double-arch" },
        { name: "Reducing", url: "/rubber-expansion-joints/reducing" },
      ],
    },
    {
      title: "Strainers",
      url: "/strainers",
      items: [
        { name: "Y Strainers", url: "/strainers/y-strainer" },
        { name: "Simplex Basket", url: "/strainers/simplex-basket-strainer" },
        { name: "Duplex Basket", url: "/strainers/duplex-basket-strainer" },
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

  const moreMenu = [
    { name: "Resources", url: "/resources" },
    { name: "About Us", url: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/10 dark:bg-gray-950/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-0 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 py-0 my-0" data-testid="link-home">
            <Image
              src="/images/logo.png"
              alt="Dewater Products"
              width={200}
              height={138}
              className="h-[117px] md:h-[138px] w-auto object-cover scale-110 block -my-6"
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
                    className="w-full text-left px-3 py-2 hover:bg-primary/10 hover:text-primary border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-sm truncate">{result.name}</div>
                    <div className="text-xs text-muted-foreground">{result.brand}</div>
                  </button>
                ))}
                {searchQuery.trim() && (
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors font-medium"
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
                <div className="absolute top-full left-0 mt-0 bg-popover border border-popover-border rounded-md shadow-lg p-6 grid grid-cols-5 gap-6 w-[900px]">
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
                              className="text-sm text-muted-foreground hover:text-foreground"
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
                <div className="absolute top-full left-0 mt-0 bg-popover border border-popover-border rounded-md shadow-lg p-4 w-56">
                  <ul className="space-y-2">
                    {industriesMenu.map((industry) => (
                      <li key={industry.name}>
                        <Link
                          href={industry.url}
                          className="text-sm text-muted-foreground hover:text-foreground"
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
                <div className="absolute top-full left-0 mt-0 bg-popover border border-popover-border rounded-md shadow-lg p-4 w-48">
                  <ul className="space-y-2">
                    {moreMenu.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.url}
                          className="text-sm text-muted-foreground hover:text-foreground"
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

            <Link href="/contact" className="text-foreground nav-link-hover-transparent px-3 py-2 rounded-md text-sm" data-testid="link-contact">
              Contact
            </Link>
          </nav>

          {/* Contact Info & Quote */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col gap-1">
              <a
                href="tel:0892712577"
                className="flex items-center gap-2 transition-colors text-xs"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-semibold" style={{
                  color: 'white',
                  letterSpacing: '0.05em',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5)'
                }}>(08) 9271 2577</span>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
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
                <div className="mt-2 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        handleResultClick(result.slug)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-primary/10 hover:text-primary border-b border-border last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-sm truncate">{result.name}</div>
                      <div className="text-xs text-muted-foreground">{result.brand}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <nav className="space-y-4">
              <Link href="/products" className="block text-foreground hover-elevate px-3 py-2 rounded-md font-semibold" data-testid="link-mobile-products">
                All Products
              </Link>
              <div className="pl-3 space-y-2 border-l-2 border-primary/30 ml-3">
                <Link href="/valves" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Valves
                </Link>
                <Link href="/pipe-couplings" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Pipe Couplings
                </Link>
                <Link href="/rubber-expansion-joints" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Expansion Joints
                </Link>
                <Link href="/strainers" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Strainers
                </Link>
                <Link href="/pipe-repair" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Repair Clamps
                </Link>
                <Link href="/flange-adaptors" className="block text-muted-foreground hover:text-foreground px-3 py-1 rounded-md text-sm">
                  Flange Adaptors
                </Link>
              </div>
              <Link href="/industries" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-industries">
                Industries
              </Link>
              <Link href="/resources" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-resources">
                Resources
              </Link>
              <Link href="/about" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-about">
                About
              </Link>
              <Link href="/contact" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-contact">
                Contact
              </Link>
              <div className="pt-4 border-t border-border">
                <div className="flex flex-col gap-2 px-3">
                  <a
                    href="tel:0892712577"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>(08) 9271 2577</span>
                  </a>
                  <a
                    href="mailto:sales@dewaterproducts.com.au"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-base font-medium"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span>sales@dewaterproducts.com.au</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
