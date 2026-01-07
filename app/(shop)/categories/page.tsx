import Link from 'next/link';
import { categoriesApi } from '@/lib/api/categories';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import Card from '@/components/ui/card';
import { Smartphone, Tablet, Headphones, Watch, Cpu, Cable } from 'lucide-react';

export const revalidate = 300;

const categoryIcons: Record<string, React.ReactNode> = {
  'Smartphones': <Smartphone className="w-12 h-12" />,
  'Tablets': <Tablet className="w-12 h-12" />,
  'Headphones': <Headphones className="w-12 h-12" />,
  'Smartwatches': <Watch className="w-12 h-12" />,
  'Accessories': <Cable className="w-12 h-12" />,
  'Components': <Cpu className="w-12 h-12" />,
};

async function getCategories() {
  try {
    const response = await categoriesApi.list('en');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-wide py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">All Categories</h1>
        <p className="text-muted-foreground">Browse products by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="group p-6 hover:shadow-lg transition-all border-border hover:border-primary">
              <div className="flex flex-col items-center text-center">
                {category.image ? (
                  <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={getProxiedImageUrl(category.image)}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mb-4 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    {categoryIcons[category.name] || <Smartphone className="w-12 h-12" />}
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}
                {category.products_count !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {category.products_count} products
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories available</p>
        </div>
      )}
    </div>
  );
}

