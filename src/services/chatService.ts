import { apiClient } from '../lib/apiClient';

export interface ChatMessage {
  id?: string | number;
  messageId: string;
  senderUid: string;
  receiverUid: string;
  messageText?: string;
  image?: string;
  timestamp: number | string;
  seen: boolean;
  sender?: {
    uid: string;
    username?: string;
    name?: string;
    surname?: string;
    photoUrl?: string;
    isSubscribed?: boolean;
  };
  receiver?: {
    uid: string;
    username?: string;
    name?: string;
    surname?: string;
    photoUrl?: string;
    isSubscribed?: boolean;
  };
  user?: {
    uid: string;
    username?: string;
    name?: string;
    surname?: string;
    photoUrl?: string;
    isSubscribed?: boolean;
  };
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerPhoto?: string;
  isSubscribed?: boolean;
  lastMessage: string;
  lastTimestamp: number | string;
  unreadCount: number;
  isIncomingRequest: boolean; // true if received message but never replied
}

export const chatService = {
  async getChats(page = 0, size = 50): Promise<ChatMessage[]> {
    try {
      const res = await apiClient.get(`/chats?page=${page}&size=${size}`);
      const data = res.data?.data || res.data?.message || [];
      const list: any[] = Array.isArray(data) ? data : (data.rows || []);
      return list;
    } catch (e) {
      console.error('Failed to get chats', e);
      return [];
    }
  },

  async sendMessage(receiverUid: string, messageText: string, image?: string): Promise<any> {
    try {
      const res = await apiClient.post('/chats', {
        receiverUid,
        messageText,
        image,
      });
      return res.data;
    } catch (e) {
      console.error('Failed to send message', e);
      throw e;
    }
  },

  async markAsSeen(senderUid: string): Promise<any> {
    try {
      const res = await apiClient.put('/chats/seen', { senderUid });
      return res.data;
    } catch (e) {
      console.error('Failed to mark seen', e);
    }
  },

  /**
   * Delete a conversation thread with a partner
   */
  async deleteChat(chatPartyId: string): Promise<any> {
    try {
      // First try REST if available
      const res = await apiClient.delete(`/chats/party/${chatPartyId}`).catch(() => null);
      return res?.data;
    } catch (e) {
      console.error('Failed to delete chat', e);
    }
  },

  /**
   * Calculate total unread messages count for the given user from their chat messages.
   * Counts all incoming messages where seen is false and receiverUid matches the current user.
   */
  async getUnreadCount(currentUid?: string): Promise<number> {
    try {
      const chats = await this.getChats(0, 100);
      if (!chats || chats.length === 0) return 0;
      
      const unread = chats.filter((msg) => {
        const isReceiver = currentUid ? msg.receiverUid === currentUid : true;
        return isReceiver && !msg.seen;
      });
      return unread.length;
    } catch (e) {
      console.error('Failed to calculate unread chat count', e);
      return 0;
    }
  },
};
