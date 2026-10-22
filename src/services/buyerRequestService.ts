import { apiClient } from '../lib/apiClient';

export interface BuyerRequest {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
  location?: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  postedAt: string;
}

export const buyerRequestService = {
  /**
   * Fetch active buyer requests
   */
  async getBuyerRequests(searchQuery?: string): Promise<BuyerRequest[]> {
    const res = await apiClient.get('/buyer-request', {
      params: searchQuery ? { q: searchQuery } : undefined,
    });
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    return [];
  },

  /**
   * Submit proposal to a buyer request
   */
  async submitProposal(buyerRequestId: string, quotePrice: number, coverLetter: string): Promise<any> {
    const res = await apiClient.post('/buyer-request-proposal', {
      buyerRequestId,
      quotePrice,
      coverLetter,
    });
    return res.data;
  },
};

export default buyerRequestService;
