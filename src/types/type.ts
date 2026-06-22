
export interface User {
  id: string;
  name: string;
  email: string;
  profile_url: string;
  bio: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  followers: number;
  following: number;
  followingIds: string[];
  lastResetDate?: string; // For yearly reset logic
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  user_profile_url: string;
  text: string;
  createdAt: string;
}

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  author_profile_url: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  category: string;
  createdAt: string;
  type: 'image' | 'video' | 'gif';
  comments?: Comment[];
  views: number;
  authorFollowers: number;
}

export interface ApiErrorResponse {
  success: boolean;
  error?: {
    message: string;
    code: string;
    statusCode: number;
    stack?: string;
  };
  message?: string;
}
export interface Board {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  pinIds: string[];
  pins?: any[];
  totalPins?: number;
  userId: string;
  isPrivate: boolean;
  createdAt: string;
}
