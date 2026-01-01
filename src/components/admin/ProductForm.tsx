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
import { Loader2, Save, Trash2, Plus, GripVertical, Eye, Package, AlertCircle, ArrowRight, Check, ExternalLink, Video, Star, Play, EyeOff, Ruler, Gauge, Thermometer, CircleDot, Truck, TrendingDown, Shield, Award, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { stripHtml } from '@/lib/utils';
import type { Brand, Category, Subcategory } from '@/db/schema';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductVideo {
  id: number;
  youtubeId: string;
  title: string | null;
  sizeLabel: string | null;
  isPrimary: boolean;
  isActive: boolean;
}

interface ProductWithRelations {
  id: number;
  slug: string;
  sku: string;
  name: string;
  shortName: string | null;
  brandId: number;
  categoryId: number;
  subcategoryId: number | null;
  description: string;
  certifications: string | null;
  materials: { body: string; seat?: string; disc?: string; sleeve?: string } | null;
  pressureRange: string | null;
  temperature: string | null;
  sizeFrom: string | null;
  leadTime: string | null;
  video: string | null;
  priceVaries: boolean | null;
  priceNote: string | null;
  basePrice: string | null;
  isActive: boolean | null;
  productCategories?: Array<{ id: number; categoryId: number; category: Category }>;
  variations: Array<{ id: number; size: string; label: string; price: string | null; sku: string | null; source?: string | null; displayOrder: number | null }>;
  images: Array<{ id: number; url: string; alt: string; isPrimary: boolean | null; displayOrder: number | null }>;
  downloads: Array<{ id: number; url: string; label: string; fileType: string | null; fileSize: number | null }>;
  features: Array<{ id: number; feature: string; displayOrder: number | null }>;
  specifications: Array<{ id: number; label: string; value: string; displayOrder: number | null }>;
  applications: Array<{ id: number; application: string; displayOrder: number | null }>;
}

interface ProductFormProps {
  product: ProductWithRelations;
  brands: Brand[];
  categories: Category[];
  subcategories: Subcategory[];
}

export function ProductForm({ product, brands, categories, subcategories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Form state - strip HTML from description on load
  const [formData, setFormData] = useState({
    name: product.name,
    shortName: product.shortName || '',
    slug: product.slug,
    sku: product.sku,
    brandId: String(product.brandId),
    categoryId: String(product.categoryId),
    subcategoryId: product.subcategoryId ? String(product.subcategoryId) : '',
    description: stripHtml(product.description),
    certifications: product.certifications || '',
    pressureRange: product.pressureRange || '',
    temperature: product.temperature || '',
    sizeFrom: product.sizeFrom || '',
    leadTime: product.leadTime || '',
    video: product.video || '',
    priceVaries: product.priceVaries ?? true,
    priceNote: product.priceNote || '',
    basePrice: product.basePrice || '',
    isActive: product.isActive ?? true,
    materials: product.materials || { body: '' },
  });

  // Array fields
  const [features, setFeatures] = useState(product.features.map(f => f.feature));
  const [specifications, setSpecifications] = useState(
    product.specifications.map(s => ({ label: s.label, value: s.value }))
  );
  const [applications, setApplications] = useState(product.applications.map(a => a.application));
  // Variations - track source (neto vs manual)
  const [variations, setVariations] = useState(
    product.variations.map(v => ({ size: v.size, label: v.label, price: v.price || '', sku: v.sku || '', source: v.source || 'neto' }))
  );
  const [images, setImages] = useState(
    product.images.map(i => ({ url: i.url, alt: i.alt, isPrimary: i.isPrimary ?? false }))
  );
  const [downloads, setDownloads] = useState(
    product.downloads.map(d => ({ url: d.url, label: d.label, fileType: d.fileType || 'pdf', fileSize: d.fileSize || 0 }))
  );

  // Video management state
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [videoError, setVideoError] = useState('');

  // Multi-category support - get IDs from junction table, fallback to primary categoryId
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(() => {
    if (product.productCategories && product.productCategories.length > 0) {
      return product.productCategories.map(pc => pc.categoryId);
    }
    return [product.categoryId];
  });

  const filteredSubcategories = subcategories.filter(
    s => String(s.categoryId) === formData.categoryId
  );

  // Video helper functions
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  // Fetch videos when tab is opened
  const fetchVideos = async () => {
    setVideosLoading(true);
    setVideoError('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setVideosLoading(false);
    }
  };

  const handleAddVideo = async () => {
    const youtubeId = extractYouTubeId(newVideoUrl);
    if (!youtubeId) {
      setVideoError('Invalid YouTube URL');
      return;
    }
    setVideosLoading(true);
    setVideoError('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add video');
      }
      setNewVideoUrl('');
      await fetchVideos();
      toast({ title: 'Video added', description: 'The video has been added to this product.' });
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setVideosLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    setVideosLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}/videos/${videoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete video');
      await fetchVideos();
      toast({ title: 'Video removed', description: 'The video has been removed.' });
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to delete video');
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSetPrimaryVideo = async (videoId: number) => {
    setVideosLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}/videos/${videoId}/primary`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to set primary');
      await fetchVideos();
      toast({ title: 'Primary video updated' });
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to set primary');
    } finally {
      setVideosLoading(false);
    }
  };

  const handleToggleVideoActive = async (videoId: number) => {
    setVideosLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}/videos/${videoId}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle video');
      await fetchVideos();
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to toggle video');
    } finally {
      setVideosLoading(false);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        // Don't allow removing all categories - keep at least one
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Redirect to preview tab if not already there
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      // Scroll to top to see preview
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        title: "Step 2: Review Your Changes",
        description: "Check the preview below, then click 'Save Changes' to confirm.",
      });
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brandId: parseInt(formData.brandId, 10),
          categoryId: parseInt(formData.categoryId, 10),
          subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId, 10) : null,
          categoryIds: selectedCategoryIds, // Multi-category support
          basePrice: formData.basePrice || null,
          features,
          specifications,
          applications,
          variations,
          images,
          downloads,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      toast({
        title: "Changes Saved!",
        description: (
          <div className="flex flex-col gap-2">
            <span>{formData.name} has been updated.</span>
            <a
              href={`/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              View live product <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sticky error banner */}
      {error && (
        <div className="sticky top-0 z-50 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="mb-6 flex items-center justify-center gap-2 text-sm">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${activeTab !== 'preview' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
          <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${activeTab !== 'preview' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}>
            {activeTab === 'preview' ? <Check className="h-3 w-3" /> : '1'}
          </span>
          Edit Details
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400" />
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${activeTab === 'preview' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            2
          </span>
          Review & Save
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Images & Files</TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1" onClick={() => videos.length === 0 && fetchVideos()}>
            <Video className="h-4 w-4" />
            Videos
            {videos.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{videos.filter(v => v.isActive).length}</Badge>
            )}
          </TabsTrigger>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input
                    id="shortName"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
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
                        onCheckedChange={() => {
                          toggleCategory(c.id);
                          // Update primary categoryId if this is the first selection
                          if (!selectedCategoryIds.includes(c.id)) {
                            if (selectedCategoryIds.length === 0) {
                              setFormData({ ...formData, categoryId: String(c.id) });
                            }
                          } else if (selectedCategoryIds[0] === c.id && selectedCategoryIds.length > 1) {
                            // If removing the primary, make the next one primary
                            setFormData({ ...formData, categoryId: String(selectedCategoryIds[1]) });
                          }
                        }}
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
                  folder={`products/${product.slug}`}
                />
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
                  folder={`downloads/${product.slug}`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <TooltipProvider>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Product Videos
                    {videos.length > 0 && (
                      <Badge variant="secondary">
                        {videos.filter(v => v.isActive).length} active
                        {videos.filter(v => !v.isActive).length > 0 && ` / ${videos.filter(v => !v.isActive).length} hidden`}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchVideos} disabled={videosLoading}>
                    {videosLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {videoError && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-sm text-red-800">
                    {videoError}
                  </div>
                )}

                {/* Add New Video */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <Label className="text-sm font-medium">Add New Video</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddVideo}
                      disabled={videosLoading || !extractYouTubeId(newVideoUrl)}
                      size="sm"
                    >
                      {videosLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />Add</>}
                    </Button>
                  </div>
                  {newVideoUrl && extractYouTubeId(newVideoUrl) && (
                    <div className="mt-2 flex items-center gap-2">
                      <Image
                        src={getYouTubeThumbnail(extractYouTubeId(newVideoUrl)!)}
                        alt="Preview"
                        width={80}
                        height={45}
                        className="rounded"
                        unoptimized
                      />
                      <span className="text-xs text-muted-foreground">ID: {extractYouTubeId(newVideoUrl)}</span>
                    </div>
                  )}
                </div>

                {/* Video List */}
                {videosLoading && videos.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : videos.length === 0 ? (
                  <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-40" />
                    <p>No videos yet</p>
                    <p className="text-xs mt-1">Add a YouTube URL above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Videos ({videos.length})</Label>
                      <p className="text-xs text-muted-foreground">Click thumbnail to toggle visibility on live site</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className={`border rounded-lg overflow-hidden transition-all ${!video.isActive ? 'opacity-50' : ''}`}
                        >
                          {/* Clickable thumbnail for toggle */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleToggleVideoActive(video.id)}
                                disabled={videosLoading}
                                className="relative w-full aspect-video bg-muted cursor-pointer group"
                              >
                                <Image
                                  src={getYouTubeThumbnail(video.youtubeId)}
                                  alt={video.title || 'Video'}
                                  fill
                                  className={`object-cover ${!video.isActive ? 'grayscale' : ''}`}
                                  unoptimized
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className={`rounded-full p-2 ${video.isActive ? 'bg-black/50' : 'bg-black/70'}`}>
                                    <Play className="h-6 w-6 text-white fill-white" />
                                  </div>
                                </div>
                                <div className={`absolute top-2 right-2 rounded-full p-1 ${video.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                                  {video.isActive ? <Eye className="h-3 w-3 text-white" /> : <EyeOff className="h-3 w-3 text-white" />}
                                </div>
                                {video.isPrimary && (
                                  <div className="absolute top-2 left-2">
                                    <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                      <Star className="h-3 w-3 mr-0.5 fill-current" />Primary
                                    </Badge>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {video.isActive ? 'Click to hide' : 'Click to show'}
                                  </span>
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{video.isActive ? 'Click to hide from live site' : 'Click to show on live site'}</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Video info and actions */}
                          <div className="p-2 bg-background">
                            <p className="text-xs font-medium truncate mb-1">
                              {video.title || `Video ${video.youtubeId.slice(0, 8)}...`}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {video.sizeLabel && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">{video.sizeLabel}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-0.5">
                                {!video.isPrimary && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleSetPrimaryVideo(video.id)}
                                        disabled={videosLoading}
                                      >
                                        <Star className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Set as primary video</TooltipContent>
                                  </Tooltip>
                                )}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted"
                                    >
                                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent>Open on YouTube</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDeleteVideo(video.id)}
                                      disabled={videosLoading}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete video</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Preview */}
                {videos.length > 0 && videos.find(v => v.isPrimary) && (
                  <div className="border rounded-lg p-4">
                    <Label className="text-sm font-medium mb-2 block">
                      Primary Video Preview
                      {!videos.find(v => v.isPrimary)?.isActive && (
                        <Badge variant="secondary" className="ml-2 text-xs">Hidden on live site</Badge>
                      )}
                    </Label>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${videos.find(v => v.isPrimary)?.youtubeId}`}
                        title="Primary Video Preview"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TooltipProvider>
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
                    onClick={() => setVariations([...variations, { size: '', label: '', price: '', sku: '', source: 'manual' }])}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Sizes imported from Neto are marked with a blue badge. You can add custom sizes which will be marked as "manual".
                </p>
                <div className="space-y-2">
                  {variations.map((v, i) => (
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
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        v.source === 'neto' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {v.source || 'neto'}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setVariations(variations.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {variations.length === 0 && (
                    <p className="text-sm text-gray-500">No size variations. Click "Add Size" to add.</p>
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
                  {features.map((f, i) => (
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
                  ))}
                  {features.length === 0 && (
                    <p className="text-sm text-gray-500">No features added yet.</p>
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
                  {specifications.map((s, i) => (
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
                  ))}
                  {specifications.length === 0 && (
                    <p className="text-sm text-gray-500">No specifications added yet.</p>
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
                  {applications.map((a, i) => (
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
                  ))}
                  {applications.length === 0 && (
                    <p className="text-sm text-gray-500">No applications added yet.</p>
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
              <div className="flex-1">
                <p className="font-medium text-blue-900">Product Preview</p>
                <p className="text-sm text-blue-700">
                  This shows how the product page will appear on the website. Review before saving.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!formData.isActive && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                <a
                  href={`/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  View Live <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Simulated Product Page - More accurate styling */}
            <div className="border rounded-lg bg-background overflow-hidden shadow-sm">
              {/* Product Header Section */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Image Gallery Preview */}
                  <div>
                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center overflow-hidden relative shadow-md">
                      {images.length > 0 ? (
                        <Image
                          src={images.find(i => i.isPrimary)?.url || images[0]?.url || ''}
                          alt={images.find(i => i.isPrimary)?.alt || formData.name}
                          width={500}
                          height={500}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <Package className="w-32 h-32 text-muted-foreground" />
                      )}
                      {/* Warranty Badge like actual site */}
                      <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        Up to 5 Year Warranty*
                      </div>
                      {/* Image counter */}
                      {images.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-background/80 text-foreground px-2 py-1 rounded-md text-xs font-medium">
                          1 / {images.length}
                        </div>
                      )}
                    </div>
                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className={`aspect-square bg-slate-50 rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'}`}>
                            <Image src={img.url} alt={img.alt} width={80} height={80} className="w-full h-full object-contain" unoptimized />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    {/* Brand */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {brands.find(b => String(b.id) === formData.brandId) && (
                        <Badge variant="secondary" className="text-sm">
                          {brands.find(b => String(b.id) === formData.brandId)?.name}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{formData.name || 'Product Name'}</h1>

                    {/* Free delivery notice */}
                    <div className="flex items-center gap-2 mb-4 text-orange-500">
                      <p className="text-base font-medium">Free delivery to metro areas</p>
                      <Truck className="w-5 h-5" />
                    </div>

                    {/* Bulk Pricing Info */}
                    <div className="py-2 px-3 border border-border rounded-md mb-6">
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                        <span className="font-semibold text-foreground whitespace-nowrap">
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-primary inline mr-1" />
                          Bulk Pricing:
                        </span>
                        <span><span className="text-muted-foreground">2-4 qty</span> <span className="font-bold text-yellow-600">5% off</span></span>
                        <span><span className="text-muted-foreground">5-9 qty</span> <span className="font-bold text-orange-600">10% off</span></span>
                        <span><span className="text-muted-foreground">10+ qty</span> <span className="font-bold text-rose-600">15% off</span></span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Short description */}
                    {formData.description && (
                      <p className="text-muted-foreground mb-6">
                        {formData.description.split('. ')[0]}.
                      </p>
                    )}

                    {/* Product Specs Badges - Like actual site */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.sizeFrom && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                          <Ruler className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">{formData.sizeFrom}</span>
                        </div>
                      )}
                      {formData.materials.body && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                          <CircleDot className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">Body:</span>
                          <span className="font-medium">{formData.materials.body}</span>
                        </div>
                      )}
                      {formData.pressureRange && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                          <Gauge className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">Pressure:</span>
                          <span className="font-medium">{formData.pressureRange}</span>
                        </div>
                      )}
                      {formData.temperature && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                          <Thermometer className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">Max Temp:</span>
                          <span className="font-medium">{formData.temperature}</span>
                        </div>
                      )}
                    </div>

                    {/* Size Options Preview */}
                    {variations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Select Size & Quantity</h3>
                        <div className="border rounded-lg p-4 bg-card max-h-48 overflow-y-auto">
                          {variations.slice(0, 6).map((v, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                              <div>
                                <span className="font-medium">{v.label || v.size}</span>
                                {v.sku && <span className="text-xs text-muted-foreground ml-2">({v.sku})</span>}
                              </div>
                              <span className="text-sm font-semibold text-primary tabular-nums">
                                {v.price ? `$${parseFloat(v.price).toFixed(2)}` : 'POA'}
                              </span>
                            </div>
                          ))}
                          {variations.length > 6 && (
                            <p className="text-sm text-muted-foreground pt-2 text-center">
                              + {variations.length - 6} more sizes
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add to Quote button preview */}
                    <Button size="lg" className="w-full mb-4" disabled>
                      Add to Quote
                    </Button>

                    {/* SKU and Lead Time */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>SKU:</span>
                        <span className="font-medium text-foreground">{formData.sku}</span>
                      </div>
                      {formData.leadTime && (
                        <div className="flex items-center gap-2">
                          <span>Lead Time:</span>
                          <span className="font-medium text-foreground">{formData.leadTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications - Collapsible style */}
              {formData.certifications && (
                <div className="mx-6 lg:mx-8 mb-6">
                  <Card className="shadow-md">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Approvals / Certifications</h2>
                      </div>
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <CardContent className="pt-0 pb-4 px-4">
                      <p className="text-muted-foreground">{formData.certifications}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabbed Content Section */}
              <Card className="mx-6 lg:mx-8 mb-6 shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className={`grid w-full mb-6 ${videos.filter(v => v.isActive).length > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="specifications">Specifications</TabsTrigger>
                      {videos.filter(v => v.isActive).length > 0 && (
                        <TabsTrigger value="videos">
                          Videos
                          {videos.filter(v => v.isActive).length > 1 && (
                            <Badge variant="secondary" className="ml-1 text-xs">{videos.filter(v => v.isActive).length}</Badge>
                          )}
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="description" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4">Description</h2>
                      <p className="text-muted-foreground mb-6 whitespace-pre-line">
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

                    {videos.filter(v => v.isActive).length > 0 && (
                      <TabsContent value="videos" className="mt-0">
                        <h2 className="text-2xl font-bold mb-6">
                          Product Videos
                          {videos.filter(v => v.isActive).length > 1 && (
                            <Badge variant="secondary" className="ml-2">{videos.filter(v => v.isActive).length} videos</Badge>
                          )}
                        </h2>
                        {/* Primary video */}
                        {videos.find(v => v.isPrimary && v.isActive) && (
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                            <iframe
                              src={`https://www.youtube.com/embed/${videos.find(v => v.isPrimary && v.isActive)?.youtubeId}`}
                              title="Product Video"
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        )}
                        {/* Additional videos */}
                        {videos.filter(v => v.isActive && !v.isPrimary).length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">More Videos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {videos.filter(v => v.isActive && !v.isPrimary).slice(0, 4).map((video) => (
                                <div key={video.id} className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                                  <Image
                                    src={getYouTubeThumbnail(video.youtubeId)}
                                    alt={video.title || 'Video'}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="bg-white/90 rounded-full p-2">
                                      <Play className="h-5 w-5 text-primary fill-primary" />
                                    </div>
                                  </div>
                                  <p className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 px-1 py-0.5 rounded truncate">
                                    {video.sizeLabel || video.title}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Applications Section */}
              {applications.filter(a => a.trim()).length > 0 && (
                <Card className="mx-6 lg:mx-8 mb-6 shadow-lg">
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
              Saving...
            </>
          ) : activeTab === 'preview' ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              Review & Save
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
