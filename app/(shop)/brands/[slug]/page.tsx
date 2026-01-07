import { notFound } from 'next/navigation';
import { brandsApi } from '@/lib/api/brands';
import { productsApi } from '@/lib/api/products';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { categoriesApi } from '@/lib/api/categories';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 300;

interface BrandPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    lang?: string;
  };
}

async function getBrand(slug: string, lang?: string) {
  try {
    const brand = await brandsApi.getBySlug(slug, lang);
    return brand;
  } catch (error: any) {
    console.error('Error fetching brand:', error);
    // If brand not found, return null to trigger 404
    if (error.message === 'Brand not found' || error.response?.status === 404) {
      return null;
    }
    // For other errors, still return null to show 404
    return null;
  }
}

async function getProducts(slug: string, searchParams: BrandPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1', 10);
  try {
    return await brandsApi.getProducts(slug, {
      page,
      per_page: 20,
      sort: searchParams.sort,
      lang: searchParams.lang || 'en',
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 } };
  }
}

async function getCategories() {
  try {
    const response = await categoriesApi.list('en');
    return response.data;
  } catch (error) {
    return [];
  }
}

async function getBrands() {
  try {
    const response = await brandsApi.list('en');
    return response.data;
  } catch (error) {
    return [];
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const [brand, productsData, categories, brands] = await Promise.all([
    getBrand(params.slug, searchParams.lang),
    getProducts(params.slug, searchParams),
    getCategories(),
    getBrands(),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div className="container-wide py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{brand.name}</h1>
        {brand.description && (
          <p className="text-muted-foreground">{brand.description}</p>
        )}
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
            <ProductGrid
              products={productsData.data || []}
              meta={productsData.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 }}
              searchParams={{ ...searchParams, brand: params.slug }}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

