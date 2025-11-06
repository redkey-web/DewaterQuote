# Design Guidelines: deWater Products Website Redesign

## Design Approach

**Inspiration**: Hoseflex.com design style – clean, modern, image-focused industrial aesthetic
**Branding**: deWater Products colors (#48c5db cyan, #5e5e5e gray)

**Core Principles**:
- Clean, modern card-based design system
- Large, professional product photography
- Generous white space for breathing room
- Strong visual hierarchy with clear CTAs
- Image-heavy presentation for industrial products
- Trust through professionalism and clarity

## Color Palette

**Based on Logo Colours**: #48c5db (cyan) and #5e5e5e (gray)

**Primary Colours (Light Mode)**:
- Primary Cyan: 187 85% 25% (WCAG AA compliant, ≥4.5:1 contrast with white text)
- Logo Cyan Reference: #48c5db (187 66% 57% - used for accents, borders, highlights where contrast isn't critical)
- Charcoal Gray: 0 0% 37% (#5e5e5e - logo gray, technical, industrial)

**Neutral Colours**:
- Foreground Text: 0 0% 15% (dark gray for body text)
- Pure White: 0 0% 100% (backgrounds)
- Light Gray: 0 0% 96-98% (subtle backgrounds, cards)
- Muted Cyan: 187 15% 95% (backgrounds, subtle highlights)

**Accent Colours**:
- Warm Orange: 25 95% 35% (WCAG AA compliant CTAs, complements cyan)
- Success Green: 145 65% 42% (quote confirmations, success states)

**Dark Mode**:
- Background: 0 0% 8% (deep charcoal)
- Primary Cyan: 187 75% 28% (WCAG AA compliant with white text, ≥4.5:1)
- Accent Orange: 25 90% 38% (accessible on dark backgrounds)
- Cards: 0 0% 12% (elevated surfaces)
- Foreground Text: 0 0% 95% (light gray for readability)

## Typography

**Font Families** (via Google Fonts):
- All text: Inter (400, 500, 600, 700) – modern, clean, professional
- Technical/Data: JetBrains Mono (400) – specifications, SKUs only

**Scale**:
- Hero Headlines: text-4xl to text-6xl, font-bold
- Section Headings: text-3xl to text-4xl, font-semibold
- Subsection Labels: text-sm uppercase tracking-wider text-primary (e.g., "who we are")
- Product Titles: text-lg to text-xl, font-semibold
- Body Copy: text-base, font-normal
- Card Labels: text-sm, font-medium

## Layout System

**Spacing**: Generous white space between sections (py-16 to py-24), moderate internal padding (p-6 to p-8)

**Grid Structure**:
- Product category cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-3 (large cards with images)
- Projects/blog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Industry links: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 (simple text links)

**Container Strategy**:
- Main content: max-w-7xl mx-auto px-6 lg:px-8
- Full-width sections with inner max-w-7xl
- Consistent horizontal padding throughout

## Component Library

### Hero Section (Hoseflex Style)
- Large, bold headline with company tagline
- Simple, clean background (light gradient or subtle image)
- Centered text with clear hierarchy
- Primary CTA button: "VIEW ALL PRODUCTS" or "REQUEST QUOTE"
- Optional: search bar integration
- Height: min-h-[60vh] for impact

### Product Category Cards
- Large card with featured product image
- Image fills card with subtle overlay
- Category name overlaid on image (bottom-left or centered)
- "View all" link or arrow icon
- Hover effect: slight scale and brightness increase
- Border-radius: rounded-lg
- Shadow: subtle shadow-md, hover shadow-xl

### About Section ("Who We Are" Style)
- Section label: uppercase, tracking-wider, text-primary, text-sm
- Large heading: text-3xl to text-4xl, font-semibold
- Descriptive paragraph
- Image gallery: 2-4 images showing team, facility, products
- "Learn More" CTA button

### Projects/Case Studies Section
- Grid of project cards
- Each card: featured image, category tag, project title
- Hover effect on cards
- "VIEW ALL" link above grid
- Clean, modern card design

### Blog/News Section
- Card-based layout with featured images
- Each card: image, date, category, title, excerpt
- "read more" links on each card
- "VIEW ALL" link above section

### Industry Solutions
- Simple grid of text links
- Clean typography, no images needed
- Organized by relevance
- Light hover effect (underline or color change)

## Navigation

**Header Style**:
- Larger logo (68-80px height)
- Minimal vertical padding (py-1.5 to py-2)
- Clean, modern menu structure
- Products, Industries, More dropdowns
- Contact info integrated into header
- Search bar prominent
- Quote cart button

**Mega-Menu**:
- Multi-column grid layout
- Category titles clickable
- Subcategory lists under each category
- Clean white background with subtle shadow
- Quick fade-in animation

## Images

**Product Category Images**: Large, high-quality product photography on white or industrial backgrounds, 16:9 or 4:3 aspect ratio

**Hero Images**: Wide industrial scenes, pipeline installations, or product close-ups with text overlay capability

**About/Team Images**: Professional facility photos, team at work, manufacturing process

**Project Images**: Real installation photos, before/after, industrial settings

**Blog Images**: Relevant product or industry photography

## Page-Specific Layouts

**Homepage**:
1. Hero section with headline + tagline + CTA
2. Product category cards (grid of 6)
3. Industry solutions (simple link grid)
4. About section ("who we are")
5. Projects section (featured projects)
6. Blog/news section (latest posts)
7. Footer

**Product Category Pages**:
- Category hero with title
- Grid of products
- Filter options (sidebar or top)
- Clean, modern product cards

**Product Detail Pages**:
- Breadcrumbs
- Large product images (left)
- Product details (right)
- Specifications
- "Add to Quote" CTA
- Related products

**About Page**:
- Company story
- Image gallery
- Team/facility showcase
- Values and mission

## Interaction Details

**Card Hovers**: Scale to 1.02-1.03, shadow increase, smooth transition (200-300ms)

**Button Hovers**: Slight darkening/lightening, no dramatic changes

**Image Overlays**: Dark overlay (opacity-30 to opacity-50) on category cards for text readability

**Smooth Scrolling**: All internal navigation uses smooth scroll behavior

**Loading States**: Skeleton screens for product grids, smooth content reveals

## Technical Considerations

**Performance**: Optimized images, lazy loading, modern image formats (WebP)
**Accessibility**: WCAG AA compliance, keyboard navigation, ARIA labels
**Responsive**: Mobile-first approach, touch-friendly interfaces
**WordPress Ready**: Modular design translatable to blocks/templates

This clean, modern design mirrors Hoseflex's professional industrial aesthetic while maintaining deWater Products' unique brand identity.