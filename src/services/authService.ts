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
    const directUid =
      localStorage.getItem(StorageEnum.UserId) ||
      localStorage.getItem('userId') ||
      localStorage.getItem('bb_user_uid');
    if (directUid) return directUid;
    // Decode from JWT payload if not directly stored
    const token =
      localStorage.getItem(StorageEnum.AccessToken) ||
      localStorage.getItem('bb_access_token') ||
      localStorage.getItem('accessToken');
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
      if (res.data?.uid || res.data?.id) {
        return res.data;
      }
    } catch (err) {
      console.warn('Could not retrieve current user profile from /users/me', err);
    }

    // Fallback: If /users/me failed, try by stored user ID
    const uid = this.getUserId();
    if (uid) {
      try {
        const userRes = await apiClient.get(`/users/${uid}`);
        if (userRes.data?.data) return userRes.data.data;
        if (userRes.data) return userRes.data;
      } catch (fallbackErr) {
        console.warn('Could not retrieve user by uid fallback', fallbackErr);
      }
    }

    return null;
  },

  /**
   * Synchronous / helper alias for compatibility with components reading cached user
   */
  getUser(): any {
    if (typeof window === 'undefined') return null;
    const directUid = this.getUserId();
    if (!directUid) return null;
    try {
      const cached = localStorage.getItem('bb_user_profile') || localStorage.getItem('user');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return { uid: directUid };
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
