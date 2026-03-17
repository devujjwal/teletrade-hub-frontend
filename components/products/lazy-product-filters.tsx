'use client';

import { useEffect, useState } from 'react';
import ProductFilters from '@/components/products/product-filters';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { productsApi } from '@/lib/api/products';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { FilterOptions } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyProductFiltersProps {
  lang: string;
}

export default function LazyProductFilters({ lang }: LazyProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFilters = async () => {
      try {
        const [categoriesResponse, brandsResponse, filtersResponse] = await Promise.all([
          categoriesApi.list(lang),
          brandsApi.list(lang),
          productsApi.list({
            page: 1,
            per_page: 1,
            lang,
            include_total: 0,
          }),
        ]);

        if (!mounted) {
          return;
        }

        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
        setBrands(Array.isArray(brandsResponse.data) ? brandsResponse.data : []);
        setFilterOptions(filtersResponse.filters);
      } catch (error) {
        if (!mounted) {
          return;
        }
        setCategories([]);
        setBrands([]);
        setFilterOptions(undefined);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFilters();

    return () => {
      mounted = false;
    };
  }, [lang]);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <ProductFilters
      categories={categories}
      brands={brands}
      filterOptions={filterOptions}
    />
  );
}
