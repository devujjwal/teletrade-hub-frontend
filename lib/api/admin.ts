import apiClient from './client';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getOrders: async (filters?: any) => {
    const response = await apiClient.get('/admin/orders', { params: filters });
    return response.data;
  },

  getOrder: async (id: string | number) => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string | number, status: string) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  getProducts: async (filters?: any) => {
    const response = await apiClient.get('/admin/products', { params: filters });
    return response.data;
  },

  updateProduct: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data;
  },

  getPricingConfig: async () => {
    const response = await apiClient.get('/admin/pricing');
    return response.data;
  },

  updateGlobalMarkup: async (markupValue: number, recalculate?: boolean) => {
    const response = await apiClient.put('/admin/pricing/global', {
      markup_value: markupValue,
      recalculate: recalculate || false,
    });
    return response.data;
  },

  updateCategoryMarkup: async (categoryId: number, markupValue: number, markupType: string = 'percentage') => {
    const response = await apiClient.put(`/admin/pricing/category/${categoryId}`, {
      markup_value: markupValue,
      markup_type: markupType,
    });
    return response.data;
  },

  syncProducts: async (lang?: string) => {
    // If lang is provided, pass it as query parameter, otherwise sync all languages
    const params = lang ? { lang } : {};
    const response = await apiClient.post('/admin/sync/products', {}, { params });
    return response.data;
  },

  getSyncStatus: async () => {
    const response = await apiClient.get('/admin/sync/status');
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  },

  // Product CRUD
  createProduct: async (data: any) => {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
  },

  // Category CRUD
  getCategories: async () => {
    const response = await apiClient.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: any) => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Brand CRUD
  getBrands: async () => {
    const response = await apiClient.get('/admin/brands');
    return response.data;
  },

  createBrand: async (data: any) => {
    const response = await apiClient.post('/admin/brands', data);
    return response.data;
  },

  updateBrand: async (id: number, data: any) => {
    const response = await apiClient.put(`/admin/brands/${id}`, data);
    return response.data;
  },

  deleteBrand: async (id: number) => {
    const response = await apiClient.delete(`/admin/brands/${id}`);
    return response.data;
  },
};

