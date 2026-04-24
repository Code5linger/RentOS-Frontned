// src/lib/api/auth.api.ts
import { apiClient } from './client';
import { User, AuthTokens, ApiResponse } from '@/lib/types';

export interface RegisterPayload {
  email: string;
  password: string;
  role: 'OWNER' | 'TENANT';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      '/auth/register',
      payload,
    ),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      '/auth/login',
      payload,
    ),

  logout: () => apiClient.post('/auth/logout'),

  refresh: () => apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh'),
};
