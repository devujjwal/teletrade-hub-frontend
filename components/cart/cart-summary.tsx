'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils/format';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);

  const TAX_RATE = 0.19; // 19% German VAT
  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (VAT)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {subtotal < 100 && (
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Add {formatPrice(100 - subtotal)} more for free shipping
        </p>
      )}

      <Button size="lg" className="w-full btn-shop mb-4" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <Link href="/products" className="block text-center text-sm text-primary hover:underline">
        Continue Shopping
      </Link>
    </Card>
  );
}
