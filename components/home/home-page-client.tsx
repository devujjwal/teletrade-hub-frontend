'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProductCard from '@/components/products/product-card';
import BrandLogo from '@/components/ui/brand-logo';
import { ArrowRight, ChevronRight, Truck, Shield, CreditCard, Headset, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { productsApi } from '@/lib/api/products';

interface HomePageClientProps {
  featuredProducts: Product[];
  categories: Category[];
  brands: Brand[];
  categoryIcons: Record<string, React.ReactNode>;
}

export default function HomePageClient({ 
  featuredProducts, 
  categories, 
  brands,
  categoryIcons 
}: HomePageClientProps) {
  const { t, language } = useLanguage();
  const langParam = language && language !== 'en' ? `?lang=${language}` : '';
  const [totalProducts, setTotalProducts] = useState(100);

  useEffect(() => {
    // Fetch total product count for stats
    productsApi.list({ page: 1, per_page: 1 }).then(response => {
      setTotalProducts(response.meta?.total || 100);
    }).catch(() => {
      // Keep default if fetch fails
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary min-h-[500px] md:min-h-[550px]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px]" />
        </div>

        <div className="container-wide relative z-10 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30 mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary">{t('hero.newArrivals') || 'New Arrivals Available'}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="block">{t('hero.title').split(' ').slice(0, 2).join(' ')}</span>
              <span className="block text-secondary">{t('hero.title').split(' ').slice(2).join(' ') || t('hero.title').split(' ')[2] || ''}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-lg shadow-secondary/25" asChild>
                <Link href={`/products${langParam}`}>
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground font-semibold text-base" asChild>
                <Link href={`/categories${langParam}`}>
                  {t('hero.secondary')}
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-8 justify-center text-primary-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-secondary" />
                <span>{t('hero.freeShipping') || 'Free Shipping'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                <span>{t('hero.warranty') || '2 Year Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                <span>{t('hero.securePayment') || 'Secure Payment'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headset className="w-5 h-5 text-secondary" />
                <span>{t('hero.support') || '24/7 Support'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-wide py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t('categories.shopBy')}</h2>
            <p className="text-muted-foreground mt-1">{t('categories.subtitle') || 'Find exactly what you\'re looking for'}</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href={`/categories${langParam}`}>
              {t('common.viewAll') || 'View All'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}${langParam}`}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                {categoryIcons[category.name] || <Smartphone className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.products_count || 0} {t('categories.productsCount')}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted/50 py-16">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">{t('products.featured')}</h2>
              <p className="text-muted-foreground mt-1">{t('products.featuredSubtitle') || 'Top picks from our collection'}</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href={`/products${langParam}`}>
                {t('products.viewAll') || 'View All Products'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('products.noProducts')}</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Button asChild>
              <Link href={`/products${langParam}`}>{t('products.viewAll') || 'View All Products'}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="container-wide py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t('brands.shopBy')}</h2>
            <p className="text-muted-foreground mt-1">{t('brands.subtitle') || 'Explore products from top brands'}</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href={`/brands${langParam}`}>
              {t('brands.viewAll') || 'View All Brands'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}${langParam}`}
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-16 bg-card border border-border rounded-lg flex items-center justify-center group-hover:border-primary transition-colors px-2">
                <BrandLogo
                  brandName={brand.name}
                  height={60}
                  width={96}
                  className="max-w-24 max-h-12 object-contain transition-all font-semibold text-muted-foreground group-hover:text-primary"
                  showFallbackText={true}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{totalProducts}+</div>
              <p className="text-primary-foreground/80">{t('home.productsAvailable') || 'Products Available'}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{brands.length}+</div>
              <p className="text-primary-foreground/80">{t('home.topBrands') || 'Top Brands'}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-primary-foreground/80">{t('home.support') || 'Support Available'}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-primary-foreground/80">{t('home.authenticProducts') || 'Authentic Products'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-wide py-20">
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center border border-border">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            {t('home.ctaTitle') || 'Ready to upgrade your tech?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('home.ctaSubtitle') || 'Browse our extensive collection of premium telecommunication products from the world\'s leading brands.'}
          </p>
          <Button size="lg" asChild>
            <Link href={`/products${langParam}`}>
              {t('home.startShopping') || 'Start Shopping'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

