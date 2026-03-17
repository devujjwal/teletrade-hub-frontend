import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import HomePageClient from '@/components/home/home-page-client';

export const revalidate = 300; // Revalidate every 5 minutes

interface HomePageProps {
  searchParams: Promise<{
    lang?: string;
  }>;
}

async function getFeaturedProducts(lang: string = 'en') {
  try {
    const response = await productsApi.list({ 
      per_page: 8, 
      lang,
      is_featured: 1, // Filter to only show featured products
      include_total: 0,
      include_filters: 0,
    });
    return Array.isArray(response.data) ? response.data.slice(0, 8) : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories(lang: string = 'en') {
  try {
    const response = await categoriesApi.list(lang);
    return Array.isArray(response.data) ? response.data.slice(0, 6) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBrands(lang: string = 'en') {
  try {
    const response = await brandsApi.list(lang);
    return Array.isArray(response.data) ? response.data.slice(0, 8) : [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || 'en';
  const [featuredProducts, categories, brands] = await Promise.all([
    getFeaturedProducts(lang),
    getCategories(lang),
    getBrands(lang),
  ]);

  return (
    <HomePageClient 
      featuredProducts={featuredProducts}
      categories={categories}
      brands={brands}
    />
  );
}
