import { apiClient } from '../lib/apiClient';

export interface Shop {
  id: string;
  userId: string;
  name: string;
  image?: string;
  coverImage?: string;
  description?: string;
  location?: string;
  currency?: string;
  phone?: string;
  email?: string;
  website?: string;
  verificationStatus: 'unverified' | 'pending' | 'approved' | 'rejected';
  views?: number;
  createdAt?: string;
}

export interface ShopStatistics {
  views: number;
  clientCount: number;
  projectCount: number;
  totalExpenses: number;
  totalAmount: number;
}

export interface ShopOrdersSummary {
  pending: number;
  paid: number;
  cancelled: number;
  totalOrders: number;
}

export interface ShopOrderItem {
  id: string | number;
  shopId: string;
  userId?: string;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  user?: {
    uid: string;
    name: string;
    username?: string;
    photoUrl?: string;
  };
  totalAmount?: number;
  amount?: number;
  status: 'pending' | 'paid' | 'cancelled' | 'in_progress' | 'completed';
  deliveryDate?: string;
  createdAt: string;
  items?: Array<{
    id: string | number;
    name: string;
    price?: number;
    amount?: number;
    quantity?: number;
    type?: string;
  }>;
}

export interface ShopClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  company?: string;
  notes?: string;
  totalOrders?: number;
  createdAt?: string;
}

export const shopService = {
  /**
   * Get user shop details (GET /shops/user-shops/:uid)
   */
  async getUserShop(uid: string): Promise<Shop | null> {
    try {
      const res = await apiClient.get(`/shops/user-shops/${uid}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as Shop;
      }
      if (res.data?.data && !Array.isArray(res.data.data)) {
        return res.data.data as Shop;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Get shop statistics metrics (GET /dashboard/shop-statistics/:userId)
   */
  async getShopStatistics(userId: string): Promise<ShopStatistics> {
    try {
      const res = await apiClient.get(`/dashboard/shop-statistics/${userId}`);
      const data = res.data?.data || res.data || {};
      return {
        views: Number(data.views || 0),
        clientCount: Number(data.clientCount || 0),
        projectCount: Number(data.projectCount || 0),
        totalExpenses: Number(data.totalExpenses || 0),
        totalAmount: Number(data.totalAmount || 0),
      };
    } catch {
      return {
        views: 0,
        clientCount: 0,
        projectCount: 0,
        totalExpenses: 0,
        totalAmount: 0,
      };
    }
  },

  /**
   * Get shop order breakdown/chart metrics (GET /dashboard/shop-orders/:shopId)
   */
  async getShopOrdersSummary(shopId: string): Promise<ShopOrdersSummary> {
    try {
      const res = await apiClient.get(`/dashboard/shop-orders/${shopId}`);
      const data = res.data?.data || res.data || {};
      return {
        pending: Number(data.pending || 0),
        paid: Number(data.paid || 0),
        cancelled: Number(data.cancelled || 0),
        totalOrders: Number(data.totalOrders || (Number(data.pending || 0) + Number(data.paid || 0) + Number(data.cancelled || 0))),
      };
    } catch {
      return {
        pending: 0,
        paid: 0,
        cancelled: 0,
        totalOrders: 0,
      };
    }
  },

  /**
   * Get shop orders list (GET /orders/shop-orders/:shopId)
   */
  async getShopOrders(shopId: string, page = 0, limit = 20): Promise<ShopOrderItem[]> {
    try {
      const res = await apiClient.get(`/orders/shop-orders/${shopId}?page=${page}&limit=${limit}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  /**
   * Get shop clients CRM list (GET /clients/shop-clients/:shopId)
   */
  async getShopClients(shopId: string, page = 0, limit = 20): Promise<ShopClient[]> {
    try {
      const res = await apiClient.get(`/clients/shop-clients/${shopId}?page=${page}&limit=${limit}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  /**
   * Get products owned by user (GET /goods/user-products/:uid)
   */
  async getUserProducts(uid: string, page = 0, limit = 30): Promise<any[]> {
    try {
      const res = await apiClient.get(`/goods/user-products/${uid}?page=${page}&limit=${limit}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  /**
   * Get services owned by user (GET /services/user-services/:uid)
   */
  async getUserServices(uid: string, page = 0, limit = 30): Promise<any[]> {
    try {
      const res = await apiClient.get(`/services/user-services/${uid}?page=${page}&limit=${limit}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  /**
   * Delete product (DELETE /goods/:id)
   */
  async deleteProduct(id: string | number): Promise<boolean> {
    try {
      await apiClient.delete(`/goods/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete service (DELETE /services/:id)
   */
  async deleteService(id: string | number): Promise<boolean> {
    try {
      await apiClient.delete(`/services/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Update order status (PUT /orders/:id)
   */
  async updateOrderStatus(id: string | number, status: string): Promise<boolean> {
    try {
      await apiClient.put(`/orders/${id}`, { status });
      return true;
    } catch {
      return false;
    }
  },
};
