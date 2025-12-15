# DeWater Products - Quote Request System

## Overview

Industrial pipe fittings e-commerce/quote system for DeWater Products Australia. Customers browse products, add items to a quote cart, and submit quote requests via email. This is a B2B-focused platform serving water, wastewater, mining, and irrigation industries.

- **Production URL**: https://dewaterproducts.com.au
- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 | App Router with Server Components |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS | With CSS variables for theming |
| Components | shadcn/ui | Radix primitives (47 UI components) |
| Database | Neon PostgreSQL | Serverless Postgres |
| ORM | Drizzle | Type-safe database queries |
| Auth | NextAuth.js | Admin panel authentication |
| Forms | React Hook Form + Zod | Validation |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (contact, quote, upload, auth)
│   ├── admin/             # Admin panel (protected routes)
│   ├── products/          # Product pages
│   └── [slug]/            # Dynamic product routes
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── context/               # React Context (QuoteContext)
├── data/                  # Static catalog data (catalog.ts)
├── db/                    # Database schema and connection
├── lib/                   # Utilities and helpers
└── types/                 # TypeScript type definitions
```

### Key Architecture Decisions

**App Router Pattern**: Uses Next.js 15 App Router exclusively. Server Components by default, `'use client'` directive only when hooks, events, or context are needed.

**Quote Cart System**: Client-side state managed via React Context (`QuoteContext`), persisted to localStorage. No user accounts required - quote requests submitted via email.

**Database Schema**: Products, categories, brands, and variations stored in Neon Postgres. Schema defined in `src/db/schema.ts`, queries in `src/lib/db/`.

**Static Fallback**: Product data also exists in `src/data/catalog.ts` for development and fallback scenarios.

### Important Constraints

This project was migrated from Vite/Express. Only use Next.js patterns:

- Use `next/link` for navigation (not wouter)
- Use `next/image` for images
- API routes in `src/app/api/` (not Express)
- No `client/`, `server/`, or `shared/` directories (legacy, now in `_replit_backup/`)

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless database via `@neondatabase/serverless`
- **Drizzle ORM**: Schema in `src/db/schema.ts`, config in `drizzle.config.ts`
- **Env**: `DATABASE_URL`

### Email
- **SendGrid**: Quote and contact form submissions via `@sendgrid/mail`
- **Env**: `SENDGRID_API_KEY`, `FROM_EMAIL`, `BUSINESS_EMAIL`

### Authentication
- **NextAuth.js**: Admin panel access with credentials provider
- **Env**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_PASSWORD_HASH`

### File Storage
- **Vercel Blob**: PDF datasheets and product images
- **Env**: `BLOB_READ_WRITE_TOKEN`

### Spam Protection
- **Cloudflare Turnstile**: Form protection on contact and quote pages
- **Env**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

### Rate Limiting
- **Upstash Redis**: API rate limiting
- **Env**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Analytics
- **Google Analytics 4**: Tracking via `src/components/GoogleAnalytics.tsx`
- **Measurement ID**: `G-6KZKZBD747`
