import { apiClient } from '../lib/apiClient';
import { Post } from '../components/feed/PostCard';

export interface BossUpCategory {
  industryId: string;
  categoryId?: string;
  industry: string;
  photo?: string;
  description?: string;
  award?: string;
  startAt?: string | null;
  endedAt?: string | null;
  criteria?: string;
  joinedUsersCount?: number;
  isJoined?: boolean;
}

export interface JoinedUser {
  uid: string;
  name: string;
  username?: string;
  photoUrl?: string;
  industry?: string;
  isOnline?: boolean;
}

export const bossUpService = {
  async getCategories(): Promise<BossUpCategory[]> {
    try {
      const res = await apiClient.get('/industry/user-count');
      const data = res.data?.data || res.data?.message || [];
      const rows: any[] = Array.isArray(data) ? data : (data.rows || []);

      const filtered = rows
        .map((cat: any) => ({
          industryId: String(cat.industryId || cat.id || cat._id),
          categoryId: cat.categoryId,
          industry: cat.industry || cat.name || '',
          photo: cat.photo || '',
          description: cat.description || '',
          award: cat.award || 'Win',
          startAt: cat.startAt || null,
          endedAt: cat.endedAt || null,
          criteria: cat.criteria || '',
          joinedUsersCount: Number(cat.joinedUsersCount || cat.userCount || 0),
        }))
        .filter((cat: BossUpCategory) => {
          const isTargetCategory = cat.categoryId === '-Mos1VMlx3oxZFRaw_BH';
          const isMainBossUp = cat.industryId === '-MsUOGcOT9oRXGakCcJv';
          const notEnded = !cat.endedAt || new Date(cat.endedAt).getTime() >= Date.now();
          return (isTargetCategory && notEnded) || isMainBossUp;
        });

      filtered.sort((a, b) => {
        if (a.industryId === '-MsUOGcOT9oRXGakCcJv') return -1;
        if (b.industryId === '-MsUOGcOT9oRXGakCcJv') return 1;
        return a.industry.localeCompare(b.industry);
      });

      return filtered;
    } catch (e) {
      console.error('Failed to load boss up categories', e);
      return [];
    }
  },

  /**
   * Fetch forums/posts belonging to an industry challenge
   * Backend endpoint: GET /forum/get-industry-forums/:industryId?size=50&page=0
   */
  async getIndustryForums(industryId: string, page = 0, size = 50): Promise<{ count: number; posts: Post[] }> {
    try {
      const res = await apiClient.get(`/forum/get-industry-forums/${industryId}`, {
        params: { page, size },
      });
      const data = res.data?.data || res.data?.message || {};
      const rows: any[] = Array.isArray(data) ? data : (data.rows || []);
      const count = Number(data.count || rows.length);

      const posts: Post[] = rows.map((item: any) => {
        const user = item.user || item.author || {};
        let postImages: string[] = [];
        if (Array.isArray(item.images) && item.images.length > 0) {
          postImages = item.images.filter(Boolean);
        } else if (typeof item.images === 'string' && item.images.trim()) {
          postImages = item.images.split(';').map((s: string) => s.trim()).filter(Boolean);
        } else if (item.photoUrl) {
          postImages = [item.photoUrl];
        } else if (item.image) {
          postImages = [item.image];
        }

        return {
          id: String(item.forumId || item.id || item._id),
          author: {
            id: String(user.uid || user.id || item.userId || ''),
            name: user.name || user.fullname || user.username || 'Business Boss',
            username: user.username || undefined,
            avatarUrl: user.photoUrl || user.avatar || user.profilePicture || '',
            tagline: user.company || user.industry || user.bio || undefined,
            verified: Boolean(user.isVerified || user.verified),
          },
          content: item.title ? `${item.title}\n\n${item.description || ''}` : item.description || '',
          images: postImages,
          createdAt: item.createdAt || new Date().toISOString(),
          likesCount: Array.isArray(item.likes) ? item.likes.length : Number(item.likesCount || 0),
          commentsCount: Array.isArray(item.comments) ? item.comments.length : Number(item.commentsCount || 0),
          coinsCount: Array.isArray(item.coins) ? item.coins.length : Number(item.coinsCount || 0),
          views: Number(item.views || 0),
          category: item.industry?.industry || undefined,
          type: 'forum',
        };
      });

      return { count, posts };
    } catch (e) {
      console.error('Failed to load industry forums', e);
      return { count: 0, posts: [] };
    }
  },

  /**
   * Fetch members who joined the industry
   * Backend endpoint: GET /industry/get-joined-users/:industryId?size=50&page=0
   */
  async getJoinedUsers(industryId: string, page = 0, size = 50): Promise<JoinedUser[]> {
    try {
      const res = await apiClient.get(`/industry/get-joined-users/${industryId}`, {
        params: { page, size },
      });
      const data = res.data?.data || res.data?.message || {};
      const rows: any[] = Array.isArray(data) ? data : (data.rows || []);

      return rows.map((u: any) => ({
        uid: String(u.uid || u.userId || u.id || ''),
        name: u.name || u.fullname || u.username || 'Business Boss',
        username: u.username || undefined,
        photoUrl: u.photoUrl || u.avatar || '',
        industry: u.industry || u.company || '',
        isOnline: Boolean(u.isOnline),
      }));
    } catch (e) {
      console.error('Failed to load joined users', e);
      return [];
    }
  },

  /**
   * Toggle join/leave industry
   * Backend endpoint: PUT /industry/join-leave-industry/:industryId
   */
  async toggleJoinIndustry(industryId: string): Promise<boolean> {
    try {
      const res = await apiClient.put(`/industry/join-leave-industry/${industryId}`);
      return res.status === 200 || res.status === 201;
    } catch (e) {
      console.error('Failed to toggle industry join status', e);
      return false;
    }
  },
};
