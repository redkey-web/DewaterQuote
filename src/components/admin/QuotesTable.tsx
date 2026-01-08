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
import { Eye, ChevronUp, ChevronDown, Search } from 'lucide-react';

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
};

type SortKey = 'quoteNumber' | 'company' | 'contact' | 'items' | 'total' | 'status' | 'date';
type SortDirection = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  quoted: 'bg-purple-100 text-purple-800',
  forwarded: 'bg-green-100 text-green-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStatus = searchParams.get('status') || 'all';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Update URL when status filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.replace(`/admin/quotes${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const filteredAndSortedQuotes = useMemo(() => {
    let result = [...quotes];

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
  }, [quotes, search, statusFilter, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
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
  }) => (
    <TableHead className={className}>
      <button
        onClick={() => handleSort(column)}
        className="flex items-center gap-1 hover:text-gray-900"
      >
        {label}
        {sortKey === column ? (
          sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <span className="w-4" />
        )}
      </button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <SortableHeader column="quoteNumber" label="Quote #" />
              <SortableHeader column="company" label="Company" />
              <SortableHeader column="contact" label="Contact" />
              <SortableHeader column="items" label="Items" className="text-center" />
              <SortableHeader column="total" label="Total" className="text-right" />
              <SortableHeader column="status" label="Status" />
              <SortableHeader column="date" label="Date" />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {quotes.length === 0
                    ? 'No quote requests yet'
                    : 'No quotes match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedQuotes.map((quote) => (
                <TableRow key={quote.id} className="hover:bg-gray-50">
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
                    {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/quotes/${quote.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
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
    </div>
  );
}
