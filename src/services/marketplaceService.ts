import { apiClient } from '../lib/apiClient';

export interface MarketplaceService {
  id: string;
  title: string;
  thumbnailUrl: string;
  price: string;
  rating: number;
  reviewsCount: number;
  category: string;
  location?: string;
  seller: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
}

export const marketplaceService = {
  /**
   * Fetch services catalog
   */
  async getServices(category = 'All'): Promise<MarketplaceService[]> {
    const res = await apiClient.get('/service', {
      params: category !== 'All' ? { category } : undefined,
    });
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    return [];
  },
};

export default marketplaceService;
