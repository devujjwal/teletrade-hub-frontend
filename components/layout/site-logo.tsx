import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface SiteLogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  background?: 'light' | 'dark';
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function SiteLogo({
  href = '/',
  className,
  imageClassName,
  background = 'light',
  width = 420,
  height = 120,
  priority = false,
}: SiteLogoProps) {
  const src = background === 'dark'
    ? '/branding/site-logo-dark.png'
    : '/branding/site-logo-light.png';

  return (
    <Link href={href} className={cn('inline-flex items-center', className)} aria-label="Telecommunication Trading e.K.">
      <Image
        src={src}
        alt="Telecommunication Trading e.K."
        width={width}
        height={height}
        priority={priority}
        className={cn('h-auto w-auto max-w-full', imageClassName)}
      />
    </Link>
  );
}
