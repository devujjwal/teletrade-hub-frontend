'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  ChevronRight, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { ordersApi } from '@/lib/api/orders';
import { Order } from '@/types/order';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  processing: { icon: Package, color: 'text-accent', bg: 'bg-accent/10', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-primary', bg: 'bg-primary/10', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, initialize, _hasHydrated } = useAuthStore();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Only redirect if hydrated and user is not logged in
    if (_hasHydrated && (!token || !user)) {
      router.push('/login');
      return;
    }

    // Fetch orders only if authenticated
    if (_hasHydrated && token && user) {
      const fetchOrders = async () => {
        try {
          const response = await ordersApi.list();
          setOrders(response.data || []);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching orders:', error);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [_hasHydrated, token, user, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (only show after hydration)
  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mb-4">{t('account.viewOrders')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('account.signInToView')}
          </p>
          <Button size="lg" asChild>
            <Link href="/login">{t('auth.login')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground">{t('account.title')}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{t('orders.title')}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold">{t('orders.title')}</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('orders.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('orders.allStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('orders.allStatus')}</SelectItem>
              <SelectItem value="pending">{t('status.pending')}</SelectItem>
              <SelectItem value="processing">{t('status.processing')}</SelectItem>
              <SelectItem value="shipped">{t('status.shipped')}</SelectItem>
              <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
              <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="font-display text-xl font-bold mb-2">{t('orders.noOrders')}</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? t('orders.tryAdjusting')
              : t('orders.noOrdersYet')
            }
          </p>
          <Button asChild>
            <Link href="/products">{t('orders.startShopping')}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;
            const orderNumber = order.order_number || `ORD-${order.id}`;
            const orderDate = order.created_at 
              ? new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : '';

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{orderNumber}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {t(`status.${order.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('orders.placedOn')} {orderDate}
                    </p>
                  </div>

                  {/* Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                          <Image 
                            src={item.product_image || '/placeholder.svg'} 
                            alt={item.product_name || 'Product'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Price & Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">€{Number(order.total || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length || 0} {t('orders.items')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
