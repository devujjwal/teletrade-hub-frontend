import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';
import ProductGallery from '@/components/products/product-gallery';
import AddToCartButton from '@/components/products/add-to-cart-button';
import RelatedProductsClient from '@/components/products/related-products-client';
import { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import ProductPriceSection from '@/components/products/product-price-section';
import ProductSpecsBadges from '@/components/products/product-specs-badges';
import ProductSpecifications from '@/components/products/product-specifications';
import ProductTrustBadges from '@/components/products/product-trust-badges';
import { mapProduct } from '@/lib/utils/mappers';

export const revalidate = 300; // Revalidate every 5 minutes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ujjwal.in';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

type ProductSearchParams = Awaited<ProductPageProps['searchParams']>;
type ProductRouteParams = Awaited<ProductPageProps['params']>;

const getProduct = cache(async (slug: string, lang?: string) => {
  try {
    const params = new URLSearchParams();
    params.set('lang', lang || 'en');

    const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}?${params.toString()}`, {
      next: {
        revalidate,
        tags: ['products', `product:slug:${slug}`],
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const rawProduct = payload?.data?.product;
    if (!rawProduct) {
      return null;
    }

    return mapProduct(rawProduct);
  } catch (error) {
    // SECURITY: Only log errors in development to prevent information disclosure
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error);
    }
    return null;
  }
});

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams: ProductRouteParams = await params;
  const resolvedSearchParams = await searchParams;
  const product = await getProduct(resolvedParams.slug, resolvedSearchParams.lang);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | TeleTrade Hub`,
    description: product.meta_description || product.description || `Buy ${product.name} at TeleTrade Hub`,
    openGraph: {
      title: product.name,
      description: product.meta_description || product.description,
      images: product.primary_image ? [{ url: product.primary_image }] : [],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const resolvedParams: ProductRouteParams = await params;
  const resolvedSearchParams: ProductSearchParams = await searchParams;
  const product = await getProduct(resolvedParams.slug, resolvedSearchParams.lang);

  if (!product) {
    notFound();
  }

  const originalPrice = Number(product.original_price) || 0;
  const price = Number(product.price) || 0;
  const liveStock = product.available_quantity ?? product.stock_quantity;
  const hasDiscount = originalPrice > 0 && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        {product.category_slug && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/categories/${product.category_slug}`} className="hover:text-foreground">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div>
          <ProductGallery
            primaryImage={product.primary_image}
            images={product.images || []}
            productName={product.name}
            isFeatured={product.is_featured === 1}
            discountPercent={discountPercent}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          {product.brand_name && (
            <Link
              href={`/brands/${product.brand_slug || product.brand_id}`}
              className="text-primary font-medium hover:underline inline-block"
            >
              {product.brand_name}
            </Link>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>

          {/* SKU */}
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>

          {/* Price */}
          <ProductPriceSection
            slug={product.slug}
            price={price}
            originalPrice={originalPrice}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
          />

          {/* Stock Status */}
          <div>
            {product.availability === 'in_stock' ? (
              liveStock <= 5 && liveStock > 0 ? (
                <span className="badge-warning">
                  Only {liveStock} left in stock
                </span>
              ) : liveStock > 0 ? (
                <span className="badge-success">In Stock</span>
              ) : (
                <span className="badge-destructive">Out of Stock</span>
              )
            ) : product.availability === 'pre_order' ? (
              <span className="badge-info">Pre-Order</span>
            ) : (
              <span className="badge-destructive">Out of Stock</span>
            )}
          </div>

          {/* Specs Badges (Color, Storage, RAM, Warranty) */}
          <ProductSpecsBadges product={product} />

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Trust Badges */}
          <ProductTrustBadges />

          {/* Description */}
          {product.description && (
            <div className="pt-6 border-t border-border">
              <h2 className="font-semibold text-lg mb-3">Description</h2>
              {/* SECURITY: React automatically escapes HTML, but we ensure safe rendering */}
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Specifications - Full Width Below Grid */}
      <div className="mt-12">
        <ProductSpecifications product={product} />
      </div>

      {/* Related Products */}
      {product.category_id ? (
        <RelatedProductsClient
          categoryId={product.category_id}
          excludeId={product.id}
          lang={resolvedSearchParams.lang || 'en'}
        />
      ) : null}
    </div>
  );
}
