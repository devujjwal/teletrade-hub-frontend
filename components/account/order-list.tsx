'use client';

import Link from 'next/link';
import { Order } from '@/types/order';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils/format';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
        <Link href="/products" className="text-primary hover:underline">
          Start Shopping
        </Link>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      processing: 'default',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'error',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="font-semibold text-lg hover:text-primary transition-colors"
                >
                  Order #{order.order_number}
                </Link>
                <Badge variant={getStatusBadge(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {format(new Date(order.created_at), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} •{' '}
                {formatPrice(order.total)}
              </p>
            </div>
            <Link
              href={`/orders/${order.id}`}
              className="flex items-center text-primary hover:underline"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

