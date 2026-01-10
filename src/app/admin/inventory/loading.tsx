import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Alert */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Table */}
      <div className="border rounded-lg bg-white">
        {/* Table Header */}
        <div className="border-b px-4 py-3 flex gap-4 items-center">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* Table Rows */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-b px-4 py-4 flex gap-4 items-center">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-1 ml-auto">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
