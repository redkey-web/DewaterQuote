'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Video, ExternalLink, Plus, X, Loader2, Trash2, Star, Play, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface ProductVideo {
  id: number;
  youtubeId: string;
  title: string | null;
  sizeLabel: string | null;
  isPrimary: boolean;
  isActive: boolean;
  variationId: number | null;
}

interface VideoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
  currentVideoUrl: string | null;
  videoCount?: number;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
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
  videoCount = 0,
}: VideoPopupProps) {
  const router = useRouter();
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);

  // Fetch videos when dialog opens
  const fetchVideos = useCallback(async () => {
    if (!open) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data.videos || []);

      // Select primary video by default
      const primary = data.videos?.find((v: ProductVideo) => v.isPrimary);
      if (primary) setSelectedVideo(primary);
      else if (data.videos?.length > 0) setSelectedVideo(data.videos[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, [open, productId]);

  useEffect(() => {
    if (open) {
      fetchVideos();
      setNewVideoUrl('');
    }
  }, [open, fetchVideos]);

  const handleAddVideo = async () => {
    const youtubeId = extractYouTubeId(newVideoUrl);
    if (!youtubeId) {
      setError('Invalid YouTube URL');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/videos`, {
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
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete video');
      }

      await fetchVideos();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPrimary = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/videos/${videoId}/primary`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set primary');
      }

      await fetchVideos();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (video: ProductVideo) => {
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/videos/${video.id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to toggle video');
      }

      await fetchVideos();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle video');
    } finally {
      setIsSaving(false);
    }
  };

  const newVideoId = extractYouTubeId(newVideoUrl);
  const activeVideos = videos.filter(v => v.isActive).length;
  const inactiveVideos = videos.filter(v => !v.isActive).length;

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Product Videos
              {videos.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeVideos} active{inactiveVideos > 0 && ` / ${inactiveVideos} hidden`}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>{productName}</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                  onClick={handleAddVideo}
                  disabled={isSaving || !newVideoId}
                  size="sm"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
              {newVideoUrl && !newVideoId && (
                <p className="text-xs text-yellow-600 mt-1">Invalid YouTube URL</p>
              )}
              {newVideoId && (
                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src={getYouTubeThumbnail(newVideoId)}
                    alt="Preview"
                    width={80}
                    height={45}
                    className="rounded"
                    unoptimized
                  />
                  <span className="text-xs text-muted-foreground">ID: {newVideoId}</span>
                </div>
              )}
            </div>

            {/* Video List */}
            {isLoading ? (
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
                  <p className="text-xs text-muted-foreground">Click thumbnail to toggle visibility</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        selectedVideo?.id === video.id
                          ? 'ring-2 ring-blue-500'
                          : ''
                      } ${!video.isActive ? 'opacity-50' : ''}`}
                    >
                      {/* Clickable thumbnail area for toggle */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleToggleActive(video)}
                            disabled={isSaving}
                            className="relative w-full aspect-video bg-muted cursor-pointer group"
                          >
                            <Image
                              src={getYouTubeThumbnail(video.youtubeId)}
                              alt={video.title || 'Video'}
                              fill
                              className={`object-cover ${!video.isActive ? 'grayscale' : ''}`}
                              unoptimized
                            />
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`rounded-full p-2 ${video.isActive ? 'bg-black/50' : 'bg-black/70'}`}>
                                <Play className="h-6 w-6 text-white fill-white" />
                              </div>
                            </div>
                            {/* Active/Inactive indicator */}
                            <div className={`absolute top-2 right-2 rounded-full p-1 ${
                              video.isActive ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {video.isActive ? (
                                <Eye className="h-3 w-3 text-white" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-white" />
                              )}
                            </div>
                            {/* Primary badge */}
                            {video.isPrimary && (
                              <div className="absolute top-2 left-2">
                                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                  <Star className="h-3 w-3 mr-0.5 fill-current" />
                                  Primary
                                </Badge>
                              </div>
                            )}
                            {/* Hover overlay */}
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
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {video.sizeLabel}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {!video.isPrimary && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => handleSetPrimary(video.id, e)}
                                    disabled={isSaving}
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
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Open on YouTube</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => handleDeleteVideo(video.id, e)}
                                  disabled={isSaving}
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

            {/* Selected Video Preview */}
            {selectedVideo && (
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium mb-2 block">
                  Preview
                  {!selectedVideo.isActive && (
                    <Badge variant="secondary" className="ml-2 text-xs">Hidden on live site</Badge>
                  )}
                </Label>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                    title={selectedVideo.title || 'Video Preview'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {selectedVideo.title && (
                  <p className="text-sm text-muted-foreground mt-2">{selectedVideo.title}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
