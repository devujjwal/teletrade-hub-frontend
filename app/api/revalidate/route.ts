import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface RevalidatePayload {
  secret?: string;
  homeChanged?: boolean;
  productsListingChanged?: boolean;
  revalidateAllProductPages?: boolean;
  revalidateAllCategoryPages?: boolean;
  revalidateAllBrandPages?: boolean;
  productSlugs?: string[];
  categorySlugs?: string[];
  brandSlugs?: string[];
}

const uniqueSlugs = (slugs: unknown): string[] => {
  if (!Array.isArray(slugs)) return [];

  const normalized = slugs
    .map((slug) => (typeof slug === 'string' ? slug.trim() : ''))
    .filter((slug) => slug.length > 0);

  return [...new Set(normalized)];
};

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ success: false, message: 'Revalidation secret not configured' }, { status: 500 });
  }

  let payload: RevalidatePayload;
  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
  }

  if (payload.secret !== expectedSecret) {
    return NextResponse.json({ success: false, message: 'Invalid revalidation secret' }, { status: 401 });
  }

  const touchedPaths = new Set<string>();

  if (payload.homeChanged) {
    revalidatePath('/');
    touchedPaths.add('/');
  }

  if (payload.productsListingChanged) {
    revalidatePath('/products');
    touchedPaths.add('/products');
  }

  if (payload.revalidateAllProductPages) {
    revalidatePath('/products/[slug]', 'page');
    touchedPaths.add('/products/[slug]');
  }

  if (payload.revalidateAllCategoryPages) {
    revalidatePath('/categories/[slug]', 'page');
    touchedPaths.add('/categories/[slug]');
    revalidatePath('/categories');
    touchedPaths.add('/categories');
  }

  if (payload.revalidateAllBrandPages) {
    revalidatePath('/brands/[slug]', 'page');
    touchedPaths.add('/brands/[slug]');
    revalidatePath('/brands');
    touchedPaths.add('/brands');
  }

  for (const slug of uniqueSlugs(payload.productSlugs)) {
    const path = `/products/${slug}`;
    revalidatePath(path);
    touchedPaths.add(path);
  }

  for (const slug of uniqueSlugs(payload.categorySlugs)) {
    const path = `/categories/${slug}`;
    revalidatePath(path);
    touchedPaths.add(path);
  }

  for (const slug of uniqueSlugs(payload.brandSlugs)) {
    const path = `/brands/${slug}`;
    revalidatePath(path);
    touchedPaths.add(path);
  }

  return NextResponse.json({
    success: true,
    revalidated: Array.from(touchedPaths),
  });
}
