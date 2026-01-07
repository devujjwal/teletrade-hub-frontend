import apiClient from './client';
import { Order, CreateOrderRequest, OrderListResponse } from '@/types/order';

export const ordersApi = {
  list: async (): Promise<OrderListResponse> => {
    const response = await apiClient.get<OrderListResponse>('/orders');
    return response.data;
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

