import { Suspense } from 'react';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import ProductFilters from '@/components/products/product-filters';
import ProductsClient from '@/components/products/products-client';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 0; // Disable caching for dynamic filtering
export const dynamic = 'force-dynamic'; // Force dynamic rendering

interface ProductsPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sort?: string;
    page?: string;
    lang?: string;
  };
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1', 10);
  const filters: any = {
    page,
    per_page: 20,
    lang: searchParams.lang || 'en',
  };

  // Add filters only if they exist
  if (searchParams.category) filters.category = searchParams.category;
  if (searchParams.brand) filters.brand = searchParams.brand;
  if (searchParams.min_price) filters.min_price = parseInt(searchParams.min_price, 10);
  if (searchParams.max_price) filters.max_price = parseInt(searchParams.max_price, 10);
  if (searchParams.search) filters.search = searchParams.search;
  if (searchParams.sort) filters.sort = searchParams.sort;

  try {
    const response = await productsApi.list(filters);
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 } };
  }
}

async function getCategories() {
  try {
    const response = await categoriesApi.list('en');
    return response.data || [];
  } catch (error) {
    return [];
  }
}

async function getBrands() {
  try {
    const response = await brandsApi.list('en');
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [productsData, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="container-wide py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">Browse our complete product catalog</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <ProductFilters categories={categories} brands={brands} />
          </Suspense>
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
  );
}
