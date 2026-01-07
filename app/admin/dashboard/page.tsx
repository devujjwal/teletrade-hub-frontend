'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin';
import Card from '@/components/ui/card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
  order_stats?: {
    total_revenue?: number;
    this_month_revenue?: number;
    total_orders?: number;
    pending_orders?: number;
    processing_orders?: number;
    shipped_orders?: number;
    delivered_orders?: number;
    cancelled_orders?: number;
    today_revenue?: number;
  };
  product_stats?: {
    total_products?: number;
    available_products?: number;
  };
  recent_orders?: Array<{
    id: number;
    order_number: string;
    status: string;
    customer_name?: string;
    customer_email?: string;
    total_amount?: number;
    created_at: string;
  }>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  processing: 'bg-info/20 text-info border-info/30',
  shipped: 'bg-primary/20 text-primary border-primary/30',
  delivered: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      // Handle different response structures
      const data = response.data || response;
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const orderStats = stats?.order_stats || {};
  const productStats = stats?.product_stats || {};
  const recentOrders = stats?.recent_orders || [];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(orderStats.total_revenue || 0),
      description: `${formatPrice(orderStats.this_month_revenue || 0)} this month`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Orders',
      value: orderStats.total_orders || 0,
      description: `${orderStats.pending_orders || 0} pending`,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Products',
      value: productStats.total_products || 0,
      description: `${productStats.available_products || 0} available`,
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Today Revenue',
      value: formatPrice(orderStats.today_revenue || 0),
      description: 'Real-time tracking',
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  const orderStatusCards = [
    { label: 'Pending', value: orderStats.pending_orders || 0, icon: Clock, color: 'text-warning' },
    {
      label: 'Processing',
      value: orderStats.processing_orders || 0,
      icon: Package,
      color: 'text-info',
    },
    { label: 'Shipped', value: orderStats.shipped_orders || 0, icon: Truck, color: 'text-primary' },
    {
      label: 'Delivered',
      value: orderStats.delivered_orders || 0,
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      label: 'Cancelled',
      value: orderStats.cancelled_orders || 0,
      icon: XCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
          <CardDescription>Current distribution of orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {orderStatusCards.map((status) => (
              <div
                key={status.label}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50"
              >
                <status.icon className={`h-8 w-8 ${status.color} mb-2`} />
                <p className="text-2xl font-bold">{status.value}</p>
                <p className="text-sm text-muted-foreground">{status.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </div>
          <Link href="/admin/orders">
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              View All
            </Badge>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">#{order.order_number}</p>
                      <Badge className={statusColors[order.status] || ''}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer_name || order.customer_email || 'Guest'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total_amount || 0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent orders</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
