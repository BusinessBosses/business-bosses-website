import { apiClient } from '../lib/apiClient';

export interface CommentItem {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
    username?: string;
    avatarUrl?: string;
    isPro?: boolean;
  };
}

export const commentService = {
  /**
   * Get all comments for a post
   */
  async getPostComments(postId: string): Promise<CommentItem[]> {
    try {
      const res = await apiClient.get(`/comments/post/${postId}`);
      const data = res.data?.data || res.data?.message || [];
      if (Array.isArray(data)) {
        return data.map((c: any) => ({
          id: String(c.id || c.commentId || c._id),
          userId: String(c.userId || c.user?.uid || ''),
          postId: String(c.postId),
          text: c.comment || c.text || c.message || '',
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
          user: {
            name: c.user?.name || c.user?.fullname || c.user?.username || 'Boss Member',
            username: c.user?.username || undefined,
            avatarUrl: c.user?.photoUrl || c.user?.avatar || '',
            isPro: !!(c.user?.isSubscribed || c.user?.isBossPro),
          },
        }));
      }
      return [];
    } catch (err) {
      console.warn('Could not load post comments', err);
      return [];
    }
  },

  /**
   * Add a new comment to a post
   */
  async addComment(postId: string, text: string, receiverUid?: string): Promise<any> {
    const res = await apiClient.post('/comments', {
      postId,
      text,
      receiverUid,
    });
    return res.data;
  },
};
