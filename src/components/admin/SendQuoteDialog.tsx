'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send,
  FileText,
  Mail,
  Eye,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: number;
  quoteNumber: string;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
}

export function SendQuoteDialog({
  open,
  onOpenChange,
  quoteId,
  quoteNumber,
  customerEmail,
  customerName,
  onSuccess,
}: SendQuoteDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [isSending, setIsSending] = useState(false);
  const [preparedBy, setPreparedBy] = useState('');
  const [emailPreviewLoading, setEmailPreviewLoading] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);

  // Build preview URLs with current settings
  const buildPreviewParams = () => {
    const params = new URLSearchParams();
    if (preparedBy) params.set('preparedBy', preparedBy);
    return params.toString();
  };

  const handlePreviewPdf = () => {
    const params = buildPreviewParams();
    const url = `/api/admin/quotes/${quoteId}/pdf${params ? `?${params}` : ''}`;
    window.open(url, '_blank');
  };

  const handlePreviewPdfDraft = () => {
    const params = new URLSearchParams(buildPreviewParams());
    params.set('draft', 'true');
    const url = `/api/admin/quotes/${quoteId}/pdf?${params.toString()}`;
    window.open(url, '_blank');
  };

  const handlePreviewEmail = async () => {
    setEmailPreviewLoading(true);
    try {
      const params = buildPreviewParams();
      const url = `/api/admin/quotes/${quoteId}/email-preview${params ? `?${params}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load preview');
      const html = await response.text();
      setEmailPreviewHtml(html);
    } catch (error) {
      toast({
        title: 'Failed to load email preview',
        variant: 'destructive',
      });
    } finally {
      setEmailPreviewLoading(false);
    }
  };

  const handleOpenEmailInNewTab = () => {
    const params = buildPreviewParams();
    const url = `/api/admin/quotes/${quoteId}/email-preview${params ? `?${params}` : ''}`;
    window.open(url, '_blank');
  };

  const handleSendQuote = async () => {
    if (!confirm(`Send quote ${quoteNumber} to ${customerEmail}?`)) {
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/quotes/" + quoteId + "/send", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preparedBy: preparedBy || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send quote');
      }

      toast({
        title: 'Quote sent successfully',
        description: `Quote ${quoteNumber} has been emailed to ${customerEmail} with PDF attachment.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to send quote',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-sky-500" />
            Send Quote to Customer
          </DialogTitle>
          <DialogDescription>
            Send {quoteNumber} to {customerName} ({customerEmail}) with a professional PDF attachment.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'settings')} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-hidden flex flex-col mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    PDF Quote
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviewPdfDraft}
                    >
                      Draft
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviewPdf}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Professional A4 PDF with company branding, itemized quote, and terms.
                  Will be attached to the email.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-500" />
                    Email
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviewEmail}
                      disabled={emailPreviewLoading}
                    >
                      {emailPreviewLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Load'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenEmailInNewTab}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Styled HTML email with quote summary and &quot;Accept Quote&quot; button.
                </p>
              </div>
            </div>

            {/* Email Preview Frame */}
            {emailPreviewHtml && (
              <div className="flex-1 border rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-100 px-3 py-2 border-b flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Preview</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEmailPreviewHtml(null)}
                  >
                    Close
                  </Button>
                </div>
                <iframe
                  srcDoc={emailPreviewHtml}
                  className="w-full h-[400px]"
                  title="Email Preview"
                />
              </div>
            )}

            {!emailPreviewHtml && (
              <div className="flex-1 border rounded-lg bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click &quot;Load&quot; above to preview the email</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              {/* Recipient Info */}
              <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                <h3 className="font-medium text-sky-900 mb-2">Recipient</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sky-700">Name:</span>{' '}
                    <span className="font-medium">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-sky-700">Email:</span>{' '}
                    <span className="font-medium">{customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Quote Options */}
              <div className="space-y-4">
                <h3 className="font-medium">Quote Options</h3>
                <div>
                  <Label htmlFor="prepared-by">Prepared By</Label>
                  <Input
                    id="prepared-by"
                    placeholder="e.g., John from Sales"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* What gets sent */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-medium mb-3">What will be sent:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Professional HTML email with quote summary
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    PDF attachment ({quoteNumber}.pdf)
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Instructions to email purchase order
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Terms & conditions
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendQuote}
            disabled={isSending}
            className="bg-sky-500 hover:bg-sky-600"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Quote with PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
