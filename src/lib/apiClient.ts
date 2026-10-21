import axios from 'axios';
import { StorageEnum } from '../common/emums/StorageEmuns';
import { ServerUrl } from '../config/config';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ServerUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Read token from localStorage (matches website's existing ServiceApi auth)
  return localStorage.getItem(StorageEnum.AccessToken) || localStorage.getItem('bb_access_token');
}

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(StorageEnum.AccessToken);
        localStorage.removeItem('bb_access_token');
        if (!window.location.pathname.startsWith('/auth') && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

