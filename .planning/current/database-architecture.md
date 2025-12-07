# DewaterQuote Database Architecture

> Comprehensive technical specification for Phase 3 (Database) and Phase 7 (Admin Panel)

---

## Executive Summary

This document outlines the optimal database architecture for DewaterQuote, designed specifically for Vercel deployment. All recommended technologies are **already installed** in package.json, requiring zero new dependencies.

### Stack Decision

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Database** | Neon Postgres | Native Vercel integration, serverless driver, free tier sufficient |
| **ORM** | Drizzle ORM | Already installed, lightweight, type-safe, native Neon support |
| **File Storage** | Vercel Blob | Already installed, CDN included, simple API |
| **Auth** | NextAuth.js | Already installed, works with Drizzle adapter |
| **Deployment** | Vercel | Current platform, optimized for Next.js |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js 14 App Router                      │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │ │
│  │  │   Pages     │  │   Admin     │  │  API Routes    │  │ │
│  │  │  (SSR/SSG)  │  │   Panel     │  │  /api/*        │  │ │
│  │  └──────┬──────┘  └──────┬──────┘  └───────┬────────┘  │ │
│  │         │                │                  │           │ │
│  │  ┌──────▼────────────────▼──────────────────▼────────┐ │ │
│  │  │                 Drizzle ORM                        │ │ │
│  │  │            (drizzle-orm/neon-http)                 │ │ │
│  │  └─────────────────────┬─────────────────────────────┘ │ │
│  └────────────────────────┼──────────────────────────────┘ │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
            ┌───────────────▼───────────────┐
            │        Neon Postgres          │
            │    (Serverless, Auto-scale)   │
            │                               │
            │  • Scale to zero when idle    │
            │  • Auto-scaling compute       │
            │  • Connection pooling         │
            │  • Preview branch per deploy  │
            └───────────────────────────────┘

┌───────────────────────────────────────────┐
│            Vercel Blob Storage            │
│                                           │
│  • Product images                         │
│  • PDF datasheets                         │
│  • Certification documents                │
│  • CDN-backed public URLs                 │
└───────────────────────────────────────────┘
```

---

## Database Comparison Matrix

### Why Neon Postgres?

| Feature | Neon | Supabase | PlanetScale | Prisma Postgres |
|---------|------|----------|-------------|-----------------|
| **Vercel Native** | ✅ First-party | ✅ Marketplace | ❌ Deprecated | ✅ Marketplace |
| **SQL Dialect** | PostgreSQL | PostgreSQL | MySQL | PostgreSQL |
| **Serverless Driver** | ✅ @neondatabase/serverless | ⚠️ Requires pool | ⚠️ HTTP only | ✅ Accelerate |
| **Edge Support** | ✅ Full | ⚠️ Limited | ✅ Full | ✅ Full |
| **Free Tier** | 0.5GB, 190 hrs | 500MB | 5GB | Limited |
| **Drizzle Support** | ✅ Native | ✅ pg adapter | ❌ Different | ❌ Different ORM |
| **Already Installed** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Preview Branches** | ✅ Auto | ⚠️ Manual | ✅ Auto | ❌ No |

**Verdict:** Neon wins on native integration, serverless performance, and zero migration cost.

---

## Schema Design

### Entity Relationship Diagram

```
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│    brands    │      │  categories  │      │ subcategories  │
├──────────────┤      ├──────────────┤      ├────────────────┤
│ id (PK)      │      │ id (PK)      │      │ id (PK)        │
│ slug         │      │ slug         │      │ slug           │
│ name         │      │ name         │      │ name           │
│ description  │      │ description  │      │ description    │
└──────┬───────┘      │ displayOrder │      │ categoryId(FK) │
       │              └──────┬───────┘      └───────┬────────┘
       │                     │                      │
       │    ┌────────────────┼──────────────────────┘
       │    │                │
       ▼    ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                         products                              │
├──────────────────────────────────────────────────────────────┤
│ id (PK)          │ slug (unique)    │ sku (unique)           │
│ name             │ shortName        │ brandId (FK)           │
│ categoryId (FK)  │ subcategoryId(FK)│ description            │
│ certifications   │ materials (JSON) │ pressureRange          │
│ temperature      │ sizeFrom         │ leadTime               │
│ video            │ priceVaries      │ priceNote              │
│ basePrice        │ isActive         │ createdAt/updatedAt    │
└──────────────────┴──────────────────┴────────────────────────┘
       │
       │ 1:N relationships
       │
       ├──────────────────┬──────────────────┬─────────────────┐
       │                  │                  │                 │
       ▼                  ▼                  ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ variations   │  │   images     │  │  downloads   │  │  features    │
├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ id (PK)      │  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │
│ productId(FK)│  │ productId(FK)│  │ productId(FK)│  │ productId(FK)│
│ size         │  │ url          │  │ url          │  │ feature      │
│ label        │  │ alt          │  │ label        │  │ displayOrder │
│ price        │  │ isPrimary    │  │ fileType     │  └──────────────┘
│ sku          │  │ displayOrder │  │ fileSize     │
│ displayOrder │  └──────────────┘  └──────────────┘
└──────────────┘

┌──────────────────┐  ┌──────────────────┐
│ specifications   │  │  applications    │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │
│ productId (FK)   │  │ productId (FK)   │
│ label            │  │ application      │
│ value            │  │ displayOrder     │
│ displayOrder     │  └──────────────────┘
└──────────────────┘

┌──────────────────┐
│   admin_users    │
├──────────────────┤
│ id (PK)          │
│ email (unique)   │
│ passwordHash     │
│ name             │
│ createdAt        │
│ lastLogin        │
└──────────────────┘
```

---

## Drizzle Schema Implementation

### `src/db/schema.ts`

```typescript
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  decimal,
  timestamp,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// LOOKUP TABLES
// ============================================

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  longDescription: text('long_description'),
  image: text('image'), // Vercel Blob URL
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const subcategories = pgTable('subcategories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  displayOrder: integer('display_order').default(0),
});

// ============================================
// MAIN PRODUCT TABLE
// ============================================

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  brandId: integer('brand_id').references(() => brands.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  subcategoryId: integer('subcategory_id').references(() => subcategories.id),
  description: text('description').notNull(),
  certifications: text('certifications'), // Markdown/HTML
  materials: jsonb('materials').$type<{
    body: string;
    seat?: string;
    disc?: string;
    sleeve?: string;
  }>(),
  pressureRange: text('pressure_range'),
  temperature: text('temperature'),
  sizeFrom: text('size_from'),
  leadTime: text('lead_time'),
  video: text('video'), // YouTube URL
  priceVaries: boolean('price_varies').default(true),
  priceNote: text('price_note'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
  skuIdx: uniqueIndex('products_sku_idx').on(table.sku),
}));

// ============================================
// PRODUCT RELATED TABLES (1:N)
// ============================================

export const productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  size: text('size').notNull(), // "48.3mm"
  label: text('label').notNull(), // "48.3mm Pipe Outside Diameter"
  price: decimal('price', { precision: 10, scale: 2 }),
  sku: text('sku'),
  displayOrder: integer('display_order').default(0),
});

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(), // Vercel Blob URL
  alt: text('alt').notNull(),
  type: text('type').default('image'), // 'image' | 'video'
  isPrimary: boolean('is_primary').default(false),
  displayOrder: integer('display_order').default(0),
});

export const productDownloads = pgTable('product_downloads', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(), // Vercel Blob URL
  label: text('label').notNull(), // "Product Datasheet"
  fileType: text('file_type'), // "pdf", "doc"
  fileSize: integer('file_size'), // bytes
});

export const productFeatures = pgTable('product_features', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  feature: text('feature').notNull(),
  displayOrder: integer('display_order').default(0),
});

export const productSpecifications = pgTable('product_specifications', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(), // "Body Material"
  value: text('value').notNull(), // "316 Stainless Steel"
  displayOrder: integer('display_order').default(0),
});

export const productApplications = pgTable('product_applications', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  application: text('application').notNull(), // "Water treatment"
  displayOrder: integer('display_order').default(0),
});

// ============================================
// ADMIN USERS (for NextAuth)
// ============================================

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
});

// ============================================
// RELATIONS (for Drizzle query builder)
// ============================================

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  variations: many(productVariations),
  images: many(productImages),
  downloads: many(productDownloads),
  features: many(productFeatures),
  specifications: many(productSpecifications),
  applications: many(productApplications),
}));

export const productVariationsRelations = relations(productVariations, ({ one }) => ({
  product: one(products, {
    fields: [productVariations.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productDownloadsRelations = relations(productDownloads, ({ one }) => ({
  product: one(products, {
    fields: [productDownloads.productId],
    references: [products.id],
  }),
}));

export const productFeaturesRelations = relations(productFeatures, ({ one }) => ({
  product: one(products, {
    fields: [productFeatures.productId],
    references: [products.id],
  }),
}));

export const productSpecificationsRelations = relations(productSpecifications, ({ one }) => ({
  product: one(products, {
    fields: [productSpecifications.productId],
    references: [products.id],
  }),
}));

export const productApplicationsRelations = relations(productApplications, ({ one }) => ({
  product: one(products, {
    fields: [productApplications.productId],
    references: [products.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariation = typeof productVariations.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type ProductDownload = typeof productDownloads.$inferSelect;
export type ProductFeature = typeof productFeatures.$inferSelect;
export type ProductSpecification = typeof productSpecifications.$inferSelect;
export type ProductApplication = typeof productApplications.$inferSelect;

export type AdminUser = typeof adminUsers.$inferSelect;
```

### `src/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';
```

### `drizzle.config.ts`

```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## Database Connection

### Serverless Driver (Recommended for Vercel)

The `@neondatabase/serverless` driver is optimized for:
- Vercel Serverless Functions
- Vercel Edge Functions
- Low-latency HTTP-based queries
- Automatic connection pooling

```typescript
// For Server Components and API Routes
import { db } from '@/db';

// Query products with relations
const products = await db.query.products.findMany({
  with: {
    brand: true,
    category: true,
    variations: true,
    images: true,
  },
  where: (products, { eq }) => eq(products.isActive, true),
});
```

---

## File Storage (Vercel Blob)

### Upload API Route

```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string || 'uploads';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const blob = await put(`${folder}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true, // Prevent conflicts
  });

  return NextResponse.json({
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
  });
}
```

### Folder Structure

```
vercel-blob-storage/
├── products/
│   ├── images/           # Product photos
│   │   ├── {product-slug}-{random}.jpg
│   │   └── ...
│   └── datasheets/       # PDF downloads
│       ├── {product-slug}-datasheet-{random}.pdf
│       └── ...
├── categories/
│   └── {category-slug}.jpg
└── brands/
    └── {brand-slug}-logo.png
```

---

## Admin Authentication (NextAuth.js)

### Configuration

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.email, credentials.email),
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) return null;

        // Update last login
        await db
          .update(adminUsers)
          .set({ lastLogin: new Date() })
          .where(eq(adminUsers.id, user.id));

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Middleware Protection

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## Implementation Phases

### Phase 3: Database Schema (Est: 4-6 hours)

#### 3.1 Neon Setup (30 min)
- [ ] Create Neon project via Vercel Marketplace integration
- [ ] Copy connection string to `.env.local`
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Test connection with `npm run db:studio`

#### 3.2 Schema Implementation (2 hr)
- [ ] Create `src/db/schema.ts` (copy from above)
- [ ] Create `src/db/index.ts` (copy from above)
- [ ] Update `drizzle.config.ts`
- [ ] Run `npm run db:push` to create tables
- [ ] Verify tables in Drizzle Studio

#### 3.3 Seed Script (2-3 hr)
- [ ] Create `scripts/seed.ts`
- [ ] Transform `catalog.ts` products to DB inserts
- [ ] Handle all relationships (brand → product → variations → images)
- [ ] Run seed: `npx tsx scripts/seed.ts`
- [ ] Verify data in Drizzle Studio

#### 3.4 Data Access Layer (1-2 hr)
- [ ] Create `src/lib/db/products.ts` with query functions
- [ ] Create `src/lib/db/categories.ts`
- [ ] Update existing pages to use DB queries
- [ ] Keep `catalog.ts` as fallback during transition

### Phase 7: Admin Panel (Est: 6-8 hours)

#### 7.1 Auth Setup (1-2 hr)
- [ ] Install bcryptjs: `npm install bcryptjs @types/bcryptjs`
- [ ] Create NextAuth route handler
- [ ] Create admin middleware
- [ ] Create `/admin/login` page
- [ ] Create initial admin user via seed script

#### 7.2 Admin Layout (1-2 hr)
- [ ] Create admin layout with sidebar
- [ ] Dashboard page `/admin`
- [ ] Navigation: Products, Categories, Brands, Files

#### 7.3 Product Management (3-4 hr)
- [ ] Products list page `/admin/products`
- [ ] Product create form `/admin/products/new`
- [ ] Product edit form `/admin/products/[id]`
- [ ] Variation management (inline table)
- [ ] File upload integration (Vercel Blob)

#### 7.4 Supporting CRUD (1-2 hr)
- [ ] Categories list/edit
- [ ] Brands list/edit
- [ ] Subcategories list/edit

---

## Environment Variables

### `.env.local` (Development)

```bash
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Vercel Blob (auto-configured on Vercel, manual for local)
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxx"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (existing)
CONTACT_EMAIL="sales@dewaterproducts.com.au"
FROM_EMAIL="noreply@dewaterproducts.com.au"
```

### Vercel Environment Variables

```
DATABASE_URL          → From Neon integration (auto)
BLOB_READ_WRITE_TOKEN → From Vercel Blob (auto)
NEXTAUTH_SECRET       → Generate: openssl rand -base64 32
NEXTAUTH_URL          → Your production URL
```

---

## Query Examples

### Get Product with All Relations

```typescript
import { db } from '@/db';

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, slug),
    with: {
      brand: true,
      category: true,
      subcategory: true,
      variations: {
        orderBy: (variations, { asc }) => [asc(variations.displayOrder)],
      },
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
      downloads: true,
      features: {
        orderBy: (features, { asc }) => [asc(features.displayOrder)],
      },
      specifications: {
        orderBy: (specs, { asc }) => [asc(specs.displayOrder)],
      },
      applications: true,
    },
  });
}
```

### Get Products by Category

```typescript
export async function getProductsByCategory(categorySlug: string) {
  return db.query.products.findMany({
    where: (products, { eq, and }) =>
      and(
        eq(products.isActive, true),
        eq(categories.slug, categorySlug)
      ),
    with: {
      brand: true,
      images: {
        where: (images, { eq }) => eq(images.isPrimary, true),
        limit: 1,
      },
      variations: true,
    },
  });
}
```

### Get Products by Brand

```typescript
export async function getProductsByBrand(brandSlug: string) {
  const brand = await db.query.brands.findFirst({
    where: (brands, { eq }) => eq(brands.slug, brandSlug),
  });

  if (!brand) return [];

  return db.query.products.findMany({
    where: (products, { eq, and }) =>
      and(
        eq(products.brandId, brand.id),
        eq(products.isActive, true)
      ),
    with: {
      category: true,
      images: {
        where: (images, { eq }) => eq(images.isPrimary, true),
        limit: 1,
      },
    },
  });
}
```

---

## Cost Estimation

### Neon Postgres (Free Tier)
- 0.5 GB storage (sufficient for ~10,000+ products)
- 190 compute hours/month
- Autosuspend after 5 minutes idle
- **Cost: $0/month** for this use case

### Vercel Blob
- $0.03/GB storage
- $0.30/GB bandwidth
- Estimated: ~100 images × 500KB = 50MB
- **Cost: ~$0.01/month** for this use case

### Vercel (Pro recommended for production)
- Free tier works for development
- Pro: $20/month for production features
- **Cost: $0-20/month** depending on plan

---

## Migration Strategy

### Gradual Transition

1. **Phase 1**: Set up DB, create schema, seed data
2. **Phase 2**: Create data access layer alongside `catalog.ts`
3. **Phase 3**: Update pages one-by-one to use DB
4. **Phase 4**: Remove `catalog.ts` dependency
5. **Phase 5**: Build admin panel for ongoing management

### Rollback Plan

Keep `catalog.ts` as read-only fallback:

```typescript
// src/lib/products.ts
import { db } from '@/db';
import { products as catalogProducts } from '@/data/catalog';

export async function getProducts() {
  try {
    return await db.query.products.findMany({ ... });
  } catch (error) {
    console.error('DB error, falling back to catalog:', error);
    return catalogProducts; // Static fallback
  }
}
```

---

## References

- [Neon + Vercel Integration](https://vercel.com/marketplace/neon)
- [Drizzle ORM + Neon Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-neon)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [NextAuth.js Credentials Provider](https://next-auth.js.org/providers/credentials)
- [Drizzle Relations](https://orm.drizzle.team/docs/rqb)

---

*Document created: 2025-12-07*
*Last updated: 2025-12-07*
