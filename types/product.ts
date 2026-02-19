export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  meta_description?: string;
  primary_image?: string;
  images?: string[];
  price: number;
  customer_price?: number;
  merchant_price?: number;
  base_price?: number; // Vendor price or cost price
  original_price?: number;
  stock_quantity: number;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  category_id: number;
  category_name?: string;
  category_slug?: string;
  brand_id: number;
  brand_name?: string;
  brand_slug?: string;
  specifications?: Record<string, string>;
  warranty?: string;
  warranty_months?: number;
  created_at?: string;
  updated_at?: string;
  is_featured?: number;
  is_available?: number; // 1 = available, 0 = unavailable
  product_source?: 'vendor' | 'own'; // Product source: vendor or own stock
  vendor_article_id?: string; // Vendor SKU (only for vendor products)
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  color?: string;
  storage?: string;
  ram?: string;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  per_page?: number;
  lang?: string;
  is_featured?: number; // Filter by featured status (1 for featured, 0 for not featured)
}

export interface FilterOptions {
  colors?: string[];
  storage?: string[];
  ram?: string[];
  price_range?: {
    min: number;
    max: number;
  };
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters?: FilterOptions;
}
