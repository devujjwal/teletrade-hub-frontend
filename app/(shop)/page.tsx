import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { brandsApi } from '@/lib/api/brands';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProductCard from '@/components/products/product-card';
import { ArrowRight, ChevronRight, Smartphone, Tablet, Headphones, Watch, Cpu, Cable, Truck, Shield, CreditCard, Headset } from 'lucide-react';

export const revalidate = 300; // Revalidate every 5 minutes

const categoryIcons: Record<string, React.ReactNode> = {
  'Smartphones': <Smartphone className="w-8 h-8" />,
  'Tablets': <Tablet className="w-8 h-8" />,
  'Headphones': <Headphones className="w-8 h-8" />,
  'Smartwatches': <Watch className="w-8 h-8" />,
  'Accessories': <Cable className="w-8 h-8" />,
  'Components': <Cpu className="w-8 h-8" />,
};

async function getFeaturedProducts() {
  try {
    const response = await productsApi.list({ 
      per_page: 8, 
      lang: 'en',
      is_featured: 1 // Filter to only show featured products
    });
    return Array.isArray(response.data) ? response.data.slice(0, 8) : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await categoriesApi.list('en');
    return Array.isArray(response.data) ? response.data.slice(0, 6) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBrands() {
  try {
    const response = await brandsApi.list('en');
    return Array.isArray(response.data) ? response.data.slice(0, 8) : [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories, brands] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBrands(),
  ]);

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
              <span className="text-sm font-medium text-secondary">New Arrivals Available</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="block">Premium Electronics</span>
              <span className="block text-secondary">& Telecommunications</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Discover the latest smartphones, tablets, and cutting-edge technology
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-lg shadow-secondary/25" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground font-semibold text-base" asChild>
                <Link href="/categories">
                  Browse Categories
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-8 justify-center text-primary-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-secondary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Headset className="w-5 h-5 text-secondary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-wide py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Find exactly what you're looking for</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/categories">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                {categoryIcons[category.name] || <Smartphone className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.products_count || 0} products
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
              <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Top picks from our collection</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/products">
                View All Products
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
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Button asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="container-wide py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Shop by Brand</h2>
            <p className="text-muted-foreground mt-1">Explore products from top brands</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/brands">
              View All Brands
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-16 bg-card border border-border rounded-lg flex items-center justify-center group-hover:border-primary transition-colors">
                {brand.logo ? (
                  <Image
                    src={getProxiedImageUrl(brand.logo)}
                    alt={brand.name}
                    width={96}
                    height={48}
                    className="max-w-24 max-h-12 object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <span className="font-semibold text-muted-foreground group-hover:text-primary">
                    {brand.name}
                  </span>
                )}
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
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-primary-foreground/80">Products Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-primary-foreground/80">Top Brands</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-primary-foreground/80">Customer Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-primary-foreground/80">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-wide py-20">
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center border border-border">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Ready to upgrade your tech?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Browse our extensive collection of premium telecommunication products
            from the world's leading brands.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
