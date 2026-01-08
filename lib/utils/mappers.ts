import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';

/**
 * Map backend product response to frontend Product type
 */
export function mapProduct(backendProduct: any): Product {
  // Parse specifications if it's a string
  let specifications = backendProduct.specifications || {};
  if (typeof specifications === 'string') {
    try {
      specifications = JSON.parse(specifications);
    } catch (e) {
      specifications = {};
    }
  }
  
  // Ensure specifications is an object
  if (!specifications || typeof specifications !== 'object') {
    specifications = {};
  }
  
  // Add EAN, color, storage, RAM to specifications if they exist as separate fields
  if (backendProduct.ean && !specifications.ean) {
    specifications.ean = backendProduct.ean;
  }
  if (backendProduct.color && !specifications.color) {
    specifications.color = backendProduct.color;
  }
  if (backendProduct.storage && !specifications.storage && !specifications.prod_storage) {
    specifications.prod_storage = backendProduct.storage;
  }
  if (backendProduct.ram && !specifications.ram && !specifications.prod_memory) {
    specifications.prod_memory = backendProduct.ram;
  }
  
  // Get warranty from warranty_name or warranty_months
  let warranty = backendProduct.warranty;
  if (!warranty && backendProduct.warranty_name) {
    warranty = backendProduct.warranty_name;
  } else if (!warranty && backendProduct.warranty_months) {
    warranty = `${backendProduct.warranty_months} ${backendProduct.warranty_months === 1 ? 'month' : 'months'}`;
  }
  
  // Add warranty to specifications if not already there
  if (warranty && !specifications.warranty) {
    specifications.warranty = warranty;
  }
  
  // Add full_name if name exists
  if (backendProduct.name && !specifications.full_name) {
    specifications.full_name = backendProduct.name;
  }
  
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
    specifications,
    warranty,
    warranty_months: backendProduct.warranty_months ? Number(backendProduct.warranty_months) : undefined,
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
 * Uses language-specific name fields (name_de, name_en, etc.) if available
 */
export function mapCategory(backendCategory: any, lang?: string): Category {
  // Determine which name field to use based on language
  let name = backendCategory.name || '';
  
  if (lang && backendCategory[`name_${lang}`]) {
    name = backendCategory[`name_${lang}`];
  } else if (backendCategory.name_en) {
    // Fallback to English if language-specific name not available
    name = backendCategory.name_en;
  }
  
  return {
    id: backendCategory.id,
    name,
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

