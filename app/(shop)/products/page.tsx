import { Suspense } from 'react';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import ProductFilters from '@/components/products/product-filters';
import ProductsClient from '@/components/products/products-client';
import MobileFilterSortBar from '@/components/products/mobile-filter-sort-bar';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 0; // Disable caching for dynamic filtering
export const dynamic = 'force-dynamic'; // Force dynamic rendering

interface ProductsPageProps {
  searchParams: {
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
  };
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1', 10);
  const lang = searchParams.lang || 'en';
  const filters: any = {
    page,
    per_page: 20,
    lang,
  };

  // Add filters only if they exist
  if (searchParams.category) filters.category = searchParams.category;
  if (searchParams.brand) filters.brand = searchParams.brand;
  if (searchParams.min_price) filters.min_price = parseInt(searchParams.min_price, 10);
  if (searchParams.max_price) filters.max_price = parseInt(searchParams.max_price, 10);
  if (searchParams.color) filters.color = searchParams.color;
  if (searchParams.storage) filters.storage = searchParams.storage;
  if (searchParams.ram) filters.ram = searchParams.ram;
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

async function getCategories(lang: string = 'en') {
  try {
    const response = await categoriesApi.list(lang);
    return response.data || [];
  } catch (error) {
    return [];
  }
}

async function getBrands(lang: string = 'en') {
  try {
    const response = await brandsApi.list(lang);
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const lang = searchParams.lang || 'en';
  const [productsData, categories, brands] = await Promise.all([
    getProducts(searchParams),
    getCategories(lang),
    getBrands(lang),
  ]);

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
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <ProductFilters 
                categories={categories} 
                brands={brands} 
                filterOptions={productsData.filters}
              />
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

      {/* Mobile Filter/Sort Bar - Only visible on mobile/tablet */}
      <MobileFilterSortBar
        categories={categories}
        brands={brands}
        filterOptions={productsData.filters}
      />
    </>
  );
}
