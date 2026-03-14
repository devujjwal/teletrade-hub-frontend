import { notFound } from 'next/navigation';
import { brandsApi } from '@/lib/api/brands';
import { productsApi } from '@/lib/api/products';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { categoriesApi } from '@/lib/api/categories';
import BrandLogo from '@/components/ui/brand-logo';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 300;

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    lang?: string;
  }>;
}

type BrandSearchParams = Awaited<BrandPageProps['searchParams']>;
type BrandRouteParams = Awaited<BrandPageProps['params']>;

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

async function getProducts(slug: string, searchParams: BrandSearchParams) {
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
  const resolvedParams: BrandRouteParams = await params;
  const resolvedSearchParams = await searchParams;
  const [brand, productsData, categories, brands] = await Promise.all([
    getBrand(resolvedParams.slug, resolvedSearchParams.lang),
    getProducts(resolvedParams.slug, resolvedSearchParams),
    getCategories(),
    getBrands(),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div className="container-wide py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 flex items-center justify-center">
            <BrandLogo
              brandName={brand.name}
              height={80}
              width={120}
              className="max-w-full max-h-full object-contain"
              showFallbackText={false}
            />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{brand.name}</h1>
        </div>
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
              searchParams={{ ...resolvedSearchParams, brand: resolvedParams.slug }}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
