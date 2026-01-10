import { Skeleton } from '@/components/ui/skeleton';

export default function QuotesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        {/* Table Header */}
        <div className="border-b px-4 py-3 flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* Table Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-b px-4 py-4 flex gap-4 items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-5 w-28" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
