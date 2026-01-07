'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/store/cart-store';
import { useCartStore } from '@/lib/store/cart-store';
import { getProxiedImageUrl } from '@/lib/utils/format';
import { formatPrice } from '@/lib/utils/format';
import Badge from '@/components/ui/badge';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 p-4 bg-card rounded-xl border border-border">
      {/* Image */}
      <Link href={`/products/${item.product_id}`} className="flex-shrink-0">
        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
          {item.product_image ? (
            <Image
              src={getProxiedImageUrl(item.product_image)}
              alt={item.product_name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product_id}`}>
          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
            {item.product_name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          SKU: {item.sku}
        </p>
      </div>

      {/* Price & Quantity */}
      <div className="flex flex-col items-end gap-4">
        {/* Remove Button */}
        <button
          onClick={() => removeItem(item.product_id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quantity */}
        <div className="flex items-center border border-border rounded-lg">
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-lg font-bold">{formatPrice(item.price * item.quantity)}</p>
          {item.quantity > 1 && (
            <p className="text-xs text-muted-foreground">
              {formatPrice(item.price)} each
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
