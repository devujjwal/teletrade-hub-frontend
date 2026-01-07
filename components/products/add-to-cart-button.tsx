'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/cart-store';
import Button from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const isInStock = product.availability === 'in_stock' || product.availability === 'pre_order';
  const maxQuantity = product.stock_quantity || 999;

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_image: product.primary_image,
      price: product.price,
      quantity,
      sku: product.sku,
    });

    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Quantity:</label>
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            type="button"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-16 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {product.stock_quantity && product.stock_quantity > 0 && (
          <span className="text-xs text-muted-foreground">
            {product.stock_quantity} available
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!isInStock}
        size="lg"
        className="w-full btn-shop"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </div>
  );
}
