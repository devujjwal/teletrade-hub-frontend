import { Loader2 } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-10 w-40" />
        <Skeleton className="h-5 w-80" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Loading users...</p>
              <p className="text-xs text-muted-foreground">Preparing customer and merchant registrations.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.6fr] gap-4 border-b bg-muted/30 px-5 py-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-20" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.6fr] gap-4 border-b px-5 py-4 last:border-b-0"
              >
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
