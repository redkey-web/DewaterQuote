'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
// Select components removed - using native HTML select to avoid Radix UI issues
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Trash2, Plus, GripVertical, Info, Eye, Package, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { Brand, Category, Subcategory } from '@/db/schema';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductDownload {
  url: string;
  label: string;
  fileType: string;
  fileSize: number;
}

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
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

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
  const [images, setImages] = useState<ProductImage[]>([]);
  const [downloads, setDownloads] = useState<ProductDownload[]>([]);

  // Multi-category support
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const filteredSubcategories = subcategories.filter(
    s => String(s.categoryId) === formData.categoryId
  );

  // Toggle category selection
  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        // Allow removing all for new products
        const newIds = prev.filter(id => id !== categoryId);
        // Update primary categoryId if needed
        if (newIds.length > 0 && prev[0] === categoryId) {
          setFormData({ ...formData, categoryId: String(newIds[0]) });
        } else if (newIds.length === 0) {
          setFormData({ ...formData, categoryId: '' });
        }
        return newIds;
      }
      const newIds = [...prev, categoryId];
      // Set primary categoryId to first selection
      if (prev.length === 0) {
        setFormData({ ...formData, categoryId: String(categoryId) });
      }
      return newIds;
    });
  };

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

    // Redirect to preview tab if not already there
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      toast({
        title: "Review Changes",
        description: "Please check the preview before creating.",
      });
      return;
    }

    setSaving(true);
    setError('');

    // Validate required fields
    if (!formData.name || !formData.sku || !formData.brandId || !formData.description) {
      setError('Please fill in all required fields: Name, SKU, Brand, and Description');
      setSaving(false);
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one category');
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
          categoryId: selectedCategoryIds[0], // Primary category
          subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId, 10) : null,
          categoryIds: selectedCategoryIds, // Multi-category support
          basePrice: formData.basePrice || null,
          features: features.filter(f => f.trim()),
          specifications: specifications.filter(s => s.label.trim() && s.value.trim()),
          applications: applications.filter(a => a.trim()),
          variations: variations.filter(v => v.size.trim() && v.label.trim()),
          images: images.filter(i => i.url),
          downloads: downloads.filter(d => d.url),
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Images & Files</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Sizes</TabsTrigger>
          <TabsTrigger value="content">Features & Specs</TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Brand *</Label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={String(b.id)}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                    disabled={selectedCategoryIds.length === 0}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">None</option>
                    {filteredSubcategories.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-category selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Categories *</Label>
                  <span className="text-xs text-gray-500">
                    {selectedCategoryIds.length} selected (first selected is primary for URL)
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center space-x-2 p-2 rounded border ${
                        selectedCategoryIds.includes(c.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <Checkbox
                        id={`category-${c.id}`}
                        checked={selectedCategoryIds.includes(c.id)}
                        onCheckedChange={() => toggleCategory(c.id)}
                      />
                      <label
                        htmlFor={`category-${c.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {c.name}
                        {selectedCategoryIds[0] === c.id && (
                          <span className="ml-1 text-xs text-blue-600">(primary)</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  The primary category determines the product URL. Select multiple categories to show this product in multiple sections.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  required
                  placeholder="Enter product description (plain text only - formatting is applied automatically on the website)"
                />
                <p className="text-xs text-muted-foreground">
                  Enter plain text only. Website styling is applied automatically for consistent formatting.
                </p>
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

        {/* Media Tab */}
        <TabsContent value="media">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={images}
                  onChange={setImages}
                  folder={`products/${formData.slug || 'new'}`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload product images. The first image will be set as primary by default.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datasheets & Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  files={downloads}
                  onChange={setDownloads}
                  folder={`downloads/${formData.slug || 'new'}`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload PDF datasheets, specification sheets, and other downloadable files.
                </p>
              </CardContent>
            </Card>
          </div>
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
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Note: For products imported from Neto, sizes are automatically synced and cannot be manually modified after import.
                    Only add sizes manually for products not in the Neto system.
                  </span>
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

        {/* Preview Tab */}
        <TabsContent value="preview">
          <div className="space-y-4">
            {/* Preview Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Product Preview</p>
                <p className="text-sm text-blue-700">
                  This shows how the product page will appear on the website. Review before creating.
                </p>
              </div>
              {!formData.isActive && (
                <Badge variant="destructive" className="ml-auto">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Product Inactive
                </Badge>
              )}
            </div>

            {/* Simulated Product Page */}
            <div className="border rounded-lg bg-background overflow-hidden">
              {/* Product Header Section */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {images.length > 0 ? (
                      <Image
                        src={images.find(i => i.isPrimary)?.url || images[0]?.url || ''}
                        alt={images.find(i => i.isPrimary)?.alt || formData.name || 'Product image'}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <Package className="w-32 h-32 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {brands.find(b => String(b.id) === formData.brandId) && (
                        <Badge variant="secondary">
                          {brands.find(b => String(b.id) === formData.brandId)?.name}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{formData.name || 'Product Name'}</h1>

                    <Separator className="my-4" />

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Product Details</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {formData.sizeFrom && (
                          <div>
                            <span className="text-sm text-muted-foreground">Size Range:</span>
                            <p className="font-medium">{formData.sizeFrom}</p>
                          </div>
                        )}
                        {formData.materials.body && (
                          <div>
                            <span className="text-sm text-muted-foreground">Body:</span>
                            <p className="font-medium">{formData.materials.body}</p>
                          </div>
                        )}
                        {formData.pressureRange && (
                          <div>
                            <span className="text-sm text-muted-foreground">Pressure Range:</span>
                            <p className="font-medium">{formData.pressureRange}</p>
                          </div>
                        )}
                        {formData.temperature && (
                          <div>
                            <span className="text-sm text-muted-foreground">Max Temperature:</span>
                            <p className="font-medium">{formData.temperature}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Size Options Preview */}
                    {variations.filter(v => v.size.trim()).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Select Sizes & Quantities</h3>
                        <div className="border rounded-md p-4 bg-muted/30 max-h-48 overflow-y-auto">
                          {variations.filter(v => v.size.trim()).slice(0, 5).map((v, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                              <div>
                                <span className="font-medium">{v.label || v.size}</span>
                                {v.sku && <span className="text-xs text-muted-foreground ml-2">SKU: {v.sku}</span>}
                              </div>
                              <span className="text-sm font-semibold text-primary">
                                {v.price ? `$${v.price} ex GST` : 'POA'}
                              </span>
                            </div>
                          ))}
                          {variations.filter(v => v.size.trim()).length > 5 && (
                            <p className="text-sm text-muted-foreground pt-2">
                              + {variations.filter(v => v.size.trim()).length - 5} more sizes available
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabbed Content Section (like actual product page) */}
              <Card className="mx-6 lg:mx-8 mb-6">
                <CardContent className="p-6 lg:p-8">
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4">Description</h2>
                      <p className="text-muted-foreground mb-6">
                        {formData.description || 'No description provided.'}
                      </p>

                      {features.filter(f => f.trim()).length > 0 && (
                        <>
                          <h3 className="text-xl font-semibold mb-4">Features</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.filter(f => f.trim()).map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-muted-foreground">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="specifications" className="mt-0">
                      <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
                      {specifications.filter(s => s.label.trim() && s.value.trim()).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {specifications.filter(s => s.label.trim() && s.value.trim()).map((s, i) => (
                            <div key={i} className="border-b border-border pb-3">
                              <div className="text-sm text-muted-foreground mb-1">{s.label}</div>
                              <div className="font-medium text-lg">{s.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No specifications added.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Applications Section */}
              {applications.filter(a => a.trim()).length > 0 && (
                <Card className="mx-6 lg:mx-8 mb-6">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-4">Applications</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {applications.filter(a => a.trim()).map((app, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Certifications Section */}
              {formData.certifications && (
                <Card className="mx-6 lg:mx-8 mb-6">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-4">Approvals / Certifications</h2>
                    <p className="text-muted-foreground">{formData.certifications}</p>
                  </CardContent>
                </Card>
              )}
            </div>
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
