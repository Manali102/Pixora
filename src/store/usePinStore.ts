import React from 'react';
import { create } from 'zustand';
import { Pin } from '@/types/type';
import { postService } from '@/services/postService';

export const transformBackendPin = (post: any): Pin => ({
  id: post._id,
  title: post.title || 'Untitled',
  description: post.description || '',
  imageUrl: post.media_url,
  authorId: post.user_id?._id || 'unknown',
  authorName: post.user_id?.name || 'Anonymous',
  authorAvatar: post.user_id?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post._id}`,
  likes: post.totalLikes || 0,
  category: post.category || 'General',
  createdAt: post.created_at,
  type: post.resource_type === 'video' ? 'video' : 'image',
  isLiked: false,
  isSaved: false,
  comments: [],
  authorFollowers: post.authorFollowers || 0,
  views: post.views || 0,
});

interface PinState {
  pins: Pin[];
  isLoading: boolean;
  searchQuery: string;
  selectedPin: Pin | null;
  feedType: 'all' | 'following';
  userPins: Pin[];
  fetchPins: () => Promise<void>;
  fetchUserPins: (userId: string) => Promise<void>;
  setFeedType: (type: 'all' | 'following') => void;
  setSearchQuery: (query: string) => void;
  setSelectedPin: (pin: Pin | null) => void;
  addPin: (pin: Pin) => void;
  deletePin: (id: string) => Promise<void>;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  addComment: (pinId: string, comment: string) => void;
  fetchPinById: (id: string) => Promise<void>;
}

export const usePinStore = create<PinState>()((set, get) => ({
  pins: [],
  isLoading: false,
  searchQuery: '',
  selectedPin: null,
  feedType: 'all',
  userPins: [],

  fetchPins: async () => {
    const { feedType } = get();
    set({ isLoading: true });
    try {
      const response = feedType === 'all' 
        ? await postService.getAllPosts()
        : await postService.getFollowingPosts();
      
      if (response.success && response.data?.posts) {
        // Transform backend posts to frontend Pin interface
        const transformedPins: Pin[] = response.data.posts.map(transformBackendPin);
        
        set({ pins: transformedPins, isLoading: false });
      } else {
        set({ pins: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch pins:', error);
      set({ pins: [], isLoading: false });
    }
  },

  fetchUserPins: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await postService.getUserPosts(userId);
      if (response.success && response.data?.posts) {
        const transformedPins: Pin[] = response.data.posts.map(transformBackendPin);
        set({ userPins: transformedPins, isLoading: false });
      } else {
        set({ userPins: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch user pins:', error);
      set({ userPins: [], isLoading: false });
    }
  },

  setFeedType: (type: 'all' | 'following') => {
    set({ feedType: type });
    get().fetchPins();
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedPin: (pin: Pin | null) => set({ selectedPin: pin }),

  fetchPinById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await postService.getPost(id);
      if (response.success && response.data?.post) {
        const post = response.data.post;
        const transformedPin: Pin = transformBackendPin(post);
        set({ selectedPin: transformedPin, isLoading: false });
      } else {
        set({ selectedPin: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch pin:', error);
      set({ selectedPin: null, isLoading: false });
    }
  },

  addPin: (pin: Pin) =>
    set((state) => ({ pins: [pin, ...state.pins] })),

  deletePin: async (id: string) => {
    try {
      const response = await postService.deletePost(id);
      if (response.success) {
        set((state) => ({ 
          pins: state.pins.filter((pin) => pin.id !== id),
          userPins: state.userPins.filter((pin) => pin.id !== id)
        }));
      } else {
        throw new Error(response.message || 'Failed to delete pin');
      }
    } catch (error) {
      console.error('Failed to delete pin:', error);
      throw error;
    }
  },

  addComment: (pinId: string, text: string) =>
    set((state) => {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'u1', // Defaulting to Admin for now
        userName: 'Admin',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        text,
        createdAt: new Date().toISOString(),
      };

      const updatedPins = state.pins.map((pin) =>
        pin.id === pinId 
          ? { ...pin, comments: [...(pin.comments || []), newComment] }
          : pin
      );

      const updatedSelectedPin = state.selectedPin?.id === pinId
        ? updatedPins.find(pin => pin.id === pinId) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin,
      };
    }),

  toggleLike: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((pin) =>
        pin.id === id
          ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
          : pin
      );
      
      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(pin => pin.id === id) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    }),

  toggleSave: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((pin) =>
        pin.id === id ? { ...pin, isSaved: !pin.isSaved } : pin
      );

      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(pin => pin.id === id) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    }),
}));

// Selector: filtered pins derived from store state
export const useFilteredPins = () => {
  const pins = usePinStore((state) => state.pins);
  const searchQuery = usePinStore((state) => state.searchQuery);

  return React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return pins;

    return pins.filter(
      (pin) =>
        pin.title.toLowerCase().includes(query) ||
        pin.category.toLowerCase().includes(query) ||
        pin.description.toLowerCase().includes(query)
    );
  }, [pins, searchQuery]);
};
