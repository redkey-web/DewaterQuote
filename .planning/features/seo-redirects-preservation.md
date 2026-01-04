# SEO Redirects & URL Preservation Plan

**Created**: 2026-01-05
**Type**: SEO enhancement
**Status**: Planning (Review Required)

## Summary

Redirect list compiled from Ahrefs data to preserve rankings from old URLs that no longer exist on the new site. User should review before implementation.

**Important**: Prefer updating internal links to new URLs rather than creating redirects where possible.

## Phases

### Phase 1: URL Structure Changes (Completed) ✅
- [x] Changed `/straub-couplings-repair-clamps` → `/brand/straub-couplings` (kept old URL)
- [x] Created `/duckbill-check-valves` page
- [x] Created `/muff-couplings` info page

### Phase 2: High Priority Redirects (Review Required)
- [ ] `/rubber-expansion-joints/fsf-single-sphere/` → `/single-sphere-expansion-joints`
- [ ] `/rubber-expansion-joints/double-arch-rubber-expansion-joint/` → `/double-arch-expansion-joints`
- [ ] `/rubber-expansion-joints/twin-sphere-rubber-expansion-joint-ftf/` → `/twin-sphere-expansion-joints`

### Phase 3: Brand/Category Redirects (Review Required)
- [ ] `/brand/teekay-couplings/` → `/brands/teekay`
- [ ] `/brand/flanged-suction-strainer/` → `/flanged-suction-strainers`
- [ ] `/flange-adapters/` → `/flange-adaptors`
- [ ] `/strainers/simplex-basket-strainer/` → `/basket-strainers`
- [ ] `/strainers/duplex-basket-strainer/` → `/duplex-basket-strainers`

### Phase 4: Product Page Redirects (Review Required)
- [ ] `/orbit-pipe-repair-clamp-series-1-and-200mm-long` → `/pipe-repair-clamps`
- [ ] `/orbit-pipe-repair-clamp-series-1-and-100mm-long` → `/pipe-repair-clamps`
- [ ] `/flex-grip-open-l` → `/orbit-couplings`
- [ ] `/metal-lock-s` → `/orbit-couplings`
- [ ] `/plast-coupling` → `/orbit-couplings`
- [ ] `/elbow-repair-clamp` → `/pipe-repair-clamps`
- [ ] `/control-rod-rubber-expansion-joint-accessory` → `/expansion-joints`

### Phase 5: Valve Category Redirects (Review Required)
- [ ] `/valves/knife-gate-valves/` → `/industrial-valves`
- [ ] `/valves/foot-valve/` → `/foot-valves`
- [ ] `/valves/butterfly-valve/` → `/butterfly-valves`
- [ ] `/valves/swing-check-valve/` → `/check-valves`
- [ ] `/valves/float-valve/` → `/float-valves`
- [ ] `/valves/ball-check-valve/` → `/ball-valves`

### Phase 6: Low Priority Redirects (Optional)
- [ ] `/strainers/heavy-duty-y-strainer-filter-screen/` → `/y-strainers`
- [ ] `/muff-couplings-aluminium-table-d-e` → `/muff-couplings`
- [ ] `/foot-valve-galvanised-flanged-table-d` → `/foot-valves`
- [ ] `/foot-valve-hdpe-flanged-table-e` → `/foot-valves`

---

## Full Redirect Reference Table

### HIGH PRIORITY - Significant Traffic Loss

| Old URL | New URL | Previous Traffic | Top Keyword (Vol) | Notes |
|---------|---------|------------------|-------------------|-------|
| `/muff-couplings/muff-couplings/` | `/muff-couplings` | 37 | muff coupling (80) | **Info page created** |
| `/rubber-expansion-joints/fsf-single-sphere/` | `/single-sphere-expansion-joints` | 11 | rubber expansion joint (10) | Product page moved |
| `/rubber-expansion-joints/double-arch-rubber-expansion-joint/` | `/double-arch-expansion-joints` | 3 | rubber expansion joint perth | Product page moved |
| `/rubber-expansion-joints/twin-sphere-rubber-expansion-joint-ftf/` | `/twin-sphere-expansion-joints` | 1 | rubber expansion joint brisbane | Product page moved |

