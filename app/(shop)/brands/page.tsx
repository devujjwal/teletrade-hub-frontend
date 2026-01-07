import Link from 'next/link';
import { brandsApi } from '@/lib/api/brands';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Image from 'next/image';
import Card from '@/components/ui/card';

export const revalidate = 300;

async function getBrands() {
  try {
    const response = await brandsApi.list('en');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container-wide py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">All Brands</h1>
        <p className="text-muted-foreground">Explore products from top brands</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.slug}`}>
            <Card className="group p-6 hover:shadow-lg transition-all border-border hover:border-primary text-center">
              {brand.logo ? (
                <div className="relative w-full h-24 mb-4 flex items-center justify-center">
                  <Image
                    src={getProxiedImageUrl(brand.logo)}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
              ) : (
                <div className="w-full h-24 mb-4 flex items-center justify-center">
                  <span className="font-semibold text-lg text-muted-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              {brand.products_count !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {brand.products_count} products
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No brands available</p>
        </div>
      )}
    </div>
  );
}

