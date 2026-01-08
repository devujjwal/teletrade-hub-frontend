'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import LanguageSelector from '@/components/layout/language-selector';
import { useLanguage } from '@/contexts/language-context';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, logout, isAdmin } = useAuthStore();
  const { t, language } = useLanguage();

  // Prevent hydration mismatch by only rendering cart badge after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // SECURITY: Use encodeURIComponent to prevent XSS in URL parameters
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const langParam = language && language !== 'en' ? `&lang=${language}` : '';
      // Use Next.js router for better security and performance
      router.push(`/products?search=${encodedQuery}${langParam}`);
    }
  };

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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TT</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">TeleTrade Hub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
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
              onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                    <Link href="/account">{t('account.title')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">{t('nav.myOrders')}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>{t('nav.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {isMounted && itemCount > 0 && (
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
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  {!user && (
                    <>
                      <Link href="/login" className="text-lg font-medium py-2">
                        {t('nav.login')}
                      </Link>
                      <Link href="/register" className="text-lg font-medium py-2">
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
              href={link.href}
              className="nav-link text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Search - Expandable */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full text-base"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
