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
  subtitle: text('subtitle'), // Additional product subtitle
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

  // URL Override - allows manual slug with automatic redirect from old URL
  slugOverride: text('slug_override'), // If set, this becomes the canonical slug
  previousSlug: text('previous_slug'), // Stores old slug for 301 redirect

  // ============================================
  // AVAILABILITY CONTROLS (Phase F1)
  // ============================================
  isQuoteOnly: boolean('is_quote_only').default(false), // Show "Request Quote" instead of price
  isSuspended: boolean('is_suspended').default(false), // Temporarily unavailable
  suspendedReason: text('suspended_reason'), // Why product is suspended
  handlingTimeDays: integer('handling_time_days'), // Processing time in days
  leadTimeText: text('lead_time_text'), // e.g., "2-3 weeks"

  // ============================================
  // PRICING FIELDS (Phase F1)
  // ============================================
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }), // What we pay supplier
  rrp: decimal('rrp', { precision: 10, scale: 2 }), // Recommended retail price
  promotionPrice: decimal('promotion_price', { precision: 10, scale: 2 }), // Sale price
  promotionStartDate: timestamp('promotion_start_date'), // When promotion starts
  promotionEndDate: timestamp('promotion_end_date'), // When promotion ends
  promotionId: text('promotion_id'), // Reference ID for promotion

  // ============================================
  // TAX FIELDS (Phase F1)
  // ============================================
  taxFree: boolean('tax_free').default(false), // GST exempt
  taxCategory: text('tax_category'), // Tax classification

  // ============================================
  // PRICE TIERS - Customer Groups (Phase F1)
  // ============================================
  priceA: decimal('price_a', { precision: 10, scale: 2 }), // Trade pricing
  priceB: decimal('price_b', { precision: 10, scale: 2 }), // Wholesale pricing
  priceC: decimal('price_c', { precision: 10, scale: 2 }), // Tier C
  priceD: decimal('price_d', { precision: 10, scale: 2 }), // Tier D
  priceE: decimal('price_e', { precision: 10, scale: 2 }), // Tier E
  priceF: decimal('price_f', { precision: 10, scale: 2 }), // Tier F

  // ============================================
  // OTHER FIELDS (Phase F1)
  // ============================================
  isVirtual: boolean('is_virtual').default(false), // Digital/non-physical product
  isService: boolean('is_service').default(false), // Service rather than product
  customCode: text('custom_code'), // Custom product code

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
  skuIdx: uniqueIndex('products_sku_idx').on(table.sku),
}));

// ============================================
// INVENTORY & LOGISTICS TABLES (Phase F1)
// ============================================

// Stock tracking - managed via admin panel
export const productStock = pgTable('product_stock', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variationId: integer('variation_id'), // Optional - for variation-level stock (references productVariations)
  qtyInStock: integer('qty_in_stock').default(0),
  incomingQty: integer('incoming_qty').default(0),
  preorderQty: integer('preorder_qty').default(0),
  reorderPoint: integer('reorder_point').default(5), // Alert when stock falls below this
  expectedArrival: timestamp('expected_arrival'), // When incoming stock arrives
  lastUpdatedAt: timestamp('last_updated_at').defaultNow(),
});

// Shipping dimensions - for freight quotes
export const productShipping = pgTable('product_shipping', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variationId: integer('variation_id'), // Optional - for variation-level shipping
  weightKg: decimal('weight_kg', { precision: 10, scale: 3 }),
  heightCm: decimal('height_cm', { precision: 10, scale: 2 }),
  widthCm: decimal('width_cm', { precision: 10, scale: 2 }),
  lengthCm: decimal('length_cm', { precision: 10, scale: 2 }),
  cubicM3: decimal('cubic_m3', { precision: 10, scale: 4 }), // Calculated volume
  shippingCategory: text('shipping_category'), // Freight class
  pickZone: text('pick_zone'), // Warehouse location
  unitOfMeasure: text('unit_of_measure').default('ea'), // 'ea', 'pack', 'box'
});

// Supplier information - internal use only
export const productSupplier = pgTable('product_supplier', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  primarySupplier: text('primary_supplier'), // Supplier company name
  supplierItemCode: text('supplier_item_code'), // Their SKU
  supplierProductName: text('supplier_product_name'), // Their product name
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }), // What we pay
});

// SEO fields - parent products only (variations inherit)
export const productSeo = pgTable('product_seo', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull().unique(),
  metaKeywords: text('meta_keywords'),
  metaDescription: text('meta_description'),
  pageTitle: text('page_title'), // Custom page title (overrides default)
});

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
  isSuspended: boolean('is_suspended').default(false), // Temporarily hide this size option
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
// PRODUCT VIDEOS TABLE (Multiple YouTube videos per product)
// ============================================

