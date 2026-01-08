'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { FilterOptions } from '@/types/product';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  filterOptions?: FilterOptions;
}

export default function ProductFilters({ categories = [], brands = [], filterOptions }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ensure categories and brands are arrays
  const categoriesList = Array.isArray(categories) ? categories : [];
  const brandsList = Array.isArray(brands) ? brands : [];
  
  // Extract filter options
  const colors = filterOptions?.colors || [];
  const storageOptions = filterOptions?.storage || [];
  const ramOptions = filterOptions?.ram || [];

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page
    // Preserve language parameter
    const lang = searchParams.get('lang');
    if (lang && lang !== 'en') {
      params.set('lang', lang);
    }
    // Use push to ensure navigation triggers re-render
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const lang = searchParams.get('lang');
    const url = lang && lang !== 'en' ? `/products?lang=${lang}` : '/products';
    router.push(url, { scroll: false });
  };

  const activeCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');
  const activeColor = searchParams.get('color');
  const activeStorage = searchParams.get('storage');
  const activeRam = searchParams.get('ram');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const hasActiveFilters = activeCategory || activeBrand || activeColor || activeStorage || activeRam || minPrice || maxPrice;

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

      {/* Color Filter */}
      {colors.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Color</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => updateFilter('color', activeColor === color ? null : color)}
              >
                <input
                  type="radio"
                  name="color"
                  checked={activeColor === color}
                  onChange={() => {}} // Handled by label onClick
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm capitalize">{color}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Storage Filter */}
      {storageOptions.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Storage</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {storageOptions.map((storage) => (
              <label
                key={storage}
                className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => updateFilter('storage', activeStorage === storage ? null : storage)}
              >
                <input
                  type="radio"
                  name="storage"
                  checked={activeStorage === storage}
                  onChange={() => {}} // Handled by label onClick
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm">{storage}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* RAM Filter */}
      {ramOptions.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">RAM</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {ramOptions.map((ram) => (
              <label
                key={ram}
                className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => updateFilter('ram', activeRam === ram ? null : ram)}
              >
                <input
                  type="radio"
                  name="ram"
                  checked={activeRam === ram}
                  onChange={() => {}} // Handled by label onClick
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm">{ram}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

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
