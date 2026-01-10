# Subcategory Breadcrumbs Enhancement

**Created**: 2026-01-05
**Updated**: 2026-01-05
**Type**: enhancement
**Status**: Complete

## Summary
Add parent category links to subcategory page breadcrumbs without changing URL structure. Currently subcategory pages show `Home / Butterfly Valves`, should show `Home / Valves / Butterfly Valves`.

## Scope
- **Impact**: Low
- **Files**: ~20 subcategory pages
- **Components**: Breadcrumb nav, BreadcrumbJsonLd

## Category Mappings

| Category | Parent URL | Subcategory Pages |
|----------|------------|-------------------|
| Valves | `/industrial-valves` | butterfly-valves, check-valves, gate-valves, ball-valves, float-valves, foot-valves, duckbill-check-valves |
| Expansion Joints | `/expansion-joints` | single-sphere, twin-sphere, single-arch, double-arch, triple-arch, quadruple-arch, reducing, ptfe-lined |
| Strainers | `/strainers` | y-strainers, basket-strainers, duplex-basket-strainers, flanged-suction-strainers |
| Couplings | `/pipe-couplings` | muff-couplings, flange-adaptors |
| Pipe Repair | `/pipe-repair` | (none - it's a category page itself) |

## Phases

### Phase 1: Valve Subcategories ✅
- [x] butterfly-valves/page.tsx (added Valves parent)
- [x] check-valves/page.tsx (already had parent)
- [x] gate-valves/page.tsx (already had parent)
- [x] ball-valves/page.tsx (added Valves parent)
- [x] float-valves/page.tsx (already had parent)
- [x] foot-valves/page.tsx (already had parent)
- [x] duckbill-check-valves/page.tsx (added Valves to JSON-LD)

### Phase 2: Expansion Joint Subcategories ✅
- [x] single-sphere-expansion-joints/page.tsx (already had parent)
- [x] twin-sphere-expansion-joints/page.tsx (added Expansion Joints parent)
- [x] single-arch-expansion-joints/page.tsx (already had parent)
- [x] double-arch-expansion-joints/page.tsx (added Expansion Joints parent)
- [x] triple-arch-expansion-joints/page.tsx (already had parent)
- [x] quadruple-arch-expansion-joints/page.tsx (already had parent)
- [x] reducing-expansion-joints/page.tsx (added Expansion Joints parent)
- [x] ptfe-lined-expansion-joints/page.tsx (already had parent)

### Phase 3: Strainer Subcategories ✅
- [x] y-strainers/page.tsx (added Strainers parent)
- [x] basket-strainers/page.tsx (already had parent)
- [x] duplex-basket-strainers/page.tsx (already had parent)
- [x] flanged-suction-strainers/page.tsx (already had parent)

### Phase 4: Coupling Subcategories ✅
- [x] muff-couplings/page.tsx (added Pipe Couplings to JSON-LD)
- [x] flange-adaptors/page.tsx (added Pipe Couplings parent + visual nav)

### Phase 5: Dynamic Routes
- [x] [slug]/[subcategory]/page.tsx (already has parent in breadcrumbs)
- [x] expansion-joints/[subcategory]/page.tsx (already has parent)

## Implementation Pattern

For each file, update:

1. **BreadcrumbJsonLd array** - Add parent category:
```tsx
const breadcrumbs = [
  { name: "Home", url: "https://dewaterproducts.com.au" },
  { name: "Valves", url: "https://dewaterproducts.com.au/industrial-valves" },  // ADD
  { name: content.title, url: "https://dewaterproducts.com.au/butterfly-valves" },
]
```

2. **Visual nav breadcrumb** - Add parent link:
```tsx
<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
  <span className="mx-1">/</span>
  <Link href="/industrial-valves" className="hover:text-foreground transition-colors">Valves</Link>  // ADD
  <span className="mx-1">/</span>  // ADD
  <span className="text-foreground font-medium">{content.title}</span>
</nav>
```

## Notes
- URLs remain unchanged (flat structure preserved)
- SEO benefit from proper breadcrumb hierarchy
- Improves navigation UX
