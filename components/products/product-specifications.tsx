'use client';

import { Product } from '@/types/product';
import { useLanguage } from '@/contexts/language-context';
import Card from '@/components/ui/card';

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const { t } = useLanguage();
  
  if (!product.specifications || Object.keys(product.specifications).length === 0) {
    return null;
  }
  
  // Map of specification keys to display labels
  const specLabels: Record<string, string> = {
    ean: 'EAN',
    warranty: t('products.warranty') || 'Warranty',
    full_name: 'Full Name',
    item_spec: 'Item Spec',
    prod_memory: t('products.ram') || 'RAM',
    prod_network: 'Network',
    prod_storage: t('products.storage') || 'Storage',
    manufacturers_warranty: t('products.warranty') || 'Warranty',
  };
  
  // Priority order for specifications
  const priorityOrder = ['ean', 'warranty', 'manufacturers_warranty', 'full_name', 'item_spec', 'prod_memory', 'prod_network', 'prod_storage'];
  
  // Get specifications in priority order, then others
  const specMap = new Map<string, string>();
  const otherSpecs: Array<[string, string]> = [];
  
  Object.entries(product.specifications).forEach(([key, value]) => {
    // Skip color_translations as it's handled separately
    if (key === 'color_translations' || key === 'color' || key === 'storage' || key === 'ram') {
      return;
    }
    
    const priorityIndex = priorityOrder.indexOf(key.toLowerCase());
    if (priorityIndex !== -1) {
      specMap.set(key, String(value));
    } else {
      otherSpecs.push([key, String(value)]);
    }
  });
  
  // Build ordered specs array
  const orderedSpecs: Array<[string, string]> = [];
  priorityOrder.forEach(key => {
    // Find matching key (case-insensitive)
    const matchingKey = Array.from(specMap.keys()).find(k => k.toLowerCase() === key);
    if (matchingKey) {
      orderedSpecs.push([matchingKey, specMap.get(matchingKey)!]);
      specMap.delete(matchingKey);
    }
  });
  
  // Combine ordered specs and other specs
  const allSpecs = [...orderedSpecs, ...otherSpecs];
  
  if (allSpecs.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-4">{t('products.specifications') || 'Specifications'}</h2>
      <dl className="space-y-0">
        {allSpecs.map(([key, value], index) => {
          const label = specLabels[key.toLowerCase()] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <div 
              key={key} 
              className={`flex justify-between py-3 ${index < allSpecs.length - 1 ? 'border-b border-border' : ''}`}
            >
              <dt className="font-medium text-foreground pr-4">{label}</dt>
              {/* SECURITY: React automatically escapes HTML in JSX, value is safe */}
              <dd className="text-muted-foreground text-right">{value}</dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}

