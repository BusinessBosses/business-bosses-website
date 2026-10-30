import { apiClient } from '../lib/apiClient';

export interface NotificationItem {
  notificationId: string;
  dataId?: string;
  senderUid?: string;
  message: string;
  title: string;
  timestamp: number;
  receiverUid?: string;
  isRead?: boolean;
  notificationType?: string;
  username?: string;
  image?: string;
  user?: {
    uid?: string;
    username?: string;
    name?: string;
    photoUrl?: string;
  };
}

export interface QuoteData {
  id?: number | string;
  message?: string;
  by?: string;
}

export interface NotificationsResponse {
  quote?: QuoteData | null;
  notifications: NotificationItem[];
  count: number;
}

export const notificationService = {
  /**
   * Fetch paginated notifications for current user
   */
  async getNotifications(page = 0, size = 50): Promise<NotificationsResponse> {
    try {
      const res = await apiClient.get(`/notification?page=${page}&size=${size}`);
      if (res.data?.success) {
        const rows: NotificationItem[] =
          res.data.data?.notifications?.rows ||
          (Array.isArray(res.data.data?.notifications) ? res.data.data.notifications : []);
        const count: number =
          res.data.data?.notifications?.count ?? rows.length;
        const quote: QuoteData | null = res.data.data?.quote || null;

        return {
          quote,
          notifications: rows,
          count,
        };
      }
      return { quote: null, notifications: [], count: 0 };
    } catch (err) {
      console.error('Failed to get notifications', err);
      throw err;
    }
  },

  /**
   * Get unread notifications count for the current user.
   * Checks user record first or falls back to checking unread items in notifications.
   */
  async getUnreadCount(fallbackUnReadCount?: number): Promise<number> {
    try {
      if (typeof fallbackUnReadCount === 'number' && fallbackUnReadCount > 0) {
        return fallbackUnReadCount;
      }
      // If user unReadCount is undefined or 0, also check the live notifications list
      const res = await this.getNotifications(0, 30);
      if (res && Array.isArray(res.notifications)) {
        const unreadItems = res.notifications.filter((n) => n.isRead === false);
        return unreadItems.length;
      }
      return fallbackUnReadCount ?? 0;
    } catch (e) {
      return fallbackUnReadCount ?? 0;
    }
  },

  /**
   * Delete a notification by ID
   */
  async deleteNotification(notificationId: string): Promise<any> {
    try {
      const res = await apiClient.delete(`/notification/${notificationId}`);
      return res.data;
    } catch (err) {
      console.error('Failed to delete notification', err);
      throw err;
    }
  },
};

export default notificationService;
