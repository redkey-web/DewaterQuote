'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDownload {
  id?: number;
  url: string;
  label: string;
  fileType: string;
  fileSize: number;
}

interface FileUploadProps {
  files: ProductDownload[];
  onChange: (files: ProductDownload[]) => void;
  folder?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function FileUpload({ files, onChange, folder = 'downloads' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);

    try {
      const newFiles: ProductDownload[] = [];

      for (const file of Array.from(fileList)) {
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

        const { url, type, size } = await response.json();

        // Generate label from filename
        const label = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        newFiles.push({
          url,
          label,
          fileType: type.split('/')[1] || 'file',
          fileSize: size,
        });
      }

      onChange([...files, ...newFiles]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [files, onChange, folder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const handleRemove = async (index: number) => {
    const file = files[index];

    // Try to delete from blob storage
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url }),
      });
    } catch (error) {
      console.error('Failed to delete from storage:', error);
    }

    onChange(files.filter((_, i) => i !== index));
  };

  const handleLabelChange = (index: number, label: string) => {
    const newFiles = [...files];
    newFiles[index] = { ...newFiles[index], label };
    onChange(newFiles);
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
              Drag and drop files here, or{' '}
              <label className="text-blue-600 hover:underline cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF documents up to 10MB
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={file.url}
              className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-red-500" />
              </div>

              <div className="flex-1 min-w-0">
                <Input
                  value={file.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  placeholder="File label"
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">
                  {file.fileType.toUpperCase()} - {formatFileSize(file.fileSize)}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  asChild
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
