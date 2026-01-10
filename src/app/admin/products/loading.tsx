import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-24 ml-auto" />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        {/* Table Header */}
        <div className="border-b px-4 py-3 flex gap-4 items-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* Table Rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="border-b px-4 py-4 flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-64 mt-1" />
            </div>
            <Skeleton className="h-5 w-20 font-mono" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
