import { apiClient } from './apiClient';
import { Order, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const res = await apiClient.get<Order[]>(`/orders${userId ? `?userId=${userId}` : ''}`);
      return res.data;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const res = await apiClient.get<Order>(`/orders/${orderId}`);
      return res.data;
    } catch {
      return INITIAL_ORDERS.find((o) => o.id === orderId) || null;
    }
  },

  async updateStatus(orderId: string, status: OrderStatus, note?: string): Promise<boolean> {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status, note });
      return true;
    } catch {
      return true;
    }
  },
};

