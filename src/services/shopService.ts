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
  completed?: number;
  processed?: number;
  online?: number;
  in_person?: number;
  pickup?: number;
  totalOrders: number;
}

export interface ShopGraphData {
  totalSales: number;
  xAxis: string;
  graphData: Array<{
    date: string;
    totalAmount: number;
  }>;
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
   * Ensure user has a valid shop ID, auto-provisioning a default showcase shop if needed
   */
  async ensureUserShop(user: { uid: string; name?: string; username?: string; email?: string; photoUrl?: string; location?: string }): Promise<string> {
    if (!user || !user.uid) {
      throw new Error('User authentication required to post a listing.');
    }

    // 1. Try to fetch existing shop
    const existingShop = await this.getUserShop(user.uid);
    if (existingShop && existingShop.id) {
      return existingShop.id;
    }

    // 2. Auto-provision shop for user
    const shopName = user.name || user.username ? `${user.name || user.username}'s Store` : `Store ${user.uid.slice(0, 6)}`;
    const shopPayload = {
      userId: user.uid,
      name: `${shopName} ${Date.now().toString().slice(-4)}`,
      description: 'Official storefront & showcase on Business Bosses',
      location: user.location || 'Global',
      image: user.photoUrl || 'https://placehold.co/400x400/F21C29/FFFFFF?text=Shop',
      details: 'Showcase shop for marketplace products and professional services',
      email: user.email || 'user@businessbosses.co.uk',
      paymentMethods: [
        {
          paymentMethod: 'Direct Payment',
          details: 'Standard settlement or direct buyer arrangement',
        },
      ],
    };

    const res = await apiClient.post('/shops', shopPayload);
    const created = res.data?.data;
    if (created && created.id) {
      return created.id;
    }
    throw new Error(res.data?.message || 'Failed to initialize storefront. Please try again.');
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
  async getShopOrdersSummary(shopId: string, date?: string): Promise<ShopOrdersSummary> {
    try {
      const url = date ? `/dashboard/shop-orders/${shopId}?date=${date}` : `/dashboard/shop-orders/${shopId}`;
      const res = await apiClient.get(url);
      const data = res.data?.data || res.data || {};
      return {
        pending: Number(data.pending || 0),
        paid: Number(data.paid || 0),
        cancelled: Number(data.cancelled || 0),
        completed: Number(data.completed || 0),
        processed: Number(data.processed || 0),
        online: Number(data.online || 0),
        in_person: Number(data.in_person || 0),
        pickup: Number(data.pickup || 0),
        totalOrders: Number(data.totalOrders || (Number(data.pending || 0) + Number(data.paid || 0) + Number(data.cancelled || 0))),
      };
    } catch {
      return {
        pending: 0,
        paid: 0,
        cancelled: 0,
        completed: 0,
        processed: 0,
        online: 0,
        in_person: 0,
        pickup: 0,
        totalOrders: 0,
      };
    }
  },

  /**
   * Get shop performance graph data (GET /dashboard/shop-graph-data/:shopId)
   */
  async getShopGraphData(shopId: string, date?: string): Promise<ShopGraphData> {
    try {
      const url = date ? `/dashboard/shop-graph-data/${shopId}?date=${date}` : `/dashboard/shop-graph-data/${shopId}`;
      const res = await apiClient.get(url);
      const data = res.data?.data || res.data || {};
      return {
        totalSales: Number(data.totalSales || 0),
        xAxis: data.xAxis || 'day',
        graphData: Array.isArray(data.graphData) ? data.graphData : [],
      };
    } catch {
      return {
        totalSales: 0,
        xAxis: 'day',
        graphData: [],
      };
    }
  },

  /**
   * Get shop orders list (Sales Leads) (GET /orders/shop-orders/:shopId)
   */
  async getShopOrders(shopId: string, page = 0, limit = 50): Promise<ShopOrderItem[]> {
    try {
      const res = await apiClient.get(`/orders/shop-orders/${shopId}?page=${page}&limit=${limit}`);
      const rows = res.data?.data?.rows || res.data?.rows || res.data?.data || [];
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  /**
   * Get user placed orders (My Purchases / Orders) (GET /orders/user-orders/:userId)
   */
  async getUserOrders(userId: string, page = 0, limit = 50): Promise<ShopOrderItem[]> {
    try {
      const res = await apiClient.get(`/orders/user-orders/${userId}?page=${page}&limit=${limit}`);
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
