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
    token?: string;
    uid?: string;
    user?: any;
  };
  token?: string;
}

export const authService = {
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
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(StorageEnum.AccessToken, token);
    localStorage.setItem('bb_access_token', token);
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
