'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Lock, Minus, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { getProxiedImageUrl } from '@/lib/utils/format';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);
  const { token, user } = useAuthStore();
  const { t } = useLanguage();

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.original_price) || 0;
  const isInStock = product.availability === 'in_stock' || product.availability === 'pre_order';
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const hasDiscount = originalPrice > 0 && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const imageUrl = product.primary_image || '/placeholder.svg';
  
  // Check if product is in cart - subscribe to items array for reactivity
  const cartItem = items.find((item) => item.product_id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!token || !user) {
      router.push('/login');
      return;
    }
    
    if (isInStock) {
      addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.primary_image,
        price: product.price,
        quantity: 1,
        sku: product.sku,
        slug: product.slug,
        stock_quantity: product.stock_quantity,
      });
    }
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity < product.stock_quantity) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  // Get specs from specifications object
  const specs: string[] = [];
  if (product.specifications) {
    if (product.specifications.storage) specs.push(product.specifications.storage);
    if (product.specifications.color) specs.push(product.specifications.color);
    if (product.specifications.ram) specs.push(product.specifications.ram);
  }

  return (
    <div className="product-card group relative">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden p-4 bg-white dark:bg-muted">
        <div className="aspect-square bg-white dark:bg-muted rounded-lg flex items-center justify-center p-4">
          <Image
            src={getProxiedImageUrl(imageUrl)}
            alt={product.name}
            width={300}
            height={300}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        {hasDiscount && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 mb-2">
          {product.brand_name && (
            <>
              <span className="text-xs text-muted-foreground">{product.brand_name}</span>
              {product.category_name && <span className="text-xs text-muted-foreground">•</span>}
            </>
          )}
          {product.category_name && (
            <span className="text-xs text-muted-foreground">{product.category_name}</span>
          )}
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-accent transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Specs - Always render to maintain consistent height */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem]">
          {specs.length > 0 ? (
            specs.map((spec, index) => (
              <span key={index} className="badge-muted">{spec}</span>
            ))
          ) : (
            <span className="invisible">placeholder</span>
          )}
        </div>

        {/* Price & Stock */}
        <div className="flex flex-col gap-2 mb-3">
          {/* Price Section */}
          <div className="min-h-[1.5rem]">
            {token && user ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="price-current">{formatPrice(price)}</span>
                {hasDiscount && (
                  <span className="price-original">{formatPrice(originalPrice)}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{t('products.loginToViewPrice')}</span>
              </div>
            )}
          </div>
          {/* Stock Status */}
          <div className="min-h-[1.25rem]">
            {isInStock ? (
              isLowStock ? (
                <span className="badge-warning inline-block">{t('products.lowStock')}</span>
              ) : (
                <span className="badge-success inline-block">{t('products.inStock')}</span>
              )
            ) : (
              <span className="badge-destructive inline-block">{t('products.outOfStock')}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button or Quantity Controls */}
        {token && user ? (
          isInCart ? (
            <div className="flex items-center justify-center border border-primary rounded-full overflow-hidden bg-primary/5">
              <button
                onClick={handleDecreaseQuantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary"
                type="button"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-primary px-2">
                {cartItem?.quantity || 0}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                disabled={cartItem && cartItem.quantity >= product.stock_quantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              className="w-full btn-shop"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('products.addToCart')}
            </Button>
          )
        ) : (
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push('/login');
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            {t('products.loginToBuy')}
          </Button>
        )}
      </div>
    </div>
  );
}

