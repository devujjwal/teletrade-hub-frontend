'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import Button from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);
  const { token, user } = useAuthStore();
  const { t } = useLanguage();

  const isInStock = product.availability === 'in_stock' || product.availability === 'pre_order';
  
  // Get current cart item - subscribe to items array for reactivity
  const cartItem = items.find((item) => item.product_id === product.id);
  const currentCartQuantity = cartItem?.quantity || 0;
  
  // Local quantity state for the selector
  const [quantity, setQuantity] = useState(1);
  
  // Update local quantity when cart changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);
  
  // Calculate available stock
  const availableStock = product.stock_quantity - currentCartQuantity;
  const maxQuantity = cartItem ? product.stock_quantity : availableStock;

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!token || !user) {
      router.push('/login');
      return;
    }
    
    if (!isInStock) {
      return;
    }

    if (cartItem) {
      // Update existing cart item
      updateQuantity(product.id, quantity);
    } else {
      // Add new item to cart
      addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.primary_image,
        price: product.price,
        quantity,
        sku: product.sku,
        slug: product.slug,
        stock_quantity: product.stock_quantity,
      });
    }
  };

  // If not logged in, show login prompt
  if (!token || !user) {
    return (
      <Button
        onClick={() => router.push('/login')}
        size="lg"
        className="w-full"
        variant="outline"
      >
        <Lock className="w-5 h-5 mr-2" />
        {t('products.loginToBuy')}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector - Only show for in-stock products */}
      {isInStock && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">{t('cart.quantity')}:</label>
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(cartItem ? 1 : 1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              type="button"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {cartItem ? (
            <span className="text-xs text-muted-foreground">
              {availableStock} more available
            </span>
          ) : (
            product.stock_quantity > 0 && (
              <span className="text-xs text-muted-foreground">
                {product.stock_quantity} available
              </span>
            )
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!isInStock || (cartItem && quantity === currentCartQuantity)}
        size="lg"
        className="w-full btn-shop"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {!isInStock 
          ? t('products.outOfStock') 
          : cartItem 
            ? 'Update Cart' 
            : t('products.addToCart')}
      </Button>
    </div>
  );
}
