// src/lib/api/client.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/lib/stores/auth.store';

const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://rentos-xa8c.onrender.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true, // send httpOnly refresh token cookie
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach access token ──────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — silent token refresh ────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string): void {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 on non-refresh endpoint — attempt silent refresh
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.post<{
          success: true;
          data: { accessToken: string; refreshToken: string };
        }>('/auth/refresh');

        const newToken = res.data.data.accessToken;
        useAuthStore.getState().setToken(newToken);
        processQueue(newToken);

        original.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().clearAuth();
        // Redirect to login — works in client components
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
