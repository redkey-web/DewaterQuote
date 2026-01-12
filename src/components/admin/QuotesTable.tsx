'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, ArrowUp, ArrowDown, ArrowUpDown, Search, Trash2, Loader2, CheckCircle, RotateCcw, Archive } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type QuoteItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: string | null;
};

type Quote = {
  id: number;
  quoteNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  itemCount: number;
  pricedTotal: string | null;
  status: string | null;
  createdAt: Date;
  items: QuoteItem[];
  isDeleted?: boolean | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;
};

type DateRange = 'all' | 'today' | 'week' | 'month' | 'quarter';

type SortKey = 'quoteNumber' | 'company' | 'contact' | 'items' | 'total' | 'status' | 'date';
type SortDirection = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  quoted: 'bg-purple-100 text-purple-800',
  forwarded: 'bg-green-100 text-green-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

interface QuotesTableProps {
  quotes: Quote[];
  deletedQuotes?: Quote[];
}

export function QuotesTable({ quotes: initialQuotes, deletedQuotes = [] }: QuotesTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const initialStatus = searchParams?.get('status') || 'all';

  const [quotes, setQuotes] = useState(initialQuotes);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [restoringIds, setRestoringIds] = useState<Set<number>>(new Set());
  const [archivingIds, setArchivingIds] = useState<Set<number>>(new Set());
  const [deletedQuotesList, setDeletedQuotesList] = useState(deletedQuotes);

  // Update URL when status filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.replace(`/admin/quotes${params.toString() ? `?${params.toString()}` : ''}`);
  };

  // Helper to check if date is within range
  const isWithinDateRange = (date: Date, range: DateRange): boolean => {
    if (range === 'all') return true;
    const now = new Date();
    const quoteDate = new Date(date);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case 'today':
        return quoteDate >= startOfToday;
      case 'week': {
        const weekAgo = new Date(startOfToday);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return quoteDate >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(startOfToday);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return quoteDate >= monthAgo;
      }
      case 'quarter': {
        const quarterAgo = new Date(startOfToday);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        return quoteDate >= quarterAgo;
      }
      default:
        return true;
    }
  };

  const filteredAndSortedQuotes = useMemo(() => {
    // Choose source: active or deleted quotes
    let result = showDeleted ? [...deletedQuotesList] : [...quotes];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.quoteNumber.toLowerCase().includes(searchLower) ||
          q.companyName.toLowerCase().includes(searchLower) ||
          q.contactName.toLowerCase().includes(searchLower) ||
          q.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((q) => q.status === statusFilter);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      result = result.filter((q) => isWithinDateRange(q.createdAt, dateRange));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case 'quoteNumber':
          comparison = a.quoteNumber.localeCompare(b.quoteNumber);
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'contact':
          comparison = a.contactName.localeCompare(b.contactName);
          break;
        case 'items':
          comparison = a.itemCount - b.itemCount;
          break;
        case 'total':
          comparison =
            (parseFloat(a.pricedTotal || '0') || 0) -
            (parseFloat(b.pricedTotal || '0') || 0);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [quotes, deletedQuotesList, showDeleted, search, statusFilter, dateRange, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const handleDeleteQuote = async () => {
    if (!deletingQuote) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/quotes/" + deletingQuote.id, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete quote");
      }

      // Remove quote from local state
      setQuotes((prev) => prev.filter((q) => q.id !== deletingQuote.id));
      toast({
        title: "Quote deleted",
        description: "Quote " + deletingQuote.quoteNumber + " has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete quote",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingQuote(null);
    }
  };

  const handleToggleComplete = async (quote: Quote) => {
    const quoteId = quote.id;
    const currentStatus = quote.status || "pending";
    const newStatus = currentStatus === "completed" ? "forwarded" : "completed";

    // Add to toggling set
    setTogglingIds((prev) => new Set(prev).add(quoteId));

    // Optimistic update
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );

    try {
      const response = await fetch("/api/admin/quotes/" + quoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast({
        title: newStatus === "completed" ? "Quote marked complete" : "Quote reopened",
        description: "Quote " + quote.quoteNumber + " status updated.",
      });
    } catch {
      // Revert on error
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: currentStatus } : q))
      );
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedQuotes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedQuotes.map((q) => q.id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkMarkComplete = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkProcessing(true);
    const idsToProcess = Array.from(selectedIds);
    let successCount = 0;

    // Process each selected quote
    for (const id of idsToProcess) {
      try {
        const response = await fetch(`/api/admin/quotes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });

        if (response.ok) {
          successCount++;
          setQuotes((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: "completed" } : q))
          );
        }
      } catch {
        // Continue with other quotes
      }
    }

    setIsBulkProcessing(false);
    setSelectedIds(new Set());

    toast({
      title: `Marked ${successCount} quote${successCount !== 1 ? "s" : ""} complete`,
      description: successCount === idsToProcess.length
        ? "All selected quotes updated."
        : `${idsToProcess.length - successCount} failed to update.`,
    });
  };

  const handleRestoreQuote = async (quote: Quote) => {
    const quoteId = quote.id;

    // Add to restoring set
    setRestoringIds((prev) => new Set(prev).add(quoteId));

    try {
      const response = await fetch('/api/admin/quotes/${quoteId}/restore', {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to restore quote");
      }

      // Remove from deleted list and add to active list
      setDeletedQuotesList((prev) => prev.filter((q) => q.id !== quoteId));
      setQuotes((prev) => [...prev, { ...quote, isDeleted: false }]);

      toast({
        title: "Quote restored",
        description: 'Quote ${quote.quoteNumber} has been restored.',
      });
    } catch (error) {
      toast({
        title: "Failed to restore quote",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setRestoringIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  const handleArchiveQuote = async (quote: Quote) => {
    const quoteId = quote.id;

    // Add to archiving set
    setArchivingIds((prev) => new Set(prev).add(quoteId));

    try {
      const response = await fetch('/api/admin/quotes/${quoteId}', {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to archive quote");
      }

      // Remove from active quotes and add to deleted list
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
      setDeletedQuotesList((prev) => [...prev, { ...quote, isDeleted: true }]);

      toast({
        title: "Quote archived",
        description: 'Quote ${quote.quoteNumber} has been archived. View in "Show Deleted" to restore.',
      });
    } catch (error) {
      toast({
        title: "Failed to archive quote",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setArchivingIds((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    }
  };

  const SortableHeader = ({
    column,
    label,
    className,
  }: {
    column: SortKey;
    label: string;
    className?: string;
  }) => {
    const isActive = sortKey === column;
    return (
      <TableHead className={cn("sticky top-16 bg-gray-50 z-10", className)}>
        <button
          onClick={() => handleSort(column)}
          className={cn(
            "flex items-center gap-1 transition-colors",
            isActive ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
          )}
        >
          {label}
          {isActive ? (
            sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      </TableHead>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters Row 1 */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search quotes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="forwarded">Forwarded</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>

        {/* Show Deleted Toggle */}
        {deletedQuotes.length > 0 && (
          <div className="flex items-center gap-2">
            <Switch
              id="show-deleted"
              checked={showDeleted}
              onCheckedChange={setShowDeleted}
            />
            <Label htmlFor="show-deleted" className="text-sm text-gray-600">
              Show Deleted ({deletedQuotes.length})
            </Label>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && !showDeleted && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} quote{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <Button
            size="sm"
            onClick={handleBulkMarkComplete}
            disabled={isBulkProcessing}
          >
            {isBulkProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Mark Complete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {!showDeleted && (
                <TableHead className="w-10 sticky top-16 bg-gray-50 z-10">
                  <Checkbox
                    checked={selectedIds.size > 0 && selectedIds.size === filteredAndSortedQuotes.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <TableHead className="w-10 sticky top-16 bg-gray-50 z-10">
                <span className="sr-only">Complete</span>
              </TableHead>
              <SortableHeader column="quoteNumber" label="Quote #" />
              <SortableHeader column="company" label="Company" />
              <SortableHeader column="contact" label="Contact" />
              <SortableHeader column="items" label="Items" className="text-center" />
              <SortableHeader column="total" label="Total" className="text-right" />
              <SortableHeader column="status" label="Status" />
              <SortableHeader column="date" label="Date" />
              <TableHead className="text-right sticky top-16 bg-gray-50 z-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showDeleted ? 9 : 10} className="text-center py-8 text-gray-500">
                  {showDeleted
                    ? 'No deleted quotes'
                    : quotes.length === 0
                    ? 'No quote requests yet'
                    : 'No quotes match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedQuotes.map((quote) => (
                <TableRow
                  key={quote.id}
                  className={cn(
                    "hover:bg-gray-50",
                    quote.status === "completed" && "bg-gray-50/50 text-gray-500",
                    showDeleted && "bg-red-50/30",
                    selectedIds.has(quote.id) && "bg-blue-50"
                  )}
                >
                  {!showDeleted && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(quote.id)}
                        onCheckedChange={() => handleSelectOne(quote.id)}
                        aria-label={`Select ${quote.quoteNumber}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Checkbox
                      checked={quote.status === "completed"}
                      disabled={togglingIds.has(quote.id) || showDeleted}
                      onCheckedChange={() => handleToggleComplete(quote)}
                      aria-label={"Mark " + quote.quoteNumber + " as complete"}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{quote.quoteNumber}</TableCell>
                  <TableCell className="font-medium">{quote.companyName}</TableCell>
                  <TableCell>
                    <div>{quote.contactName}</div>
                    <div className="text-sm text-gray-500">{quote.email}</div>
                  </TableCell>
                  <TableCell className="text-center">{quote.itemCount}</TableCell>
                  <TableCell className="text-right">
                    {quote.pricedTotal
                      ? `$${parseFloat(quote.pricedTotal).toLocaleString('en-AU', {
                          minimumFractionDigits: 2,
                        })}`
                      : 'POA'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[quote.status || 'pending']}
                    >
                      {quote.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    <div>
                      {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                    </div>
                    {/* Show deletion info for deleted quotes */}
                    {showDeleted && quote.deletedAt && (
                      <div className="text-xs text-red-600 mt-1">
                        Deleted {formatDistanceToNow(new Date(quote.deletedAt), { addSuffix: true })}
                        {quote.deletedBy && ` by ${quote.deletedBy.split("@")[0]}`}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {showDeleted ? (
                        /* Restore button for deleted quotes */
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreQuote(quote)}
                          disabled={restoringIds.has(quote.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          {restoringIds.has(quote.id) ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-1" />
                          )}
                          Restore
                        </Button>
                      ) : (
                        /* Normal actions for active quotes */
                        <>
                          <Link href={"/admin/quotes/" + quote.id}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveQuote(quote)}
                            disabled={archivingIds.has(quote.id)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            title="Archive this quote"
                          >
                            {archivingIds.has(quote.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Archive className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingQuote(quote)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Permanently delete this quote"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500">
        Showing {filteredAndSortedQuotes.length} of {quotes.length} quotes
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuote} onOpenChange={() => setDeletingQuote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quote{" "}
              <strong>{deletingQuote?.quoteNumber}</strong> from{" "}
              <strong>{deletingQuote?.companyName}</strong>?
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
