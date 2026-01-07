import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';

/**
 * Map backend product response to frontend Product type
 */
export function mapProduct(backendProduct: any): Product {
  return {
    id: backendProduct.id,
    sku: backendProduct.sku || '',
    name: backendProduct.name || '',
    slug: backendProduct.slug || backendProduct.id?.toString() || '',
    description: backendProduct.description,
    meta_description: backendProduct.meta_description,
    primary_image: backendProduct.image_url || backendProduct.primary_image || backendProduct.image,
    images: backendProduct.images || [],
    price: Number(backendProduct.price) || 0,
    base_price: backendProduct.base_price ? Number(backendProduct.base_price) : undefined,
    original_price: backendProduct.original_price ? Number(backendProduct.original_price) : undefined,
    stock_quantity: backendProduct.stock_quantity || 0,
    availability: backendProduct.is_available === 1 || backendProduct.is_available === true
      ? 'in_stock'
      : backendProduct.is_available === 2
      ? 'pre_order'
      : 'out_of_stock',
    category_id: backendProduct.category_id || 0,
    category_name: backendProduct.category_name,
    category_slug: backendProduct.category_slug,
    brand_id: backendProduct.brand_id || 0,
    brand_name: backendProduct.brand_name,
    brand_slug: backendProduct.brand_slug,
    specifications: backendProduct.specifications || {},
    warranty: backendProduct.warranty || backendProduct.warranty_months ? `${backendProduct.warranty_months} months` : undefined,
    created_at: backendProduct.created_at,
    updated_at: backendProduct.updated_at,
    // Handle is_featured
    is_featured: backendProduct.is_featured === 1 || backendProduct.is_featured === true ? 1 : 0,
    // Product source fields
    product_source: backendProduct.product_source || 'vendor',
    vendor_article_id: backendProduct.vendor_article_id,
  };
}

/**
 * Map backend category response to frontend Category type
 */
export function mapCategory(backendCategory: any): Category {
  return {
    id: backendCategory.id,
    name: backendCategory.name || '',
    slug: backendCategory.slug || backendCategory.id?.toString() || '',
    description: backendCategory.description,
    image: backendCategory.image_url || backendCategory.image,
    parent_id: backendCategory.parent_id,
    products_count: backendCategory.product_count || backendCategory.products_count || 0,
  };
}

/**
 * Map backend brand response to frontend Brand type
 */
export function mapBrand(backendBrand: any): Brand {
  return {
    id: backendBrand.id,
    name: backendBrand.name || '',
    slug: backendBrand.slug || backendBrand.id?.toString() || '',
    description: backendBrand.description,
    logo: backendBrand.logo_url || backendBrand.logo,
    products_count: backendBrand.product_count || backendBrand.products_count || 0,
  };
}

