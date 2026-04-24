// src/lib/stores/auth.store.ts
import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setAuth: (user, accessToken) => set({ user, accessToken }),
  setToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setHydrated: () => set({ isHydrated: true }),
}));
