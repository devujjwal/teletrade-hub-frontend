import apiClient from './client';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    // Backend returns: { success: true, data: { order_stats, product_stats, recent_orders } }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },

  getOrders: async (filters?: any) => {
    const response = await apiClient.get('/admin/orders', { params: filters });
    // Backend returns: { success: true, data: { orders: [...], pagination: {...} } }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },

  getOrder: async (id: string | number) => {
    const response = await apiClient.get(`/admin/orders/${id}`);
    // Backend returns: { success: true, data: { order: {...} } }
    if (response.data?.success && response.data?.data?.order) {
      return response.data.data.order;
    }
    // Fallback for direct order response
    if (response.data?.order) {
      return response.data.order;
    }
    return response.data;
  },

  updateOrderStatus: async (id: string | number, status: string) => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  getProducts: async (filters?: any) => {
    const response = await apiClient.get('/admin/products', { params: filters });
    // Backend returns: { success: true, data: { products: [...], pagination: {...} } }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateProduct: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data;
  },

  getPricingConfig: async () => {
    const response = await apiClient.get('/admin/pricing');
    // Backend returns: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
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
    // Backend returns: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    // Backend returns: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
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
    // Backend returns: { success: true, data: { categories: [...] } }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
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
    // Backend returns: { success: true, data: { brands: [...] } }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
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

