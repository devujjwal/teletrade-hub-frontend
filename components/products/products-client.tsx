'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/product';
import ProductGrid from '@/components/products/product-grid';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductsClientProps {
  initialProducts: Product[];
  initialMeta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ProductsClient({ initialProducts, initialMeta }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    // Skip fetch on initial mount since we already have initial data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const filters: any = {
          page,
          per_page: 20,
          lang: searchParams.get('lang') || 'en',
        };

        if (searchParams.get('category')) filters.category = searchParams.get('category');
        if (searchParams.get('brand')) filters.brand = searchParams.get('brand');
        if (searchParams.get('min_price')) filters.min_price = parseInt(searchParams.get('min_price')!, 10);
        if (searchParams.get('max_price')) filters.max_price = parseInt(searchParams.get('max_price')!, 10);
        if (searchParams.get('search')) filters.search = searchParams.get('search');
        if (searchParams.get('sort')) filters.sort = searchParams.get('sort');

        const response = await productsApi.list(filters);
        setProducts(response.data || []);
        setMeta((prev) => response.meta || prev);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParamsString, searchParams]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const searchParamsObj: Record<string, string | undefined> = {
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: searchParams.get('page') || undefined,
    lang: searchParams.get('lang') || undefined,
  };

  return (
    <ProductGrid
      products={products}
      meta={meta}
      searchParams={searchParamsObj}
    />
  );
}

