'use client';

import { Product } from '@/types/product';
import { useLanguage } from '@/contexts/language-context';

interface ProductSpecsBadgesProps {
  product: Product;
}

export default function ProductSpecsBadges({ product }: ProductSpecsBadgesProps) {
  const { t, language } = useLanguage();
  
  const specs: Array<{ label: string; value: string }> = [];
  
  // Get color from specifications with language fallback
  const colorTranslations = product.specifications?.color_translations as Record<string, string> | undefined;
  const color = colorTranslations?.[language] ||
                colorTranslations?.en ||
                product.specifications?.color ||
                null;
  
  // Get storage from specifications
  const storage = product.specifications?.prod_storage || 
                  product.specifications?.storage ||
                  null;
  
  // Get RAM from specifications
  const ram = product.specifications?.prod_memory || 
              product.specifications?.ram ||
              null;
  
  // Get warranty - prioritize warranty_months, format as "12 Months Warranty"
  let warranty: string | null = null;
  if (product.warranty_months) {
    const months = product.warranty_months;
    const monthLabel = months === 1 ? t('products.month') || 'Month' : t('products.months') || 'Months';
    warranty = `${months} ${monthLabel} ${t('products.warranty') || 'Warranty'}`;
  } else if (product.warranty || product.specifications?.warranty) {
    warranty = product.warranty || product.specifications?.warranty || null;
    if (warranty && typeof warranty === 'string') {
      // If warranty is like "12 months" or "12 month", keep it as is
      // If it's just a number, add "months"
      if (/^\d+$/.test(warranty.trim())) {
        warranty = `${warranty} ${t('products.months')}`;
      }
    }
  }
  
  if (color) {
    specs.push({ label: t('products.color'), value: color });
  }
  
  if (storage) {
    specs.push({ label: t('products.storage'), value: storage });
  }
  
  if (ram) {
    specs.push({ label: t('products.ram'), value: ram });
  }
  
  if (warranty) {
    specs.push({ label: t('products.warranty'), value: warranty });
  }
  
  if (specs.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {specs.map((spec, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/20 text-secondary-foreground border border-secondary/30"
        >
          {spec.value}
        </span>
      ))}
    </div>
  );
}

