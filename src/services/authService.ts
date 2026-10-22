import { apiClient } from '../lib/apiClient';
import { StorageEnum } from '../common/emums/StorageEmuns';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    token?: string;
    uid?: string;
    user?: any;
    [key: string]: any;
  };
  accessToken?: string;
  token?: string;
  [key: string]: any;
}

export const authService = {
  /**
   * Helper to extract JWT token from diverse backend response shapes
   */
  extractToken(res: any): string | null {
    if (!res) return null;
    return (
      res.data?.accessToken ||
      res.data?.token ||
      res.accessToken ||
      res.token ||
      null
    );
  },

  /**
   * Sign in an existing user
   */
  async signIn(payload: SignInPayload): Promise<AuthResponse> {
    const res = await apiClient.post('/auth/sign-in', payload);
    return res.data;
  },

  /**
   * Register a new user
   */
  async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    const res = await apiClient.post('/auth/sign-up', payload);
    return res.data;
  },

  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token =
      localStorage.getItem(StorageEnum.AccessToken) ||
      localStorage.getItem('bb_access_token');
    return !!token && token !== 'undefined' && token !== 'null';
  },

  /**
   * Save session token
   */
  setToken(token: string, uid?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(StorageEnum.AccessToken, token);
    localStorage.setItem('bb_access_token', token);
    if (uid) {
      localStorage.setItem('bb_user_uid', uid);
    }
  },

  /**
   * Get current authenticated user ID
   */
  getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    const directUid = localStorage.getItem('bb_user_uid');
    if (directUid) return directUid;
    // Decode from JWT payload if not directly stored
    const token = localStorage.getItem(StorageEnum.AccessToken) || localStorage.getItem('bb_access_token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(atob(payloadBase64));
          return decoded.uid || decoded.id || null;
        }
      } catch (e) {
        // Ignore decode error
      }
    }
    return null;
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<any> {
    try {
      const res = await apiClient.get('/users/me');
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      return res.data || null;
    } catch (err) {
      console.warn('Could not retrieve current user profile', err);
      return null;
    }
  },

  /**
   * Remove session token and clear session
   */
  signOut(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(StorageEnum.AccessToken);
    localStorage.removeItem('bb_access_token');
    window.location.href = '/login';
  },
};

export default authService;
