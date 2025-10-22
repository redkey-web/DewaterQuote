# Design Guidelines: deWater Products Website Redesign

## Design Approach

**Selected Approach**: Design System – Material Design principles adapted for industrial B2B

**Rationale**: Industrial product showcase requires clarity, trust, and efficient information hierarchy. Material Design provides the structure while allowing professional customization for the technical sector.

**Core Principles**:
- Trust through consistency and professionalism
- Clarity in product information and navigation
- Efficiency in quote generation process
- Authority positioning in industrial market

## Color Palette

**Primary Colors**:
- Deep Industrial Blue: 210 85% 25% (trust, professionalism)
- Navy Accent: 215 75% 18% (depth, authority)

**Secondary/Accent**:
- Steel Gray: 210 12% 45% (technical, industrial)
- Light Gray: 210 15% 95% (backgrounds, cards)

**Functional Colors**:
- Success Green: 145 65% 42% (quote confirmations)
- Warning Orange: 25 85% 55% (items without pricing)
- Dark Mode: Charcoal 215 15% 12% with adjusted primary blue 210 75% 45%

## Typography

**Font Families** (via Google Fonts):
- Headings: Inter (600, 700) – modern, professional
- Body: Inter (400, 500) – exceptional readability
- Technical/Data: JetBrains Mono (400) – specifications, SKUs

**Scale**:
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headings: text-3xl to text-4xl, font-semibold
- Product Titles: text-xl to text-2xl, font-semibold
- Body Copy: text-base, font-normal
- Technical Details: text-sm, mono

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (py-8, px-6, gap-12, etc.)

**Grid Structure**:
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 lg:grid-cols-2
- Technical specs: grid-cols-2 md:grid-cols-3 lg:grid-cols-4

**Container Strategy**:
- Main content: max-w-7xl mx-auto px-6
- Mega-menu: full-width with max-w-7xl inner
- Product detail: max-w-6xl

## Component Library

### Navigation
**Mega-Menu**: Multi-column dropdowns with category thumbnails, hover reveals subcategories, sticky header on scroll with elevation shadow

**Sticky Quote Button**: Fixed bottom-right (lg:top-right), floating with shadow-xl, shows item count badge, primary blue background

### Product Components
**Product Cards**: White/dark cards with shadow-md, hover shadow-lg transition, product image (aspect-square), title, SKU, price (if available), "Add to Quote" button (variant="default", full-width)

**Category Hubs**: Hero banner with category image overlay, grid of subcategories with icons, brief application descriptions

**Technical Specs Table**: Striped rows, clear hierarchy, responsive stack on mobile

### Quote Cart System
**Quote Cart Panel**: Slide-in from right, two sections (Priced Items with subtotal, Items Requiring Quote with orange header), remove buttons, prominent "Submit Quote" CTA, "Continue Browsing" secondary action

**RFQ Form**: Clean multi-step or single-page with sections, includes quote cart summary, contact fields, special requirements textarea, file upload for drawings/specs

### Trust Elements
**Brand Logos Section**: Grayscale logos on hover colored, grid layout
**Certifications/Standards**: Badge display on product pages and footer
**Industry Applications**: Icon + title cards linking to industry pages

## Images

**Hero Section**: Large (60vh to 70vh) industrial photography – close-up of pipe fittings, valve assembly, or industrial facility. Blue overlay (opacity-30) maintaining brand color. Centered headline with CTA buttons.

**Product Photography**: Clean white background product shots, 1:1 aspect ratio, consistent lighting. Multiple angles for product detail pages. Lifestyle images showing installation contexts for category hubs.

**Category Hubs**: Header images showing products in use – industrial facilities, pipeline installations, valve assemblies.

**Brand Pages**: Brand logo + hero image of their facilities or product range.

## Page-Specific Layouts

**Homepage**: Hero with quote CTA → Featured product categories (4-column grid) → Brand showcase → Industry applications → Resources section → Trust badges/certifications

**Product Category Pages**: Category hero → Filter sidebar (left) + product grid (right) → Pagination → Related categories

**Product Detail**: Breadcrumbs → 2-column (images left, details right) → Specs table → Related products → Downloads section

**Brand Hub**: Brand story header → Product categories they supply → Certifications → Featured products

**Industry Pages**: Industry hero → Common challenges → Recommended products by category → Case studies/applications

## Interaction Details

**Hover States**: Subtle scale (1.02) on cards, color shift on buttons, underline on text links

**Add to Quote**: Success toast notification, item count badge animation on sticky button

**Mega-Menu**: 200ms fade-in, backdrop blur, clear active state indicators

**Mobile**: Hamburger menu, collapsible mega-menu sections, sticky quote cart button (bottom), touch-optimized button sizes (min h-12)

## Technical Considerations

**Performance**: Lazy-load product images, optimized thumbnails for grids, CDN delivery
**Accessibility**: ARIA labels on quote cart, keyboard navigation for mega-menu, sufficient color contrast (WCAG AA)
**WordPress/WooCommerce**: Modular block-based design, custom product templates, ACF-friendly structure

This professional, trust-building design positions deWater Products as an authoritative industrial supplier while streamlining the quote generation process.