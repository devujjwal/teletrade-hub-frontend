'use client';

import { Loader2 } from 'lucide-react';

const placeholders = Array.from({ length: 6 }, (_, index) => index);

export default function ProductsGridLoader() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Refreshing products</p>
            <p className="text-xs text-muted-foreground">Finding the best matches for your filters</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholders.map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="h-44 bg-gradient-to-br from-muted via-muted/60 to-muted" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-9 w-full rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
