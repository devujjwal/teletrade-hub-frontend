'use client';

import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminPageLoaderProps {
  message?: string;
  rows?: number;
}

export default function AdminPageLoader({
  message = 'Loading data...',
  rows = 5,
}: AdminPageLoaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm w-fit">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton key={idx} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
