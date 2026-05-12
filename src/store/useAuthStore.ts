import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/type';
import { userService } from '@/services/userService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
  fetchProfile: () => Promise<void>;
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

      fetchProfile: async () => {
        try {
          const response = await userService.getProfile();
          if (response.success && response.data?.user) {
            const backendUser = response.data.user;
            
            // Storage calculation logic
            const plan = backendUser.subscription_plan?.toLowerCase() || 'free';
            const cycle = backendUser.billing_cycle || 'monthly';
            
            let storageLimit = 5; // Default for Free
            if (plan === 'starter') storageLimit = cycle === 'annual' ? 25 : 10;
            else if (plan === 'pro') storageLimit = cycle === 'annual' ? 30 : 15;
            else if (plan === 'enterprise') storageLimit = cycle === 'annual' ? 40 : 20;

            const updatedUser: User = {
              id: backendUser._id || backendUser.id,
              name: backendUser.name,
              email: backendUser.email,
              avatar: backendUser.profile_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.email}`,
              bio: backendUser.bio || '',
              role: backendUser.role || 'user',
              storageUsed: Number((backendUser.storage_used / (1024 * 1024)).toFixed(2)) || 0,
              storageLimit: storageLimit,
              subscription: plan as any,
              billingCycle: cycle as any,
              lastResetDate: backendUser.last_quota_reset,
              followers: backendUser.followers_count || 0,
              following: backendUser.following_count || 0,
            };
            set({ user: updatedUser, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
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
