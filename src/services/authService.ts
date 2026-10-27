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
   * Sign in or Sign up with Google OAuth
   */
  async googleSignIn(payload: { token: string; email?: string }): Promise<AuthResponse> {
    const res = await apiClient.post('/auth/google-sign-in', payload);
    return res.data;
  },

  /**
   * Check if username or email exists
   */
  async checkExists(payload: { username?: string; email?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await apiClient.post('/auth/email-exist', {
        username: payload.username || '',
        email: payload.email || '',
      });
      return { success: res.data?.success !== false };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data?.error || 'Already exists',
      };
    }
  },

  /**
   * Request OTP for password reset
   */
  async requestOtp(email: string): Promise<any> {
    const res = await apiClient.post('/auth/request-otp', { email });
    return res.data;
  },

  /**
   * Verify OTP for email / password reset
   */
  async verifyOtp(payload: { email: string; otp: string }): Promise<any> {
    const res = await apiClient.post('/auth/verify-email', payload);
    return res.data;
  },

  /**
   * Reset Password
   */
  async resetPassword(payload: { email: string; newPassword: string }): Promise<any> {
    const res = await apiClient.post('/auth/reset-password', payload);
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
    localStorage.setItem('hasLoggedInBefore', 'true');
    if (uid) {
      localStorage.setItem(StorageEnum.UserId, uid);
      localStorage.setItem('userId', uid);
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
    // 1. Return memory or cached profile immediately if available
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('bb_user_profile') || localStorage.getItem('user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.name || parsed.username)) {
            // Still background fetch to keep fresh
            this.fetchAndCacheUser().catch(() => {});
            return parsed;
          }
        }
      } catch {}
    }

    return await this.fetchAndCacheUser();
  },

  async fetchAndCacheUser(): Promise<any> {
    try {
      const res = await apiClient.get('/users/me');
      const data = res.data?.data || (res.data?.uid || res.data?.id ? res.data : null);
      if (data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('bb_user_profile', JSON.stringify(data));
          localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
      }
    } catch (err) {
      console.warn('Could not retrieve current user profile from /users/me', err);
    }

    // Fallback: If /users/me failed, try by stored user ID
    const uid = this.getUserId();
    if (uid) {
      try {
        const userRes = await apiClient.get(`/users/${uid}`);
        const data = userRes.data?.data || userRes.data;
        if (data) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('bb_user_profile', JSON.stringify(data));
            localStorage.setItem('user', JSON.stringify(data));
          }
          return data;
        }
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
