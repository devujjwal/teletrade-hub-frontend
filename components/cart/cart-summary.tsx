'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils/format';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useSettings } from '@/contexts/settings-context';

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const { t } = useLanguage();
  const { settings } = useSettings();

  const subtotal = getTotal();
  const tax = subtotal * settings.tax_rate;
  const shipping = subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_cost;
  const total = subtotal + tax + shipping;

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="font-display text-xl font-semibold mb-6">{t('checkout.orderSummary')}</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.subtotal')}</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.shipping')}</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('checkout.taxVat')}</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
          <span>{t('cart.total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {subtotal < settings.free_shipping_threshold && (
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Add {formatPrice(settings.free_shipping_threshold - subtotal)} more for free shipping
        </p>
      )}

      <Button size="lg" className="w-full btn-shop mb-4" asChild>
        <Link href="/checkout">{t('cart.checkout')}</Link>
      </Button>

      <Link href="/products" className="block text-center text-sm text-primary hover:underline">
        {t('cart.continueShopping')}
      </Link>
    </Card>
  );
}
