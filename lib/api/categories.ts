import apiClient from './client';
import { Category, CategoryListResponse } from '@/types/category';
import { mapCategory } from '@/lib/utils/mappers';

export const categoriesApi = {
  list: async (lang?: string): Promise<CategoryListResponse> => {
    const response = await apiClient.get<any>('/categories', {
      params: { lang },
    });
    // Backend returns: { success: true, data: { categories: [...] } } or { success: true, data: [...] }
    if (response.data?.success) {
      if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
        return { data: response.data.data.categories.map((cat: any) => mapCategory(cat, lang)) };
      }
      if (Array.isArray(response.data.data)) {
        return { data: response.data.data.map((cat: any) => mapCategory(cat, lang)) };
      }
    }
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return { data: response.data.map((cat: any) => mapCategory(cat, lang)) };
    }
    // Handle nested data.data structure
    if (response.data?.data && Array.isArray(response.data.data)) {
      return { data: response.data.data.map((cat: any) => mapCategory(cat, lang)) };
    }
    return { data: [] };
  },

  getBySlug: async (slug: string, lang?: string): Promise<Category> => {
    // The API doesn't have a direct /categories/{slug} endpoint
    // We need to get category info from the products endpoint or categories list
    try {
      // First try to get from categories list and find by slug
      const categoriesResponse = await categoriesApi.list(lang);
      const category = categoriesResponse.data.find((c) => c.slug === slug);
      if (category) {
        return category;
      }
      
      // If not found, try to get category info from products endpoint
      const productsResponse = await apiClient.get<any>(`/categories/${slug}/products`, {
        params: { lang, page: 1, limit: 1 },
      });
      
      if (productsResponse.data?.success && productsResponse.data?.data?.category) {
        return mapCategory(productsResponse.data.data.category, lang);
      }
      
      throw new Error('Category not found');
    } catch (error: any) {
      // Handle API errors
      if (error.response?.status === 404 || error.message === 'Category not found') {
        throw new Error('Category not found');
      }
      // Re-throw if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch category');
    }
  },

  getProducts: async (slug: string, filters?: any, lang?: string): Promise<any> => {
    const response = await apiClient.get<any>(`/categories/${slug}/products`, {
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

