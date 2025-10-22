import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
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
      items: [
        { name: "Pipe Couplings", url: "/clamps-couplings/pipe-couplings" },
        { name: "Pipe Repair Clamps", url: "/clamps-couplings/pipe-repair-clamps" },
        { name: "Muff/Sleeve Couplings", url: "/clamps-couplings/muff-couplings" },
        { name: "Flange Adaptors", url: "/clamps-couplings/flange-adaptors" },
      ],
    },
    {
      title: "Valves",
      items: [
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
      items: [
        { name: "Rubber Expansion Joints", url: "/expansion-joints/rubber" },
        { name: "PTFE Expansion Joints", url: "/expansion-joints/ptfe" },
        { name: "Stainless/Fabric Joints", url: "/expansion-joints/stainless-fabric" },
      ],
    },
    {
      title: "Strainers & Filters",
      items: [
        { name: "Y Strainers", url: "/strainers/y-strainers" },
        { name: "Basket Strainers", url: "/strainers/basket" },
        { name: "T Strainers", url: "/strainers/t-strainers" },
        { name: "Duplex Strainers", url: "/strainers/duplex" },
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

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="hidden lg:flex items-center justify-end gap-6 py-2 text-sm border-b border-border">
          <a href="tel:0892712577" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Phone className="w-4 h-4" />
            <span>(08) 9271 2577</span>
          </a>
          <a href="mailto:sales@dewaterproducts.com.au" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Mail className="w-4 h-4" />
            <span>sales@dewaterproducts.com.au</span>
          </a>
        </div>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <img src={logoImage} alt="deWater Products" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md"
                data-testid="button-products-menu"
              >
                Products <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "products" && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg p-6 grid grid-cols-4 gap-8 w-[800px]">
                  {productsMenu.map((category) => (
                    <div key={category.title}>
                      <h3 className="font-semibold text-sm mb-3">{category.title}</h3>
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
              onMouseEnter={() => setActiveMenu("brands")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md"
                data-testid="button-brands-menu"
              >
                Brands <ChevronDown className="w-4 h-4" />
              </button>
              {activeMenu === "brands" && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg p-4 w-48">
                  <ul className="space-y-2">
                    {brandsMenu.map((brand) => (
                      <li key={brand.name}>
                        <Link
                          href={brand.url}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          data-testid={`link-brand-${brand.name.toLowerCase()}`}
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
              onMouseEnter={() => setActiveMenu("industries")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md"
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

            <Link href="/resources" className="text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-resources">
              Resources
            </Link>
            <Link href="/about" className="text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-about">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-contact">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onCartClick}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="space-y-4">
              <Link href="/" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-home">
                Home
              </Link>
              <Link href="/products" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-products">
                Products
              </Link>
              <Link href="/brands" className="block text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-brands">
                Brands
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
