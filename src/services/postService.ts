import { apiClient } from '../lib/apiClient';
import { Post } from '../components/feed/PostCard';

export interface CreatePostPayload {
  text: string;
  image?: string;
}

export const postService = {
  /**
   * Fetch timeline posts based on filter tab
   */
  async getPosts(tab: 'forYou' | 'following' = 'forYou', page = 1, limit = 15): Promise<Post[]> {
    const endpoint = tab === 'forYou' ? '/post/all-posts-new' : '/post/get-posts';
    const res = await apiClient.get(endpoint, {
      params: { page, limit },
    });

    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((item: any) => ({
        id: String(item.id || item._id),
        author: {
          id: String(item.userId || item.author?.id || ''),
          name: item.author?.name || item.user?.name || item.userName || 'Business Boss',
          username: item.author?.username || item.user?.username || item.userHandle || undefined,
          avatarUrl: item.author?.avatarUrl || item.user?.avatar || item.userAvatar || 'https://i.pravatar.cc/150?img=12',
          isPro: !!(item.author?.isPro || item.user?.isPro || item.isBossPro),
        },
        content: item.text || item.content || item.description || '',
        images: item.image ? [item.image] : item.images || [],
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now',
        likesCount: item.likesCount || item.likes?.length || 0,
        commentsCount: item.commentsCount || item.comments?.length || 0,
        isLiked: !!item.isLiked,
        isBookmarked: !!item.isBookmarked,
      }));
    }
    return [];
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

  /**
   * Toggle post like
   */
  async toggleLike(postId: string): Promise<any> {
    const res = await apiClient.post('/likes', { postId });
    return res.data;
  },
};

export default postService;
