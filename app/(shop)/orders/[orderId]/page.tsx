'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi } from '@/lib/api/orders';
import { formatPrice } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/format';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Order } from '@/types/order';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await ordersApi.getById(orderNumber);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error('Order not found');
        router.push('/account/orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router]);

  if (isLoading) {
    return (
      <div className="container-wide py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-wide py-16 text-center">
        <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/account/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      {/* Success Message */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We've sent a confirmation email to {order.customer_email}
        </p>
      </div>

      {/* Order Details */}
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold mb-1">Order #{order.order_number}</h2>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDateTime(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  order.status === 'delivered'
                    ? 'success'
                    : order.status === 'cancelled'
                    ? 'error'
                    : 'info'
                }
                className="mb-2"
              >
                {order.status}
              </Badge>
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
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.product_image || '/placeholder-image.jpg'} 
                    alt={item.product_name || 'Product'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product_sku} × {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            )) || []}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.shipping_cost && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
              </div>
            )}
            {order.tax && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (VAT)</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
            <address className="not-italic text-muted-foreground">
              {order.shipping_address?.first_name} {order.shipping_address?.last_name}
              <br />
              {order.shipping_address?.address_line1}
              {order.shipping_address?.address_line2 && (
                <>
                  <br />
                  {order.shipping_address.address_line2}
                </>
              )}
              <br />
              {order.shipping_address?.city}
              {order.shipping_address?.state && `, ${order.shipping_address.state}`} {order.shipping_address?.postal_code}
              <br />
              {order.shipping_address?.country}
              {order.shipping_address?.phone && (
                <>
                  <br />
                  Tel: {order.shipping_address.phone}
                </>
              )}
            </address>
          </Card>

          {/* Billing Address */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Billing Address</h3>
            <address className="not-italic text-muted-foreground">
              {order.billing_address?.first_name} {order.billing_address?.last_name}
              <br />
              {order.billing_address?.address_line1}
              {order.billing_address?.address_line2 && (
                <>
                  <br />
                  {order.billing_address.address_line2}
                </>
              )}
              <br />
              {order.billing_address?.city}
              {order.billing_address?.state && `, ${order.billing_address.state}`} {order.billing_address?.postal_code}
              <br />
              {order.billing_address?.country}
              {order.billing_address?.phone && (
                <>
                  <br />
                  Tel: {order.billing_address.phone}
                </>
              )}
            </address>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            Print Order
          </Button>
        </div>
      </div>
    </div>
  );
}

