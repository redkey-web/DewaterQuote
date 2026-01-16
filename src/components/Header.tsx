"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ClipboardList, Menu, X, ChevronDown, ChevronRight, Phone, Mail, Search, Loader2, Monitor, Smartphone } from "lucide-react"
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
  const pathname = usePathname()
  const { itemCount: cartItemCount, openCart } = useQuote()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [closingMenu, setClosingMenu] = useState<string | null>(null)
  const [closingContent, setClosingContent] = useState<string | null>(null)
  const [flashingLink, setFlashingLink] = useState<string | null>(null)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const headerSearchInputRef = useRef<HTMLInputElement>(null)
  const productsButtonRef = useRef<HTMLButtonElement>(null)
  const [buttonTilt, setButtonTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [forceDesktop, setForceDesktop] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Track mount state for portal
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check and apply desktop mode preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('forceDesktop')
    if (saved === 'true') {
      setForceDesktop(true)
      document.documentElement.classList.add('force-desktop')
      // Set viewport to desktop width
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=1280')
      }
    }
  }, [])

  // Toggle desktop mode
  const toggleDesktopMode = () => {
    const newValue = !forceDesktop
    setForceDesktop(newValue)
    localStorage.setItem('forceDesktop', String(newValue))

    if (newValue) {
      document.documentElement.classList.add('force-desktop')
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=1280')
      }
    } else {
      document.documentElement.classList.remove('force-desktop')
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1')
      }
    }
    // Reload to apply changes properly
    window.location.reload()
  }

  // Ripple effect for Products button
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    button.appendChild(ripple)

    setTimeout(() => ripple.remove(), 600)
  }

  // Focus search input when search opens
  useEffect(() => {
    if (showSearch) {
      headerSearchInputRef.current?.focus()
    }
  }, [showSearch])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideDesktop = !searchRef.current?.contains(target)
      const isOutsideMobile = !mobileSearchRef.current?.contains(target)
      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false)
        setShowSearch(false)
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
      setShowSearch(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleResultClick = (slug: string) => {
    setShowResults(false)
    setShowSearch(false)
    setSearchQuery("")
    router.push(`/${slug}`)
  }

  const productsMenu = [
    {
      title: "Couplings & Repair",
      url: "/pipe-couplings",
      items: [
        { name: "Pipe Couplings", url: "/pipe-couplings" },
        { name: "Pipe Repair Clamps", url: "/pipe-repair-clamps" },
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
        { name: "Duplex Strainers", url: "/duplex-basket-strainers" },
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
    { name: "Dewater Products", url: "/dewater-products" },
    { name: "Straub", url: "/straub-couplings" },
    { name: "Orbit", url: "/orbit-couplings" },
    { name: "Teekay", url: "/teekay" },
    { name: "Bore-Flex", url: "/bore-flex" },
    { name: "Defender Valves", url: "/defender-valves" },
    { name: "Defender Strainers", url: "/defender-strainers" },
    { name: "Other Manufacturers", url: "/other-manufacturers" },
  ]

  const companyMenu = [
    { name: "About Us", url: "/about" },
    { name: "Meet the Team", url: "/meet-the-team" },
  ]

  const policiesMenu = [
    { name: "Warranty", url: "/warranty" },
    { name: "Returns Policy", url: "/returns" },
    { name: "Terms & Conditions", url: "/terms" },
    { name: "Privacy Policy", url: "/privacy" },
  ]

  // Dynamic dropdown height calculation based on content (returns pixels)
  const getDropdownHeight = (menu: string): number => {
    const headerHeight = 86; // Header area
    const paddingHeight = 144; // pt-8 (32px) + pb-24 (96px) + title area buffer
    const itemHeight = 28; // Approximate height per menu item
    const titleAreaHeight = 140; // Left side title + description + link

    switch (menu) {
      case 'products': {
        // Products has multiple categories in 2 columns
        const categoryHeights = productsMenu.map(cat => (cat.items.length + 1) * itemHeight);
        const col1Height = categoryHeights.slice(0, 2).reduce((a, b) => a + b, 0);
        const col2Height = categoryHeights.slice(2, 4).reduce((a, b) => a + b, 0);
        const maxColHeight = Math.max(col1Height, col2Height, titleAreaHeight);
        return headerHeight + paddingHeight + maxColHeight;
      }
      case 'industries': {
        const rows = Math.ceil(industriesMenu.length / 2);
        const contentHeight = Math.max(rows * itemHeight, titleAreaHeight);
        return headerHeight + paddingHeight + contentHeight;
      }
      case 'brands': {
        const rows = Math.ceil(brandsMenu.length / 2);
        const contentHeight = Math.max(rows * itemHeight, titleAreaHeight);
        return headerHeight + paddingHeight + contentHeight;
      }
      default:
        return 320;
    }
  }

  // Close desktop dropdown with flash then slide-up animation
  // After flash, both text and background slide up together
  const closeMenuWithAnimation = (menuName: string, linkUrl?: string) => {
    if (linkUrl) {
      // Flash the link first
      setFlashingLink(linkUrl)
      setTimeout(() => {
        setFlashingLink(null)
        // Start content sliding up
        setClosingContent(menuName)
        // Delay background by 200ms
        setTimeout(() => {
          setClosingMenu(menuName)
        }, 200)
        // Clean up after both animations complete
        setTimeout(() => {
          setActiveMenu(null)
          setClosingMenu(null)
          setClosingContent(null)
        }, 700) // 200ms delay + 500ms animation
      }, 500) // Flash duration
    } else {
      // Start content sliding up
      setClosingContent(menuName)
      // Delay background by 200ms
      setTimeout(() => {
        setClosingMenu(menuName)
      }, 200)
      // Clean up after both animations complete
      setTimeout(() => {
        setActiveMenu(null)
        setClosingMenu(null)
        setClosingContent(null)
      }, 700)
    }
  }

  // Close mobile menu with flash then slide-up animation
  const closeMobileMenuWithAnimation = (linkUrl?: string) => {
    if (linkUrl) {
      // Flash the link first
      setFlashingLink(linkUrl)
      setTimeout(() => {
        setFlashingLink(null)
        setMobileMenuClosing(true)
        setTimeout(() => {
          setMobileMenuOpen(false)
          setMobileMenuClosing(false)
          setExpandedMobileCategory(null)
        }, 500) // Match slower slide-up animation
      }, 500) // Flash duration
    } else {
      setMobileMenuClosing(true)
      setTimeout(() => {
        setMobileMenuOpen(false)
        setMobileMenuClosing(false)
        setExpandedMobileCategory(null)
      }, 500)
    }
  }

  return (
    <>
      {/* Portal dropdown backgrounds outside header stacking context */}
      {isMounted && (activeMenu || closingMenu || closingContent) && ['products', 'industries', 'brands'].includes(activeMenu || closingMenu || closingContent || '') && createPortal(
        <div
          className={`fixed top-0 left-0 right-0 dropdown-silver-gradient z-[50] rounded-b-2xl ${
            closingMenu ? 'animate-dropdown-slide-up' : 'animate-dropdown-slide'
          }`}
          style={{ height: getDropdownHeight(activeMenu || closingMenu || closingContent || 'products') }}
          onMouseEnter={() => !closingMenu && !closingContent && setActiveMenu(activeMenu)}
          onMouseLeave={() => !closingMenu && !closingContent && setActiveMenu(null)}
        />,
        document.body
      )}

      <header className="sticky top-0 z-[60]">
        <div className="absolute inset-0 header-gradient-blur" />
        <div className="relative max-w-7xl mx-auto px-6">
        {/* Three-column, two-row grid */}
        <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] lg:grid-rows-[auto_auto] items-center gap-x-6">
          {/* Logo - spans both rows */}
          <Link
            href="/"
            className="row-span-2 flex items-center"
            data-testid="link-home"
          >
            <Image
              src="/images/logo-new.png"
              alt="Dewater Products - Fluid Piping Components"
              width={500}
              height={167}
              className="h-[145px] w-auto object-contain -mt-10 -mb-12"
              priority
            />
          </Link>

          {/* Search - spans both rows, centered */}
          <div className="row-span-2 flex items-center justify-center">
            {/* Search Bar */}
            <div className="relative w-full max-w-sm" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin z-10" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                )}
                <input
                  ref={headerSearchInputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-2 text-sm font-dot border-2 border-primary rounded-xl bg-gray-100 dark:bg-gray-800 shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all search-shimmer"
                  data-testid="input-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                />
              </form>

              {/* ABN - tiny text below search */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap pointer-events-none mt-0.5">
                ABN: 98 622 681 663
              </span>

              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.brand}</div>
                    </button>
                  ))}
                  {searchQuery.trim() && (
                    <button
                      onClick={handleSearchSubmit as any}
                      className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  )}
                </div>
              )}

              {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 p-4">
                  <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Row Right - Contact Info */}
          <div className="flex items-center justify-end gap-6 py-1.5 text-sm text-gray-600 dark:text-gray-400">
            <a href="mailto:sales@dewaterproducts.com.au" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-primary" />
              <span className="chrome-text">sales@dewaterproducts.com.au</span>
            </a>
            <a href="tel:1300271290" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" />
              1300 271 290
            </a>
          </div>

          {/* Bottom Row Right - Nav Items */}
          <nav className="flex items-center justify-end gap-5 py-2">
            {/* Products Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all py-2 px-2 rounded ${
                  activeMenu === "products" ? "text-primary [text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]" : "text-gray-700 dark:text-gray-200 hover:text-primary hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]"
                }`}
                data-testid="button-products-menu"
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === "products" ? "rotate-180" : ""}`} />
              </button>

              {(activeMenu === "products" || closingContent === "products") && (
                <>
                  {/* Invisible bridge from button to dropdown */}
                  <div
                    className="fixed left-0 right-0 h-[30px] z-[99]"
                    style={{ top: '60px' }}
                    onMouseEnter={() => !closingContent && setActiveMenu("products")}
                  />
                  <div
                    className={`fixed top-[86px] left-0 right-0 z-[70] ${closingContent === "products" ? "animate-dropdown-content-slide-up" : ""}`}
                    onMouseEnter={() => !closingContent && setActiveMenu("products")}
                    onMouseLeave={() => !closingContent && setActiveMenu(null)}
                  >
                    <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
                      <div className="grid grid-cols-12 gap-12">
                        {/* Left: Title & Description */}
                        <div className="col-span-4">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Products
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Industrial pipe fittings, couplings, valves, and accessories for mining, construction, water treatment, and process applications.
                          </p>
                          <Link
                            href="/products"
                            className={`inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline ${flashingLink === '/products' ? 'animate-menu-flash' : ''}`}
                            onClick={() => closeMenuWithAnimation("products", "/products")}
                          >
                            View all products
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>

                        {/* Right: Category Links */}
                        <div className="col-span-8">
                          <div className="columns-2 gap-12">
                            {productsMenu.map((category) => (
                              <div key={category.title} className="break-inside-avoid mb-3">
                                <Link
                                  href={category.url}
                                  className={"text-gray-900 dark:text-white font-semibold hover:text-primary hover-underline-scale inline-block transition-all" + (flashingLink === category.url ? " animate-menu-flash" : "")}
                                  onClick={() => closeMenuWithAnimation("products", category.url)}
                                >
                                  {category.title}
                                </Link>
                                <ul className="mt-2 space-y-1">
                                  {category.items.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        href={item.url}
                                        className={"text-gray-600 dark:text-gray-400 hover:text-primary hover-underline-scale inline-block transition-all" + (flashingLink === item.url ? " animate-menu-flash" : "")}
                                        onClick={() => closeMenuWithAnimation("products", item.url)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Industries Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("industries")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all py-2 px-2 rounded ${
                  activeMenu === "industries" ? "text-primary [text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]" : "text-gray-700 dark:text-gray-200 hover:text-primary hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]"
                }`}
              >
                Industry
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === "industries" ? "rotate-180" : ""}`} />
              </button>

              {(activeMenu === "industries" || closingContent === "industries") && (
                <>
                  {/* Invisible bridge from button to dropdown */}
                  <div
                    className="fixed left-0 right-0 h-[30px] z-[99]"
                    style={{ top: '60px' }}
                    onMouseEnter={() => !closingContent && setActiveMenu("industries")}
                  />
                  <div
                    className={`fixed top-[86px] left-0 right-0 z-[70] ${closingContent === "industries" ? "animate-dropdown-content-slide-up" : ""}`}
                    onMouseEnter={() => !closingContent && setActiveMenu("industries")}
                    onMouseLeave={() => !closingContent && setActiveMenu(null)}
                  >
                    <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
                      <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-4">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Industries
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We supply quality pipe fittings and fluid control products to a wide range of industries across Australia.
                          </p>
                          <Link
                            href="/industries"
                            className={"inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline" + (flashingLink === "/industries" ? " animate-menu-flash" : "")}
                            onClick={() => closeMenuWithAnimation("industries", "/industries")}
                          >
                            View all industries
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="col-span-8">
                          <div className="columns-2 gap-12">
                            {industriesMenu.map((industry) => (
                              <Link
                                key={industry.name}
                                href={industry.url}
                                className={"block text-gray-600 dark:text-gray-400 hover:text-primary hover-underline-scale transition-all py-1" + (flashingLink === industry.url ? " animate-menu-flash" : "")}
                                onClick={() => closeMenuWithAnimation("industries", industry.url)}
                              >
                                {industry.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Brands Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("brands")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all py-2 px-2 rounded ${
                  activeMenu === "brands" ? "text-primary [text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]" : "text-gray-700 dark:text-gray-200 hover:text-primary hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]"
                }`}
              >
                Brands
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === "brands" ? "rotate-180" : ""}`} />
              </button>

              {(activeMenu === "brands" || closingContent === "brands") && (
                <>
                  {/* Invisible bridge from button to dropdown */}
                  <div
                    className="fixed left-0 right-0 h-[30px] z-[99]"
                    style={{ top: '60px' }}
                    onMouseEnter={() => !closingContent && setActiveMenu("brands")}
                  />
                  <div
                    className={`fixed top-[86px] left-0 right-0 z-[70] ${closingContent === "brands" ? "animate-dropdown-content-slide-up" : ""}`}
                    onMouseEnter={() => !closingContent && setActiveMenu("brands")}
                    onMouseLeave={() => !closingContent && setActiveMenu(null)}
                  >
                    <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
                      <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-4">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Brands
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We partner with leading manufacturers to bring you quality products backed by industry expertise.
                          </p>
                          <Link
                            href="/brands"
                            className={"inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline" + (flashingLink === "/brands" ? " animate-menu-flash" : "")}
                            onClick={() => closeMenuWithAnimation("brands", "/brands")}
                          >
                            View all brands
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="col-span-8">
                          <div className="columns-2 gap-12">
                            {brandsMenu.map((brand) => (
                              <Link
                                key={brand.name}
                                href={brand.url}
                                className={"block text-gray-600 dark:text-gray-400 hover:text-primary hover-underline-scale transition-all py-1" + (flashingLink === brand.url ? " animate-menu-flash" : "")}
                                onClick={() => closeMenuWithAnimation("brands", brand.url)}
                              >
                                {brand.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Resources Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("resources")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all py-2 px-2 rounded ${
                  activeMenu === "resources" ? "text-primary [text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]" : "text-gray-700 dark:text-gray-200 hover:text-primary hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.2)]"
                }`}
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === "resources" ? "rotate-180" : ""}`} />
              </button>

              {activeMenu === "resources" && (
                <>
                  {/* Invisible bridge from button to dropdown */}
                  <div
                    className="absolute top-full left-0 w-full h-6 z-[99]"
                    onMouseEnter={() => setActiveMenu("resources")}
                  />
                  <div
                    className="absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-[100] w-56 animate-dropdown-slide overflow-hidden"
                    onMouseEnter={() => setActiveMenu("resources")}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className="p-4 space-y-1">
                      {[...companyMenu, ...policiesMenu].map((item) => (
                        <Link
                          key={item.name}
                          href={item.url}
                          className={"block px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary hover-underline-scale transition-colors" + (flashingLink === item.url ? " animate-menu-flash" : "")}
                          onClick={() => closeMenuWithAnimation("resources", item.url)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quote Button */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-cyan-700 text-cyan-700 bg-transparent shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] hover:bg-[radial-gradient(ellipse_at_center,_rgba(103,232,249,0.15)_0%,_rgba(34,211,238,0.1)_50%,_transparent_100%)] hover:border-cyan-500 hover:text-cyan-600 transition-all duration-150"
              data-testid="button-quote"
            >
              <ClipboardList className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="flex items-center" data-testid="link-home-mobile">
            <Image
              src="/images/logo-new.png"
              alt="Dewater Products"
              width={200}
              height={67}
              className="h-24 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
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
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {(mobileMenuOpen || mobileMenuClosing) && (
        <div className={`lg:hidden fixed left-0 right-0 top-16 h-[calc(100vh-64px)] z-50 bg-white dark:bg-gray-950 overflow-y-auto border-t border-gray-100 dark:border-gray-800 ${mobileMenuClosing ? 'animate-mobile-menu-slide-up' : ''}`}>
            <div className="px-6 py-4">
              <div className="mb-4" ref={mobileSearchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  {isSearching ? (
                    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="pl-9 w-full h-11 text-sm font-dot rounded-xl bg-zinc-100 border-2 border-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(0,0,0,0.08)] focus:outline-none focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(59,156,165,0.3)] focus:border-primary transition-all placeholder:text-zinc-400 text-zinc-800"
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
                          closeMobileMenuWithAnimation()
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
              {/* Products */}
              <div className="py-2">
                <Link href="/products" className={"block text-foreground px-3 py-2 rounded-md font-semibold" + (flashingLink === "/products" ? " animate-menu-flash" : "")} onClick={() => closeMobileMenuWithAnimation("/products")}>
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
                            className={"block text-xs text-primary hover:text-primary/80 px-3 py-1.5 rounded-md" + (flashingLink === category.url ? " animate-menu-flash" : "")}
                            onClick={() => closeMobileMenuWithAnimation(category.url)}
                          >
                            View All {category.title}
                          </Link>
                          {category.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.url}
                              className={"block text-xs text-muted-foreground hover:bg-primary hover:text-white px-3 py-1.5 rounded-md transition-colors" + (flashingLink === item.url ? " animate-menu-flash" : "")}
                              onClick={() => closeMobileMenuWithAnimation(item.url)}
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

              {/* Brands */}
              <div className="py-2 border-t border-border">
                <Link href="/brands" className={"block text-foreground px-3 py-2 rounded-md font-semibold" + (flashingLink === "/brands" ? " animate-menu-flash" : "")} onClick={() => closeMobileMenuWithAnimation("/brands")}>
                  Brands
                </Link>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {brandsMenu.map((brand) => (
                    <Link
                      key={brand.name}
                      href={brand.url}
                      className={"block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors" + (flashingLink === brand.url ? " animate-menu-flash" : "")}
                      onClick={() => closeMobileMenuWithAnimation(brand.url)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="py-2 border-t border-border">
                <Link href="/industries" className={"block text-foreground px-3 py-2 rounded-md font-semibold" + (flashingLink === "/industries" ? " animate-menu-flash" : "")} onClick={() => closeMobileMenuWithAnimation("/industries")}>
                  Industries
                </Link>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {industriesMenu.map((industry) => (
                    <Link key={industry.name} href={industry.url} className={"block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors" + (flashingLink === industry.url ? " animate-menu-flash" : "")} onClick={() => closeMobileMenuWithAnimation(industry.url)}>
                      {industry.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="py-2 border-t border-border">
                <Link href="/contact" className={"block text-foreground px-3 py-2 rounded-md font-semibold" + (flashingLink === "/contact" ? " animate-menu-flash" : "")} onClick={() => closeMobileMenuWithAnimation("/contact")}>
                  Contact
                </Link>
              </div>

              {/* Company */}
              <div className="py-2 border-t border-border">
                <span className="block text-foreground px-3 py-2 rounded-md font-semibold">Company</span>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {companyMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className={"block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors" + (flashingLink === item.url ? " animate-menu-flash" : "")}
                      onClick={() => closeMobileMenuWithAnimation(item.url)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="py-2 border-t border-border">
                <span className="block text-foreground px-3 py-2 rounded-md font-semibold">Policies</span>
                <div className="pl-3 space-y-1 border-l-2 border-primary/30 ml-3">
                  {policiesMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className={"block text-muted-foreground hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm transition-colors" + (flashingLink === item.url ? " animate-menu-flash" : "")}
                      onClick={() => closeMobileMenuWithAnimation(item.url)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
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
                    <span className="text-sm chrome-text">sales@dewaterproducts.com.au</span>
                  </a>
                </div>
              </div>

              {/* Desktop/Mobile View Toggle */}
              <div className="py-4 border-t border-border">
                <button
                  onClick={toggleDesktopMode}
                  className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {forceDesktop ? (
                    <>
                      <Smartphone className="w-5 h-5" />
                      <span className="text-sm">Switch to Mobile Site</span>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-5 h-5" />
                      <span className="text-sm">View Desktop Site</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Floating "Switch to Mobile" button - only visible when forceDesktop is active */}
      {forceDesktop && isMounted && (
        <button
          onClick={toggleDesktopMode}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
          aria-label="Switch to mobile site"
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Mobile View</span>
        </button>
      )}
    </header>
    </>
  )
}
