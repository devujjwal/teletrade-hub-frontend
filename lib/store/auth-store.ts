'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  _hasHydrated: boolean;
  login: (token: string, user: User, isAdmin?: boolean) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAdmin: false,
      _hasHydrated: false,
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
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after rehydration completes
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

