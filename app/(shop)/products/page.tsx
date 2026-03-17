import { Suspense } from 'react';
import ProductsClient from '@/components/products/products-client';
import LazyProductFilters from '@/components/products/lazy-product-filters';
import LazyMobileFilterSortBar from '@/components/products/lazy-mobile-filter-sort-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { mapProduct } from '@/lib/utils/mappers';

export const revalidate = 120; // Short ISR window; explicit revalidation still refreshes immediately after admin/sync writes

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    color?: string;
    storage?: string;
    ram?: string;
    search?: string;
    sort?: string;
    page?: string;
    lang?: string;
  }>;
}

type ProductsSearchParams = Awaited<ProductsPageProps['searchParams']>;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ujjwal.in';

async function getProducts(searchParams: ProductsSearchParams) {
  const page = parseInt(searchParams.page || '1', 10);
  const lang = searchParams.lang || 'en';
  const params = new URLSearchParams({
    page: String(page),
    limit: '20',
    lang,
    include_filters: '0',
  });

  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.brand) params.set('brand', searchParams.brand);
  if (searchParams.min_price) params.set('min_price', searchParams.min_price);
  if (searchParams.max_price) params.set('max_price', searchParams.max_price);
  if (searchParams.color) params.set('color', searchParams.color);
  if (searchParams.storage) params.set('storage', searchParams.storage);
  if (searchParams.ram) params.set('ram', searchParams.ram);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.sort) params.set('sort', searchParams.sort);

  try {
    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      next: {
        revalidate,
        tags: ['products', `products:lang:${lang}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Products fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data?.products) ? payload.data.products.map(mapProduct) : [];
    const pagination = payload?.data?.pagination || {};

    return {
      data: products,
      meta: {
        current_page: pagination.page || page,
        last_page: pagination.pages || 1,
        per_page: pagination.limit || 20,
        total: pagination.total || products.length,
      },
    };
  } catch (error) {
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 } };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || 'en';
  const productsData = await getProducts(resolvedSearchParams);

  return (
    <>
      <div className="container-wide py-8 pb-24 lg:pb-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete product catalog</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <LazyProductFilters lang={lang} />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ProductsClient
                initialProducts={productsData.data || []}
                initialMeta={productsData.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 }}
              />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Mobile Filter/Sort Bar - Only visible on mobile/tablet */}
      <LazyMobileFilterSortBar lang={lang} />
    </>
  );
}
