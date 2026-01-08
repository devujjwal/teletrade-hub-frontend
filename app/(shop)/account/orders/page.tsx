'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { ordersApi } from '@/lib/api/orders';
import OrderList from '@/components/account/order-list';
import { Order } from '@/types/order';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Check authentication - redirect if not logged in
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await ordersApi.list();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, user, router]);

  // Show loading while checking auth or fetching orders
  if (!token || !user || isLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
}

