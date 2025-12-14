# DeWater Products - Quote Request System

## Overview

Industrial pipe fittings e-commerce/quote system for DeWater Products Australia. Customers browse products, add to quote cart, and submit quote requests via email.

- **Production URL**: https://dewaterproducts.com.au
- **Repository**: https://github.com/redkey-web/DewaterQuote
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Neon PostgreSQL + Drizzle ORM

---

## CRITICAL: Architecture Rules

> **WARNING**: This project was migrated from Vite/React/Express to Next.js.
> Only use the current Next.js architecture documented below.

### DO NOT:
- Use `wouter` for routing (use `next/link`)
- Use Express patterns (no `server/` routes)
- Reference old file structure (`client/`, `server/`, `shared/`)
- Install removed packages: `wouter`, `express`, `@tanstack/react-router`

### DO:
- Use Next.js App Router patterns (`src/app/`)
- Use `next/link` for navigation
- Use `next/image` for images
- Use Server Components by default
- Add `'use client'` only when needed (hooks, events, context)
- Use API routes in `src/app/api/`

---

## System Architecture

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15 | App Router |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | With CSS variables |
| Components | shadcn/ui | Radix primitives |
| Icons | Lucide React | Tree-shakeable |
| Forms | React Hook Form | With Zod validation |
| Database | Neon PostgreSQL | Serverless |
| ORM | Drizzle | Type-safe |
| Email | SendGrid | Contact/quote forms |
| Auth | NextAuth.js | Admin authentication |
| File Storage | Vercel Blob | Product images |
| Deployment | Vercel (prod) / Replit (dev) | Dual platform |

### Component Architecture

```
src/
├── app/                    # Next.js App Router (pages + API)
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── [slug]/            # Dynamic product pages
│   ├── [category]/        # Category pages
│   ├── admin/             # Admin dashboard (protected)
│   ├── contact/           # Contact page
│   ├── request-quote/     # Quote submission
│   └── api/               # API routes
│       ├── contact/       # Contact form handler
│       ├── quote/         # Quote submission handler
│       └── admin/         # Admin CRUD endpoints
├── components/            # React components
│   ├── layout/            # Header, Footer, Navigation
│   ├── ui/                # shadcn/ui components
│   ├── QuoteCart.tsx      # Shopping cart sidebar
│   ├── ProductCard.tsx    # Product grid cards
│   ├── Testimonials.tsx   # Customer reviews
│   ├── OrderBumps.tsx     # Cross-sell suggestions
│   └── DiscountCelebration.tsx  # Discount animation
├── context/               # React context providers
│   └── QuoteContext.tsx   # Quote cart state
├── data/                  # Static data
│   ├── catalog.ts         # Product catalog
│   └── testimonials.ts    # Customer reviews
├── lib/                   # Utilities
│   ├── utils.ts           # cn() helper
│   ├── quote.ts           # Quote calculations
│   └── db/                # Database connection
└── types/                 # TypeScript types
    └── index.ts
```

---

## File Structure

### ACTIVE (Use These)

```
DewaterQuote/
├── src/app/              ← ACTIVE: All pages and routes
├── src/components/       ← ACTIVE: All components
├── src/context/          ← ACTIVE: React context
├── src/data/             ← ACTIVE: Product catalog
├── src/lib/              ← ACTIVE: Utilities
├── public/               ← ACTIVE: Static assets
├── next.config.js        ← ACTIVE: Next.js config (platform detection)
├── tailwind.config.ts    ← ACTIVE: Tailwind config
├── package.json          ← ACTIVE: Dependencies
├── drizzle.config.ts     ← ACTIVE: Database config
└── tsconfig.json         ← ACTIVE: TypeScript config
```

### NOT IN USE (Legacy Backup)

```
_replit_backup/           ← IGNORE: Old Vite/Express code (reference only)
```

---

## Feature Specifications

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, categories, testimonials, FAQ |
| `/products` | Products | All products grid |
| `/[slug]` | Product Detail | Individual product with size selector |
| `/valves` | Category | Valve products |
| `/pipe-couplings` | Category | Pipe coupling products |
| `/strainers` | Category | Strainer products |
| `/rubber-expansion-joints` | Category | Expansion joint products |
| `/flange-adaptors` | Category | Flange adaptor products |
| `/pipe-repair` | Category | Pipe repair clamps |
| `/straub` | Brand | Straub products |
| `/orbit` | Brand | Orbit products |
| `/teekay` | Brand | Teekay products |
| `/industries/[industry]` | Industry | Industry-specific products |
| `/contact` | Contact | Contact form |
| `/request-quote` | Quote | Quote submission form |

