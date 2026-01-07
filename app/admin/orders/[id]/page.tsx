'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';
import { Order } from '@/types/order';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async (status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border border-secondary-300 px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-secondary-600">Order Number:</dt>
              <dd className="font-medium">{order.order_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Date:</dt>
              <dd>{formatDateTime(order.created_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Status:</dt>
              <dd>
                <Badge
                  variant={
                    order.status === 'delivered'
                      ? 'success'
                      : order.status === 'cancelled'
                      ? 'error'
                      : 'info'
                  }
                >
                  {order.status}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Payment Status:</dt>
              <dd>
                <Badge
                  variant={
                    order.payment_status === 'paid'
                      ? 'success'
                      : order.payment_status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {order.payment_status}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Total:</dt>
              <dd className="font-bold text-lg">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-secondary-600">Name:</dt>
              <dd className="font-medium">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-secondary-600">Email:</dt>
              <dd>{order.customer_email}</dd>
            </div>
            {order.customer_phone && (
              <div>
                <dt className="text-secondary-600">Phone:</dt>
                <dd>{order.customer_phone}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <address className="not-italic">
            {order.shipping_address.address_line_1}
            {order.shipping_address.address_line_2 && (
              <>
                <br />
                {order.shipping_address.address_line_2}
              </>
            )}
            <br />
            {order.shipping_address.city}
            {order.shipping_address.state && `, ${order.shipping_address.state}`}
            <br />
            {order.shipping_address.postal_code}
            <br />
            {order.shipping_address.country}
          </address>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between border-b border-secondary-200 pb-3">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-secondary-600">
                    SKU: {item.sku} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
            <div className="pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.shipping_cost && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-secondary-200">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

