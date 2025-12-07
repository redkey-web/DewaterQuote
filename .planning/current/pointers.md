# Key File Pointers

**Last Updated**: 2025-12-07

## By Task Type

### Understanding Overall Structure
- Entry Point: `client/src/main.tsx` (current) → `src/app/page.tsx` (target)
- Root Layout: N/A (current) → `src/app/layout.tsx` (target)
- Global Config: `vite.config.ts` (current) → `next.config.js` (target)
- Package Info: `package.json`

### Routing
- Current: `client/src/App.tsx` (wouter Switch/Route)
- Target: File-based routing in `src/app/`

### Working with Forms
- Quote Form: `client/src/pages/RequestQuotePage.tsx`
- Contact Form: `client/src/pages/ContactPage.tsx`
- Form Components: `client/src/components/ui/form.tsx`

### Quote Cart System
- Cart State: `client/src/App.tsx` (useState + localStorage)
- Cart UI: `client/src/components/QuoteCart.tsx`
- Sticky Button: `client/src/components/StickyQuoteButton.tsx`
- Item Schema: `shared/schema.ts`

### Product Data
- Neto Integration: `server/neto.ts`
- Routes: `server/routes.ts`
- Product Display: `client/src/pages/ProductDetailPage.tsx`
- Product Cards: `client/src/components/ProductCard.tsx`

### Styling
- Global Styles: `client/src/index.css`
- Tailwind Config: `tailwind.config.ts`
- UI Components: `client/src/components/ui/`

### Layout Components
- Header: `client/src/components/Header.tsx`
- Footer: `client/src/components/Footer.tsx`
- Sidebar: `client/src/components/AppSidebar.tsx`

## High-Impact Files

Files that affect many parts of the system:

1. **client/src/App.tsx** - All routing, quote state, cart logic
2. **client/src/components/Header.tsx** - Site-wide navigation
3. **client/src/components/ProductCard.tsx** - Used on all product listings
4. **shared/schema.ts** - Type definitions for quotes
5. **tailwind.config.ts** - All styling
6. **server/neto.ts** - All product data (to be replaced)

## Migration Order Recommendation

1. Layout (Header, Footer, globals)
2. Home page
3. Product components (Card, Detail)
4. Category pages (templates)
5. Quote cart system
6. Forms
7. Admin panel (new)
