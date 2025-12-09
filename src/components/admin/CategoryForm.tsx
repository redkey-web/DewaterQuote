'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Trash2, Plus, GripVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Category, Subcategory } from '@/db/schema';

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// New Category Form
export function CategoryFormNew() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    displayOrder: 0,
  });

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.name || !formData.slug) {
      setError('Name and slug are required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.name),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }

      const data = await response.json();
      router.push(`/admin/categories/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g., Pipe Couplings"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="e.g., pipe-couplings"
              />
              <p className="text-xs text-gray-500">Auto-generated from name</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
              className="w-24"
            />
            <p className="text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description for listings..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={4}
              placeholder="Detailed description for category page..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-6 flex justify-between">
        <Link href="/admin/categories">
          <Button type="button" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Category
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Edit Category Form
interface CategoryFormEditProps {
  category: CategoryWithSubcategories;
}

export function CategoryFormEdit({ category }: CategoryFormEditProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    longDescription: category.longDescription || '',
    displayOrder: category.displayOrder ?? 0,
  });

  const [subcats, setSubcats] = useState(
    category.subcategories.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description || '',
      displayOrder: s.displayOrder ?? 0,
      isNew: false,
    }))
  );

  const addSubcategory = () => {
    setSubcats([
      ...subcats,
      {
        id: -Date.now(), // Temporary negative ID for new items
        name: '',
        slug: '',
        description: '',
        displayOrder: subcats.length,
        isNew: true,
      },
    ]);
  };

  const removeSubcategory = (index: number) => {
    setSubcats(subcats.filter((_, i) => i !== index));
  };

  const updateSubcategory = (index: number, field: keyof typeof subcats[0], value: string | number) => {
    const newSubcats = [...subcats];
    const current = newSubcats[index];

    if (field === 'name' && typeof value === 'string' && current.isNew && !current.slug) {
      // Auto-generate slug for new subcategories
      newSubcats[index] = {
        ...current,
        name: value,
        slug: generateSlug(value),
      };
    } else {
      newSubcats[index] = { ...current, [field]: value } as typeof current;
    }
    setSubcats(newSubcats);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.name || !formData.slug) {
      setError('Name and slug are required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subcategories: subcats
            .filter((s) => s.name.trim() && s.slug.trim())
            .map((s, i) => ({
              id: s.isNew ? undefined : s.id,
              name: s.name.trim(),
              slug: s.slug.trim(),
              description: s.description.trim() || null,
              displayOrder: i,
            })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subcategories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Subcategories</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSubcategory}>
                <Plus className="h-4 w-4 mr-1" />
                Add Subcategory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {subcats.length === 0 ? (
              <p className="text-sm text-gray-500">No subcategories. Click "Add Subcategory" to create one.</p>
            ) : (
              <div className="space-y-4">
                {subcats.map((subcat, i) => (
                  <div key={subcat.id} className="flex gap-4 items-start p-4 border rounded-lg bg-gray-50">
                    <GripVertical className="h-5 w-5 text-gray-400 mt-2" />
                    <div className="flex-1 grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={subcat.name}
                          onChange={(e) => updateSubcategory(i, 'name', e.target.value)}
                          placeholder="Subcategory name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug *</Label>
                        <Input
                          value={subcat.slug}
                          onChange={(e) => updateSubcategory(i, 'slug', e.target.value)}
                          placeholder="url-slug"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={subcat.description}
                          onChange={(e) => updateSubcategory(i, 'description', e.target.value)}
                          placeholder="Optional description"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubcategory(i)}
                      className="mt-7"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-6 flex justify-between">
        <Link href="/admin/categories">
          <Button type="button" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
