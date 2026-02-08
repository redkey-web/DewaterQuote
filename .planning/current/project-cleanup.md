# Project Cleanup & Freeze Investigation

**Created**: 2026-01-14
**Completed**: 2026-01-14
**Type**: maintenance
**Status**: Complete

## Summary

Remove unused files, clean database orphans, and investigate freezing issues. The project has accumulated ~190MB of deprecated/backup files plus a 902MB .next cache that may contribute to IDE/git performance issues.

## Scope

- **Impact**: Medium (storage + performance)
- **Files**: ~15 folders/files to evaluate
- **Risk**: Low (removable items are deprecated/backup)

## Identified Cleanup Targets

### High Priority - Safe Deletions (~190MB)

| Target | Size | Reason |
|--------|------|--------|
| `_deprecated/` | 50MB | Old Replit project structure from Nov 26 |
| `_replit_backup/` | 62MB | Complete backup from Dec 28, superseded |
| `.planning/audit/images/` | 44MB | Old audit images (already uploaded to Blob) |
| `.playwright-mcp/` | 34MB | Playwright test artifacts |

### Medium Priority - Review Before Deletion

| Target | Size | Reason |
|--------|------|--------|
| `attached_assets/` | 3.9MB | May contain unused assets |
| `ADMIN_DATA_SYNC_PLAN.md` | 10KB | Old planning doc in root |
| `Dewater.xlsx` | 551KB | Old spreadsheet |
| `docs/` | 24KB | May be unused documentation |
| `_handoff/` | 24KB | Handoff protocol files |

### Cache (Auto-regenerates)

| Target | Size | Action |
|--------|------|--------|
| `.next/` | 902MB | Clear if freezing persists |

### Scripts Folder Review

68 scripts totaling ~11,500 lines. Many are one-off migration/import scripts that have served their purpose:
- `scrape-straub.mjs` - one-time scrape
- `download-*.sh/ts` - one-time downloads
- `import-*.ts` - one-time imports
- `seed.ts` - initial seeding (may keep)

## Phases

### Phase 1: File System Cleanup
- [x] Remove `_deprecated/` folder (50MB)
- [x] Remove `_replit_backup/` folder (62MB)
- [x] Remove `.planning/audit/images/` folder (44MB)
- [x] Remove `.playwright-mcp/` folder (34MB)
- [x] Review and remove `attached_assets/` if unused
- [x] Move old root files to `.planning/archive/`

### Phase 2: Scripts Audit
- [x] Identify scripts that have served their purpose
- [x] Move completed scripts to `scripts/_archive/`
- [x] Keep essential scripts: seed, create-admin, check utilities

### Phase 3: Database Cleanup
- [x] Check for orphaned product_images (URLs pointing to deleted blobs)
- [x] Check for inactive products that can be fully removed
- [x] Check empty tables: product_stock, product_shipping, product_seo
- [x] Review quotes marked as deleted (isDeleted=true)

### Phase 4: Freeze Investigation
- [x] Clear `.next/` cache and rebuild
- [x] Check git index size (`du -sh .git/`)
- [x] Review .gitignore covers large folders
- [x] Check for recursive symlinks or large binary files
- [x] Test Claude Code performance after cleanup

## Freeze Causes - Likely Culprits

1. **Large folder sizes** - 190MB+ of deprecated files being indexed
2. **902MB .next cache** - Heavy IDE/git operations
3. **68 scripts** - Many files for tools to scan
4. **44MB audit images** - Binary files in planning folder

## Safety Measures

- All deletions are backup/deprecated folders
- Database cleanup uses soft delete first
- Git history preserves everything
- No production data affected

## Expected Outcome

- **~190MB** freed from project folder
- Faster git operations
- Reduced IDE indexing time
- Cleaner project structure

## Notes

- Run `npm run build` after cleanup to verify nothing breaks
- Consider adding large folders to `.gitignore` if recreated
- Scripts can be recovered from git history if needed later

---

## Completion Summary (2026-01-14)

### Storage Freed
| Item | Size |
|------|------|
| `_deprecated/` | 50MB |
| `_replit_backup/` | 62MB |
| `.planning/audit/images/` | 44MB |
| `.playwright-mcp/` | 34MB |
| `attached_assets/` | 4MB |
| `.next/` cache | 902MB |
| **Total** | **~1.1GB** |

### Scripts Archived
- 36 one-off migration scripts moved to `scripts/_archive/`
- 31 active scripts remaining

### Freeze Prevention
- Cleared 902MB build cache
- .gitignore updated to exclude backup/archive folders
- Git folder is 360MB (normal for project history)
