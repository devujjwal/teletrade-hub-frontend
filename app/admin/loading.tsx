import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm w-fit">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading admin page...</span>
      </div>
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}
