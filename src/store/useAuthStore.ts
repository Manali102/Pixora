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
  updateProfileApi: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  fetchProfile: () => Promise<void>;
  checkStorageReset: () => void;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

const transformBackendUser = (backendUser: any): User => {
  // Storage calculation logic
  const plan = backendUser.plan_type?.toLowerCase() || 'free';
  const cycle = backendUser.billing_period?.toLowerCase() || 'monthly';
  
  let storageLimit = 5; // Default for Free
  if (plan === 'starter') storageLimit = cycle === 'yearly' ? 25 : 10;
  else if (plan === 'pro') storageLimit = cycle === 'yearly' ? 30 : 15;
  else if (plan === 'enterprise') storageLimit = cycle === 'yearly' ? 40 : 20;

  return {
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
    followers: backendUser.followers_count || 0,
    following: backendUser.following_count || 0,
    followingIds: backendUser.following_ids || [],
  };
};

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

      updateProfileApi: async (formData: FormData) => {
        const { user } = get();
        if (!user) return { success: false, message: 'User not found' };
        
        try {
          const response = await userService.updateProfile(user.id, formData);
          if (response.success && response.data?.user) {
            const backendUser = response.data.user;
            const updatedUser = transformBackendUser(backendUser);
            set({ user: updatedUser });
            return { success: true };
          }
          return { success: false, message: 'Update failed' };
        } catch (error: any) {
          console.error('Failed to update profile:', error);
          const message = error.response?.data?.error?.message || error.message || 'Failed to update profile';
          return { success: false, message };
        }
      },

      fetchProfile: async () => {
        try {
          const response = await userService.getProfile();
          if (response.success && response.data?.user) {
            const backendUser = response.data.user;
            const updatedUser = transformBackendUser(backendUser);
            set({ user: updatedUser, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      checkStorageReset: () => {
        const { user } = get();
        if (!user || user.billingCycle !== 'yearly' || !user.lastResetDate) return;

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
          console.log('Storage quota reset for yearly plan');
        }
      },

      followUser: async (userId: string) => {
        try {
          const response = await userService.followUser(userId);
          if (response.success) {
            set((state) => {
              if (!state.user) return {};
              return {
                user: {
                  ...state.user,
                  following: state.user.following + 1,
                  followingIds: [...state.user.followingIds, userId],
                },
              };
            });
          }
        } catch (error) {
          console.error('Failed to follow user:', error);
        }
      },

      unfollowUser: async (userId: string) => {
        try {
          const response = await userService.unfollowUser(userId);
          if (response.success) {
            set((state) => {
              if (!state.user) return {};
              return {
                user: {
                  ...state.user,
                  following: state.user.following - 1,
                  followingIds: state.user.followingIds.filter((id) => id !== userId),
                },
              };
            });
          }
        } catch (error) {
          console.error('Failed to unfollow user:', error);
        }
      },
    }),
    {
      name: 'pixora_auth', // key in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
          // Safety: Ensure followingIds is always an array
          if (state.user && !state.user.followingIds) {
            state.user.followingIds = [];
          }
        }
      },
    }
  )
);
