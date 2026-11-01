// src/services/adminService.ts
import { apiClient } from './apiClient';

export interface DashboardStats {
  totalGmv: number;
  platformCommission: number;
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveringOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  successRate: number;
  retentionRate: number;
  totalRestaurants: number;
  activeRestaurants: number;
  totalDrivers: number;
  activeDrivers: number;
  totalCustomers: number;
  activeCustomers: number;
  districtBreakdown: { district: string; percent: number; gmv: number; orders: number }[];
  paymentBreakdown: { method: string; percent: number; count: number }[];
}

export const adminService = {
  async getDashboardStats() {
    return apiClient.get<DashboardStats>('/admin/dashboard');
  },

  async getUsers(search?: string, role?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    return apiClient.get<any[]>(`/admin/users?${params.toString()}`);
  },

  async toggleUserLock(userId: string) {
    return apiClient.put(`/admin/users/${userId}/toggle-lock`, {});
  },

  async updateUserRole(userId: string, role: string) {
    return apiClient.put(`/admin/users/${userId}/role`, { role });
  },

  async getSettlements() {
    return apiClient.get<any[]>('/admin/settlements');
  },

  async queryAiAnalyst(prompt: string) {
    return apiClient.post<{ success: boolean; answer: string }>('/admin/ai-analyst', { prompt });
  },
};

