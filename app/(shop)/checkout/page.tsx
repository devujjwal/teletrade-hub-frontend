'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/lib/utils/validation';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { ordersApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import CheckoutForm from '@/components/checkout/checkout-form';
import OrderSummary from '@/components/checkout/order-summary';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const { user, token, _hasHydrated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only redirect if hydrated and user is not logged in
    if (_hasHydrated && (!token || !user)) {
      router.push('/login?redirect=/checkout');
      return;
    }
  }, [_hasHydrated, token, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billing_address: undefined, // Same as shipping by default
    },
  });

  const sameAsShipping = watch('billing_address') === undefined;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...data,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        billing_address: sameAsShipping ? data.shipping_address : data.billing_address,
      };

      const order = await ordersApi.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/checkout/payment-instructions/${order.order_number}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated (only after hydration)
  if (!token || !user) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Checkout</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to continue with checkout
            </p>
            <Button size="lg" onClick={() => router.push('/login?redirect=/checkout')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container-wide py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue}
              user={user}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              getTotal={getTotal}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

