'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export default function ProductFilters({ categories = [], brands = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ensure categories and brands are arrays
  const categoriesList = Array.isArray(categories) ? categories : [];
  const brandsList = Array.isArray(brands) ? brands : [];

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page
    // Use push to ensure navigation triggers re-render
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push('/products', { scroll: false });
  };

  const activeCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const hasActiveFilters = activeCategory || activeBrand || minPrice || maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Category</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categoriesList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories available</p>
          ) : (
            categoriesList.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                checked={activeCategory === category.slug}
                onChange={(e) =>
                  updateFilter('category', e.target.checked ? category.slug : null)
                }
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm">
                {category.name}
                {category.products_count !== undefined && (
                  <span className="text-muted-foreground ml-1">({category.products_count})</span>
                )}
              </span>
            </label>
            ))
          )}
        </div>
      </Card>

      {/* Brand Filter */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Brand</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {brandsList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No brands available</p>
          ) : (
            brandsList.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                checked={activeBrand === brand.slug}
                onChange={(e) =>
                  updateFilter('brand', e.target.checked ? brand.slug : null)
                }
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm">
                {brand.name}
                {brand.products_count !== undefined && (
                  <span className="text-muted-foreground ml-1">({brand.products_count})</span>
                )}
              </span>
            </label>
            ))
          )}
        </div>
      </Card>

      {/* Price Range */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
        <div className="space-y-3">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice || ''}
            onChange={(e) => updateFilter('min_price', e.target.value || null)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice || ''}
            onChange={(e) => updateFilter('max_price', e.target.value || null)}
            className="text-sm"
          />
        </div>
      </Card>
    </div>
  );
}
