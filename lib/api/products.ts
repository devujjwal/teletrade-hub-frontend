import apiClient from './client';
import { Product, ProductFilters, ProductListResponse, FilterOptions } from '@/types/product';
import { mapProduct } from '@/lib/utils/mappers';

export const productsApi = {
  list: async (filters?: ProductFilters): Promise<ProductListResponse> => {
    // The backend only accepts category_id and brand_id (not slugs)
    // We need to convert slugs to IDs if provided
    const params: any = { ...filters };
    
    // Convert category slug to category_id
    if (params.category && !params.category_id) {
      try {
        const { categoriesApi } = await import('./categories');
        const categoriesResponse = await categoriesApi.list(params.lang);
        const category = categoriesResponse.data.find((c) => c.slug === params.category);
        if (category) {
          params.category_id = category.id;
        }
        delete params.category; // Remove slug
      } catch (error) {
        console.error('Error fetching category for filter:', error);
      }
    }
    
    // Convert brand slug to brand_id
    if (params.brand && !params.brand_id) {
      try {
        const { brandsApi } = await import('./brands');
        const brandsResponse = await brandsApi.list(params.lang);
        const brand = brandsResponse.data.find((b) => b.slug === params.brand);
        if (brand) {
          params.brand_id = brand.id;
        }
        delete params.brand; // Remove slug
      } catch (error) {
        console.error('Error fetching brand for filter:', error);
      }
    }
    
    const response = await apiClient.get<any>('/products', {
      params,
    });
    
    // Backend returns: { success: true, data: { products: [...], pagination: {...}, filters: {...} } }
    if (response.data?.success && response.data?.data?.products) {
      const products = response.data.data.products;
      const pagination = response.data.data.pagination || {};
      const filters: FilterOptions = response.data.data.filters || {};
      return {
        data: products.map(mapProduct),
        meta: {
          current_page: pagination.page || 1,
          last_page: pagination.pages || 1,
          per_page: pagination.limit || 20,
          total: pagination.total || products.length,
        },
        filters,
      };
    }
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return {
        data: response.data.map(mapProduct),
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length,
        },
      };
    }
    // Handle nested data.data structure
    if (response.data?.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data.map(mapProduct),
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: response.data.data.length,
          total: response.data.data.length,
        },
      };
    }
    // Default empty response
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
      },
    };
  },

  getBySlug: async (slug: string, lang?: string): Promise<Product> => {
    const response = await apiClient.get<any>(`/products/${slug}`, {
      params: { lang },
    });
    // Backend returns: { success: true, data: { product: {...} } }
    if (response.data?.success && response.data?.data?.product) {
      return mapProduct(response.data.data.product);
    }
    // Handle direct product response
    if (response.data?.id) {
      return mapProduct(response.data);
    }
    // Handle nested data.product
    if (response.data?.data?.product) {
      return mapProduct(response.data.data.product);
    }
    throw new Error('Product not found');
  },

  search: async (query: string, lang?: string): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>('/products/search', {
      params: { q: query, lang },
    });
    return response.data;
  },
};

