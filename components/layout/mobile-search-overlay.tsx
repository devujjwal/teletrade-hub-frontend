'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const langParam = language && language !== 'en' ? `&lang=${language}` : '';
      router.push(`/products?search=${encodedQuery}${langParam}`);
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const overlayContent = (
    <div 
      className="fixed inset-0 flex flex-col bg-white lg:hidden" 
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Search Products</h1>
        <button
          onClick={onClose}
          className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-4 bg-white flex-shrink-0">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.search') || 'Search products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-14 py-4 bg-white border-2 border-gray-900 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {/* Search Submit Icon */}
            {searchQuery.trim() && (
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Empty State */}
        {!searchQuery.trim() && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Search className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Search Products</h2>
            <p className="text-center text-gray-500 text-base">
              Start typing to search for products, brands, or categories
            </p>
          </div>
        )}

        {/* Search Results Placeholder - You can add search suggestions here */}
        {searchQuery.trim() && (
          <div className="px-4 py-2">
            <p className="text-sm text-gray-500 mb-3">
              Press Enter to search for "{searchQuery}"
            </p>
            {/* You can add search suggestions/recent searches here */}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
}
