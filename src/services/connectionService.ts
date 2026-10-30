import { apiClient } from '../lib/apiClient';

export interface SuggestedFollowUser {
  uid: string;
  name: string;
  username?: string;
  avatarUrl: string;
  businessName?: string;
  industry?: string;
  category?: string;
  bio?: string;
  isPro?: boolean;
  followersCount?: number;
}

export const connectionService = {
  /**
   * Fetch suggested users to connect with
   * Endpoint: /connection/getRecommendedConnections or /users
   */
  async getSuggestedUsers(page = 0, size = 30): Promise<SuggestedFollowUser[]> {
    try {
      const res = await apiClient.get('/connection/getRecommendedConnections', {
        params: { page, size },
      });
      const rows = res.data?.data?.rows || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((u: any) => ({
          uid: String(u.uid || u.id),
          name: u.name ? `${u.name} ${u.surname || ''}`.trim() : u.fullname || u.username || 'Business Boss',
          username: u.username || undefined,
          avatarUrl: u.photoUrl || u.profilePicture || u.avatar || '',
          businessName: u.companyName || u.businessName,
          industry: u.industry || u.category || 'Entrepreneur',
          category: u.category,
          bio: u.bio,
          isPro: Boolean(u.isSubscribed || u.isBossPro),
          followersCount: Number(u.connectionCount || u.followersCount || 0),
        }));
      }
    } catch (e) {
      console.warn('Could not load recommended connections from /connection/getRecommendedConnections, trying fallback', e);
    }

    // Fallback: /users
    try {
      const res = await apiClient.get('/users', {
        params: { page, limit: size },
      });
      const rows = res.data?.data?.rows || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (Array.isArray(rows)) {
        return rows.map((u: any) => ({
          uid: String(u.uid || u.id),
          name: u.name ? `${u.name} ${u.surname || ''}`.trim() : u.fullname || u.username || 'Business Boss',
          username: u.username || undefined,
          avatarUrl: u.photoUrl || u.profilePicture || u.avatar || '',
          businessName: u.companyName || u.businessName,
          industry: u.industry || u.category || 'Entrepreneur',
          category: u.category,
          bio: u.bio,
          isPro: Boolean(u.isSubscribed || u.isBossPro),
          followersCount: Number(u.connectionCount || u.followersCount || 0),
        }));
      }
    } catch (err) {
      console.error('Failed to load suggested users', err);
    }

    return [];
  },

  /**
   * Connect (Follow) a user
   * Dual parameter compatible: connectedId and connectionId
   */
  async connectUser(targetUid: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/connection/connect', {
        connectedId: targetUid,
        connectionId: targetUid,
        timestamp: Date.now(),
      });
      return !!res.data?.success;
    } catch (e) {
      console.error('Failed to connect with user', e);
      return false;
    }
  },

  /**
   * Disconnect (Unfollow) a user
   */
  async disconnectUser(targetUid: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/connection/disconnect', {
        connectedId: targetUid,
        connectionId: targetUid,
        timestamp: Date.now(),
      });
      return !!res.data?.success;
    } catch (e) {
      console.error('Failed to disconnect user', e);
      return false;
    }
  },
};

export default connectionService;
