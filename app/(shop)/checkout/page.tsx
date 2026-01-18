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
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  // Determine if billing is same as shipping:
  // When "same as shipping" is checked, billing_address_id is undefined
  // and billing_address fields are populated with shipping address data
  const billingAddressIdValue = watch('billing_address_id');
  const sameAsShipping = !billingAddressIdValue;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse customer name into first and last name
      const nameParts = data.customer_name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Check if user selected saved addresses or entered new ones
      const useShippingAddressId = data.shipping_address_id && user;
      const useBillingAddressId = data.billing_address_id && user;

      // Debug logging
      console.log('Form data:', { 
        shipping_address_id: data.shipping_address_id, 
        billing_address_id: data.billing_address_id,
        useShippingAddressId,
        useBillingAddressId,
        user: user?.id
      });

      // Build order data with either address IDs or full address data
      const orderData: any = {
        cart_items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: 'bank_transfer',
        notes: data.notes || '',
        user_id: user?.id,
        guest_email: !user ? data.customer_email : undefined,
      };

      // Add shipping address (either ID or full data, NEVER both)
      if (useShippingAddressId) {
        orderData.shipping_address_id = parseInt(data.shipping_address_id!);
        // DO NOT add shipping_address when using ID
      } else if (data.shipping_address) {
        // Only add shipping_address if we have the data and NOT using an ID
        orderData.shipping_address = {
          first_name: firstName,
          last_name: lastName,
          company: '',
          address_line1: data.shipping_address.address_line_1,
          address_line2: data.shipping_address.address_line_2 || '',
          city: data.shipping_address.city,
          state: data.shipping_address.state || '',
          postal_code: data.shipping_address.postal_code,
          country: data.shipping_address.country,
          phone: data.customer_phone || '',
        };
      }

      // Add billing address (either ID or full data, NEVER both)
      // IMPORTANT: Prioritize IDs over form data to avoid duplicates
      if (sameAsShipping && useShippingAddressId) {
        // Billing same as shipping - use the shipping address ID
        orderData.billing_address_id = parseInt(data.shipping_address_id!);
        // DO NOT add billing_address when using ID
      } else if (sameAsShipping && orderData.shipping_address) {
        // Billing same as shipping - reference the shipping address data
        orderData.billing_address = orderData.shipping_address;
      } else if (!sameAsShipping && useBillingAddressId) {
        // User selected a different saved billing address
        orderData.billing_address_id = parseInt(data.billing_address_id!);
        // DO NOT add billing_address when using ID
      } else if (!sameAsShipping && data.billing_address) {
        // User manually entered a different billing address (not using saved address)
        orderData.billing_address = {
          first_name: firstName,
          last_name: lastName,
          company: '',
          address_line1: data.billing_address.address_line_1,
          address_line2: data.billing_address.address_line_2 || '',
          city: data.billing_address.city,
          state: data.billing_address.state || '',
          postal_code: data.billing_address.postal_code,
          country: data.billing_address.country,
          phone: data.customer_phone || '',
        };
      }

      // Debug: Log what we're sending to the API
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const order = await ordersApi.create(orderData);
      
      // Mark order as placed to prevent cart redirect
      setOrderPlaced(true);
      
      // Clear cart and redirect
      clearCart();
      toast.success('Order placed successfully!');
      
      // Use replace instead of push to prevent back button issues
      router.replace(`/checkout/payment-instructions/${order.order_number}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order. Please try again.');
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

  // Only redirect to cart if empty AND not in the process of placing an order
  if (items.length === 0 && !isSubmitting && !orderPlaced) {
    router.push('/cart');
    return null;
  }

  // Show processing state after order is placed
  if (orderPlaced) {
    return (
      <div className="container-wide py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Your Order...</h2>
          <p className="text-muted-foreground">Please wait while we redirect you to payment instructions.</p>
        </div>
      </div>
    );
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