export const productVideos = pgTable('product_videos', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variationId: integer('variation_id').references(() => productVariations.id, { onDelete: 'set null' }), // Optional - for size-specific videos
  youtubeId: text('youtube_id').notNull(), // Just the video ID (e.g., "VRei4m3c3Ck")
  title: text('title'), // Video title from YouTube
  sizeLabel: text('size_label'), // Extracted size (e.g., "114.3mm")
  isPrimary: boolean('is_primary').default(false), // Main video for product
  isActive: boolean('is_active').default(true), // Show on live site (admin can toggle)
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
// REDIRECTS TABLE (for 301 redirects)
// ============================================

export const redirects = pgTable('redirects', {
  id: serial('id').primaryKey(),
  fromPath: text('from_path').notNull().unique(), // e.g., "/old-product-slug"
  toPath: text('to_path').notNull(), // e.g., "/new-product-slug"
  statusCode: integer('status_code').default(301), // 301 permanent, 302 temporary
  isActive: boolean('is_active').default(true),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }), // Optional link to product
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // Optional expiration for temporary redirects
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
  videos: many(productVideos), // Multiple YouTube videos
  // Phase F1 relations
  stock: many(productStock),
  shipping: many(productShipping),
  supplier: one(productSupplier), // 1:1 relationship
  seo: one(productSeo), // 1:1 relationship
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

export const productVideosRelations = relations(productVideos, ({ one }) => ({
  product: one(products, {
    fields: [productVideos.productId],
    references: [products.id],
  }),
  variation: one(productVariations, {
    fields: [productVideos.variationId],
    references: [productVariations.id],
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
// PHASE F1 RELATIONS
// ============================================

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));

export const productShippingRelations = relations(productShipping, ({ one }) => ({
  product: one(products, {
    fields: [productShipping.productId],
    references: [products.id],
  }),
}));

export const productSupplierRelations = relations(productSupplier, ({ one }) => ({
  product: one(products, {
    fields: [productSupplier.productId],
    references: [products.id],
  }),
}));

export const productSeoRelations = relations(productSeo, ({ one }) => ({
  product: one(products, {
    fields: [productSeo.productId],
    references: [products.id],
  }),
}));

export const redirectsRelations = relations(redirects, ({ one }) => ({
  product: one(products, {
    fields: [redirects.productId],
    references: [products.id],
  }),
}));

// ============================================
// QUOTES TABLES (Phase 9.5)
// ============================================

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  quoteNumber: text('quote_number').notNull().unique(), // e.g., "QR-20250104-001"

  // Customer info
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),

  // Delivery Address
  deliveryStreet: text('delivery_street'),
  deliverySuburb: text('delivery_suburb'),
  deliveryState: text('delivery_state'),
  deliveryPostcode: text('delivery_postcode'),

  // Billing Address
  billingStreet: text('billing_street'),
  billingSuburb: text('billing_suburb'),
  billingState: text('billing_state'),
  billingPostcode: text('billing_postcode'),

  // Notes
  notes: text('notes'),
  internalNotes: text('internal_notes'), // Admin-only notes

  // Totals (snapshot at time of request)
  itemCount: integer('item_count').notNull(),
  pricedTotal: decimal('priced_total', { precision: 10, scale: 2 }),
  savings: decimal('savings', { precision: 10, scale: 2 }),
  certFee: decimal('cert_fee', { precision: 10, scale: 2 }),
  certCount: integer('cert_count'),
  hasUnpricedItems: boolean('has_unpriced_items').default(false),

  // Shipping (added when forwarding to client)
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }),
  shippingNotes: text('shipping_notes'),

  // Status tracking
  status: text('status').default('pending'), // pending, reviewed, quoted, forwarded, accepted, rejected

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  forwardedAt: timestamp('forwarded_at'),
  respondedAt: timestamp('responded_at'),

  // IP for rate limiting reference
  clientIp: text('client_ip'),

  // Quick approval token (for email approval without login)
  approvalToken: text('approval_token').unique(),
  approvalTokenExpiresAt: timestamp('approval_token_expires_at'),

  // PDF Storage (Phase: quotes-admin-enhancements)
  pdfUrl: text('pdf_url'), // Vercel Blob URL for stored PDF
  pdfGeneratedAt: timestamp('pdf_generated_at'), // When PDF was last generated
  pdfVersion: integer('pdf_version').default(1), // Version for regeneration tracking

  // Soft Delete (Phase: quotes-admin-enhancements)
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  deletedBy: text('deleted_by'), // Admin email who deleted
});

export const quoteItems = pgTable('quote_items', {
  id: serial('id').primaryKey(),
  quoteId: integer('quote_id').references(() => quotes.id, { onDelete: 'cascade' }).notNull(),

  // Product reference (optional - for linking)
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),

  // Snapshot data (preserved even if product changes)
  category: text('category').notNull(),
  sku: text('sku').notNull(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  quantity: integer('quantity').notNull(),

  // Variation info
  size: text('size'),
  sizeLabel: text('size_label'),
  variationSku: text('variation_sku'),

  // Pricing (at time of request)
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  lineTotal: decimal('line_total', { precision: 10, scale: 2 }),

  // Options
  materialTestCert: boolean('material_test_cert').default(false),

  // Admin can override pricing
  quotedPrice: decimal('quoted_price', { precision: 10, scale: 2 }),
  quotedNotes: text('quoted_notes'),

  // Custom specs for Straub/Teekay products
  customPipeOd: text('custom_pipe_od'),
  customRubberMaterial: text('custom_rubber_material'),
  customPressure: text('custom_pressure'),
  customNotes: text('custom_notes'),

  displayOrder: integer('display_order').default(0),
});

export const quotesRelations = relations(quotes, ({ many }) => ({
  items: many(quoteItems),
}));

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
  product: one(products, {
    fields: [quoteItems.productId],
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
export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
export type ProductVideo = typeof productVideos.$inferSelect;
export type NewProductVideo = typeof productVideos.$inferInsert;

// Phase F1 types
export type ProductStock = typeof productStock.$inferSelect;
export type NewProductStock = typeof productStock.$inferInsert;
export type ProductShipping = typeof productShipping.$inferSelect;
export type NewProductShipping = typeof productShipping.$inferInsert;
export type ProductSupplier = typeof productSupplier.$inferSelect;
export type NewProductSupplier = typeof productSupplier.$inferInsert;
export type ProductSeo = typeof productSeo.$inferSelect;
export type NewProductSeo = typeof productSeo.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;

export type Redirect = typeof redirects.$inferSelect;
export type NewRedirect = typeof redirects.$inferInsert;

// Quote types
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type QuoteItemDB = typeof quoteItems.$inferSelect;
export type NewQuoteItemDB = typeof quoteItems.$inferInsert;
