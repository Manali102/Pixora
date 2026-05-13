import React from 'react';
import { create } from 'zustand';
import { Pin } from '@/types/type';
import { postService } from '@/services/postService';

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
  deletePin: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  addComment: (pinId: string, comment: string) => void;
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
        const transformedPins: Pin[] = response.data.posts.map((post: any) => ({
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
          isLiked: false, // Default for now
          isSaved: false, // Default for now
          comments: [], // Comments will be loaded on demand or if included in backend
          authorFollowers: post.authorFollowers || 0,
          views: post.views || 0,
        }));
        
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
        const transformedPins: Pin[] = response.data.posts.map((post: any) => ({
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
        }));
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

  addPin: (pin: Pin) =>
    set((state) => ({ pins: [pin, ...state.pins] })),

  deletePin: (id: string) =>
    set((state) => ({ pins: state.pins.filter((p) => p.id !== id) })),

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

      const updatedPins = state.pins.map((p) =>
        p.id === pinId 
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      );

      const updatedSelectedPin = state.selectedPin?.id === pinId
        ? updatedPins.find(p => p.id === pinId) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin,
      };
    }),

  toggleLike: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      );
      
      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(p => p.id === id) || null
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    }),

  toggleSave: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((p) =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p
      );

      const updatedSelectedPin = state.selectedPin?.id === id
        ? updatedPins.find(p => p.id === id) || null
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
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pins;

    return pins.filter(
      (pin) =>
        pin.title.toLowerCase().includes(q) ||
        pin.category.toLowerCase().includes(q) ||
        pin.description.toLowerCase().includes(q)
    );
  }, [pins, searchQuery]);
};
