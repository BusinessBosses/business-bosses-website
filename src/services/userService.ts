import { apiClient } from '../lib/apiClient';

export interface UserProfileData {
  id?: string;
  uid?: string;
  name?: string;
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  bio?: string;
  description?: string;
  photoUrl?: string;
  avatarUrl?: string;
  profilePicture?: string;
  preferredCurrency?: string;
  hasShop?: boolean;
  coinsCount?: number;
  [key: string]: any;
}

export interface UpdateUserProfilePayload {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  preferredCurrency?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Get user profile by UID
   */
  async getUserById(uid: string): Promise<UserProfileData | null> {
    try {
      const res = await apiClient.get(`/users/${uid}`);
      return res.data?.data || res.data || null;
    } catch (err) {
      console.error('Failed to get user by id', err);
      throw err;
    }
  },

  /**
   * Get user profile by username
   */
  async getUserByUsername(username: string): Promise<UserProfileData | null> {
    try {
      const res = await apiClient.get(`/users/username/${encodeURIComponent(username)}`);
      return res.data?.data || res.data || null;
    } catch (err) {
      console.error('Failed to get user by username', err);
      throw err;
    }
  },

  /**
   * Update user profile details
   */
  async updateProfile(uid: string, payload: UpdateUserProfilePayload): Promise<UserProfileData> {
    try {
      const res = await apiClient.put(`/users/${uid}`, payload);
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Failed to update user profile', err);
      throw err;
    }
  },

  /**
   * Update user preferred currency
   */
  async updatePreferredCurrency(uid: string, currency: string): Promise<any> {
    try {
      const res = await apiClient.put(`/users/${uid}`, { preferredCurrency: currency });
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Failed to update preferred currency', err);
      throw err;
    }
  },

  /**
   * Change user password
   */
  async updatePassword(payload: UpdatePasswordPayload): Promise<any> {
    try {
      const res = await apiClient.post('/users/update-password', payload);
      return res.data;
    } catch (err) {
      console.error('Failed to update password', err);
      throw err;
    }
  },

  /**
   * Delete user account permanently
   */
  async deleteAccount(uid: string): Promise<any> {
    try {
      const res = await apiClient.delete(`/users/${uid}`);
      return res.data;
    } catch (err) {
      console.error('Failed to delete user account', err);
      throw err;
    }
  },
};

export default userService;
