import { apiClient } from '../lib/apiClient';
import { Post } from '../components/feed/PostCard';

export interface CreatePostPayload {
  text: string;
  image?: string;
}

export const postService = {
  /**
   * Fetch timeline posts matching mobile home_controller.dart:
   * 1. Fetches from /post/all-posts-new or /init/new
   * 2. Unpacks response.data (which returns { posts: { rows: [] }, forums: { rows: [] }, courses: { rows: [] } })
   * 3. Flattens and mixes posts and community forums, sorted by timestamp DESC
   */
  async getPosts(tab: 'forYou' | 'following' = 'forYou', page = 0, limit = 20): Promise<Post[]> {
    try {
      const endpoint = tab === 'forYou' ? '/post/all-posts-new' : '/post/get-posts';
      const res = await apiClient.get(endpoint, {
        params: { page, size: limit },
      });

      const responseData = res.data?.data || res.data;
      if (!responseData) return [];

      let rawPosts: any[] = [];
      let rawForums: any[] = [];
      let rawCourses: any[] = [];

      // Check if wrapped in { posts: { rows: [...] } } structure as in /post/all-posts-new
      if (responseData.posts?.rows && Array.isArray(responseData.posts.rows)) {
        rawPosts = responseData.posts.rows;
      } else if (Array.isArray(responseData.posts)) {
        rawPosts = responseData.posts;
      } else if (Array.isArray(responseData)) {
        rawPosts = responseData;
      }

      // Check for forums (Boss Up challenge posts & community discussions)
      if (responseData.forums?.rows && Array.isArray(responseData.forums.rows)) {
        rawForums = responseData.forums.rows;
      } else if (Array.isArray(responseData.forums)) {
        rawForums = responseData.forums;
      }

      // Check for courses
      if (responseData.courses?.rows && Array.isArray(responseData.courses.rows)) {
        rawCourses = responseData.courses.rows;
      } else if (Array.isArray(responseData.courses)) {
        rawCourses = responseData.courses;
      }

      // Map standard posts
      const mappedPosts: (Post & { timestamp: number })[] = rawPosts.map((item: any) => {
        const ts = Number(item.timestamp) || (item.createdAt ? new Date(item.createdAt).getTime() : Date.now());
        const user = item.user || item.author || {};
        const forum = item.forum || {};
        const industry = item.industry?.industry || forum.industry?.industry || user.industry || undefined;

        // Extract images from all possible formats
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

        const coinsCount = Array.isArray(item.coins) ? item.coins.length : Number(item.coinsCount) || 0;

        return {
          id: String(item.postId || item.id || item._id),
          author: {
            id: String(item.userId || user.uid || user.id || ''),
            name: user.name || user.fullname || user.username || 'Business Boss',
            username: user.username || undefined,
            avatarUrl: user.photoUrl || user.avatar || user.profilePicture || '',
            isPro: !!(user.isSubscribed || user.isBossPro),
          },
          content: item.title || item.text || item.content || item.description || '',
          images: postImages,
          createdAt: new Date(ts).toLocaleDateString(),
          category: industry && industry !== 'General Business' ? industry : undefined,
          likesCount: Array.isArray(item.likes) ? item.likes.length : Number(item.likesCount) || 0,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : Number(item.commentsCount) || 0,
          coinsCount: coinsCount,
          repostsCount: Array.isArray(item.reposts) ? item.reposts.length : Number(item.repostsCount) || 0,
          isLiked: !!item.isLiked,
          isCoined: !!item.isCoined,
          isBookmarked: !!item.isBookmarked,
          isReposted: !!item.isReposted,
          isBoosted: !!item.promote,
          timestamp: ts,
        };
      });

      // Map community forums (e.g. Boss Up challenge posts)
      const mappedForums: (Post & { timestamp: number })[] = rawForums.map((item: any) => {
        const ts = Number(item.timestamp) || (item.createdAt ? new Date(item.createdAt).getTime() : Date.now());
        const user = item.user || {};
        const industry = item.industry?.industry || 'Boss Up Challenge';

        // Extract images from all possible formats
        let forumImages: string[] = [];
        if (Array.isArray(item.images) && item.images.length > 0) {
          forumImages = item.images.filter(Boolean);
        } else if (typeof item.images === 'string' && item.images.trim()) {
          forumImages = item.images.split(';').map((s: string) => s.trim()).filter(Boolean);
        } else if (item.photo) {
          forumImages = [item.photo];
        } else if (item.photoUrl) {
          forumImages = [item.photoUrl];
        }

        const coinsCount = Array.isArray(item.coins) ? item.coins.length : Number(item.coinsCount) || 0;

        return {
          id: String(item.forumId || item.id),
          author: {
            id: String(item.userId || user.uid || ''),
            name: user.name || user.fullname || user.username || 'Boss Up Member',
            username: user.username || undefined,
            avatarUrl: user.photoUrl || user.avatar || '',
            isPro: !!(user.isSubscribed || user.isBossPro),
          },
          content: item.description || item.title || '',
          images: forumImages,
          createdAt: new Date(ts).toLocaleDateString(),
          category: industry,
          likesCount: Array.isArray(item.likes) ? item.likes.length : 0,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
          coinsCount: coinsCount,
          repostsCount: 0,
          isLiked: false,
          isCoined: false,
          isBookmarked: false,
          isReposted: false,
          isBoosted: !!item.promote,
          timestamp: ts,
        };
      });

      // Unified organic list sorted by timestamp DESC (mobile mixPostandPromoted algorithm)
      const combined = [...mappedPosts, ...mappedForums].sort((a, b) => b.timestamp - a.timestamp);

      // Return clean Post objects
      return combined.map(({ timestamp, ...post }) => post);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      return [];
    }
  },

  /**
   * Create a new post
   */
  async createPost(payload: CreatePostPayload): Promise<any> {
    const res = await apiClient.post('/post/create-post', payload);
    return res.data;
  },

  /**
   * Generate AI advertising / promotional post copy
   */
  async generateAiCopy(prompt: string): Promise<string> {
    const res = await apiClient.post('/ai-promote/generate', { prompt });
    if (res.data?.success && res.data?.data) {
      const generated = res.data.data.content || res.data.data.text || res.data.data;
      return typeof generated === 'string' ? generated : JSON.stringify(generated);
    }
    throw new Error(res.data?.message || 'Failed to generate copy');
  },
};
