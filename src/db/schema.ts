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
  // Cross-reference fields for competitor equivalents
  straubEquivalent: text('straub_equivalent'), // e.g., "STRAUB-FLEX 1L"
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
  source: text('source').default('neto'), // 'neto' | 'manual' - where this size came from
  displayOrder: integer('display_order').default(0),
});

// Junction table for products <-> categories (many-to-many)
export const productCategories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  displayOrder: integer('display_order').default(0),
}, (table) => ({
  uniqueProductCategory: uniqueIndex('product_categories_unique_idx').on(table.productId, table.categoryId),
}));

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
  productCategories: many(productCategories),
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
  productCategories: many(productCategories),
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

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
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
export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
