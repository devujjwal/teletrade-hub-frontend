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
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  processing: 'bg-info/20 text-info border-info/30',
  shipped: 'bg-primary/20 text-primary border-primary/30',
  delivered: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  paid: 'bg-success/20 text-success',
  failed: 'bg-destructive/20 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
      });
      // API now returns { orders: [...], pagination: {...} } directly
      setOrders(response.orders || []);
      setPagination((prev) => response.pagination || prev);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
      setSelectedOrder(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
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
                          <Badge className={statusColors[order.status] || ''}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[order.payment_status] || ''}>
                            {order.payment_status}
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
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
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
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <Badge className={paymentStatusColors[selectedOrder.payment_status] || ''}>
                    {selectedOrder.payment_status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Change Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
