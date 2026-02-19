'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { formatPrice } from '@/lib/utils/format';
import Badge from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';

interface ProductPriceSectionProps {
  slug: string;
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  discountPercent: number;
}

export default function ProductPriceSection({
  slug,
  price,
  originalPrice,
  hasDiscount,
  discountPercent,
}: ProductPriceSectionProps) {
  const router = useRouter();
  const { token, user, _hasHydrated } = useAuthStore();
  const { t } = useLanguage();
  const [resolvedPrice, setResolvedPrice] = useState(price);
  const [resolvedOriginalPrice, setResolvedOriginalPrice] = useState(originalPrice);
  const [resolvedHasDiscount, setResolvedHasDiscount] = useState(hasDiscount);
  const [resolvedDiscountPercent, setResolvedDiscountPercent] = useState(discountPercent);

  useEffect(() => {
    setResolvedPrice(price);
    setResolvedOriginalPrice(originalPrice);
    setResolvedHasDiscount(hasDiscount);
    setResolvedDiscountPercent(discountPercent);
  }, [price, originalPrice, hasDiscount, discountPercent]);

  useEffect(() => {
    if (!_hasHydrated || !token || !user) return;

    productsApi.getBySlug(slug).then((latestProduct) => {
      const latestPrice = Number(latestProduct.price) || 0;
      const latestOriginalPrice = Number(latestProduct.original_price) || 0;
      const latestHasDiscount = latestOriginalPrice > 0 && latestOriginalPrice > latestPrice;
      const latestDiscountPercent = latestHasDiscount
        ? Math.round((1 - latestPrice / latestOriginalPrice) * 100)
        : 0;

      setResolvedPrice(latestPrice);
      setResolvedOriginalPrice(latestOriginalPrice || undefined);
      setResolvedHasDiscount(latestHasDiscount);
      setResolvedDiscountPercent(latestDiscountPercent);
    }).catch(() => {
      // Keep server-provided price as fallback
    });
  }, [_hasHydrated, token, user, slug]);

  // If not logged in, show login prompt
  if (!token || !user) {
    return (
      <div 
        className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-lg border border-border cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => router.push('/login')}
      >
        <Lock className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{t('products.loginToViewPrice')}</p>
          <p className="text-sm text-muted-foreground">{t('products.signInForPricing')}</p>
        </div>
      </div>
    );
  }

  // Show price for logged-in users
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="text-3xl font-bold">{formatPrice(resolvedPrice)}</span>
      {resolvedHasDiscount && resolvedOriginalPrice && resolvedDiscountPercent > 0 && (
        <>
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(resolvedOriginalPrice)}
          </span>
          <Badge variant="error">Save {resolvedDiscountPercent}%</Badge>
        </>
      )}
    </div>
  );
}
