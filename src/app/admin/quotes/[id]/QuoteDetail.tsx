'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  FileText,
  Save,
  Download,
  Eye,
  RefreshCw,
  ExternalLink,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { SendQuoteDialog } from '@/components/admin/SendQuoteDialog';

type Address = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

type QuoteItem = {
  id: number;
  sku: string;
  name: string;
  brand: string;
  quantity: number;
  sizeLabel: string | null;
  unitPrice: string | null;
  lineTotal: string | null;
  materialTestCert: boolean | null;
  quotedPrice: string | null;
  quotedNotes: string | null;
  // Custom specs for Straub/Teekay products
  customPipeOd: string | null;
  customRubberMaterial: string | null;
  customPressure: string | null;
  customNotes: string | null;
};

type Quote = {
  id: number;
  quoteNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  // Delivery Address (separate columns)
  deliveryStreet: string | null;
  deliverySuburb: string | null;
  deliveryState: string | null;
  deliveryPostcode: string | null;
  // Billing Address (separate columns)
  billingStreet: string | null;
  billingSuburb: string | null;
  billingState: string | null;
  billingPostcode: string | null;
  notes: string | null;
  internalNotes: string | null;
  itemCount: number;
  pricedTotal: string | null;
  savings: string | null;
  certFee: string | null;
  certCount: number | null;
  hasUnpricedItems: boolean | null;
  shippingCost: string | null;
  shippingNotes: string | null;
  status: string | null;
  createdAt: Date;
  items: QuoteItem[];
  // PDF Storage fields
  pdfUrl: string | null;
  pdfGeneratedAt: Date | null;
  pdfVersion: number | null;
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  quoted: 'bg-purple-100 text-purple-800',
  forwarded: 'bg-green-100 text-green-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export function QuoteDetail({ quote }: { quote: Quote }) {
  const { toast } = useToast();
  const router = useRouter();
  const [status, setStatus] = useState(quote.status || 'pending');
  const [shippingCost, setShippingCost] = useState(quote.shippingCost || '');
  const [shippingNotes, setShippingNotes] = useState(quote.shippingNotes || '');
  const [internalNotes, setInternalNotes] = useState(quote.internalNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(quote.pdfUrl);
  const [currentPdfVersion, setCurrentPdfVersion] = useState(quote.pdfVersion);

  // Helper to construct address objects from separate columns
  const deliveryAddress: Address = {
    street: quote.deliveryStreet || '',
    suburb: quote.deliverySuburb || '',
    state: quote.deliveryState || '',
    postcode: quote.deliveryPostcode || '',
  };

  const billingAddress: Address = {
    street: quote.billingStreet || '',
    suburb: quote.billingSuburb || '',
    state: quote.billingState || '',
    postcode: quote.billingPostcode || '',
  };

  const formatAddress = (addr: Address) =>
    `${addr.street}, ${addr.suburb} ${addr.state} ${addr.postcode}`;

  const billingIsDifferent =
    formatAddress(deliveryAddress) !== formatAddress(billingAddress);

  // Calculate totals
  const subtotal = parseFloat(quote.pricedTotal || '0');
  const savings = parseFloat(quote.savings || '0');
  const certFee = parseFloat(quote.certFee || '0');
  const shipping = parseFloat(shippingCost || '0');
  const subtotalAfterDiscount = subtotal - savings + certFee + shipping;
  const gst = subtotalAfterDiscount * 0.1;
  const total = subtotalAfterDiscount + gst;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          shippingCost: shippingCost || null,
          shippingNotes: shippingNotes || null,
          internalNotes: internalNotes || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast({ title: 'Quote updated successfully' });
    } catch {
      toast({ title: 'Failed to save quote', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendSuccess = () => {
    setStatus('forwarded');
    toast({ title: 'Quote sent to customer successfully' });
  };

  const handleDownloadPdf = () => {
    const params = new URLSearchParams();
    if (shippingCost) params.set('shipping', shippingCost);
    if (shippingNotes) params.set('shippingNotes', shippingNotes);
    const url = `/api/admin/quotes/${quote.id}/pdf${params.toString() ? `?${params.toString()}` : ''}`;
    window.open(url, '_blank');
  };

  const handlePrintView = () => {
    window.open("/admin/quotes/" + quote.id + "/print", "_blank");
  };

  const handleRegeneratePdf = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/admin/quotes/" + quote.id + "/store-pdf", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to regenerate PDF");

      const data = await response.json();
      setCurrentPdfUrl(data.pdfUrl);
      setCurrentPdfVersion(data.pdfVersion);
      toast({
        title: "PDF regenerated successfully",
        description: "Version " + data.pdfVersion + " stored",
      });
    } catch {
      toast({ title: "Failed to regenerate PDF", variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDeleteQuote = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/quotes/" + quote.id, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete quote");
      }

      toast({
        title: "Quote deleted",
        description: "Quote " + quote.quoteNumber + " has been deleted.",
      });

      // Navigate back to quotes list
      router.push("/admin/quotes");
    } catch (error) {
      toast({
        title: "Failed to delete quote",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.quoteNumber}</h1>
            <p className="text-gray-500">
              {format(new Date(quote.createdAt), 'PPpp')}
            </p>
          </div>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintView}>
            <Eye className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleRegeneratePdf}
            disabled={isRegenerating}
          >
            <RefreshCw className={"h-4 w-4 mr-1" + (isRegenerating ? " animate-spin" : "")} />
            {isRegenerating ? "Regenerating..." : "Regenerate PDF"}
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button
            onClick={() => setSendDialogOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Send className="h-4 w-4 mr-1" />
            Send Approved Quote
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quote details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{quote.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{quote.contactName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${quote.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {quote.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a
                  href={`tel:${quote.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {quote.phone}
                </a>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p>{formatAddress(deliveryAddress)}</p>
                </div>
              </div>
              {billingIsDifferent && (
                <div className="flex items-start gap-2 mt-3">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Billing Address</p>
                    <p>{formatAddress(billingAddress)}</p>
                  </div>
                </div>
              )}
            </div>

            {quote.notes && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Customer Notes</p>
                <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {quote.notes}
                </p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Items ({quote.itemCount})</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.brand}</div>
                      {item.sizeLabel && (
                        <div className="text-sm text-gray-500">
                          Size: {item.sizeLabel}
                        </div>
                      )}
                      {/* Custom Specs for Straub/Teekay products */}
                      {item.customPipeOd && (
                        <div className="mt-1 p-2 bg-gray-50 rounded text-xs space-y-1">
                          <div className="text-gray-700">
                            <span className="text-gray-500">Pipe OD:</span> {item.customPipeOd} |
                            <span className="text-gray-500"> Material:</span> {item.customRubberMaterial} |
                            <span className="text-gray-500"> Pressure:</span> {item.customPressure}
                          </div>
                          {item.customNotes && (
                            <div className="text-gray-500 italic">{item.customNotes}</div>
                          )}
                        </div>
                      )}
                      {item.materialTestCert && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          + Material Cert
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.unitPrice
                        ? `$${parseFloat(item.unitPrice).toFixed(2)}`
                        : 'POA'}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.lineTotal
                        ? `$${parseFloat(item.lineTotal).toFixed(2)}`
                        : 'POA'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right column - Actions & Summary */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold">Status</h2>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="forwarded">Forwarded</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stored PDF Info */}
          {currentPdfUrl && (
            <div className="bg-white rounded-lg border p-6 space-y-3">
              <h2 className="font-semibold">Stored PDF</h2>
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Version:</span>
                  <Badge variant="outline">{currentPdfVersion || 1}</Badge>
                </div>
                <a
                  href={currentPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline text-xs break-all"
                >
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  View stored PDF
                </a>
              </div>
            </div>
          )}

          {/* Shipping */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold">Shipping</h2>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Shipping Cost (ex GST)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Shipping Notes
              </label>
              <Textarea
                placeholder="e.g., Road freight to Perth metro"
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <h2 className="font-semibold">Summary</h2>
            <div className="space-y-2 text-sm">
              {subtotal > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listed Price Total:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount:</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  {certFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Material Certs ({quote.certCount}):
                      </span>
                      <span>${certFee.toFixed(2)}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-500">Subtotal (ex GST):</span>
                    <span>${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (10%):</span>
                    <span>${gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-base">
                    <span>Total (inc GST):</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
              {quote.hasUnpricedItems && (
                <p className="text-amber-600 text-xs mt-2">
                  Some items require manual pricing
                </p>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold">Internal Notes</h2>
            <Textarea
              placeholder="Notes for internal use only..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Send Quote Dialog */}
      <SendQuoteDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        quoteId={quote.id}
        quoteNumber={quote.quoteNumber}
        customerEmail={quote.email}
        customerName={quote.contactName}
        shippingCost={shippingCost}
        shippingNotes={shippingNotes}
        onSuccess={handleSendSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quote{" "}
              <strong>{quote.quoteNumber}</strong> from{" "}
              <strong>{quote.companyName}</strong>?
              <br />
              <br />
              This action cannot be undone. The quote and any associated PDF will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuote}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
