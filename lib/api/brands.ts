import apiClient from './client';
import { Brand, BrandListResponse } from '@/types/brand';
import { mapBrand } from '@/lib/utils/mappers';

export const brandsApi = {
  list: async (lang?: string): Promise<BrandListResponse> => {
    const response = await apiClient.get<any>('/brands', {
      params: { lang },
    });
    // Backend returns: { success: true, data: { brands: [...] } } or { success: true, data: [...] }
    if (response.data?.success) {
      if (response.data?.data?.brands && Array.isArray(response.data.data.brands)) {
        return { data: response.data.data.brands.map(mapBrand) };
      }
      if (Array.isArray(response.data.data)) {
        return { data: response.data.data.map(mapBrand) };
      }
    }
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return { data: response.data.map(mapBrand) };
    }
    // Handle nested data.data structure
    if (response.data?.data && Array.isArray(response.data.data)) {
      return { data: response.data.data.map(mapBrand) };
    }
    return { data: [] };
  },

  getBySlug: async (slug: string, lang?: string): Promise<Brand> => {
    // The API doesn't have a direct /brands/{slug} endpoint
    // We need to get brand info from the products endpoint or brands list
    try {
      // First try to get from brands list and find by slug
      const brandsResponse = await brandsApi.list(lang);
      const brand = brandsResponse.data.find((b) => b.slug === slug);
      if (brand) {
        return brand;
      }
      
      // If not found, try to get brand info from products endpoint
      const productsResponse = await apiClient.get<any>(`/brands/${slug}/products`, {
        params: { lang, page: 1, limit: 1 },
      });
      
      if (productsResponse.data?.success && productsResponse.data?.data?.brand) {
        return mapBrand(productsResponse.data.data.brand);
      }
      
      throw new Error('Brand not found');
    } catch (error: any) {
      // Handle API errors
      if (error.response?.status === 404 || error.message === 'Brand not found') {
        throw new Error('Brand not found');
      }
      // Re-throw if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch brand');
    }
  },

  getProducts: async (slug: string, filters?: any, lang?: string): Promise<any> => {
    const response = await apiClient.get<any>(`/brands/${slug}/products`, {
      params: { ...filters, lang },
    });
    // Backend returns: { success: true, data: { products: [...], pagination: {...} } }
    if (response.data?.success && response.data?.data?.products) {
      const products = response.data.data.products;
      const pagination = response.data.data.pagination || {};
      return {
        data: products.map((p: any) => {
          const { mapProduct } = require('@/lib/utils/mappers');
          return mapProduct(p);
        }),
        meta: {
          current_page: pagination.page || 1,
          last_page: pagination.pages || 1,
          per_page: pagination.limit || 20,
          total: pagination.total || products.length,
        },
      };
    }
    // Handle direct array response
    if (Array.isArray(response.data)) {
      const { mapProduct } = require('@/lib/utils/mappers');
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
};

