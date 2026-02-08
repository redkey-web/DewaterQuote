---
phase: 1
phase_name: "Admin Panel V2"
test_file: tests/admin/admin-panel-v2.spec.ts
test_required: true
test_timeout: 180
flaky_retries: 3
---

# Admin Panel V2

**Created**: 2026-01-12
**Type**: Fix / Enhancement
**Priority**: High
**Related**: [[admin-panel-overhaul]] - Refinements from V1 implementation

## Summary

Bug fixes and UI polish for the admin panel, addressing issues discovered after the V1 overhaul: logo sizing, quote count sync, table overflow handling, sticky headers, and mobile navigation gaps.

## Scope

- **Impact**: Medium
- **Files**: ~6 estimated
- **Areas**: AdminSidebar, AdminHeader, InventoryManagementTable, ProductsTable, Dashboard

---

## Phase 1: Mobile Navigation Fix (Critical)

### 1.1 Mobile Sidebar Missing Nav Items **[ACTIVE]**

**Problem**: The slide-out mobile sidebar is missing Quotes, Inventory, and Logistics navigation items. Users can't access these pages on mobile.

**Files Affected**:
- `src/components/admin/AdminHeader.tsx` (lines 36-44)

**Root Cause**: The `navigation` array in AdminHeader.tsx only has 7 items, missing the 3 key operational pages that exist in AdminSidebar.tsx.

**Current** (AdminHeader.tsx):
```typescript
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpIcon },
];
```

**Expected** (match AdminSidebar.tsx):
```typescript
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quotes', href: '/admin/quotes', icon: FileText },
  { name: 'Inventory', href: '/admin/inventory', icon: PackageSearch },
  { name: 'Product Pages', href: '/admin/products', icon: Package },
  { name: 'Logistics', href: '/admin/logistics', icon: Truck },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpIcon },
];
```

**Outcome**: Mobile sidebar shows all nav items matching desktop sidebar.

**Test**: `mobile-nav-complete`

**Tasks**:
- [x] Import missing icons (FileText, PackageSearch, Truck) in AdminHeader.tsx
- [x] Add Quotes, Inventory, Logistics to navigation array
- [x] Rename "Products" to "Product Pages" for consistency
- [x] Reorder to match AdminSidebar.tsx order
- [x] Test mobile menu at various breakpoints

**Resolution**: {filled after}

---

## Phase 2: Table Overflow Fixes

### 2.1 Products & Inventory Tables Overflow

**Problem**: Both ProductsTable and InventoryManagementTable overflow the page width. They should use the same horizontal scroll mechanism that Logistics uses successfully.

**Files Affected**:
- `src/components/admin/ProductsTable.tsx` (line 311)
- `src/components/admin/InventoryManagementTable.tsx` (line 1014)

**Root Cause Analysis**:

1. **ProductsTable**: Container missing `overflow-x-auto` class entirely
   ```tsx
   // Current (line 311)
   <div className="border rounded-lg bg-white">
   ```

2. **InventoryManagementTable**: Has `overflow-x-auto` but table uses `min-w-[1200px]` which may cause parent overflow. Need to ensure parent container constrains width properly.
   ```tsx
   // Current (line 1014)
   <div className="border rounded-lg bg-white overflow-x-auto">
     <Table containerClassName="min-w-[1200px]">
   ```

**Expected** (match LogisticsTabs pattern):
- Container has `overflow-x-auto`
- Parent must have `max-w-full` or `overflow-hidden` to prevent page overflow
- Table can have `min-width` for content

**Outcome**: Both tables scroll horizontally within their containers without overflowing page bounds.

**Test**: `tables-horizontal-scroll`

**Tasks**:
- [x] ProductsTable: Add `overflow-x-auto` to table container
- [x] InventoryManagementTable: Add `max-w-full overflow-hidden` to parent or adjust container
- [x] Check admin layout wrapper for proper width constraints
- [ ] Test both tables with narrow viewport to verify scroll works
- [ ] Verify neither table overflows page bounds

**Resolution**: {filled after}

---

### 2.2 Inventory Table Sticky Header Fix

**Problem**: Inventory table heading is not at the top of the table. It should stick to the top of the scrollable container (not page top with hardcoded offset).

**Files Affected**:
- `src/components/admin/InventoryManagementTable.tsx` (line 1018)

**Root Cause**: TableHead uses `sticky top-[116px]` - hardcoded offset relative to page. Should use `sticky top-0` inside a scrollable container with `max-height`.

**Current** (line 1018):
```tsx
<TableHead className="w-[40px] sticky top-[116px] bg-gray-100 z-20">
```

**Expected Approach**:
1. Wrap table in a container with `max-height` and `overflow-y-auto`
2. Change sticky offset to `top-0` (relative to container, not page)
3. Keep horizontal scroll behavior

**Outcome**: Table header sticks to top of table container when scrolling within the table, not relative to page scroll.

**Test**: `inventory-sticky-header`

