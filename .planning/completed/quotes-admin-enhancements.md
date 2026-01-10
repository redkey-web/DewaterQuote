# Quotes Admin Enhancements

**Created**: 2026-01-10
**Type**: Enhancement
**Status**: Planning
**Priority**: Medium
**Related**: [[quote-system]], [[admin-enhancements]]

## Summary

Enhance the admin quotes management system with PDF storage persistence, quote deletion capability, completed status checkbox, and improved table sorting matching the InventoryManagementTable pattern.

## Scope

- **Impact**: Medium
- **Files**: ~8-12 estimated
- **Components**: QuotesTable, quotes API routes, database schema

## Current State

| Feature | Current | Target |
|---------|---------|--------|
| PDF Storage | Generated on-the-fly | Stored in DB with Blob URL |
| Delete Quotes | Not available | Soft delete with confirmation |
| Completed Status | Via status dropdown only | Quick checkbox toggle |
| Table Sorting | Basic SortableHeader | Full InventoryManagementTable pattern |

---

## Phase 1: Database Schema - PDF Storage

### 1.1 Add PDF Fields to Quotes Table
Add columns to store generated PDFs:

```typescript
// In src/db/schema.ts - quotes table
pdfUrl: text('pdf_url'),              // Vercel Blob URL for stored PDF
pdfGeneratedAt: timestamp('pdf_generated_at'), // When PDF was last generated
pdfVersion: integer('pdf_version').default(1), // Version for regeneration tracking
```

- [x] Add `pdfUrl` column to quotes table
- [x] Add `pdfGeneratedAt` timestamp column
- [x] Add `pdfVersion` integer column (default 1)
- [x] Run `db:push` to apply schema changes
- [x] Update Quote type exports

### 1.2 Create PDF Storage API
- [x] Create `POST /api/admin/quotes/[id]/store-pdf` endpoint
- [x] Generate PDF using existing `@react-pdf/renderer` QuotePDF component
- [x] Upload PDF buffer to Vercel Blob (`put()`)
- [x] Store Blob URL in quotes.pdfUrl
- [x] Update pdfGeneratedAt timestamp
- [x] Return stored PDF URL

### 1.3 Auto-Store PDF on Quote Generation
- [x] Modify `/api/quote/route.ts` to store PDF after initial generation
- [x] Modify `/api/admin/quotes/[id]/send/route.ts` to update stored PDF
- [x] Add "Regenerate PDF" button to quote detail page

---

## Phase 2: Quote Deletion

### 2.1 Soft Delete Implementation
Add soft delete rather than hard delete for audit trail:

```typescript
// In src/db/schema.ts - quotes table (if not exists)
isDeleted: boolean('is_deleted').default(false),
deletedAt: timestamp('deleted_at'),
deletedBy: text('deleted_by'), // Admin email/name
```

- [x] Add `isDeleted` boolean column
- [x] Add `deletedAt` timestamp column
- [x] Add `deletedBy` text column
- [x] Run `db:push` to apply schema changes

### 2.2 Delete API Endpoint
- [x] Create `DELETE /api/admin/quotes/[id]/route.ts` handler
- [x] Set `isDeleted = true`, `deletedAt = now()`, `deletedBy = session.user`
- [x] Delete associated Blob PDF if exists
- [x] Return success response

### 2.3 Delete UI in QuotesTable
- [x] Add delete button/icon to actions column
- [x] Add confirmation AlertDialog (matching InventoryManagementTable pattern)
- [x] Handle delete action with loading state
- [x] Remove row from view on success
- [x] Show toast notification

### 2.4 Filter Out Deleted Quotes
- [x] Update `getQuotes()` in quotes list page to exclude `isDeleted = true`
- [ ] Optionally add "Show Deleted" toggle for admins

---

## Phase 3: Completed Checkbox

### 3.1 Add Completed Status
The `status` field already exists with values: pending, reviewed, quoted, forwarded, accepted, rejected.

Option A: Use existing "accepted" status as completed
Option B: Add new "completed" status for explicit tracking

**Decision**: Use "completed" as new status value (clearer intent)

- [x] Add "completed" to statusColors map in QuotesTable
- [x] Add "Completed" option to status filter dropdown

### 3.2 Quick Toggle Checkbox
- [x] Add Checkbox column after Quote # column
- [x] Checked state = status === 'completed'
- [x] On toggle: PATCH to `/api/admin/quotes/[id]` with status change
- [x] Optimistic UI update with revert on error
- [x] Visual feedback (strikethrough or muted row for completed)

### 3.3 Batch Complete Action
- [ ] Add bulk selection checkboxes (like InventoryManagementTable)
- [ ] Add "Mark Complete" bulk action button
- [ ] Batch PATCH to update multiple quotes

---

## Phase 4: Enhanced Table Sorting

Current QuotesTable has basic SortableHeader. Upgrade to match InventoryManagementTable pattern.

### 4.1 Update Sort UI
- [x] Add ArrowUp/ArrowDown/ArrowUpDown icons (like InventoryManagementTable)
- [x] Add visual active state (text-gray-900 vs text-gray-600)
- [x] Add hover transitions

### 4.2 Sticky Headers
- [x] Add sticky positioning to table headers
- [x] Match InventoryManagementTable sticky header pattern
- [x] Account for AdminHeader offset (top-16)

### 4.3 Filter Enhancements
- [ ] Add date range filter (created this week, this month, etc.)
- [ ] Add total amount range filter (optional)
- [ ] Persist filter state in URL params (already partially done)

---

## Phase 5: Polish & Integration

### 5.1 Quote Detail Page Updates
- [x] Show stored PDF with download link
- [x] Add "Regenerate PDF" button
- [x] Add "Delete Quote" button with confirmation
- [ ] Show deletion info if quote was deleted then restored

### 5.2 Dashboard Stats
- [ ] Update admin dashboard to show quote stats
- [ ] Completed vs pending count
- [ ] This week/month activity

### 5.3 Testing
- [ ] Test PDF storage with various quote types
- [ ] Test delete and restore flow
- [ ] Test bulk actions
- [ ] Test sorting with large dataset

---

## Files to Modify/Create

| File | Changes |
|------|---------|
| `src/db/schema.ts` | Add PDF and deletion columns |
| `src/components/admin/QuotesTable.tsx` | Enhanced sorting, checkbox, delete |
| `src/app/api/admin/quotes/[id]/route.ts` | Add DELETE handler, update PATCH |
| `src/app/api/admin/quotes/[id]/store-pdf/route.ts` | New - PDF storage |
| `src/app/admin/quotes/page.tsx` | Update query to exclude deleted |
| `src/app/admin/quotes/[id]/QuoteDetail.tsx` | PDF display, delete button |

---

## Implementation Notes

### PDF Storage Strategy
- Use Vercel Blob for PDF storage (consistent with product images)
- Store with path: `quotes/{quoteNumber}/quote-{version}.pdf`
- Keep URL in database for fast retrieval
- Consider retention policy for old versions

### Sorting Consistency
The InventoryManagementTable uses this pattern:
```typescript
const SortableHeader = ({ sortKey, children }) => {
  const isActive = sortConfig.key === sortKey;
  return (
    <button onClick={() => handleSort(sortKey)} className={cn(...)}>
      {children}
      {isActive ? (direction === 'desc' ? <ArrowDown /> : <ArrowUp />) : <ArrowUpDown />}
    </button>
  );
};
```

Apply same pattern to QuotesTable for consistency.

---

Last Updated: 2026-01-10
