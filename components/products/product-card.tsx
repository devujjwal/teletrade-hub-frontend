'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Lock } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { getProxiedImageUrl } from '@/lib/utils/format';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { token, user } = useAuthStore();

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.original_price) || 0;
  const isInStock = product.availability === 'in_stock' || product.availability === 'pre_order';
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const hasDiscount = originalPrice > 0 && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const imageUrl = product.primary_image || '/placeholder.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!token || !user) {
      toast.error('Please login to add items to cart');
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
      });
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error('Product is out of stock');
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

        {/* Specs */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem]">
            {specs.map((spec, index) => (
              <span key={index} className="badge-muted">{spec}</span>
            ))}
          </div>
        )}

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
                <span className="text-sm font-medium whitespace-nowrap">Login to view price</span>
              </div>
            )}
          </div>
          {/* Stock Status */}
          <div className="min-h-[1.25rem]">
            {isInStock ? (
              isLowStock ? (
                <span className="badge-warning inline-block">Low Stock</span>
              ) : (
                <span className="badge-success inline-block">In Stock</span>
              )
            ) : (
              <span className="badge-destructive inline-block">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button or Login Prompt */}
        {token && user ? (
          <Button
            className="w-full btn-shop"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
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
            Login to Purchase
          </Button>
        )}
      </div>
    </div>
  );
}

