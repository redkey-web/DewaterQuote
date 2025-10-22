import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Dewater Products PTY LTD</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leading supplier of industrial pipe fittings, valves, and accessories in Australia.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>(08) 9271 2577</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>sales@dewaterproducts.com.au</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Perth, Australia</span>
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                ABN: 98 622 681 663
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/clamps-couplings" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-clamps">Clamps & Couplings</Link></li>
              <li><Link href="/valves" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-valves">Valves</Link></li>
              <li><Link href="/expansion-joints" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-expansion">Expansion Joints</Link></li>
              <li><Link href="/strainers" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-strainers">Strainers & Filters</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Brands</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brands/straub" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-straub">Straub</Link></li>
              <li><Link href="/brands/orbit" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-orbit">Orbit</Link></li>
              <li><Link href="/brands/teekay" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-teekay">Teekay</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-contact">Contact</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping-delivery" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-shipping">Shipping & Delivery</Link></li>
              <li><Link href="/returns-refunds" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-returns">Returns & Refunds</Link></li>
              <li><Link href="/payment-methods" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-payment">Payment Methods</Link></li>
              <li><Link href="/warranty" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-warranty">Warranty Information</Link></li>
              <li><Link href="/terms-conditions" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dewater Products PTY LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
