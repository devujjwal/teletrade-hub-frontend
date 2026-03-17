'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import LanguageSelector from '@/components/layout/language-selector';
import MobileSearchOverlay from '@/components/layout/mobile-search-overlay';
import { useLanguage } from '@/contexts/language-context';
import { useHydrated } from '@/lib/hooks/use-hydrated';
import SiteLogo from '@/components/layout/site-logo';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/product';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRequestRef = useRef(0);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const isHydrated = useHydrated();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, logout, isAdmin } = useAuthStore();
  const { t, language } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // SECURITY: Use encodeURIComponent to prevent XSS in URL parameters
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const langParam = language && language !== 'en' ? `&lang=${language}` : '';
      // Use Next.js router for better security and performance
      router.push(`/products?search=${encodedQuery}${langParam}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const currentRequestId = ++searchRequestRef.current;
    const debounceTimer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await productsApi.list({
          search: query,
          page: 1,
          per_page: 6,
          include_total: 0,
          include_filters: 0,
          lang: language || 'en',
        });

        if (searchRequestRef.current !== currentRequestId) {
          return;
        }

        setSuggestions(Array.isArray(response.data) ? response.data.slice(0, 6) : []);
      } catch (error) {
        if (searchRequestRef.current !== currentRequestId) {
          return;
        }
        setSuggestions([]);
      } finally {
        if (searchRequestRef.current === currentRequestId) {
          setIsSearching(false);
        }
      }
    }, 280);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, language]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!searchContainerRef.current) {
        return;
      }
      if (!searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const langParam = language && language !== 'en' ? `?lang=${language}` : '';
  const navLinks = [
    { href: `/${langParam}`, label: t('nav.home') },
    { href: `/products${langParam}`, label: t('nav.products') },
    { href: `/categories${langParam}`, label: t('nav.categories') },
    { href: `/brands${langParam}`, label: t('nav.brands') },
  ];

  return (
    <header className="header-sticky">
      <div className="container-wide">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <SiteLogo
            href="/"
            background="light"
            width={410}
            height={120}
            imageClassName="h-11 sm:h-12 w-auto"
            priority
          />

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                className="pl-10 pr-4 w-full"
              />
              {showSuggestions && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((product) => {
                      const langParam = language && language !== 'en' ? `?lang=${language}` : '';
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}${langParam}`}
                          prefetch={false}
                          className="block px-3 py-2 hover:bg-muted transition-colors"
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                        >
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground">No products found</div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSelector />

            {/* Search Icon - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User Account - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user.first_name || user.name}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link prefetch={false} href="/account">{t('account.title')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link prefetch={false} href="/account/orders">{t('nav.myOrders')}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link prefetch={false} href="/admin/dashboard">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>{t('nav.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link prefetch={false} href="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link prefetch={false} href="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Link prefetch={false} href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {isHydrated && itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      prefetch={false}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  {!user && (
                    <>
                      <Link prefetch={false} href="/login" className="text-lg font-medium py-2">
                        {t('nav.login')}
                      </Link>
                      <Link prefetch={false} href="/register" className="text-lg font-medium py-2">
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              prefetch={false}
              href={link.href}
              className="nav-link text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </header>
  );
}
