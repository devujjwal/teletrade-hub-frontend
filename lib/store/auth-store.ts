'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  login: (token: string, user: User, isAdmin?: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      login: (token, user, isAdmin = false) => {
        set({ token, user, isAdmin });
        // Also sync to individual keys for API client compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
        }
      },
      logout: () => {
        set({ token: null, user: null, isAdmin: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('is_admin');
        }
      },
      initialize: () => {
        // Sync from localStorage on mount (Zustand persist handles this, but we ensure compatibility)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          const userStr = localStorage.getItem('user');
          const isAdminStr = localStorage.getItem('is_admin');
          
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              const isAdmin = isAdminStr === 'true';
              set({ token, user, isAdmin });
            } catch (error) {
              console.error('Error parsing user from localStorage:', error);
            }
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

