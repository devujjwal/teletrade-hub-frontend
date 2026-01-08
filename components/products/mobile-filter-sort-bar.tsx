'use client';

import { useState } from 'react';
import { ListFilter, ArrowUpDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { FilterOptions } from '@/types/product';
import MobileFilters from './mobile-filters';
import MobileSortOptions from './mobile-sort-options';

interface MobileFilterSortBarProps {
  categories: Category[];
  brands: Brand[];
  filterOptions?: FilterOptions;
}

export default function MobileFilterSortBar({
  categories,
  brands,
  filterOptions,
}: MobileFilterSortBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <>
      {/* Fixed Bottom Bar - Only visible on mobile/tablet, positioned above mobile nav */}
      <div 
        className="fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 76px)', zIndex: 49 }}
      >
        <div className="grid grid-cols-2 gap-0">
          {/* Sort Button */}
          <Sheet open={sortOpen} onOpenChange={setSortOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center gap-2 py-3.5 px-6 border-r border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <ArrowUpDown className="w-5 h-5" />
                <span className="font-medium">Sort</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <MobileSortOptions onClose={() => setSortOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Filter Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center gap-2 py-3.5 px-6 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <ListFilter className="w-5 h-5" />
                <span className="font-medium">Filter</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] p-0 overflow-hidden">
              <MobileFilters
                categories={categories}
                brands={brands}
                filterOptions={filterOptions}
                onClose={() => setFilterOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom padding spacer for fixed bar + mobile nav */}
      <div className="h-32 lg:hidden" />
    </>
  );
}
