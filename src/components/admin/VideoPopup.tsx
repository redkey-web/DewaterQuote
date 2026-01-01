'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, ExternalLink, Save, X, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface VideoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
  currentVideoUrl: string | null;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function VideoPopup({
  open,
  onOpenChange,
  productId,
  productName,
  currentVideoUrl,
}: VideoPopupProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setVideoUrl(currentVideoUrl || '');
      setError('');
    }
  }, [open, currentVideoUrl]);

  const videoId = extractYouTubeId(videoUrl);
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: videoUrl.trim() || null }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save video');
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setVideoUrl('');
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: null }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove video');
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Product Video
          </DialogTitle>
          <DialogDescription>
            {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Video URL Input */}
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube URL</Label>
            <Input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Enter a YouTube video URL. Supports youtube.com/watch?v=, youtu.be/, and embed formats.
            </p>
          </div>

          {/* Video Preview */}
          {videoId && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg overflow-hidden bg-black aspect-video">
                <iframe
                  src={embedUrl || undefined}
                  title="Video Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Video ID: {videoId}</span>
                <a
                  href={`https://youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Open on YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Thumbnail Preview (when no embed shown) */}
          {!videoId && thumbnailUrl && (
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="border rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <Image
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  width={320}
                  height={180}
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* No video message */}
          {!videoUrl && (
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-40" />
              <p>No video URL set</p>
              <p className="text-xs mt-1">Paste a YouTube URL above to add a product video</p>
            </div>
          )}

          {/* Invalid URL message */}
          {videoUrl && !videoId && (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
              Could not parse YouTube video ID from URL. Please check the format.
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {currentVideoUrl && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={isSaving}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || (!!videoUrl && !videoId)}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
