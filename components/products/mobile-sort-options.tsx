'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

interface MobileSortOptionsProps {
  onClose: () => void;
}

const sortOptions = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
];

export default function MobileSortOptions({ onClose }: MobileSortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || '';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    
    // Preserve language parameter
    const lang = searchParams.get('lang');
    if (lang && lang !== 'en') {
      params.set('lang', lang);
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Sort By</h2>
      </div>

      {/* Sort Options */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                currentSort === option.value ? 'bg-gray-50' : ''
              }`}
            >
              <span className={`text-base ${
                currentSort === option.value ? 'font-semibold text-primary' : 'text-gray-900'
              }`}>
                {option.label}
              </span>
              {currentSort === option.value && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