**Tasks**:
- [x] Add max-height container around table for vertical scroll
- [x] Change `sticky top-[116px]` to `sticky top-0` for all TableHead cells
- [x] Keep `overflow-x-auto` for horizontal scrolling
- [ ] Verify header stays visible when scrolling within table
- [ ] Test that page-level scroll still works correctly

**Resolution**: {filled after}

---

## Phase 3: Logo and Branding

### 3.1 Sidebar Logo Size

**Problem**: Logo in sidebar is too small, should span full width of sidebar panel.

**Files Affected**:
- `src/components/admin/AdminSidebar.tsx` (lines 100-108)

**Current** (lines 100-108):
```tsx
<Image
  src="/images/logo-new.png"
  alt="DeWater Products"
  width={160}
  height={40}
  className="h-10 w-auto"
  priority
/>
```

**Expected**:
- Logo should be wider (full sidebar width minus padding)
- Height can scale proportionally
- Maintain aspect ratio

**Approach**:
```tsx
<Image
  src="/images/logo-new.png"
  alt="DeWater Products"
  width={200}
  height={50}
  className="w-full h-auto max-h-12"
  priority
/>
```

**Outcome**: Logo fills sidebar width (minus padding) while maintaining aspect ratio.

**Test**: `sidebar-logo-full-width`

**Tasks**:
- [x] Increase Image width prop to 200+
- [x] Change className to `w-full h-auto max-h-14`
- [ ] Verify logo looks good at sidebar width
- [ ] Check collapsed state still works (uses "D" icon)

**Resolution**: {filled after}

---

## Phase 4: Data Sync Issues

### 4.1 Pending Quote Count Mismatch

**Problem**: Dashboard shows different pending quote count than actual quotes in the Quotes panel.

**Files Affected**:
- `src/app/admin/page.tsx` (getStats function)
- API endpoints that modify quotes

**Root Cause Analysis**:
- Dashboard query: `status = 'pending' AND isDeleted = false` ✓ correct
- Quotes page query: `isDeleted = false OR isDeleted IS NULL` ✓ correct
- Likely cause: **Cache not revalidating** when quotes are modified

**Investigation Tasks**:
- [ ] Check if `/api/admin/quotes/[id]` route revalidates dashboard path
- [ ] Check if quote status changes revalidate `/admin` path
- [ ] Add `revalidatePath('/admin')` to quote modification endpoints

**Expected Behavior**: Dashboard pending count matches filtered pending quotes in Quotes panel.

**Test**: `dashboard-quote-sync`

**Tasks**:
- [ ] Audit quote modification APIs for revalidatePath calls
- [ ] Add `revalidatePath('/admin')` to:
  - POST /api/admin/quotes/[id] (status change)
  - DELETE /api/admin/quotes/[id] (soft delete)
  - POST /api/admin/quotes/[id]/restore
- [ ] Test: delete quote, verify dashboard updates immediately
- [ ] Test: change quote status, verify count updates

**Resolution**: {filled after}

---

### 4.2 Quote Number Wrong on Inventory

**Problem**: Quote number displayed on inventory is incorrect.

**Investigation Needed**: Where is quote number shown on inventory? Need to identify the specific display issue.

**Tasks**:
- [ ] Identify where quote number appears in InventoryManagementTable
- [ ] Compare displayed value with source data
- [ ] Fix data binding or display logic

**Resolution**: {filled after}

---

## Phase 5: Testing

### 5.1 Write Tests

**Test File**: `tests/admin/admin-panel-v2.spec.ts`

**Tests**:
- [ ] Mobile nav shows all 10 menu items
- [ ] Products table horizontal scroll on narrow viewport
- [ ] Inventory table header sticks during scroll
- [ ] Sidebar logo spans full width
- [ ] Dashboard pending count matches quotes panel

**Tasks**:
- [ ] Create test file with all scenarios
- [ ] Run tests with `npx playwright test tests/admin/admin-panel-v2.spec.ts`
- [ ] Fix any failures
- [ ] Verify all tests pass

**Resolution**: {filled after}

---

## Files Summary

| Area | Files |
|------|-------|
| **Mobile Nav** | AdminHeader.tsx |
| **Table Overflow** | ProductsTable.tsx |
| **Sticky Header** | InventoryManagementTable.tsx |
| **Logo** | AdminSidebar.tsx |
| **Quote Sync** | admin/page.tsx, API routes |
| **Tests** | tests/admin/admin-panel-v2.spec.ts |

---

## Quick Reference: Fixes

| Issue | File | Line | Fix |
|-------|------|------|-----|
| Mobile nav missing items | AdminHeader.tsx | 36-44 | Add Quotes, Inventory, Logistics to array |
| Products overflow | ProductsTable.tsx | 311 | Add `overflow-x-auto` |
| Inventory overflow | InventoryManagementTable.tsx | 1014 | Add parent width constraint |
| Inventory sticky header | InventoryManagementTable.tsx | 1018 | Change to `sticky top-0` with container |
| Logo too small | AdminSidebar.tsx | 100-108 | Use `w-full h-auto max-h-14` |
| Quote count stale | API routes | - | Add revalidatePath('/admin') |

---

Last Updated: 2026-01-12
