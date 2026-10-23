import { apiClient } from '../lib/apiClient';

export interface CreateOrderPayload {
  shopId: string;
  items: Array<{
    type: 'product' | 'service' | 'custom';
    id: number | string;
    name: string;
    amount?: number;
  }>;
  deliveryMethod?: string;
  deliveryDate?: string;
  paymentMethod: string;
  notes?: string;
  quantity?: number;
  orderDetails?: string;
  startTime?: string;
  endTime?: string;
}

export const orderService = {
  /**
   * Create an order or booking with full mobile parity
   * Calls POST /orders
   */
  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await apiClient.post('/orders', {
        ...payload,
        status: 'pending',
        invoiceOption: 'send_with_payment_link',
      });
      return { success: true, data: res.data?.data || res.data };
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        'Failed to process order';
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Optional Pay With Coins settlement parity
   */
  async payWithCoins(orderId: string | number): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await apiClient.post(`/orders/${orderId}/pay-with-coins`);
      return { success: true, data: res.data?.data || res.data };
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || 'Coin payment failed',
      };
    }
  },
};
