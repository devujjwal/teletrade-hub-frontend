'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { FilterOptions } from '@/types/product';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';

interface MobileFiltersProps {
  categories: Category[];
  brands: Brand[];
  filterOptions?: FilterOptions;
  onClose: () => void;
}

export default function MobileFilters({
  categories = [],
  brands = [],
  filterOptions,
  onClose,
}: MobileFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriesList = Array.isArray(categories) ? categories : [];
  const brandsList = Array.isArray(brands) ? brands : [];
  
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
    params.set('page', '1');
    
    const lang = searchParams.get('lang');
    if (lang && lang !== 'en') {
      params.set('lang', lang);
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const lang = searchParams.get('lang');
    const url = lang && lang !== 'en' ? `/products?lang=${lang}` : '/products';
    router.push(url, { scroll: false });
  };

  const applyAndClose = () => {
    onClose();
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">FILTERS</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-red-500 font-medium text-sm hover:text-red-600 transition-colors"
          >
            CLEAR ALL
          </button>
        )}
        {!hasActiveFilters && <div className="w-20" />}
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        {categoriesList.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CATEGORY</h3>
              <div className="space-y-3">
                {categoriesList.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeCategory === category.slug}
                      onChange={(e) =>
                        updateFilter('category', e.target.checked ? category.slug : null)
                      }
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-base text-gray-900">
                      {category.name}
                      {category.products_count !== undefined && (
                        <span className="text-gray-500 ml-1">({category.products_count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Brands */}
        {brandsList.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">BRAND</h3>
              <div className="space-y-3">
                {brandsList.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeBrand === brand.slug}
                      onChange={(e) =>
                        updateFilter('brand', e.target.checked ? brand.slug : null)
                      }
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-base text-gray-900">
                      {brand.name}
                      {brand.products_count !== undefined && (
                        <span className="text-gray-500 ml-1">({brand.products_count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">PRICE RANGE</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) => updateFilter('min_price', e.target.value || null)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) => updateFilter('max_price', e.target.value || null)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">COLOR</h3>
              <div className="space-y-3">
                {colors.map((color) => (
                  <label
                    key={color}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="color"
                      checked={activeColor === color}
                      onChange={() => updateFilter('color', activeColor === color ? null : color)}
                      className="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-base text-gray-900 capitalize">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Storage */}
        {storageOptions.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">STORAGE</h3>
              <div className="space-y-3">
                {storageOptions.map((storage) => (
                  <label
                    key={storage}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="storage"
                      checked={activeStorage === storage}
                      onChange={() => updateFilter('storage', activeStorage === storage ? null : storage)}
                      className="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-base text-gray-900">{storage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RAM */}
        {ramOptions.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">RAM</h3>
              <div className="space-y-3">
                {ramOptions.map((ram) => (
                  <label
                    key={ram}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="ram"
                      checked={activeRam === ram}
                      onChange={() => updateFilter('ram', activeRam === ram ? null : ram)}
                      className="w-5 h-5 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-base text-gray-900">{ram}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 px-4 py-4 bg-white grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-12 text-base font-medium"
        >
          CLOSE
        </Button>
        <Button
          onClick={applyAndClose}
          className="h-12 text-base font-medium bg-primary hover:bg-primary/90"
        >
          APPLY
        </Button>
      </div>
    </div>
  );
}
