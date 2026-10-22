import { apiClient } from '../lib/apiClient';

export interface BossOfTheWeekData {
  uid: string;
  name: string;
  username?: string;
  avatarUrl: string;
  bio?: string;
  businessName?: string;
  isPro?: boolean;
}

export interface PartnerDealData {
  id: string;
  partnerName: string;
  dealTitle: string;
  discount: string;
  logoUrl?: string;
  dealUrl?: string;
}

export const feedHighlightService = {
  /**
   * Fetch real Boss of the Week from backend
   */
  async getBossOfTheWeek(): Promise<BossOfTheWeekData | null> {
    try {
      const res = await apiClient.get('/users/bossup');
      const data = res.data?.data || res.data;
      if (data && (data.uid || data.id || data.name)) {
        return {
          uid: String(data.uid || data.id || ''),
          name: data.name || data.username || 'Featured Boss',
          username: data.username || undefined,
          avatarUrl: data.profilePicture || data.image || data.avatar || '',
          bio: data.bio || data.tagline || data.businessName || '',
          businessName: data.businessName || undefined,
          isPro: !!(data.isSubscribed || data.isBossPro),
        };
      }
      return null;
    } catch (err) {
      console.warn('Could not load Boss of the Week from server', err);
      return null;
    }
  },

  /**
   * Fetch real Partners Deals from backend
   */
  async getPartnerDeals(): Promise<PartnerDealData[]> {
    try {
      const res = await apiClient.get('/partner/all', {
        params: { page: 0, size: 6 },
      });
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: String(item.id || item._id),
          partnerName: item.name || item.companyName || 'Business Partner',
          dealTitle: item.description || item.deal || item.title || 'Exclusive Member Perk',
          discount: item.discount || item.tag || 'Special Offer',
          logoUrl: item.logo || item.image || undefined,
          dealUrl: item.url || item.website || undefined,
        }));
      }
      return [];
    } catch (err) {
      console.warn('Could not load Partner deals from server', err);
      return [];
    }
  },

  /**
   * Follow a user
   */
  async followUser(connectedId: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/connection/connect', {
        connectedId,
        timestamp: Date.now(),
      });
      return !!res.data?.success;
    } catch (err) {
      console.error('Follow failed', err);
      return false;
    }
  },
};
