'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/products/product-card';

interface RelatedProductsClientProps {
  categoryId: number;
  excludeId: number;
  lang?: string;
}

export default function RelatedProductsClient({ categoryId, excludeId, lang = 'en' }: RelatedProductsClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;

    productsApi
      .list({
        category: String(categoryId),
        per_page: 4,
        lang,
        include_total: 0,
        include_filters: 0,
      })
      .then((response) => {
        if (!mounted) {
          return;
        }
        const items = Array.isArray(response.data) ? response.data : [];
        setRelatedProducts(items.filter((item) => item.id !== excludeId).slice(0, 4));
      })
      .catch(() => {
        if (mounted) {
          setRelatedProducts([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [categoryId, excludeId, lang]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </section>
  );
}
