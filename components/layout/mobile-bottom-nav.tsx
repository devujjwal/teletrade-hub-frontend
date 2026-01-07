'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, ShoppingBag, Search, User, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { cn } from '@/lib/utils/cn';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  // Prevent hydration mismatch by only rendering badge after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/products?search=', label: 'Search', icon: Search },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: isMounted ? itemCount : 0 },
    { href: '/account', label: 'Account', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'mobile-nav-item',
              active && 'mobile-nav-item-active'
            )}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

