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
  companyName: string;
  companyPhoto?: string;
  companyUrl?: string;
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
   * Fetch real Partners Deals from backend (matching mobile deals_section.dart)
   */
  async getPartnerDeals(): Promise<PartnerDealData[]> {
    try {
      const res = await apiClient.get('/partner/all', {
        params: { page: 0, size: 10 },
      });
      // The API returns { data: { count, rows: [...] } }
      const rows = res.data?.data?.rows || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (Array.isArray(rows)) {
        return rows.map((item: any) => ({
          id: String(item.id || item._id),
          companyName: item.companyName || item.name || 'Partner',
          companyPhoto: item.companyPhoto || item.user?.photoUrl || undefined,
          companyUrl: item.companyUrl || item.user?.website || undefined,
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

export default feedHighlightService;
