export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  products_count?: number;
}

export interface CategoryListResponse {
  data: Category[];
}

