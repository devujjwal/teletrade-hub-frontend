import { notFound } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import ProductGallery from '@/components/products/product-gallery';
import AddToCartButton from '@/components/products/add-to-cart-button';
import ProductCard from '@/components/products/product-card';
import { formatPrice } from '@/lib/utils/format';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import ProductPriceSection from '@/components/products/product-price-section';
import ProductSpecsBadges from '@/components/products/product-specs-badges';
import ProductSpecifications from '@/components/products/product-specifications';
import ProductTrustBadges from '@/components/products/product-trust-badges';

export const revalidate = 300; // Revalidate every 5 minutes

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    lang?: string;
  };
}

async function getProduct(slug: string, lang?: string) {
  try {
    return await productsApi.getBySlug(slug, lang);
  } catch (error) {
    // SECURITY: Only log errors in development to prevent information disclosure
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error);
    }
    return null;
  }
}

async function getRelatedProducts(categoryId: number, excludeId: number, lang?: string) {
  try {
    const response = await productsApi.list({
      category: categoryId.toString(),
      per_page: 4,
      lang: lang || 'en',
    });
    return response.data.filter((p) => p.id !== excludeId).slice(0, 4);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug, searchParams.lang);

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
  const product = await getProduct(params.slug, searchParams.lang);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id, searchParams.lang)
    : [];

  const originalPrice = Number(product.original_price) || 0;
  const price = Number(product.price) || 0;
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
            price={price}
            originalPrice={originalPrice}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
          />

          {/* Stock Status */}
          <div>
            {product.availability === 'in_stock' ? (
              product.stock_quantity <= 5 ? (
                <span className="badge-warning">
                  Only {product.stock_quantity} left in stock
                </span>
              ) : (
                <span className="badge-success">In Stock</span>
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
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-16 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
