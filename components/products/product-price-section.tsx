'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { formatPrice } from '@/lib/utils/format';
import Badge from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface ProductPriceSectionProps {
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  discountPercent: number;
}

export default function ProductPriceSection({
  price,
  originalPrice,
  hasDiscount,
  discountPercent,
}: ProductPriceSectionProps) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  // If not logged in, show login prompt
  if (!token || !user) {
    return (
      <div 
        className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-lg border border-border cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => router.push('/login')}
      >
        <Lock className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium">Login to view price</p>
          <p className="text-sm text-muted-foreground">Sign in to see exclusive pricing and offers</p>
        </div>
      </div>
    );
  }

  // Show price for logged-in users
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="text-3xl font-bold">{formatPrice(price)}</span>
      {hasDiscount && originalPrice && discountPercent > 0 && (
        <>
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
          <Badge variant="error">Save {discountPercent}%</Badge>
        </>
      )}
    </div>
  );
}

