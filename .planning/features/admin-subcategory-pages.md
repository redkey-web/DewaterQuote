# Admin Subcategory Page Management

**Created**: 2026-01-16
**Type**: Feature
**Status**: Planning
**Priority**: High

## Summary

Enable full CRUD management of subcategory pages from the admin panel. Currently these pages are hardcoded static files, but the database schema already supports dynamic content. This feature connects the admin to dynamic frontend routes, allowing non-technical users to create, edit, and delete subcategory pages.

## Current State Analysis

### What Exists

1. **Database Schema** - Already has all needed fields in `subcategories` table:
   - `heroImage` - Vercel Blob URL for hero background
   - `metaDescription` - SEO meta description
   - `heroDescription` - Short description for hero section
   - `longDescription` - Detailed "About" section content
   - `features` - JSONB array of feature bullet points
   - `applications` - JSONB array of application areas
   - `isActive` - Toggle visibility

2. **Admin Form** - CategoryForm.tsx already supports:
   - Inline subcategory editing within category edit page
   - All page content fields (heroImage, metaDescription, heroDescription, etc.)
   - Add/remove subcategories
   - Image upload for hero images

3. **Static Pages** - 30+ hardcoded files like:
   - `/butterfly-valves/page.tsx`
   - `/ball-valves/page.tsx`
   - `/y-strainers/page.tsx`
   - Each has `const content = { ... }` with hardcoded values

### What's Missing

1. **Dynamic Frontend Route** - No route reads subcategory content from DB
2. **Standalone Subcategories Admin** - Must navigate through categories to edit
3. **Content in Database** - DB subcategory records have empty page content fields
4. **Create New Pages** - Requires creating new code files

## Scope

- **Impact**: High - Enables dynamic page management
- **Files**: ~15 estimated
- **Areas**: Admin UI, API routes, frontend routing, content migration

---

## Phase 1: Dynamic Subcategory Route

### 1.1 Create Dynamic Route Handler

**Goal**: Create a catch-all route that serves subcategory pages from the database.

**Files to create**:
- `src/app/(subcategory)/[subcategorySlug]/page.tsx`

**Implementation**:
```typescript
// Route checks if slug matches a subcategory
// If yes: render subcategory page from DB
// If no: pass through to product detail (existing behavior)
```

**Tasks**:
- [ ] Create route group `(subcategory)` for organization
- [ ] Create dynamic `[subcategorySlug]/page.tsx`
- [ ] Add data fetching function `getSubcategoryBySlug()`
- [ ] Implement page component reading from DB fields
- [ ] Add generateStaticParams() for ISR
- [ ] Add generateMetadata() for SEO

### 1.2 Add Data Access Functions

**File**: `src/data/subcategories.ts` (new)

**Functions**:
- [ ] `getSubcategoryBySlug(slug: string)` - Get subcategory with category info
- [ ] `getAllSubcategorySlugs()` - For static generation
- [ ] `getActiveSubcategories()` - For sitemap/menu

### 1.3 Handle Route Priority

**Challenge**: `/[slug]/page.tsx` catches products. Need subcategory to take priority.

**Solution Options**:
1. Route groups with priority (recommended)
2. Middleware to rewrite
3. Check subcategory first in `[slug]/page.tsx`

**Tasks**:
- [ ] Test route priority behavior
- [ ] Implement chosen solution
- [ ] Verify products still resolve correctly

---

## Phase 2: Standalone Subcategories Admin

### 2.1 Create Subcategories List Page

**File**: `src/app/admin/subcategories/page.tsx`

**Features**:
- [ ] Table with: Name, Slug, Category, Status (Active/Inactive), Product Count
- [ ] Filter by category dropdown
- [ ] Search by name
- [ ] Link to edit each subcategory
- [ ] "Add Subcategory" button

### 2.2 Create Subcategory Edit Page

**File**: `src/app/admin/subcategories/[id]/page.tsx`

**Features**:
- [ ] All page content fields (heroImage, metaDescription, etc.)
- [ ] Category selector (parent category)
- [ ] Preview link to view live page
- [ ] Delete with confirmation (protect if has products)

### 2.3 Create New Subcategory Page

**File**: `src/app/admin/subcategories/new/page.tsx`

**Features**:
- [ ] Category selector (required)
- [ ] Name with auto-slug generation
- [ ] All page content fields
- [ ] Save creates subcategory and page goes live

### 2.4 Add Sidebar Navigation

**File**: `src/components/admin/AdminSidebar.tsx`

**Tasks**:
- [ ] Add "Subcategories" nav item under Categories
- [ ] Use Layers or FolderTree icon

---

## Phase 3: API Routes

### 3.1 Create Subcategory API Endpoints

