# Codebase Analysis

**Last Updated**: 2025-12-07
**Analyzed By**: webdev:port

## Structure Overview
- **Framework**: Vite + Express + TypeScript
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: wouter (client-side SPA)
- **State**: React Query + localStorage

## File Counts
| Type | Count | Location |
|------|-------|----------|
| Pages | 13 | client/src/pages/ |
| Components | 72 | client/src/components/ (50 UI + 22 custom) |
| API Routes | 2 | server/routes.ts (Neto integration) |
| Utils/Lib | 5+ | client/src/lib/, shared/ |

## Total LOC
- Pages: ~4,000
- Components: ~4,500
- Server: ~500
- **Total**: ~9,500

## Dependencies (Key)

### Frontend
- react: ^18.3.1
- wouter: ^3.3.5
- @tanstack/react-query: ^5.60.5
- framer-motion: ^11.13.1
- react-hook-form: ^7.55.0
- zod: ^3.24.2
- lucide-react: ^0.453.0
- embla-carousel-react: ^8.6.0
- recharts: ^2.15.2

### UI
- @radix-ui/* (full suite)
- tailwind-merge
- class-variance-authority
- clsx

### Backend
- express: ^4.21.2
- drizzle-orm: ^0.39.1
- @neondatabase/serverless: ^0.10.4

## Existing Integrations
- **Neto API**: Product data source (will be replaced by Postgres)
- **No email service**: Forms console.log only
- **No spam protection**: None configured

## Routing Structure
- `/` - Home
- `/products` - Product range overview
- `/products/:slug` - Product detail
- `/pipe-couplings`, `/valves`, `/rubber-expansion-joints`, `/strainers` - Categories
- `/:category/:subcategory` - Subcategory listings
- `/brands/:brand` - Brand pages
- `/industries/:industry` - Industry pages
- `/request-quote` - Quote form (with cart items)
- `/contact` - Contact page

## Quote System
- Cart items stored in localStorage
- Add-to-quote from product pages
- Quote summary on RequestQuotePage
- No backend submission (console.log only)

## Forms Identified
1. **Quote Request** (RequestQuotePage.tsx)
   - Fields: name, email, phone, company, message
   - Validation: Zod schema
   - Backend: None (console.log)

2. **Contact Form** (ContactPage.tsx)
   - Fields: name, email, phone, company, message
   - Validation: Basic HTML required
   - Backend: None (console.log)

## Novel Patterns
- framer-motion for animations
- embla-carousel for product carousels
- Custom quote cart with localStorage persistence
- Neto API integration (to be replaced)
