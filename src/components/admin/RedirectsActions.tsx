'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function RedirectsActions() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: string[];
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async () => {
    window.location.href = '/api/admin/redirects/export';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);
    setDialogOpen(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/redirects/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setImportResult({
          success: false,
          message: data.error || 'Failed to import redirects',
          details: data.details,
        });
      } else {
        const pluralS = data.imported !== 1 ? 's' : '';
        const skippedText = data.skipped > 0 ? ', ' + data.skipped + ' skipped' : '';
        setImportResult({
          success: true,
          message: 'Imported ' + data.imported + ' redirect' + pluralS + skippedText,
          details: data.errors,
        });
        router.refresh();
      }
    } catch {
      setImportResult({
        success: false,
        message: 'Failed to import redirects',
      });
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Button variant="outline" onClick={handleImportClick} disabled={importing}>
          {importing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Import CSV
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {importing ? 'Importing...' : importResult?.success ? 'Import Complete' : 'Import Failed'}
            </DialogTitle>
          </DialogHeader>

          {importing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : importResult ? (
            <div className="space-y-4">
              <p className={importResult.success ? 'text-green-600' : 'text-red-600'}>
                {importResult.message}
              </p>

              {importResult.details && importResult.details.length > 0 && (
                <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">Warnings:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {importResult.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={() => setDialogOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
