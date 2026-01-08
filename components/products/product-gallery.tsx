'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProxiedImageUrl } from '@/lib/utils/format';
import Button from '@/components/ui/button';

interface ProductGalleryProps {
  primaryImage?: string;
  images?: string[];
  productName: string;
  isFeatured?: boolean;
  discountPercent?: number;
}

export default function ProductGallery({
  primaryImage,
  images = [],
  productName,
  isFeatured,
  discountPercent,
}: ProductGalleryProps) {
  // Normalize images array - extract image_url if objects, filter out empty/null values
  const normalizedImages = images
    .map((img: any) => (typeof img === 'string' ? img : img?.image_url))
    .filter((url: string | undefined): url is string => Boolean(url && url.trim()));
  
  // Combine primary image with other images, removing duplicates
  const allImages: string[] = [];
  if (primaryImage) {
    allImages.push(primaryImage);
  }
  // Add other images that aren't duplicates of primary_image
  normalizedImages.forEach((img) => {
    if (img !== primaryImage && !allImages.includes(img)) {
      allImages.push(img);
    }
  });
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const hasMultipleImages = allImages.length > 1;

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-square bg-muted rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  // If only one image, show it without carousel controls
  if (!hasMultipleImages) {
    return (
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
        <Image
          src={getProxiedImageUrl(allImages[0])}
          alt={productName}
          fill
          className="object-contain"
          priority
        />

        {/* Badges */}
        {isFeatured && (
          <span className="featured-badge">Featured</span>
        )}
        {discountPercent && discountPercent > 0 && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
        <Image
          src={getProxiedImageUrl(allImages[selectedImageIndex])}
          alt={productName}
          fill
          className="object-contain"
          priority
        />

        {/* Image Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full"
          onClick={prevImage}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full"
          onClick={nextImage}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Badges */}
        {isFeatured && (
          <span className="featured-badge">Featured</span>
        )}
        {discountPercent && discountPercent > 0 && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
              selectedImageIndex === index
                ? 'border-primary'
                : 'border-transparent hover:border-border'
            }`}
          >
            <Image
              src={getProxiedImageUrl(image)}
              alt={`${productName} ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
