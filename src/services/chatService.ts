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

  async markAsSeen(chatId: string): Promise<any> {
    try {
      const res = await apiClient.put('/chats/seen', { chatId });
      return res.data;
    } catch (e) {
      console.error('Failed to mark seen', e);
    }
  },
};
