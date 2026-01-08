import apiClient from './client';
import { Order, CreateOrderRequest, OrderListResponse } from '@/types/order';

export const ordersApi = {
  list: async (): Promise<OrderListResponse> => {
    const response = await apiClient.get<any>('/orders');
    // Backend returns: { success: true, data: { data: [...] } } or { success: true, data: [...] }
    if (response.data?.success && response.data?.data) {
      // Handle both nested and flat data structures
      const ordersArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data.data || [];
      return { 
        data: ordersArray,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: ordersArray.length,
          total: ordersArray.length
        }
      };
    }
    return { 
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 0,
        total: 0
      }
    };
  },

  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  },

  getById: async (orderId: string | number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  paymentSuccess: async (orderId: string | number): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/payment-success`);
  },

  paymentFailed: async (orderId: string | number): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/payment-failed`);
  },
};

