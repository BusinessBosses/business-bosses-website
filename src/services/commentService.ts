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
   * Helper to normalize a raw comment object from API into CommentItem
   */
  normalizeComment(c: any): CommentItem {
    const userObj = c.user || {};
    return {
      id: String(c.id || c.commentId || c._id || Math.random().toString(36).substring(2)),
      userId: String(c.userId || userObj.uid || userObj.id || ''),
      postId: String(c.postId || ''),
      text: c.comment || c.text || c.message || '',
      createdAt: c.createdAt
        ? new Date(c.createdAt).toLocaleDateString()
        : c.timestamp
        ? new Date(Number(c.timestamp)).toLocaleDateString()
        : 'Recently',
      user: {
        name: userObj.name || userObj.fullname || userObj.username || 'Boss Member',
        username: userObj.username || undefined,
        avatarUrl: userObj.photoUrl || userObj.avatar || userObj.profilePicture || '',
        isPro: !!(userObj.isSubscribed || userObj.isBossPro),
      },
    };
  },

  /**
   * Get all comments for a post
   * Tolerantly handles { rows: [...] }, bare arrays, and wrapped responses
   */
  async getPostComments(postId: string, initialComments?: any[]): Promise<CommentItem[]> {
    try {
      const res = await apiClient.get(`/comments/post/${postId}`);
      let list: any[] = [];

      // Backend CommentController returns MessageResponse.successResponse(res, "...", 200, { count, rows })
      // which produces { success: true, message: "...", data: { count, rows: [...] } }
      if (res.data?.data?.rows && Array.isArray(res.data.data.rows)) {
        list = res.data.data.rows;
      } else if (Array.isArray(res.data?.data)) {
        list = res.data.data;
      } else if (res.data?.message?.rows && Array.isArray(res.data.message.rows)) {
        list = res.data.message.rows;
      } else if (Array.isArray(res.data?.message)) {
        list = res.data.message;
      } else if (res.data?.rows && Array.isArray(res.data.rows)) {
        list = res.data.rows;
      }

      if (list.length > 0) {
        return list.map(this.normalizeComment);
      }

      // If the GET endpoint returned empty but the feed post already came with preloaded comments,
      // fall back to the post's embedded comments
      if (Array.isArray(initialComments) && initialComments.length > 0) {
        return initialComments.map(this.normalizeComment);
      }

      return [];
    } catch (err) {
      console.warn('Could not load comments from API, checking fallback comments', err);
      if (Array.isArray(initialComments) && initialComments.length > 0) {
        return initialComments.map(this.normalizeComment);
      }
      return [];
    }
  },

  /**
   * Add a new comment to a post
   */
  async addComment(postId: string, text: string, receiverUid?: string): Promise<any> {
    const res = await apiClient.post('/comments', {
      postId,
      comment: text,
      text,
      timestamp: Date.now(),
      receiverUid,
    });
    return res.data;
  },
};

export default commentService;
