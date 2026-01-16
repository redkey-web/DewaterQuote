'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Trash2, Plus, GripVertical, ArrowLeft, ChevronDown, ChevronUp, Upload, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import type { Category, Subcategory } from '@/db/schema';

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

interface SubcategoryFormData {
  id: number;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  heroImage: string;
  metaDescription: string;
  heroDescription: string;
  longDescription: string;
  features: string[];
  applications: string[];
  isActive: boolean;
  isNew: boolean;
  isExpanded: boolean;
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
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    longDescription: category.longDescription || '',
    displayOrder: category.displayOrder ?? 0,
  });

  const [subcats, setSubcats] = useState<SubcategoryFormData[]>(
    category.subcategories.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description || '',
      displayOrder: s.displayOrder ?? 0,
      heroImage: s.heroImage || '',
      metaDescription: s.metaDescription || '',
      heroDescription: s.heroDescription || '',
      longDescription: s.longDescription || '',
      features: s.features || [],
      applications: s.applications || [],
      isActive: s.isActive ?? true,
      isNew: false,
      isExpanded: false,
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
        heroImage: '',
        metaDescription: '',
        heroDescription: '',
        longDescription: '',
        features: [],
        applications: [],
        isActive: true,
        isNew: true,
        isExpanded: true, // Auto-expand new items
      },
    ]);
  };

  const removeSubcategory = (index: number) => {
    setSubcats(subcats.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    const newSubcats = [...subcats];
    newSubcats[index] = { ...newSubcats[index], isExpanded: !newSubcats[index].isExpanded };
    setSubcats(newSubcats);
  };

  const updateSubcategory = (index: number, field: keyof SubcategoryFormData, value: string | number | boolean | string[]) => {
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
      newSubcats[index] = { ...current, [field]: value } as SubcategoryFormData;
    }
    setSubcats(newSubcats);
  };

  const addArrayItem = (index: number, field: 'features' | 'applications') => {
    const newSubcats = [...subcats];
    const current = newSubcats[index];
    newSubcats[index] = {
      ...current,
      [field]: [...current[field], ''],
    };
    setSubcats(newSubcats);
  };

  const updateArrayItem = (subcatIndex: number, field: 'features' | 'applications', itemIndex: number, value: string) => {
    const newSubcats = [...subcats];
    const current = newSubcats[subcatIndex];
    const newArray = [...current[field]];
    newArray[itemIndex] = value;
    newSubcats[subcatIndex] = { ...current, [field]: newArray };
    setSubcats(newSubcats);
  };

  const removeArrayItem = (subcatIndex: number, field: 'features' | 'applications', itemIndex: number) => {
    const newSubcats = [...subcats];
    const current = newSubcats[subcatIndex];
    newSubcats[subcatIndex] = {
      ...current,
      [field]: current[field].filter((_, i) => i !== itemIndex),
    };
    setSubcats(newSubcats);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImage(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'subcategories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();
      updateSubcategory(index, 'heroImage', url);
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
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
              heroImage: s.heroImage || null,
              metaDescription: s.metaDescription.trim() || null,
              heroDescription: s.heroDescription.trim() || null,
              longDescription: s.longDescription.trim() || null,
              features: s.features.filter(f => f.trim()),
              applications: s.applications.filter(a => a.trim()),
              isActive: s.isActive,
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
                  <div key={subcat.id} className="border rounded-lg bg-gray-50 overflow-hidden">
                    {/* Collapsed Header */}
                    <div className="flex items-center gap-4 p-4">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <button
                        type="button"
                        onClick={() => toggleExpanded(i)}
                        className="flex-1 flex items-center gap-4 text-left"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subcat.name || 'New Subcategory'}</span>
                            {!subcat.isActive && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Inactive</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">/{subcat.slug || 'url-slug'}</span>
                        </div>
                        {subcat.isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubcategory(i)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    {/* Expanded Form */}
                    {subcat.isExpanded && (
                      <div className="border-t p-4 space-y-6 bg-white">
                        {/* Basic Info */}
                        <div className="grid gap-4 md:grid-cols-2">
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
                        </div>

                        <div className="space-y-2">
                          <Label>Short Description</Label>
                          <Input
                            value={subcat.description}
                            onChange={(e) => updateSubcategory(i, 'description', e.target.value)}
                            placeholder="Brief description for listings"
                          />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={subcat.isActive}
                            onCheckedChange={(checked) => updateSubcategory(i, 'isActive', checked)}
                          />
                          <Label>Active (visible on website)</Label>
                        </div>

                        {/* Hero Image */}
                        <div className="space-y-2">
                          <Label>Hero Image</Label>
                          <div className="flex gap-4 items-start">
                            {subcat.heroImage ? (
                              <div className="relative w-40 h-24 rounded-lg overflow-hidden border">
                                <Image
                                  src={subcat.heroImage}
                                  alt="Hero image"
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateSubcategory(i, 'heroImage', '')}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(i, file);
                                }}
                                className="hidden"
                                id={`hero-image-${subcat.id}`}
                              />
                              <label htmlFor={`hero-image-${subcat.id}`}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingImage === i}
                                  asChild
                                >
                                  <span>
                                    {uploadingImage === i ? (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-1" />
                                    )}
                                    Upload Image
                                  </span>
                                </Button>
                              </label>
                              <p className="text-xs text-gray-500 mt-1">Recommended: 1920x400px</p>
                            </div>
                          </div>
                        </div>

                        {/* SEO */}
                        <div className="space-y-2">
                          <Label>Meta Description (SEO)</Label>
                          <Textarea
                            value={subcat.metaDescription}
                            onChange={(e) => updateSubcategory(i, 'metaDescription', e.target.value)}
                            placeholder="Description for search engines (150-160 characters)"
                            rows={2}
                          />
                          <p className="text-xs text-gray-500">{subcat.metaDescription.length}/160 characters</p>
                        </div>

                        {/* Page Content */}
                        <div className="space-y-2">
                          <Label>Hero Description</Label>
                          <Textarea
                            value={subcat.heroDescription}
                            onChange={(e) => updateSubcategory(i, 'heroDescription', e.target.value)}
                            placeholder="Short description shown in the hero section"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Long Description</Label>
                          <Textarea
                            value={subcat.longDescription}
                            onChange={(e) => updateSubcategory(i, 'longDescription', e.target.value)}
                            placeholder="Detailed description for the 'About' section"
                            rows={4}
                          />
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Features</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(i, 'features')}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Feature
                            </Button>
                          </div>
                          {subcat.features.length === 0 ? (
                            <p className="text-sm text-gray-500">No features added yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {subcat.features.map((feature, fi) => (
                                <div key={fi} className="flex gap-2">
                                  <Input
                                    value={feature}
                                    onChange={(e) => updateArrayItem(i, 'features', fi, e.target.value)}
                                    placeholder="Feature description"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeArrayItem(i, 'features', fi)}
                                  >
                                    <X className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Applications */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Applications</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(i, 'applications')}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Application
                            </Button>
                          </div>
                          {subcat.applications.length === 0 ? (
                            <p className="text-sm text-gray-500">No applications added yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {subcat.applications.map((app, ai) => (
                                <div key={ai} className="flex gap-2">
                                  <Input
                                    value={app}
                                    onChange={(e) => updateArrayItem(i, 'applications', ai, e.target.value)}
                                    placeholder="Application area"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeArrayItem(i, 'applications', ai)}
                                  >
                                    <X className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
