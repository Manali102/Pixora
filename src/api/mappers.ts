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
      avatar: apiUser.profile_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
      role: (apiUser.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
      subscription: (apiUser.plan_type || 'free') as 'free' | 'starter' | 'pro' | 'enterprise',
      storageUsed: apiUser.storage_used || 0,
      storageLimit: apiUser.plan_type === 'pro' ? 1024 : 20, // Example: 1GB for pro, 20MB for free
      bio: '', // Backend doesn't provide bio yet
      followers: 0,
      billingCycle: 'monthly', // Default assumption
      lastResetDate: apiUser.updated_at,
    };
  },
};
