import apiClient from './client';

export const adminApi = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await apiClient.post<any>('/admin/login', { email, password });
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get<any>('/admin/dashboard');
    // Backend returns: { success, data: { stats: {...} } }
    return response.data?.data || response.data;
  },

  // Orders
  getOrders: async (filters?: any) => {
    const response = await apiClient.get<any>('/admin/orders', { params: filters });
    // Backend returns: { success, data: { orders: [...], pagination: {...} } }
    return response.data?.data || response.data;
  },

  // Shop Users
  getUsers: async (filters?: any) => {
    const response = await apiClient.get<any>('/admin/users', { params: filters });
    return response.data?.data || response.data;
  },

  updateUserApproval: async (id: number, isActive: boolean) => {
    const response = await apiClient.put<any>(`/admin/users/${id}/approval`, { is_active: isActive });
    return response.data;
  },

  getOrder: async (id: number) => {
    const response = await apiClient.get<any>(`/admin/orders/${id}`);
    // Backend returns: { success, data: { order: {...} } }
    return response.data?.data || response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await apiClient.put<any>(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Products
  getProducts: async (filters?: any) => {
    const response = await apiClient.get<any>('/admin/products', { params: filters });
    // Backend returns: { success, data: { products: [...], pagination: {...} } }
    return response.data?.data || response.data;
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get<any>(`/admin/products/${id}`);
    // Backend returns: { success, data: { product: {...} } }
    return response.data?.data || response.data;
  },

  createProduct: async (data: any) => {
    const response = await apiClient.post<any>('/admin/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: any) => {
    const response = await apiClient.put<any>(`/admin/products/${id}`, data);
    return response.data;
  },

  // Image Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || localStorage.getItem('auth_token') : '';
    
    const response = await fetch(`${API_URL}/upload-image.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data;
  },

  // Pricing
  getPricing: async () => {
    const response = await apiClient.get<any>('/admin/pricing');
    // Backend returns: { success, data: {...} }
    return response.data?.data || response.data;
  },

  updateGlobalMarkup: async (markup: number, accountType: 'customer' | 'merchant', recalculate?: boolean) => {
    const response = await apiClient.put<any>('/admin/pricing/global', { markup_value: markup, account_type: accountType, recalculate });
    return response.data;
  },

  updateCategoryMarkup: async (categoryId: number, markup: number, accountType: 'customer' | 'merchant') => {
    const response = await apiClient.put<any>(`/admin/pricing/category/${categoryId}`, { markup_value: markup, account_type: accountType });
    return response.data;
  },

  updateProductPricing: async (productId: number, data: { customer_price?: number; merchant_price?: number }) => {
    const response = await apiClient.put<any>(`/admin/pricing/product/${productId}`, data);
    return response.data;
  },

  // Sync
  syncProducts: async () => {
    const response = await apiClient.post<any>('/admin/sync/products');
    // Backend returns: { success, message, data: {...} }
    return response.data?.data || response.data;
  },

  getSyncStatus: async () => {
    const response = await apiClient.get<any>('/admin/sync/status');
    // Backend returns: { success, data: {...} }
    return response.data?.data || response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get<any>('/admin/categories');
    // Backend returns: { success, data: { categories: [...] } }
    return response.data?.data || response.data;
  },

  createCategory: async (data: any) => {
    const response = await apiClient.post<any>('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: any) => {
    const response = await apiClient.put<any>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await apiClient.delete<any>(`/admin/categories/${id}`);
    return response.data;
  },

  // Brands
  getBrands: async () => {
    const response = await apiClient.get<any>('/admin/brands');
    // Backend returns: { success, data: { brands: [...] } }
    return response.data?.data || response.data;
  },

  createBrand: async (data: any) => {
    const response = await apiClient.post<any>('/admin/brands', data);
    return response.data;
  },

  updateBrand: async (id: number, data: any) => {
    const response = await apiClient.put<any>(`/admin/brands/${id}`, data);
    return response.data;
  },

  deleteBrand: async (id: number) => {
    const response = await apiClient.delete<any>(`/admin/brands/${id}`);
    return response.data;
  },

  // Vendor Orders
  createSalesOrder: async (orderId: number) => {
    const response = await apiClient.post<any>('/admin/vendor/create-sales-order', { order_id: orderId });
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await apiClient.get<any>('/admin/settings');
    // API returns { success, message, data: { settings } }
    return response.data?.data || response.data;
  },

  updateSettings: async (data: any) => {
    const response = await apiClient.put<any>('/admin/settings', data);
    // API returns { success, message, data: { settings } }
    return response.data?.data || response.data;
  },

  // Password Management
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put<any>('/admin/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  resetPasswordToDefault: async () => {
    const response = await apiClient.post<any>('/admin/reset-password');
    return response.data;
  },
};
