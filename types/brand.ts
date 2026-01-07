export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  products_count?: number;
}

export interface BrandListResponse {
  data: Brand[];
}

