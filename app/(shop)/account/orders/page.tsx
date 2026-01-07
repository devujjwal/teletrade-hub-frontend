import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { ordersApi } from '@/lib/api/orders';
import OrderList from '@/components/account/order-list';
import { Order } from '@/types/order';

export const metadata: Metadata = {
  title: 'My Orders | TeleTrade Hub',
  description: 'View your order history',
};

export default async function OrdersPage() {
  // Check authentication
  let user;
  try {
    user = await authApi.getCurrentUser();
  } catch {
    redirect('/login');
  }

  // Fetch orders
  let orders: Order[] = [];
  try {
    const response = await ordersApi.list();
    orders = response.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
}

