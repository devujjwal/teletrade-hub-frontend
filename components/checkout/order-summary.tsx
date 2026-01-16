'use client';

import { CartItem } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils/format';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/utils/format';
import { useLanguage } from '@/contexts/language-context';
import { useSettings } from '@/contexts/settings-context';

interface OrderSummaryProps {
  items: CartItem[];
  getTotal: () => number;
  isSubmitting: boolean;
}

export default function OrderSummary({ items, getTotal, isSubmitting }: OrderSummaryProps) {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const subtotal = getTotal();
  const shipping = subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_cost;
  const tax = subtotal * settings.tax_rate;
  const total = subtotal + shipping + tax;

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="font-display text-xl font-semibold mb-6">{t('checkout.orderSummary')}</h2>
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product_id} className="flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              {item.product_image && (
                <Image
                  src={getProxiedImageUrl(item.product_image)}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product_name}</p>
              <p className="text-xs text-muted-foreground">
                {t('cart.quantity')}: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3 border-t border-border pt-4">
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
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
          <span>{t('cart.total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {subtotal < settings.free_shipping_threshold && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Add {formatPrice(settings.free_shipping_threshold - subtotal)} more for free shipping
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full mt-6 btn-shop"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('checkout.placeOrder')}
      </Button>
    </Card>
  );
}
