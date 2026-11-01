import { apiClient } from './apiClient';
import { SupportTicket, SupportTicketMessage } from '../types';
import { MOCK_SUPPORT_TICKETS } from '../data/mockData';

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    try {
      const res = await apiClient.get<SupportTicket[]>('/support/tickets');
      return res.data;
    } catch {
      return MOCK_SUPPORT_TICKETS;
    }
  },

  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    try {
      const res = await apiClient.get<SupportTicket>(`/support/tickets/${ticketId}`);
      return res.data;
    } catch {
      return MOCK_SUPPORT_TICKETS.find((t) => t.id === ticketId) || null;
    }
  },

  async addMessage(ticketId: string, text: string, senderName: string = 'CSKH BeFood'): Promise<SupportTicketMessage> {
    const newMsg: SupportTicketMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      await apiClient.post(`/support/tickets/${ticketId}/messages`, newMsg);
    } catch {
      // In-memory update
      const target = MOCK_SUPPORT_TICKETS.find((t) => t.id === ticketId);
      if (target) {
        target.messages.push(newMsg);
      }
    }
    return newMsg;
  },

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<boolean> {
    try {
      await apiClient.put(`/support/tickets/${ticketId}/status`, { status });
      return true;
    } catch {
      const target = MOCK_SUPPORT_TICKETS.find((t) => t.id === ticketId);
      if (target) {
        target.status = status;
      }
      return true;
    }
  },
};