### MEDIUM PRIORITY - Brand/Category Redirects

| Old URL | New URL | Top Keyword | Notes |
|---------|---------|-------------|-------|
| `/brand/straub-couplings/` | `/brand/straub-couplings` | straub coupling (200) | **URL preserved** |
| `/brand/teekay-couplings/` | `/brands/teekay` | teekay couplings (30) | |
| `/brand/flanged-suction-strainer/` | `/flanged-suction-strainers` | flanged suction strainers (10) | |
| `/flange-adapters/` | `/flange-adaptors` | flange adapter (40) | Spelling change |
| `/strainers/simplex-basket-strainer/` | `/basket-strainers` | basket strainers (40) | |
| `/strainers/duplex-basket-strainer/` | `/duplex-basket-strainers` | duplex filter (60) | |

### PRODUCT PAGE REDIRECTS

| Old URL | New URL | Top Keyword | Notes |
|---------|---------|-------------|-------|
| `/orbit-pipe-repair-clamp-series-1-and-200mm-long` | `/pipe-repair-clamps` | 200mm pipe clamp | |
| `/orbit-pipe-repair-clamp-series-1-and-100mm-long` | `/pipe-repair-clamps` | 100mm pipe clamp | |
| `/flex-grip-open-l` | `/orbit-couplings` | open l | |
| `/metal-lock-s` | `/orbit-couplings` | metal lock | |
| `/plast-coupling` | `/orbit-couplings` | hdpe coupling | |
| `/elbow-repair-clamp` | `/pipe-repair-clamps` | pipe repair clamp | |
| `/control-rod-rubber-expansion-joint-accessory` | `/expansion-joints` | rubber rod | |

### VALVE CATEGORY REDIRECTS

| Old URL | New URL | Top Keyword | Notes |
|---------|---------|-------------|-------|
| `/valves/duckbill-check-valve/` | `/duckbill-check-valves` | duckbill valve (200) | **Dedicated page created** |
| `/valves/knife-gate-valves/` | `/industrial-valves` | knifegate valves | |
| `/valves/foot-valve/` | `/foot-valves` | foot valves (50) | Already have page |
| `/valves/butterfly-valve/` | `/butterfly-valves` | butterfly valve (1000) | Already have page |
| `/valves/swing-check-valve/` | `/check-valves` | swing check valve (350) | |
| `/valves/float-valve/` | `/float-valves` | float valve (1000) | Already have page |
| `/valves/ball-check-valve/` | `/ball-valves` | ball check valve (100) | |

### LOW PRIORITY - Minimal/No Traffic

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/strainers/heavy-duty-y-strainer-filter-screen/` | `/y-strainers` | |
| `/muff-couplings-aluminium-table-d-e` | `/muff-couplings` | |
| `/foot-valve-galvanised-flanged-table-d` | `/foot-valves` | |
| `/foot-valve-hdpe-flanged-table-e` | `/foot-valves` | |
| Various `/brand/~-XXX` URLs | Ignore | Malformed URLs |

---

## Implementation Notes

1. **Middleware approach**: Add redirects to `src/middleware.ts` STATIC_REDIRECTS object
2. **Prefer link updates**: Where pages link to old URLs internally, update them directly instead of redirecting
3. **301 redirects**: Use 301 (permanent) for all SEO redirects to pass link equity
4. **Test after implementation**: Verify no 404s using `npm run build` page count

## Key Observations from Ahrefs Data

1. **Duckbill Valve** - Had 40 traffic, ranking #7 for "duckbill valve" (vol 200). Dedicated page created.

2. **Muff Couplings** - Lost 37 traffic, ranking #2 for "muff coupling" (vol 80). Info page created, products to be added.

3. **Straub Couplings** - Old `/brand/straub-couplings/` ranked #7 for "straub coupling" (vol 200). URL preserved.

4. **Expansion Joints** - Flat URL structure working well, gaining traffic. Keep current structure.

5. **Valves** - Old `/valves/{type}/` structure needs redirects to new flat `/butterfly-valves`, `/check-valves` etc.
