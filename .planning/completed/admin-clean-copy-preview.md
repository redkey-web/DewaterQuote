# Admin Clean Copy + Preview Tab

**Created**: 2025-12-16
**Type**: Enhancement
**Status**: Complete

## Summary

Improve the admin product editing experience by:
1. Stripping HTML/formatting codes from description input (clean copy only)
2. Making the description textarea larger
3. Adding a Preview tab to review changes before saving
4. Requiring preview before save (redirect to preview tab on save)

## Problem

From screenshot, the admin shows raw HTML in description field:
```html
<p><span style="font-size:20px;">The Orbit Pipe Repair Clamp Series 1...</span></p>
```

This is confusing for clients who just want to edit text. The HTML formatting should be handled consistently by the frontend CSS, not embedded in content.

## Scope

- **Impact**: Medium
- **Files**: 3-4 files
- **Components**: ProductForm.tsx, ProductFormNew.tsx, utils.ts

## Phases

### Phase 1: Create HTML Strip Utility
- [x] Add `stripHtml()` function to `src/lib/utils.ts`
- [x] Handle common entities (&nbsp;, &amp;, etc.)
- [x] Normalize whitespace

```typescript
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')      // Remove HTML tags
    .replace(/&nbsp;/g, ' ')       // Non-breaking space
    .replace(/&amp;/g, '&')        // Ampersand
    .replace(/&lt;/g, '<')         // Less than
    .replace(/&gt;/g, '>')         // Greater than
    .replace(/&quot;/g, '"')       // Quote
    .replace(/&#39;/g, "'")        // Apostrophe
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();
}
```

### Phase 2: Update ProductForm.tsx
- [x] Import stripHtml utility
- [x] Strip HTML from description on form initialization
- [x] Increase textarea rows from 4 to 8
- [x] Add controlled tab state: `const [activeTab, setActiveTab] = useState('basic')`
- [x] Add Preview tab to TabsList
- [x] Create Preview TabsContent with product preview
- [x] Modify handleSubmit: if not on preview tab, redirect and return

Key changes:
```typescript
// Form initialization
const [formData, setFormData] = useState({
  // ...
  description: stripHtml(product.description), // Strip HTML on load
  // ...
});

// Add controlled tabs
const [activeTab, setActiveTab] = useState('basic');

// Modify handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (activeTab !== 'preview') {
    setActiveTab('preview');
    toast({
      title: "Review Changes",
      description: "Please check the preview before saving.",
    });
    return;
  }

  // Continue with save...
};
```

### Phase 3: Create Product Preview Component
- [x] Create inline preview in ProductForm or separate ProductPreview.tsx
- [x] Show: name, description, images, features, specifications
- [x] Match public product page styling
- [x] Include notice: "This is how the product will appear on the website"

### Phase 4: Update ProductFormNew.tsx
- [x] Apply same changes for consistency
- [x] Preview tab (even for new products)
- [x] Larger description textarea

### Phase 5: Testing
- [x] Test with existing product that has HTML in description
- [x] Verify HTML is stripped on load
- [x] Verify save works correctly
- [x] Verify preview tab renders correctly
- [x] Verify save-from-other-tab redirects to preview
- [x] Test new product creation flow

## Technical Notes

### Why strip client-side?
- Immediate feedback
- No API changes needed
- Backwards compatible
- Database migration not required (data cleaned on next save)

### Preview Tab Content
Should render a simplified version of the public product page:
- Product name
- Description (as it will appear)
- Primary image
- Key specifications
- Features list

### UX Flow
1. User edits product on any tab
2. User clicks "Save Changes"
3. If not on Preview tab → switch to Preview, show toast
4. User reviews preview
5. User clicks "Save Changes" again from Preview tab
6. Changes are saved

## Dependencies
- Existing Tabs component from shadcn/ui
- Toast for notifications

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/utils.ts` | Add stripHtml function |
| `src/components/admin/ProductForm.tsx` | Main changes: strip HTML, preview tab, save logic |
| `src/components/admin/ProductFormNew.tsx` | Same changes for new product form |
