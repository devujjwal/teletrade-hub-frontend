'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, RefreshCw, PackageCheck, Undo2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageLoader from '@/components/admin/admin-page-loader';

type VendorReservation = Record<string, any>;

const getReservationId = (reservation: VendorReservation) =>
  String(
    reservation.reservation_id ??
      reservation.reservationId ??
      reservation.id ??
      reservation.return_val ??
      reservation.ReturnVal ??
      ''
  );

const getReservationSku = (reservation: VendorReservation) =>
  String(reservation.sku ?? reservation.product_sku ?? reservation.article_sku ?? reservation.gensoft_id ?? '-');

const getReservationQty = (reservation: VendorReservation) =>
  String(reservation.qty ?? reservation.quantity ?? reservation.amount ?? reservation.count ?? '-');

const getReservationTitle = (reservation: VendorReservation) =>
  String(
    reservation.product_name ??
      reservation.name ??
      reservation.model ??
      reservation.full_name ??
      reservation.properties?.full_name ??
      '-'
  );

const getReservationWarehouse = (reservation: VendorReservation) =>
  String(reservation.warehouse ?? reservation.stock ?? reservation.branch ?? '-');

const getReservationWarranty = (reservation: VendorReservation) =>
  String(reservation.warranty ?? reservation.warranty_years ?? '-');

export default function AdminVendorReservationsPage() {
  const [reservations, setReservations] = useState<VendorReservation[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<VendorReservation | null>(null);
  const [pendingUnreserveId, setPendingUnreserveId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReservations = async (showRefreshState = false) => {
    if (showRefreshState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await adminApi.getVendorReservations();
      setReservations(Array.isArray(response?.reservations) ? response.reservations : []);
      setRawResponse(response?.raw_response ?? response ?? null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load vendor reservations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return reservations;
    }

    return reservations.filter((reservation) => {
      const haystack = [
        getReservationId(reservation),
        getReservationSku(reservation),
        getReservationTitle(reservation),
        getReservationWarehouse(reservation),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [reservations, search]);

  const reservationCount = reservations.length;
  const uniqueSkuCount = new Set(reservations.map((reservation) => getReservationSku(reservation))).size;

  const handleUnreserve = async () => {
    if (!pendingUnreserveId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.unreserveVendorReservation(pendingUnreserveId);
      toast.success(`Reservation ${pendingUnreserveId} removed successfully`);
      setPendingUnreserveId(null);
      setSelectedReservation(null);
      await loadReservations(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Reservations</h1>
          <p className="text-muted-foreground">Review currently reserved articles at the vendor and unreserve them when needed.</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => loadReservations(true)}
          isLoading={isRefreshing}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active reservations</p>
              <p className="text-2xl font-bold">{reservationCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Unique SKUs</p>
            <p className="mt-1 text-2xl font-bold">{uniqueSkuCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Filtered results</p>
            <p className="mt-1 text-2xl font-bold">{filteredReservations.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by reservation ID, SKU, product, or warehouse..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserved Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AdminPageLoader message="Loading vendor reservations..." rows={6} />
          ) : filteredReservations.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {reservationCount === 0 ? 'No vendor reservations are currently active.' : 'No reservations match your search.'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reservation ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation, index) => {
                    const reservationId = getReservationId(reservation) || `row-${index}`;

                    return (
                      <TableRow key={`${reservationId}-${index}`}>
                        <TableCell className="font-medium">{reservationId || '-'}</TableCell>
                        <TableCell className="font-mono text-xs">{getReservationSku(reservation)}</TableCell>
                        <TableCell>
                          <div className="max-w-[340px]">
                            <p className="truncate font-medium">{getReservationTitle(reservation)}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {reservation.ean ? `EAN: ${String(reservation.ean)}` : 'Vendor reservation'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="muted">{getReservationQty(reservation)}</Badge>
                        </TableCell>
                        <TableCell>{getReservationWarehouse(reservation)}</TableCell>
                        <TableCell>{getReservationWarranty(reservation)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              <Eye className="h-4 w-4" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive"
                              onClick={() => setPendingUnreserveId(reservationId)}
                              disabled={!reservationId}
                            >
                              <Undo2 className="h-4 w-4" />
                              Unreserve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>Raw vendor payload for the selected reserved article.</DialogDescription>
          </DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-4 text-xs">
            {selectedReservation ? JSON.stringify(selectedReservation, null, 2) : ''}
          </pre>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingUnreserveId} onOpenChange={(open) => !open && setPendingUnreserveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove vendor reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unreserve reservation <span className="font-semibold">{pendingUnreserveId}</span> at the vendor.
              Use this only when you intentionally want to release the reserved stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnreserve}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? 'Removing...' : 'Unreserve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