### Admin Routes (Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Admin overview |
| `/admin/products` | Products | Product management |
| `/admin/brands` | Brands | Brand management |
| `/admin/categories` | Categories | Category management |
| `/admin/files` | Files | File/image management |
| `/admin/settings` | Settings | Site settings |
| `/admin/login` | Login | Admin authentication |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contact` | POST | Contact form submission |
| `/api/quote` | POST | Quote request submission |
| `/api/admin/products` | GET/POST | Product CRUD |
| `/api/admin/brands` | GET/POST | Brand CRUD |
| `/api/admin/categories` | GET/POST | Category CRUD |
| `/api/upload` | POST | File upload to Vercel Blob |

### Key Features

- **Quote Cart**: Add products, adjust quantities, volume discounts
- **Volume Discounts**: 5% (2-4 items), 10% (5-9 items), 15% (10+ items)
- **Discount Celebration**: Coin explosion animation on tier unlocks
- **Order Bumps**: Smart cross-sell recommendations in cart
- **Testimonials**: Customer review section
- **FAQ**: Accordion FAQ section
- **SEO**: Metadata, JSON-LD, sitemap, robots.txt
- **Admin Panel**: Full product/brand/category management

---

## Database

### Connection

```typescript
// Use lib/db/index.ts for connection
import { db } from '@/lib/db';
```

### Schema Location

- Schema: `src/lib/db/schema.ts`
- Migrations: `drizzle/`
- Config: `drizzle.config.ts`

### Commands

```bash
npm run db:generate    # Generate migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio
npm run db:seed        # Seed database
```

---

## Environment Variables

### Required

| Variable | Purpose | Where to Set |
|----------|---------|--------------|
| `DATABASE_URL` | Neon PostgreSQL connection | Vercel + Replit Secrets |
| `SENDGRID_API_KEY` | Email sending | Vercel + Replit Secrets |
| `FROM_EMAIL` | Email sender address | Vercel + Replit Secrets |
| `BUSINESS_EMAIL` | Notification recipient | Vercel + Replit Secrets |
| `NEXTAUTH_SECRET` | NextAuth session secret | Vercel + Replit Secrets |
| `NEXTAUTH_URL` | NextAuth base URL | Vercel + Replit Secrets |
| `ADMIN_PASSWORD_HASH` | Admin password (bcrypt) | Vercel + Replit Secrets |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage | Vercel only |

### Optional

| Variable | Purpose | Default |
|----------|---------|---------|
| `REPLIT` | Platform detection | Auto-set by Replit |
| `VERCEL` | Platform detection | Auto-set by Vercel |
| `NODE_ENV` | Environment | development |

---

## Development

### Replit

```bash
npm install
npm run dev        # http://localhost:5000 (mapped to port 80)
npm run build      # Production build
npm run start      # Start production
```

### Local (Mac/VS Code)

```bash
npm install
npm run dev        # http://localhost:5000
npm run build      # Production build
npm run start      # Start production
```

### Key Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run build` | Production build |
| `npm run start` | Start production (port 5000) |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push database schema |
| `npm run db:studio` | Open Drizzle Studio |

---

## Deployment

### Dual Platform Setup

| Platform | Role | URL |
|----------|------|-----|
| **Replit** | Development IDE | `*.replit.dev` |
| **GitHub** | Source control | `github.com/redkey-web/DewaterQuote` |
| **Vercel** | Production hosting | `dewaterproducts.com.au` |

### Workflow

```
1. Edit code in Replit
2. Test with live preview
3. Commit and push to GitHub
4. Vercel auto-deploys from main branch
```

### Platform Detection

The `next.config.js` automatically detects the platform:
- **Replit**: `output: 'standalone'`, `images.unoptimized: true`
- **Vercel**: Default optimized settings

---

## External Dependencies

### NPM Packages

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.x | Framework |
| react | 18.x | UI library |
| tailwindcss | 3.x | Styling |
| drizzle-orm | 0.39.x | Database ORM |
| @sendgrid/mail | 8.x | Email sending |
| next-auth | 4.x | Authentication |
| lucide-react | latest | Icons |

### External Services

| Service | Purpose | Dashboard |
|---------|---------|-----------|
| Vercel | Production hosting | vercel.com |
| Neon | PostgreSQL database | neon.tech |
| SendGrid | Email delivery | sendgrid.com |
| GitHub | Source control | github.com |

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install`, check import paths |
| Build fails | Check for TypeScript errors, run `npm run build` |
| Images not loading | Use `/images/` path from public folder |
| Styles broken | Check Tailwind content paths in config |
| API 500 error | Check env vars, view function logs |
| Port in use | Kill process: `pkill -f next` |
| Database error | Verify `DATABASE_URL` in secrets |

### If Confused About Project Structure

1. **Only look in `src/app/`** for routes
2. **Only look in `src/components/`** for components
3. **Only look in `src/data/`** for product catalog
4. **Run `npm run build`** to verify working state
5. **Ignore `_replit_backup/`** - it's legacy code

---

## User Preferences

### Communication Style
- Direct and technical
- No unnecessary pleasantries
- Focus on solutions

### Design Philosophy
- Mobile-first responsive
- Clean, professional aesthetic
- Performance over flash
- Industrial/B2B aesthetic

---

## Recent Updates

| Date | Change |
|------|--------|
| Dec 2025 | Merged Replit backup features (testimonials, FAQ, OrderBumps, DiscountCelebration) |
| Dec 2025 | Migration from Vite/Express to Next.js complete |
| Dec 2025 | Admin panel with NextAuth authentication |
| Dec 2025 | Volume discount system implemented |
