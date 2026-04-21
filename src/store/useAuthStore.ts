import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/type';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
  checkStorageReset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Set after successful API login/signup
      setAuth: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (fields: Partial<User>) => {
        set((state) => {
          if (!state.user) return {};
          const updatedUser = { ...state.user, ...fields };
          return { user: updatedUser };
        });
      },

      checkStorageReset: () => {
        const { user } = get();
        if (!user || user.billingCycle !== 'annual' || !user.lastResetDate) return;

        const lastReset = new Date(user.lastResetDate);
        const now = new Date();
        
        // Check if it's a new month since last reset
        const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

        if (isNewMonth) {
          const updatedUser = { 
            ...user, 
            storageUsed: 0, 
            lastResetDate: now.toISOString() 
          };
          
          set({ user: updatedUser });
          console.log('Storage quota reset for annual plan');
        }
      },
    }),
    {
      name: 'pixora_auth', // key in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
