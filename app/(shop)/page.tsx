import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProductCard from '@/components/products/product-card';
import HomePageClient from '@/components/home/home-page-client';
import { ArrowRight, ChevronRight, Smartphone, Tablet, Headphones, Watch, Cpu, Cable, Truck, Shield, CreditCard, Headset } from 'lucide-react';

export const revalidate = 0; // Disable caching to always show fresh data
export const dynamic = 'force-dynamic'; // Force dynamic rendering

const categoryIcons: Record<string, React.ReactNode> = {
  'Smartphones': <Smartphone className="w-8 h-8" />,
  'Tablets': <Tablet className="w-8 h-8" />,
  'Headphones': <Headphones className="w-8 h-8" />,
  'Smartwatches': <Watch className="w-8 h-8" />,
  'Accessories': <Cable className="w-8 h-8" />,
  'Components': <Cpu className="w-8 h-8" />,
};

interface HomePageProps {
  searchParams: {
    lang?: string;
  };
}

async function getFeaturedProducts(lang: string = 'en') {
  try {
    const response = await productsApi.list({ 
      per_page: 8, 
      lang,
      is_featured: 1 // Filter to only show featured products
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
  const lang = searchParams.lang || 'en';
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
      categoryIcons={categoryIcons}
    />
  );
}
