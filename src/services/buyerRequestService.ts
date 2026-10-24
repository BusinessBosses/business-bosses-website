import { apiClient } from '../lib/apiClient';

export interface BuyerRequestUser {
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  photoUrl?: string;
  location?: string;
}

export interface BuyerRequest {
  id: string | number;
  userId?: string;
  user_id?: string;
  title: string;
  description: string;
  category: string;
  budget?: string;
  budget_start?: number | string;
  budget_end?: number | string;
  deadline?: string;
  location?: string;
  attachments?: string[];
  imageUrl?: string;
  offerCount?: number;
  created_at?: string;
  createdAt?: string;
  author?: {
    name: string;
    avatarUrl: string;
  };
  postedAt?: string;
  user?: BuyerRequestUser;
}

export interface CreateBuyerRequestPayload {
  title: string;
  description: string;
  category: string;
  budget_start?: number;
  budget_end?: number;
  deadline?: string;
  attachments?: string[];
}

export const buyerRequestService = {
  /**
   * Fetch active buyer requests with optional query and category
   */
  async getBuyerRequests(searchQuery?: string, category?: string): Promise<BuyerRequest[]> {
    const params: Record<string, string> = {};
    if (searchQuery && searchQuery.trim()) params.q = searchQuery.trim();
    if (category && category !== 'All') params.category = category;

    const res = await apiClient.get('/buyer-request', { params });
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    return [];
  },

  /**
   * Create a new buyer request
   */
  async createBuyerRequest(payload: CreateBuyerRequestPayload): Promise<any> {
    const res = await apiClient.post('/buyer-request', payload);
    return res.data;
  },

  /**
   * Delete a buyer request by ID
   */
  async deleteBuyerRequest(id: string): Promise<any> {
    const res = await apiClient.delete(`/buyer-request/${id}`);
    return res.data;
  },

  /**
   * Upload attachment file to server storage
   */
  async uploadAttachment(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('file', file);

    try {
      const res = await apiClient.post('/uploads/fallback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data?.fileUrl || res.data?.url || res.data?.data?.url;
      if (fileUrl) return fileUrl;
    } catch {
      // Fallback to legacy upload PHP endpoint
      const legacyRes = await fetch('https://businessbosses.com.ng/upload.php', {
        method: 'POST',
        body: formData,
      });
      const legacyData = await legacyRes.json();
      if (legacyData?.fileUrl) return legacyData.fileUrl;
    }
    throw new Error('Failed to upload file');
  },
};

export default buyerRequestService;
