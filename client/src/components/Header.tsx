import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Menu, X, ChevronDown, Phone, Mail, Search } from "lucide-react";
import logoImage from "@assets/website_logo_1761097322396.webp";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const productsMenu = [
    {
      title: "Clamps & Couplings",
      url: "/pipe-couplings",
      items: [
        { name: "Pipe Couplings", url: "/pipe-couplings/pipe-couplings" },
        { name: "Pipe Repair Clamps", url: "/pipe-repair-clamps/pipe-repair-clamps" },
        { name: "Muff/Sleeve Couplings", url: "/pipe-couplings/muff-couplings" },
        { name: "Flange Adaptors", url: "/pipe-couplings/flange-adaptors" },
      ],
    },
    {
      title: "Valves",
      url: "/valves",
      items: [
        { name: "Butterfly Valves", url: "/valves/butterfly-valves" },
        { name: "Duckbill Check Valves", url: "/valves/check-valves/duckbill" },
        { name: "Ball Check Valves", url: "/valves/check-valves/ball" },
        { name: "Swing Check Valves", url: "/valves/check-valves/swing" },
        { name: "Gate Valves", url: "/valves/gate-valves" },
        { name: "Ball Valves", url: "/valves/ball-valves" },
        { name: "Air Release / Non-Return", url: "/valves/air-release" },
      ],
    },
    {
      title: "Expansion Joints",
      url: "/rubber-expansion-joints",
      items: [
        { name: "Rubber Expansion Joints", url: "/rubber-expansion-joints/rubber" },
        { name: "PTFE Expansion Joints", url: "/rubber-expansion-joints/ptfe" },
        { name: "Stainless/Fabric Joints", url: "/rubber-expansion-joints/stainless-fabric" },
      ],
    },
    {
      title: "Strainers & Filters",
      url: "/strainers",
      items: [
        { name: "Y Strainers", url: "/strainers/y-strainers" },
        { name: "Basket Strainers", url: "/strainers/basket" },
        { name: "T Strainers", url: "/strainers/t-strainers" },
        { name: "Duplex Strainers", url: "/strainers/duplex" },
      ],
    },
    {
      title: "Brands",
      url: "/brands/straub",
      items: [
        { name: "Straub", url: "/brands/straub" },
        { name: "Orbit", url: "/brands/orbit" },
        { name: "Teekay", url: "/brands/teekay" },
      ],
    },
  ];

  const brandsMenu = [
    { name: "Straub", url: "/brands/straub" },
    { name: "Orbit", url: "/brands/orbit" },
    { name: "Teekay", url: "/brands/teekay" },
  ];

  const industriesMenu = [
    { name: "Water & Wastewater", url: "/industries/water-wastewater" },
    { name: "Irrigation", url: "/industries/irrigation" },
    { name: "Fire Services", url: "/industries/fire-services" },
    { name: "Mining", url: "/industries/mining" },
    { name: "Marine", url: "/industries/marine" },
    { name: "HVAC", url: "/industries/hvac" },
    { name: "Food & Beverage", url: "/industries/food-beverage" },
  ];

  const moreMenu = [
    { name: "Resources", url: "/resources" },
    { name: "About Us", url: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 py-[0.84px]" data-testid="link-home">
            <img src={logoImage} alt="deWater Products" className="h-[53px] md:h-[62px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md text-sm"
                data-testid="button-products-menu"
              >
                Products <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "products" && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg p-6 grid grid-cols-5 gap-6 w-[900px]">
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
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md text-sm"
                data-testid="button-industries-menu"
              >
                Industries <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "industries" && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg p-4 w-56">
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
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md text-sm"
                data-testid="button-more-menu"
              >
                More <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "more" && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg p-4 w-48">
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

            <Link href="/contact" className="text-foreground hover-elevate px-3 py-2 rounded-md text-sm" data-testid="link-contact">
              Contact
            </Link>
          </nav>

          {/* Contact Info, Search & Quote */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-48 xl:w-56 h-9"
                data-testid="input-search"
              />
            </div>
            <a 
              href="tel:0892712577" 
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary font-semibold hover-elevate active-elevate-2 border border-primary/20 text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>(08) 9271 2577</span>
            </a>
            <a 
              href="mailto:sales@dewaterproducts.com.au" 
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary font-semibold hover-elevate active-elevate-2 border border-primary/20 text-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">sales@dewaterproducts.com.au</span>
              <span className="xl:hidden">Email Us</span>
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={onCartClick}
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
              onClick={onCartClick}
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
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-full"
                  data-testid="input-search-mobile"
                />
              </div>
            </div>
            <nav className="space-y-4">
              <Link href="/" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-home">
                Home
              </Link>
              <Link href="/products" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-products">
                Products
              </Link>
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
              <div className="pt-4 border-t border-border space-y-3">
                <a 
                  href="tel:0892712577" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary font-semibold hover-elevate active-elevate-2 border border-primary/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>(08) 9271 2577</span>
                </a>
                <a 
                  href="mailto:sales@dewaterproducts.com.au" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary font-semibold hover-elevate active-elevate-2 border border-primary/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>sales@dewaterproducts.com.au</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
