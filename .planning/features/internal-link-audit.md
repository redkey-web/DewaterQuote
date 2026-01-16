# Internal Link Audit

**Created**: 2026-01-17
**Type**: Quality Assurance
**Status**: Active
**Triggered by**: Broken `/valves` link on fire-services page

## Root Cause Analysis

### Why It Was Missed

1. **Manual data entry** - Industry page `products` arrays were hand-typed, not validated against actual routes
2. **No automated link checking** - Build process doesn't verify internal links resolve
3. **Route naming inconsistency** - Some categories use different URL patterns:
   - `valves` (data) → `industrial-valves` (route)
   - `rubber-expansion-joints` (data) → `expansion-joints` (route)

### Pattern of Error

The `[industry]/page.tsx` uses:
```tsx
{solution.products.map((prod) => (
  <Link href={`/${prod}`}>
```

This assumes `products` array values exactly match route paths. They didn't.

---

## Phase 1: Immediate Fixes (Complete)

- [x] Change `products: ["valves"]` → `["industrial-valves"]` (12 occurrences)
- [x] Change `products: ["valves", "strainers"]` → `["industrial-valves", "strainers"]` (1 occurrence)
- [x] Change `products: ["rubber-expansion-joints"]` → `["expansion-joints"]` (occurrences)

---

## Phase 2: Site-Wide Link Audit

### 2.1 Generate Valid Routes List

Create a reference of all valid internal routes:

```bash
# List all page.tsx files and extract routes
find src/app -name "page.tsx" | sed 's|src/app||;s|/page.tsx||;s|^\[.*\]|*|'
```

**Tasks**:
- [ ] Generate complete route list from src/app/
- [ ] Document in `.planning/reference/valid-routes.md`
- [ ] Include dynamic routes with their params

### 2.2 Scan All Internal Links

Search for all internal Link components and href attributes:

```bash
# Find all internal links
grep -r 'href="/' src/ --include="*.tsx" | grep -v node_modules
grep -r "href={\`/" src/ --include="*.tsx" | grep -v node_modules
```

**Tasks**:
- [ ] Extract all static internal links (href="/...")
- [ ] Extract all dynamic internal links (href={`/...`})
- [ ] Cross-reference against valid routes

### 2.3 Check Navigation/Menu Links

Priority files to audit:
- [ ] `src/components/Header.tsx` - Main nav menus
- [ ] `src/components/Footer.tsx` - Footer links
- [ ] `src/app/page.tsx` - Homepage links
- [ ] `src/app/industries/[industry]/page.tsx` - Industry page links (fixed)
- [ ] `src/app/industries/page.tsx` - Industries index

### 2.4 Automated Validation

**Option A: Build-time Script**

Create `scripts/validate-links.ts`:
```typescript
// 1. Get all page routes from file system
// 2. Get all href values from tsx files
// 3. Compare and report mismatches
```

**Option B: Playwright Crawler**

Run after build to crawl site and check 404s:
```typescript
// 1. Start from homepage
// 2. Click/fetch every internal link
// 3. Report any non-200 responses
```

**Tasks**:
- [ ] Decide on validation approach (build-time vs runtime)
- [ ] Implement chosen solution
- [ ] Add to CI/build process

---

## Phase 3: Prevention

### 3.1 Route Constants

Create a single source of truth for route paths:

```typescript
// src/lib/routes.ts
export const ROUTES = {
  INDUSTRIAL_VALVES: '/industrial-valves',
  EXPANSION_JOINTS: '/expansion-joints',
  PIPE_COUPLINGS: '/pipe-couplings',
  STRAINERS: '/strainers',
  // ... all routes
} as const;
```

Then use constants instead of strings:
```typescript
products: [ROUTES.INDUSTRIAL_VALVES]
```

**Tasks**:
- [ ] Create routes.ts with all valid paths
- [ ] Refactor industry page to use constants
- [ ] Consider TypeScript enum for compile-time safety

### 3.2 Link Component Wrapper

Create a validated Link component:

```typescript
// src/components/ValidatedLink.tsx
import { ROUTES } from '@/lib/routes';

type ValidRoute = typeof ROUTES[keyof typeof ROUTES];

interface Props {
  href: ValidRoute;
  children: React.ReactNode;
}
```

This gives TypeScript errors for invalid routes.

---

## Verification Checklist

- [ ] All industry page links working
- [ ] Header navigation links working
- [ ] Footer links working
- [ ] Homepage links working
- [ ] Product page internal links working
- [ ] Breadcrumb links working
- [ ] No 404s when crawling site

---

## Files Affected

| File | Status | Notes |
|------|--------|-------|
| `src/app/industries/[industry]/page.tsx` | ✅ Fixed | valves→industrial-valves, rubber-expansion-joints→expansion-joints |
| `src/lib/routes.ts` | ⏳ To create | Route constants |
| `scripts/validate-links.ts` | ⏳ To create | Build-time validation |

---

Last Updated: 2026-01-17
