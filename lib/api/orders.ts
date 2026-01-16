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
    const response = await apiClient.post<any>('/orders', orderData);
    // Backend returns: { success, message, data: { order_id, order_number, total, status, message } }
    // Return the data directly which contains order_number needed for redirect
    return response.data?.data || response.data;
  },

  getById: async (orderId: string | number): Promise<Order> => {
    const response = await apiClient.get<any>(`/orders/${orderId}`);
    // Backend returns: { success, message, data: { order } }
    const orderData = response.data?.data?.order || response.data?.order || response.data;
    return orderData;
  },

  paymentSuccess: async (orderId: string | number): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/payment-success`);
  },

  paymentFailed: async (orderId: string | number): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/payment-failed`);
  },
};

