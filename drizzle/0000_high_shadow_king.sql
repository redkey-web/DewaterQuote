CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"long_description" text,
	"image" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_number" text,
	"recipient" text NOT NULL,
	"subject" text NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"route" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"application" text NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"label" text NOT NULL,
	"file_type" text,
	"file_size" integer
);
--> statement-breakpoint
CREATE TABLE "product_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"feature" text NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" text NOT NULL,
	"type" text DEFAULT 'image',
	"is_primary" boolean DEFAULT false,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_seo" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"meta_keywords" text,
	"meta_description" text,
	"page_title" text,
	CONSTRAINT "product_seo_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "product_shipping" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"variation_id" integer,
	"weight_kg" numeric(10, 3),
	"height_cm" numeric(10, 2),
	"width_cm" numeric(10, 2),
	"length_cm" numeric(10, 2),
	"cubic_m3" numeric(10, 4),
	"shipping_category" text,
	"pick_zone" text,
	"unit_of_measure" text DEFAULT 'ea'
);
--> statement-breakpoint
CREATE TABLE "product_specifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"variation_id" integer,
	"qty_in_stock" integer DEFAULT 0,
	"incoming_qty" integer DEFAULT 0,
	"preorder_qty" integer DEFAULT 0,
	"reorder_point" integer DEFAULT 5,
	"expected_arrival" timestamp,
	"last_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"primary_supplier" text,
	"supplier_item_code" text,
	"supplier_product_name" text,
	"purchase_price" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "product_variations" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size" text NOT NULL,
	"label" text NOT NULL,
	"price" numeric(10, 2),
	"sku" text,
	"source" text DEFAULT 'neto',
	"size_rank" numeric(10, 2),
	"display_order" integer DEFAULT 0,
	"is_suspended" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "product_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"variation_id" integer,
	"youtube_id" text NOT NULL,
	"title" text,
	"size_label" text,
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"subtitle" text,
	"brand_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"subcategory_id" integer,
	"description" text NOT NULL,
	"certifications" text,
	"materials" jsonb,
	"pressure_range" text,
	"temperature" text,
	"size_from" text,
	"lead_time" text,
	"video" text,
	"price_varies" boolean DEFAULT true,
	"price_note" text,
	"base_price" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"straub_equivalent" text,
	"slug_override" text,
	"previous_slug" text,
	"is_quote_only" boolean DEFAULT false,
	"is_suspended" boolean DEFAULT false,
	"suspended_reason" text,
	"handling_time_days" integer,
	"lead_time_text" text,
	"cost_price" numeric(10, 2),
	"rrp" numeric(10, 2),
	"promotion_price" numeric(10, 2),
	"promotion_start_date" timestamp,
	"promotion_end_date" timestamp,
	"promotion_id" text,
	"tax_free" boolean DEFAULT false,
	"tax_category" text,
	"price_a" numeric(10, 2),
	"price_b" numeric(10, 2),
	"price_c" numeric(10, 2),
	"price_d" numeric(10, 2),
	"price_e" numeric(10, 2),
	"price_f" numeric(10, 2),
	"is_virtual" boolean DEFAULT false,
	"is_service" boolean DEFAULT false,
	"custom_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "quote_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_id" integer NOT NULL,
	"product_id" integer,
	"category" text NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"quantity" integer NOT NULL,
	"size" text,
	"size_label" text,
	"variation_sku" text,
	"unit_price" numeric(10, 2),
	"line_total" numeric(10, 2),
	"material_test_cert" boolean DEFAULT false,
	"quoted_price" numeric(10, 2),
	"quoted_notes" text,
	"custom_pipe_od" text,
	"custom_rubber_material" text,
	"custom_pressure" text,
	"custom_notes" text,
	"custom_size_requested" text,
	"custom_size_notes" text,
	"is_custom_size_request" boolean DEFAULT false,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_number" text NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"delivery_street" text,
	"delivery_suburb" text,
	"delivery_state" text,
	"delivery_postcode" text,
	"billing_street" text,
	"billing_suburb" text,
	"billing_state" text,
	"billing_postcode" text,
	"notes" text,
	"internal_notes" text,
	"item_count" integer NOT NULL,
	"priced_total" numeric(10, 2),
	"savings" numeric(10, 2),
	"cert_fee" numeric(10, 2),
	"cert_count" integer,
	"has_unpriced_items" boolean DEFAULT false,
	"shipping_cost" numeric(10, 2),
	"shipping_notes" text,
	"requires_review" boolean DEFAULT false,
	"custom_request_notes" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"forwarded_at" timestamp,
	"responded_at" timestamp,
	"client_ip" text,
	"approval_token" text,
	"approval_token_expires_at" timestamp,
	"pdf_url" text,
	"pdf_generated_at" timestamp,
	"pdf_version" integer DEFAULT 1,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"deleted_by" text,
	"customer_email_sent_at" timestamp,
	"business_email_sent_at" timestamp,
	"email_failure_reason" text,
	CONSTRAINT "quotes_quote_number_unique" UNIQUE("quote_number"),
	CONSTRAINT "quotes_approval_token_unique" UNIQUE("approval_token")
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_path" text NOT NULL,
	"to_path" text NOT NULL,
	"status_code" integer DEFAULT 301,
	"is_active" boolean DEFAULT true,
	"product_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "redirects_from_path_unique" UNIQUE("from_path")
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"category_id" integer NOT NULL,
	"display_order" integer DEFAULT 0,
	"hero_image" text,
	"meta_description" text,
	"hero_description" text,
	"long_description" text,
	"features" jsonb,
	"applications" jsonb,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "subcategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_applications" ADD CONSTRAINT "product_applications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_downloads" ADD CONSTRAINT "product_downloads_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_shipping" ADD CONSTRAINT "product_shipping_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_supplier" ADD CONSTRAINT "product_supplier_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_variation_id_product_variations_id_fk" FOREIGN KEY ("variation_id") REFERENCES "public"."product_variations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redirects" ADD CONSTRAINT "redirects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_categories_unique_idx" ON "product_categories" USING btree ("product_id","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");