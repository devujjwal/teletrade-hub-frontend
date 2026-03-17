'use client';

import { useEffect, useState } from 'react';
import MobileFilterSortBar from '@/components/products/mobile-filter-sort-bar';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { productsApi } from '@/lib/api/products';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { FilterOptions } from '@/types/product';

interface LazyMobileFilterSortBarProps {
  lang: string;
}

export default function LazyMobileFilterSortBar({ lang }: LazyMobileFilterSortBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | undefined>(undefined);

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
      }
    };

    loadFilters();

    return () => {
      mounted = false;
    };
  }, [lang]);

  return (
    <MobileFilterSortBar
      categories={categories}
      brands={brands}
      filterOptions={filterOptions}
    />
  );
}
