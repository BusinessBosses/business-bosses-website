import { apiClient } from '../lib/apiClient';

export interface ReachImpactData {
  totalReachPoints: number;
  profileReach: number;
  engagementReach: number;
  discoveryReach: number;
  trustReach: number;
  aiVisibilityScore: number;
  shopImpactScore?: number;
  shopPoints?: number;
  globalRank?: number | null;
  totalRankedUsers?: number;
  isGloballyRanked?: boolean;
  totalLikes?: number;
  totalViews?: number;
  totalComments?: number;
  hasShop?: boolean;
  isVerifiedBusiness?: boolean;
  shop?: {
    id: string;
    name: string;
    category?: string;
    location?: string;
    views?: number;
    image?: string;
  };
  shopIndustryRank?: {
    isIndustryRanked: boolean;
    industryRank: number | null;
    industryTotalShops: number;
  };
  shopGlobalRank?: {
    isGloballyRanked: boolean;
    globalRank: number | null;
    totalShops: number;
  };
  user?: any;
}

export interface LeaderboardLeader {
  rank: number;
  id: string;
  name: string;
  username?: string;
  category?: string;
  location?: string;
  score: number;
  avatarUrl?: string;
  isSubscribed?: boolean;
  hasShop?: boolean;
}

export interface ConnectionAnalysisData {
  connections: any[];
  connecteds: any[];
  disconnections: any[];
}

export const performanceService = {
  /**
   * Get total reach / impact metrics for user
   */
  async getUserImpact(userId: string): Promise<ReachImpactData | null> {
    try {
      const res = await apiClient.get(`/impact/user/${userId}`);
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      if (res.data?.totalReachPoints !== undefined) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.warn('Failed to fetch user impact', err);
      return null;
    }
  },

  /**
   * Get connection analytics (weekly, monthly followers/following/unfollowed)
   */
  async getConnectionAnalysis(): Promise<ConnectionAnalysisData | null> {
    try {
      const res = await apiClient.get('/connection/analysis');
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      if (res.data?.connections) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.warn('Failed to fetch connection analysis', err);
      return null;
    }
  },

  /**
   * Fetch leaderboard rankings (Global, Industry, Country)
   */
  async getLeaderboard(
    type: 'global' | 'industry' | 'country',
    param?: string
  ): Promise<LeaderboardLeader[]> {
    try {
      let endpoint = '/impact/top/shops?limit=30';
      if (type === 'industry' && param) {
        endpoint = `/impact/top/shops/category?category=${encodeURIComponent(param)}&limit=30`;
      } else if (type === 'country' && param) {
        endpoint = `/impact/top/shops/location?location=${encodeURIComponent(param)}&limit=30`;
      }

      const res = await apiClient.get(endpoint);
      const rawList: any[] = res.data?.data || res.data || [];

      if (!Array.isArray(rawList)) return [];

      return rawList.map((item: any, idx: number) => {
        const u = item.user || {};
        const shop = item.shop || item;
        return {
          rank: item.rank || item.globalRank || item.industryRank || idx + 1,
          id: String(u.uid || item.userId || item.id || idx),
          name: shop.name || u.name || u.fullname || u.username || 'Business Boss',
          username: u.username || undefined,
          category: shop.category || u.industry || 'General',
          location: shop.location || u.location || 'Global',
          score: Number(item.impactScore || item.totalReachPoints || item.score || 0),
          avatarUrl: shop.image || u.photoUrl || u.avatar || '',
          isSubscribed: Boolean(u.isSubscribed || u.isBossPro),
          hasShop: Boolean(u.hasShop || item.hasShop),
        };
      });
    } catch (err) {
      console.warn('Failed to fetch leaderboard data', err);
      return [];
    }
  },
};
