import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Dewater Products PTY LTD</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leading supplier of industrial pipe fittings, valves, and accessories in Australia.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:1300271290" className="hover:text-primary transition-colors">
                  1300 271 290
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:sales@dewaterproducts.com.au" className="hover:text-primary transition-colors">
                  sales@dewaterproducts.com.au
                </a>
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
              <li><Link href="/pipe-couplings" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-couplings">Pipe Couplings</Link></li>
              <li><Link href="/pipe-repair" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-repair">Pipe Repair Clamps</Link></li>
              <li><Link href="/flange-adaptors" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-flanges">Flange Adaptors</Link></li>
              <li><Link href="/industrial-valves" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-valves">Valves</Link></li>
              <li><Link href="/expansion-joints" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-expansion">Expansion Joints</Link></li>
              <li><Link href="/strainers" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-strainers">Strainers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Brands</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brand/straub-couplings" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-straub">Straub</Link></li>
              <li><Link href="/orbit-couplings" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-orbit">Orbit</Link></li>
              <li><Link href="/brands/teekay" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-teekay">Teekay</Link></li>
              <li><Link href="/brands/bore-flex-rubber" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-bore-flex">Bore-Flex Rubber</Link></li>
              <li><Link href="/brands/defender-valves" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-defender">Defender Valves</Link></li>
              <li><Link href="/brands/defender-strainers" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-defender-strainers">Defender Strainers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company & Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/meet-the-team" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-team">Meet the Team</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-contact">Contact</Link></li>
              <li><Link href="/warranty" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-warranty">Warranty</Link></li>
              <li><Link href="/delivery" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-delivery">Delivery Policy</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-returns">Returns Policy</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-privacy">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground" data-testid="link-footer-terms">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dewater Products PTY LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
