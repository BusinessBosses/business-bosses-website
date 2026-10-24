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
   * Fetch Learning industries (Learn New Skills)
   * Mobile parity: Constants.LEARNINGID = '-Mos1VMnV53H7AZa0W8p'
   */
  async getLearningCategories(): Promise<BossUpCategory[]> {
    try {
      const res = await apiClient.get('/industry/user-count');
      const data = res.data?.data || res.data?.message || [];
      const rows: any[] = Array.isArray(data) ? data : (data.rows || []);

      const learningIndustries = rows
        .filter((cat: any) => cat.categoryId === '-Mos1VMnV53H7AZa0W8p')
        .map((cat: any) => ({
          industryId: String(cat.industryId || cat.id || cat._id),
          categoryId: cat.categoryId,
          industry: cat.industry || cat.name || '',
          photo: cat.photo || '',
          description: cat.description || '',
          award: 'Learn',
          criteria: cat.criteria || '',
          joinedUsersCount: Number(cat.joinedUsersCount || cat.userCount || 0),
        }));

      learningIndustries.sort((a, b) => a.industry.localeCompare(b.industry));
      return learningIndustries;
    } catch (e) {
      console.error('Failed to load learning categories', e);
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

        const isRanked = item.isRanked === true || user.isRanked === true;

        return {
          id: String(item.forumId || item.id || item._id),
          author: {
            id: String(user.uid || user.id || item.userId || ''),
            name: user.name || user.fullname || user.username || 'Business Boss',
            username: user.username || undefined,
            avatarUrl: user.photoUrl || user.avatar || user.profilePicture || '',
            tagline: user.company || user.industry || user.bio || undefined,
            verified: Boolean(user.isVerified || user.verified),
            isPro: Boolean(user.isSubscribed || user.isPro),
          },
          content: item.title ? `${item.title}\n\n${item.description || ''}` : item.description || '',
          images: postImages,
          createdAt: item.createdAt || new Date().toISOString(),
          likesCount: Array.isArray(item.likes) ? item.likes.length : Number(item.likesCount || 0),
          commentsCount: Array.isArray(item.comments) ? item.comments.length : Number(item.commentsCount || 0),
          coinsCount: Array.isArray(item.coins) ? item.coins.length : Number(item.coinsCount || 0),
          views: Number(item.views || 0),
          category: item.industry?.industry || undefined,
          isRanked,
          type: 'forum',
        };
      });

      // Mobile parity sorting (bossup_controller.dart lines 59-93):
      // 1. Ranked forums (Boss of the week) first
      // 2. Non-ranked forums sorted descending by likesCount (most likes first)
      const rankedPosts = posts.filter((p) => p.isRanked);
      const nonRankedPosts = posts.filter((p) => !p.isRanked);

      nonRankedPosts.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

      const sortedPosts = [...rankedPosts, ...nonRankedPosts];

      return { count, posts: sortedPosts };
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

  /**
   * Fetch Previous Winners for Boss Up Challenge
   * Backend endpoint: GET /users/bossup-winners
   */
  async getBossUpWinners(): Promise<any[]> {
    try {
      const res = await apiClient.get('/users/bossup-winners');
      const data = res.data?.data || res.data?.message || [];
      return Array.isArray(data) ? data : (data.rows || []);
    } catch (e) {
      console.error('Failed to load bossup winners', e);
      return [];
    }
  },

  /**
   * Create an entry / forum in Boss Up Challenge
   * Backend endpoint: POST /forum/create
   */
  async createForumEntry(body: {
    title: string;
    description: string;
    industryId: string;
    ytUrl?: string;
    images?: string[];
  }): Promise<boolean> {
    try {
      let imageString: string | null = null;
      if (body.images && body.images.length > 0) {
        imageString = body.images.join(';');
      } else if (body.ytUrl && body.ytUrl.trim() !== '') {
        imageString = 'https://api.businessbosses.co.uk/appfiles/1698854755_13_download_(1).png';
      }

      const payload = {
        title: body.title,
        description: body.description,
        timestamp: Date.now(),
        industryId: body.industryId,
        ytUrl: body.ytUrl || null,
        images: imageString,
      };

      const res = await apiClient.post('/forum/create', payload);
      return res.status === 200 || res.status === 201;
    } catch (e) {
      console.error('Failed to create forum entry', e);
      throw e;
    }
  },
};
