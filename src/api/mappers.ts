/**
 * Data Mappers
 * Functions to transform backend API responses into frontend models.
 * Keeps our UI and hooks clean of API-specific field names (like _id or plan_type).
 */

import { UserProfile } from '@/services/authService';
import { User } from '@/types/type';

// user mapper to transform backend user profile to frontend user interface
export const userMapper = {
  /**
   * Transforms a backend UserProfile into the frontend User interface.
   */
  toFrontend: (apiUser: UserProfile): User => {
    return {
      id: apiUser._id,
      name: apiUser.name,
      email: apiUser.email,
      profile_url: apiUser.profile_url || '',
      role: (apiUser.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
      subscription: (apiUser.plan_type || 'free') as 'free' | 'starter' | 'pro' | 'enterprise',
      storageUsed: Number(((apiUser.storage_used || 0) / (1024 * 1024)).toFixed(2)),
      storageLimit: (() => {
        const plan = (apiUser.plan_type || 'free').toLowerCase();
        const cycle = (apiUser.billing_period || 'monthly').toLowerCase();
        if (plan === 'starter') return cycle === 'yearly' ? 500 : 300;
        if (plan === 'pro') return cycle === 'yearly' ? 800 : 600;
        if (plan === 'enterprise') return cycle === 'yearly' ? 1024 : 900;
        return 150; // Default for free
      })(),
      bio: '', // Backend doesn't provide bio yet
      followers: 0,
      following: 0,
      followingIds: [],
      billingCycle: 'monthly', // Default assumption
      lastResetDate: apiUser.updated_at,
    };
  },
};
