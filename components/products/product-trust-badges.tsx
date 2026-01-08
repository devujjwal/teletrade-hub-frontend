'use client';

import { Truck, Shield, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function ProductTrustBadges() {
  const { t } = useLanguage();
  
  const badges = [
    {
      icon: Truck,
      label: t('products.fastDelivery') || 'Fast Delivery',
    },
    {
      icon: Shield,
      label: t('products.securePayment') || 'Secure Payment',
    },
    {
      icon: RotateCcw,
      label: t('products.easyReturns') || 'Easy Returns',
    },
  ];
  
  return (
    <div className="flex items-center justify-between gap-6 pt-6 border-t border-border bg-muted/30 rounded-lg p-4">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-center">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}

