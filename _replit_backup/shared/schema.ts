import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product Catalog Types
export interface MediaAsset {
  url: string;
  alt: string;
  type?: 'image' | 'video';
}

export interface SpecEntry {
  label: string;
  value: string;
}

export interface SizeOption {
  value: string;
  label: string;
  price?: number;
  sku?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName?: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  features?: string[];
  specifications: SpecEntry[];
  sizeOptions?: SizeOption[];
  images: MediaAsset[];
  downloads?: {url: string; label: string}[];
  video?: string;
  leadTime?: string;
  materials: {
    body: string;
    seat?: string;
    disc?: string;
    sleeve?: string;
  };
  pressureRange: string;
  sizeFrom?: string;
  temperature?: string;
  applications?: string[];
  certifications?: string;
  price?: number;
  priceVaries?: boolean;
  priceNote?: string;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  category: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  image?: string;
  subcategories?: Subcategory[];
}

// Quote Cart Types
export interface QuoteItemVariation {
  size: string;
  sizeLabel: string;
  sku: string;
  unitPrice: number;
}

export interface QuoteItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  basePrice?: number;
  baseSku?: string;
  priceVaries: boolean;
  variation?: QuoteItemVariation;
  quantity: number;
}
