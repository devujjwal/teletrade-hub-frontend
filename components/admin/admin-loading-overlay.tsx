'use client';

import { Loader2 } from 'lucide-react';

interface AdminLoadingOverlayProps {
  message?: string;
}

export default function AdminLoadingOverlay({
  message = 'Loading data...',
}: AdminLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{message}</span>
      </div>
    </div>
  );
}
