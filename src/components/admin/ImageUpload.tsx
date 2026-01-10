'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image as ImageIcon, GripVertical, Star, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  id?: number;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  folder?: string;
}

export function ImageUpload({ images, onChange, folder = 'products' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newImages: ProductImage[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        const { url } = await response.json();

        newImages.push({
          url,
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          isPrimary: images.length === 0 && newImages.length === 0,
        });
      }

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [images, onChange, folder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const handleRemove = async (index: number) => {
    const image = images[index];

    // Try to delete from blob storage
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: image.url }),
      });
    } catch (error) {
      console.error('Failed to delete from storage:', error);
    }

    const newImages = images.filter((_, i) => i !== index);

    // If we removed the primary, make the first one primary
    if (image.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    onChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  const handleAltChange = (index: number, alt: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], alt };
    onChange(newImages);
  };

  const handleDownload = async (image: ProductImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from URL or use alt text
      const urlParts = image.url.split('/');
      const filename = urlParts[urlParts.length - 1] || `${image.alt || 'image'}.jpg`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(image.url, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          uploading && 'opacity-50 pointer-events-none'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop images here, or{' '}
              <label className="text-blue-600 hover:underline cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPEG, PNG, WebP, GIF up to 10MB
            </p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.url}
              className={cn(
                'relative group border rounded-lg overflow-hidden bg-gray-50',
                image.isPrimary && 'ring-2 ring-blue-500'
              )}
            >
              {/* Image */}
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetPrimary(index)}
                    disabled={image.isPrimary}
                    title="Set as primary"
                  >
                    <Star className={cn('h-4 w-4', image.isPrimary && 'fill-yellow-500 text-yellow-500')} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(image)}
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>

              {/* Alt Text */}
              <div className="p-2">
                <Input
                  value={image.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  placeholder="Image description"
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
