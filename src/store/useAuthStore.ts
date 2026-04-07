import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../mock/data';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email && password) {
          const mockUser: User = {
            id: 'u1',
            name: 'Manali',
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role: 'admin',
            subscription: 'pro',
            storageUsed: 450,
            storageLimit: 1024,
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email && password && name) {
          const mockUser: User = {
            id: `u${Date.now()}`,
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            role: 'user',
            subscription: 'starter',
            storageUsed: 0,
            storageLimit: 250,
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'pixora_auth', // key in localStorage
      // Only persist user; derive isAuthenticated on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
