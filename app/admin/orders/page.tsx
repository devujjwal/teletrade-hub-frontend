'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin';
import { Order } from '@/types/order';
import Card from '@/components/ui/card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AdminLoadingOverlay from '@/components/admin/admin-loading-overlay';
import AdminPageLoader from '@/components/admin/admin-page-loader';

const statusColors: Record<string, string> = {
  pending: 'border border-amber-200 bg-amber-100 text-amber-900',
  processing: 'border border-sky-200 bg-sky-100 text-sky-800',
  shipped: 'border border-indigo-200 bg-indigo-100 text-indigo-800',
  delivered: 'border border-emerald-200 bg-emerald-100 text-emerald-800',
  cancelled: 'border border-rose-200 bg-rose-100 text-rose-800',
};

const paymentStatusColors: Record<string, string> = {
  unpaid: 'border border-slate-200 bg-slate-100 text-slate-700',
  pending: 'border border-amber-200 bg-amber-100 text-amber-900',
  paid: 'border border-emerald-200 bg-emerald-100 text-emerald-800',
  failed: 'border border-rose-200 bg-rose-100 text-rose-800',
  refunded: 'border border-violet-200 bg-violet-100 text-violet-800',
};

const customerTypeColors: Record<string, string> = {
  merchant: 'border border-amber-200 bg-amber-100 text-amber-900',
  customer: 'border border-sky-200 bg-sky-100 text-sky-800',
};

const toDisplayLabel = (value?: string) => {
  if (!value) return 'Unknown';

  return value
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getOrders({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        customer_type: customerTypeFilter !== 'all' ? customerTypeFilter : undefined,
      });
      // API now returns { orders: [...], pagination: {...} } directly
      setOrders(response.orders || []);
      setPagination((prev) => ({
        current_page: response.pagination?.page || prev.current_page,
        last_page: response.pagination?.pages || prev.last_page,
        per_page: response.pagination?.limit || prev.per_page,
        total: response.pagination?.total || prev.total,
      }));
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [page, search, statusFilter, customerTypeFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setPendingStatus(selectedOrder?.status || '');
  }, [selectedOrder]);

  const closeOrderDialog = () => {
    if (isUpdatingStatus) {
      return;
    }

    setSelectedOrder(null);
    setPendingStatus('');
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !pendingStatus || pendingStatus === selectedOrder.status) {
      return;
    }

    try {
      setIsUpdatingStatus(true);
      await adminApi.updateOrderStatus(selectedOrder.id, pendingStatus);
      toast.success('Order status updated');
      await loadOrders();
      closeOrderDialog();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer and merchant orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number or customer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={customerTypeFilter}
              onValueChange={(value) => {
                setCustomerTypeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="User type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="merchant">Merchant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {!isInitialLoading && isLoading && <AdminLoadingOverlay message="Refreshing orders..." />}
          {isInitialLoading ? (
            <AdminPageLoader message="Loading orders..." rows={5} />
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found</div>
          ) : (
            <>
              <div className="relative rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.order_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer_name || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer_email || ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge className={customerTypeColors[order.customer_type || 'customer'] || customerTypeColors.customer}>
                            {toDisplayLabel(order.customer_type || 'customer')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status] || ''}>{toDisplayLabel(order.status)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[order.payment_status] || ''}>
                            {toDisplayLabel(order.payment_status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                Details
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * pagination.per_page + 1).toLocaleString()} to{' '}
                    {Math.min(page * pagination.per_page, pagination.total).toLocaleString()} of{' '}
                    {pagination.total.toLocaleString()} orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                      disabled={page === pagination.last_page}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={closeOrderDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.order_number}</DialogTitle>
              <DialogDescription>Update order status</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customer_name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-sm font-semibold">{formatPrice(selectedOrder.total)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={statusColors[selectedOrder.status] || ''}>
                    {toDisplayLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <Badge className={paymentStatusColors[selectedOrder.payment_status] || ''}>
                    {toDisplayLabel(selectedOrder.payment_status)}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Change Status</p>
                <Select
                  value={pendingStatus}
                  onValueChange={setPendingStatus}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={closeOrderDialog}
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!pendingStatus || pendingStatus === selectedOrder.status || isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