**Routes**:
- `GET /api/admin/subcategories` - List all with category info
- `POST /api/admin/subcategories` - Create new
- `GET /api/admin/subcategories/[id]` - Get single
- `PATCH /api/admin/subcategories/[id]` - Update
- `DELETE /api/admin/subcategories/[id]` - Delete (with cascade check)

**Files**:
- [ ] `src/app/api/admin/subcategories/route.ts`
- [ ] `src/app/api/admin/subcategories/[id]/route.ts`

### 3.2 Update Category API (if needed)

**File**: `src/app/api/admin/categories/[id]/route.ts`

- [ ] Verify subcategory cascade behavior
- [ ] Add revalidatePath for subcategory pages

---

## Phase 4: Content Migration

### 4.1 Create Migration Script

**File**: `scripts/migrate-subcategory-content.ts`

**Tasks**:
- [ ] Extract content from static page files
- [ ] Match to database subcategory records
- [ ] Insert/update page content fields
- [ ] Generate report of migrations

### 4.2 Run Migration

**Tasks**:
- [ ] Run migration script
- [ ] Verify content in admin panel
- [ ] Test pages load correctly from DB
- [ ] Compare output with static pages

### 4.3 Handle Orphan Cases

**Tasks**:
- [ ] Identify static pages without DB records
- [ ] Create missing subcategory records
- [ ] Verify category relationships

---

## Phase 5: Cleanup & Redirects

### 5.1 Static Page Deprecation

**Options**:
1. **Keep as fallback** - Static pages remain but dynamic preferred
2. **Remove with redirects** - Delete files, add DB redirects
3. **Archive** - Move to `_archive/` folder

**Recommended**: Option 2 - Clean removal with redirects

**Tasks**:
- [ ] Backup static page files
- [ ] Verify dynamic route serves all subcategories
- [ ] Add redirects if any URL changes
- [ ] Delete static page files
- [ ] Update any internal links

### 5.2 Update Sitemap

**File**: `src/app/sitemap.ts` (if exists)

- [ ] Include dynamic subcategory URLs
- [ ] Remove hardcoded subcategory URLs

---

## Phase 6: Testing

### 6.1 Admin Testing

- [ ] Create new subcategory via admin
- [ ] Edit existing subcategory content
- [ ] Upload hero image
- [ ] Toggle active/inactive status
- [ ] Delete subcategory (verify cascade protection)
- [ ] Verify category filter works

### 6.2 Frontend Testing

- [ ] Subcategory pages render from DB
- [ ] SEO metadata correct (meta description, title)
- [ ] Hero image displays
- [ ] Features and applications show
- [ ] Products list correctly
- [ ] Breadcrumbs work
- [ ] Inactive subcategories don't show

### 6.3 Integration Testing

- [ ] Create subcategory in admin → page immediately available
- [ ] Edit content → changes reflect on frontend
- [ ] Delete → page returns 404
- [ ] Products still accessible via their slugs

---

## Files Summary

| Area | Files |
|------|-------|
| **Dynamic Route** | `src/app/(subcategory)/[subcategorySlug]/page.tsx` |
| **Data Access** | `src/data/subcategories.ts` |
| **Admin Pages** | `src/app/admin/subcategories/page.tsx`, `[id]/page.tsx`, `new/page.tsx` |
| **Admin Form** | `src/components/admin/SubcategoryForm.tsx` (new) |
| **API Routes** | `src/app/api/admin/subcategories/route.ts`, `[id]/route.ts` |
| **Navigation** | `src/components/admin/AdminSidebar.tsx` |
| **Migration** | `scripts/migrate-subcategory-content.ts` |

---

## Dependencies

- Existing `subcategories` DB table (already has all fields)
- CategoryForm inline editing (reference for field handling)
- Image upload API (`/api/upload`) (already exists)

## Notes

- The inline subcategory editing in CategoryForm will remain - this adds a standalone section for convenience
- Consider adding bulk operations (activate/deactivate multiple)
- May want to add "Preview" button that opens page in new tab
- Hero image upload uses existing `/api/upload` endpoint

## Considerations

### Route Conflict Resolution

The main challenge is that `[slug]/page.tsx` catches all top-level routes. Solutions:

1. **Route Group Priority** - Next.js evaluates more specific routes first
2. **Check Subcategory First** - In `[slug]/page.tsx`, check if slug matches subcategory before product
3. **Different URL Structure** - Use `/type/{subcategory}` instead of `/{subcategory}`

Recommend Option 2 for simplicity - modify existing `[slug]/page.tsx` to check subcategories.

### SEO Considerations

- All existing URLs must continue working (no broken links)
- Meta descriptions from DB should match or improve existing
- Canonical URLs remain unchanged
- Structured data (breadcrumbs) should remain functional

---

Last Updated: 2026-01-16
