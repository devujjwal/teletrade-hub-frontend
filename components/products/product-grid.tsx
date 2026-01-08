'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import ProductCard from '@/components/products/product-card';
import Button from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface ProductGridProps {
  products: Product[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  searchParams: Record<string, string | undefined>;
}

export default function ProductGrid({ products = [], meta, searchParams }: ProductGridProps) {
  // Ensure products is an array
  const productsList = Array.isArray(products) ? products : [];
  
  // Default meta values
  const metaData = meta || {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: productsList.length,
  };
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  if (productsList.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms"
        icon={<ShoppingBagIcon className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort and Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {productsList.length} of {metaData.total} products
        </p>
        <select
          value={searchParams.sort || 'newest'}
          onChange={(e) => updateSort(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {metaData.last_page > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button
            variant="outline"
            disabled={metaData.current_page === 1}
            onClick={() => goToPage(metaData.current_page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {metaData.current_page} of {metaData.last_page}
          </span>
          <Button
            variant="outline"
            disabled={metaData.current_page === metaData.last_page}
            onClick={() => goToPage(metaData.current_page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
