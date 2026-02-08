# 301 Redirect Management System

## Overview
Admin panel feature to manage URL redirects with database storage, cached middleware lookup, and CSV import/export.

## Files to Create

### Admin UI
| File | Purpose |
|------|---------|
| `src/app/admin/redirects/page.tsx` | List page with table, filters |
| `src/app/admin/redirects/new/page.tsx` | Create redirect form |
| `src/app/admin/redirects/[id]/page.tsx` | Edit redirect form |
| `src/components/admin/RedirectForm.tsx` | Shared form component |

### API Routes
| File | Methods |
|------|---------|
| `src/app/api/admin/redirects/route.ts` | POST (create) |
| `src/app/api/admin/redirects/[id]/route.ts` | PATCH, DELETE |
| `src/app/api/admin/redirects/export/route.ts` | GET (CSV download) |
| `src/app/api/admin/redirects/import/route.ts` | POST (CSV upload) |

### Core
| File | Purpose |
|------|---------|
| `src/lib/redirects.ts` | In-memory cache service |
| `src/middleware.ts` | Add DB redirect lookup |
| `src/components/admin/AdminSidebar.tsx` | Add nav item |

## Schema (Already Exists)
```typescript
// src/db/schema.ts - NO CHANGES NEEDED
redirects: {
  id, fromPath (unique), toPath, statusCode (301/302),
  isActive, productId (optional FK), createdAt, expiresAt
}
```

## Implementation Details

### 1. Redirect Cache Service (`src/lib/redirects.ts`)
- In-memory Map with 60s TTL
- `getRedirect(path)` - lookup with cache
- `invalidateCache()` - called after admin actions
- Edge-compatible (no Redis needed)

### 2. Middleware Enhancement
```typescript
// After static redirect check:
const dbRedirect = await getRedirect(pathname);
if (dbRedirect) {
  return NextResponse.redirect(
    new URL(dbRedirect.toPath, request.url),
    dbRedirect.statusCode
  );
}
```

### 3. Admin UI Features
- **List**: Table with fromPath, toPath, status, active toggle, expiry
- **Create/Edit**: Form with path inputs, status dropdown, product selector, date picker
- **Bulk**: CSV import/export for spreadsheet management
- **Validation**: Unique paths, no circular redirects, path normalization

### 4. CSV Format
```csv
fromPath,toPath,statusCode,isActive,expiresAt
/old-url,/new-url,301,true,
/temp,/permanent,302,true,2024-12-31
```

## Validation Rules
- `fromPath`: Required, starts with `/`, lowercase, unique
- `toPath`: Required, starts with `/` or valid URL
- `statusCode`: 301 (permanent) or 302 (temporary)
- No circular redirects (fromPath !== toPath)

## Verification
1. Create redirect in admin UI
2. Visit old URL - should 301 to new URL
3. Check browser network tab for correct status code
4. Test CSV export/import
5. Test cache invalidation (edit redirect, verify change)
