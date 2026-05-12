
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  followers: number;
  following: number;
  lastResetDate?: string; // For annual reset logic
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
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
  authorAvatar: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  category: string;
  createdAt: string;
  type: 'image' | 'video';
  comments?: Comment[];
  views: number;
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
  userId: string;
  isPrivate: boolean;
  createdAt: string;
}
