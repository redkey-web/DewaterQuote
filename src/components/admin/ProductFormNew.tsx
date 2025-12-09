'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import type { Brand, Category, Subcategory } from '@/db/schema';

interface ProductFormNewProps {
  brands: Brand[];
  categories: Category[];
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

export function ProductFormNew({ brands, categories, subcategories }: ProductFormNewProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    slug: '',
    sku: '',
    brandId: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    certifications: '',
    pressureRange: '',
    temperature: '',
    sizeFrom: '',
    leadTime: '',
    video: '',
    priceVaries: true,
    priceNote: '',
    basePrice: '',
    isActive: true,
    materials: { body: '', seat: '', disc: '', sleeve: '' },
  });

  // Array fields
  const [features, setFeatures] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [variations, setVariations] = useState<{ size: string; label: string; price: string; sku: string }[]>([]);

  const filteredSubcategories = subcategories.filter(
    s => String(s.categoryId) === formData.categoryId
  );

  // Auto-generate slug from name
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

    // Validate required fields
    if (!formData.name || !formData.sku || !formData.brandId || !formData.categoryId || !formData.description) {
      setError('Please fill in all required fields: Name, SKU, Brand, Category, and Description');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.name),
          brandId: parseInt(formData.brandId, 10),
          categoryId: parseInt(formData.categoryId, 10),
          subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId, 10) : null,
          basePrice: formData.basePrice || null,
          features: features.filter(f => f.trim()),
          specifications: specifications.filter(s => s.label.trim() && s.value.trim()),
          applications: applications.filter(a => a.trim()),
          variations: variations.filter(v => v.size.trim() && v.label.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      const data = await response.json();
      router.push(`/admin/products/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
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

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Sizes</TabsTrigger>
          <TabsTrigger value="content">Features & Specs</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="e.g., Orbit Pipe Coupling"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input
                    id="shortName"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="e.g., Orbit Coupling"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="e.g., orbit-pipe-coupling"
                  />
                  <p className="text-xs text-gray-500">Auto-generated from name. Edit if needed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                    placeholder="e.g., ORB-COUP-001"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Brand *</Label>
                  <Select
                    value={formData.brandId}
                    onValueChange={(v) => setFormData({ ...formData, brandId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) => setFormData({ ...formData, categoryId: v, subcategoryId: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={formData.subcategoryId}
                    onValueChange={(v) => setFormData({ ...formData, subcategoryId: v })}
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {filteredSubcategories.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                  placeholder="Describe the product..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Product is active (visible on site)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pressureRange">Pressure Range</Label>
                  <Input
                    id="pressureRange"
                    value={formData.pressureRange}
                    onChange={(e) => setFormData({ ...formData, pressureRange: e.target.value })}
                    placeholder="e.g., Up to 16 bar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature Range</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="e.g., -30°C to +110°C"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sizeFrom">Size Range</Label>
                  <Input
                    id="sizeFrom"
                    value={formData.sizeFrom}
                    onChange={(e) => setFormData({ ...formData, sizeFrom: e.target.value })}
                    placeholder="e.g., DN15 - DN300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time</Label>
                  <Input
                    id="leadTime"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                    placeholder="e.g., 2-3 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video URL</Label>
                <Input
                  id="video"
                  type="url"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  rows={3}
                  placeholder="ISO 9001, AS 4087, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Materials</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Body material"
                    value={formData.materials.body}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: { ...formData.materials, body: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Seat material"
                    value={formData.materials.seat || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: { ...formData.materials, seat: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Disc material"
                    value={formData.materials.disc || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: { ...formData.materials, disc: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Sleeve material"
                    value={formData.materials.sleeve || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: { ...formData.materials, sleeve: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Size Variations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="priceVaries"
                    checked={formData.priceVaries}
                    onCheckedChange={(checked) => setFormData({ ...formData, priceVaries: checked })}
                  />
                  <Label htmlFor="priceVaries">Price varies by size</Label>
                </div>

                {!formData.priceVaries && (
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price (AUD)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="priceNote">Price Note</Label>
                  <Input
                    id="priceNote"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                    placeholder="e.g., Contact for bulk pricing"
                  />
                </div>
              </div>

              {/* Variations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Size Variations</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVariations([...variations, { size: '', label: '', price: '', sku: '' }])}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                </div>
                <div className="space-y-2">
                  {variations.length === 0 ? (
                    <p className="text-sm text-gray-500">No size variations added. Click "Add Size" to add variations.</p>
                  ) : (
                    variations.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Size (e.g., 50mm)"
                          value={v.size}
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].size = e.target.value;
                            setVariations(newVars);
                          }}
                          className="w-28"
                        />
                        <Input
                          placeholder="Label (e.g., 50mm Pipe OD)"
                          value={v.label}
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].label = e.target.value;
                            setVariations(newVars);
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].price = e.target.value;
                            setVariations(newVars);
                          }}
                          className="w-24"
                        />
                        <Input
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].sku = e.target.value;
                            setVariations(newVars);
                          }}
                          className="w-32"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setVariations(variations.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features & Specs Tab */}
        <TabsContent value="content">
          <div className="space-y-4">
            {/* Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Features</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFeatures([...features, ''])}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {features.length === 0 ? (
                    <p className="text-sm text-gray-500">No features added yet. Click "Add Feature" to add.</p>
                  ) : (
                    features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={f}
                          onChange={(e) => {
                            const newFeatures = [...features];
                            newFeatures[i] = e.target.value;
                            setFeatures(newFeatures);
                          }}
                          placeholder="Enter feature"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Specifications</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSpecifications([...specifications, { label: '', value: '' }])}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Spec
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {specifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No specifications added yet.</p>
                  ) : (
                    specifications.map((s, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={s.label}
                          onChange={(e) => {
                            const newSpecs = [...specifications];
                            newSpecs[i].label = e.target.value;
                            setSpecifications(newSpecs);
                          }}
                          placeholder="Label (e.g., Body Material)"
                          className="w-1/3"
                        />
                        <Input
                          value={s.value}
                          onChange={(e) => {
                            const newSpecs = [...specifications];
                            newSpecs[i].value = e.target.value;
                            setSpecifications(newSpecs);
                          }}
                          placeholder="Value (e.g., 316 Stainless Steel)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSpecifications(specifications.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Applications</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setApplications([...applications, ''])}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Application
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {applications.length === 0 ? (
                    <p className="text-sm text-gray-500">No applications added yet.</p>
                  ) : (
                    applications.map((a, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={a}
                          onChange={(e) => {
                            const newApps = [...applications];
                            newApps[i] = e.target.value;
                            setApplications(newApps);
                          }}
                          placeholder="Enter application"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setApplications(applications.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
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
              Create Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
