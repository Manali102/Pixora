import React from 'react';
import { create } from 'zustand';
import { Pin } from '@/types/type';
import { postService } from '@/services/postService';
import { likeService } from '@/services/likeService';
import { commentService } from '@/services/commentService';
import { useAuthStore } from './useAuthStore';

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
  type: post.resource_type === 'video' ? 'video' : post.media_url?.toLowerCase().includes('.gif') ? 'gif' : 'image',
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
  autoOpenBoardSelector: boolean;
  feedType: 'all' | 'following';
  userPins: Pin[];
  fetchPins: () => Promise<void>;
  fetchUserPins: (userId: string) => Promise<void>;
  setFeedType: (type: 'all' | 'following') => void;
  setSearchQuery: (query: string) => void;
  setSelectedPin: (pin: Pin | null) => void;
  setAutoOpenBoardSelector: (autoOpen: boolean) => void;
  addPin: (pin: Pin) => void;
  deletePin: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleSave: (id: string) => void;
  addComment: (pinId: string, comment: string) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  fetchPinById: (id: string) => Promise<void>;
  hasMoreComments: boolean;
  commentsPage: number;
  totalComments: number;
  isLoadingMoreComments: boolean;
  loadMoreComments: (id: string) => Promise<void>;
  hasMorePins: boolean;
  pinsPage: number;
  isLoadingMorePins: boolean;
  loadMorePins: () => Promise<void>;
}

export const usePinStore = create<PinState>()((set, get) => ({
  pins: [],
  isLoading: false,
  searchQuery: '',
  selectedPin: null,
  autoOpenBoardSelector: false,
  feedType: 'all',
  userPins: [],
  hasMoreComments: false,
  commentsPage: 1,
  totalComments: 0,
  isLoadingMoreComments: false,
  hasMorePins: false,
  pinsPage: 1,
  isLoadingMorePins: false,

  fetchPins: async () => {
    const { feedType } = get();
    set({ isLoading: true, pinsPage: 1, hasMorePins: false });
    try {
      const response = feedType === 'all' 
        ? await postService.getAllPosts(1)
        : await postService.getFollowingPosts(1);
      
      if (response.success && response.data?.posts) {
        // Transform backend posts to frontend Pin interface
        const transformedPins: Pin[] = response.data.posts.map(transformBackendPin);
        
        set({ 
          pins: transformedPins, 
          isLoading: false,
          hasMorePins: response.data.pagination?.page < response.data.pagination?.totalPages,
          pinsPage: 1
        });
      } else {
        set({ pins: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch pins:', error);
      set({ pins: [], isLoading: false });
    }
  },

  loadMorePins: async () => {
    const { hasMorePins, pinsPage, isLoadingMorePins, feedType } = get();
    
    if (!hasMorePins || isLoadingMorePins) return;

    set({ isLoadingMorePins: true });

    try {
      const nextPage = pinsPage + 1;
      const response = feedType === 'all' 
        ? await postService.getAllPosts(nextPage)
        : await postService.getFollowingPosts(nextPage);
      
      if (response.success && response.data?.posts) {
        const transformedPins: Pin[] = response.data.posts.map(transformBackendPin);
        
        set((state) => ({
          pins: [...state.pins, ...transformedPins],
          hasMorePins: response.data.pagination?.page < response.data.pagination?.totalPages,
          pinsPage: nextPage,
          isLoadingMorePins: false
        }));
      } else {
        set({ isLoadingMorePins: false });
      }
    } catch (error) {
      console.error('Failed to load more pins:', error);
      set({ isLoadingMorePins: false });
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
  setAutoOpenBoardSelector: (autoOpen: boolean) => set({ autoOpenBoardSelector: autoOpen }),

  fetchPinById: async (id: string) => {
    set({ isLoading: true, commentsPage: 1, hasMoreComments: false, totalComments: 0 });
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        postService.getPost(id),
        commentService.getCommentsByPostId(id).catch(() => ({ success: false, data: { comments: [] } }))
      ]);

      if (postResponse.success && postResponse.data?.post) {
        const post = postResponse.data.post;
        const transformedPin: Pin = transformBackendPin(post);

        let mappedComments: import('@/types/type').Comment[] = [];
        const responseData = (commentsResponse as any).data;
        if (commentsResponse.success && responseData?.comments) {
          mappedComments = responseData.comments.map((c: any) => ({
            id: c.id || c._id,
            userId: c.user?.id || c.user_id?._id || 'unknown',
            userName: c.user?.name || c.user_id?.name || 'Anonymous',
            userAvatar: c.user?.avatar || c.user_id?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id || c._id}`,
            text: c.comment_text || c.comments_text,
            createdAt: c.created_at || new Date().toISOString(),
          }));
        }

        transformedPin.comments = mappedComments;
        set({ 
          selectedPin: transformedPin, 
          isLoading: false,
          hasMoreComments: responseData?.pagination?.hasNextPage || false,
          commentsPage: 1,
          totalComments: responseData?.pagination?.totalComments || mappedComments.length
        });
      } else {
        set({ selectedPin: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch pin:', error);
      set({ selectedPin: null, isLoading: false });
    }
  },

  loadMoreComments: async (id: string) => {
    const { hasMoreComments, commentsPage, isLoadingMoreComments, selectedPin } = get();
    
    if (!hasMoreComments || isLoadingMoreComments || !selectedPin || selectedPin.id !== id) return;

    set({ isLoadingMoreComments: true });

    try {
      const nextPage = commentsPage + 1;
      const commentsResponse = await commentService.getCommentsByPostId(id, nextPage).catch(() => ({ success: false, data: { comments: [] } }));
      
      const responseData = (commentsResponse as any).data;
      if (commentsResponse.success && responseData?.comments) {
        const newComments = responseData.comments.map((c: any) => ({
          id: c.id || c._id,
          userId: c.user?.id || c.user_id?._id || 'unknown',
          userName: c.user?.name || c.user_id?.name || 'Anonymous',
          userAvatar: c.user?.avatar || c.user_id?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id || c._id}`,
          text: c.comment_text || c.comments_text,
          createdAt: c.created_at || new Date().toISOString(),
        }));

        set((state) => ({
          selectedPin: state.selectedPin ? {
            ...state.selectedPin,
            comments: [...(state.selectedPin.comments || []), ...newComments]
          } : null,
          hasMoreComments: responseData.pagination?.hasNextPage || false,
          commentsPage: nextPage,
          isLoadingMoreComments: false
        }));
      } else {
        set({ isLoadingMoreComments: false });
      }
    } catch (error) {
      console.error('Failed to load more comments:', error);
      set({ isLoadingMoreComments: false });
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

  addComment: async (pinId: string, text: string) => {
    const user = useAuthStore.getState().user;
    const userId = user?.id;
    if (!userId) throw new Error('User not authenticated');

    const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
    const newComment = {
      id: tempId,
      userId: userId,
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      text,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    set((state) => {
      const updatedPins = state.pins.map((pin) =>
        pin.id === pinId 
          ? { ...pin, comments: [...(pin.comments || []), newComment] }
          : pin
      );

      const updatedSelectedPin = state.selectedPin?.id === pinId
        ? { ...state.selectedPin, comments: [...(state.selectedPin.comments || []), newComment] }
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin,
        totalComments: state.totalComments + 1,
      };
    });

    try {
      const response = await commentService.createComment({
        post_id: pinId,
        user_id: userId,
        comment_text: text,
      });

      if (!response.success) throw new Error('API failed to create comment');

      // Replace temp ID with real ID from backend
      const realId = response.data?.id || response.data?.comment?.id || response.data?._id;
      if (realId) {
        set((state) => {
          const updateCommentId = (comments: import('@/types/type').Comment[] = []) =>
            comments.map(c => c.id === tempId ? { ...c, id: realId } : c);

          return {
            pins: state.pins.map(pin => pin.id === pinId ? { ...pin, comments: updateCommentId(pin.comments) } : pin),
            selectedPin: state.selectedPin?.id === pinId ? { ...state.selectedPin, comments: updateCommentId(state.selectedPin.comments) } : state.selectedPin
          };
        });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Revert optimistic update
      set((state) => {
        const removeComment = (comments: import('@/types/type').Comment[] = []) => comments.filter(c => c.id !== tempId);
        return {
          pins: state.pins.map(pin => pin.id === pinId ? { ...pin, comments: removeComment(pin.comments) } : pin),
          selectedPin: state.selectedPin?.id === pinId ? { ...state.selectedPin, comments: removeComment(state.selectedPin.comments) } : state.selectedPin,
          totalComments: state.totalComments - 1,
        };
      });
      throw error;
    }
  },

  editComment: async (commentId: string, text: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('User not authenticated');

    // Store previous state for rollback
    const previousState = get();

    // Optimistic update
    set((state) => {
      const updateCommentText = (comments: import('@/types/type').Comment[] = []) =>
        comments.map(c => c.id === commentId ? { ...c, text } : c);

      return {
        pins: state.pins.map(pin => ({ ...pin, comments: updateCommentText(pin.comments) })),
        selectedPin: state.selectedPin ? { ...state.selectedPin, comments: updateCommentText(state.selectedPin.comments) } : state.selectedPin
      };
    });

    try {
      const response = await commentService.updateComment(commentId, { comment_text: text, user_id: userId });
      if (!response.success) throw new Error('API failed to update comment');
    } catch (error) {
      console.error('Failed to update comment:', error);
      set({ pins: previousState.pins, selectedPin: previousState.selectedPin });
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    // Store previous state for rollback
    const previousState = get();

    // Optimistic update
    set((state) => {
      const removeComment = (comments: import('@/types/type').Comment[] = []) =>
        comments.filter(c => c.id !== commentId);

      return {
        pins: state.pins.map(pin => ({ ...pin, comments: removeComment(pin.comments) })),
        selectedPin: state.selectedPin ? { ...state.selectedPin, comments: removeComment(state.selectedPin.comments) } : state.selectedPin,
        totalComments: Math.max(0, state.totalComments - 1),
      };
    });

    try {
      const response = await commentService.deleteComment(commentId);
      if (!response.success) throw new Error('API failed to delete comment');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      set({ pins: previousState.pins, selectedPin: previousState.selectedPin });
      throw error;
    }
  },

  toggleLike: async (id: string) => {
    // Optimistic update
    set((state) => {
      const updatedPins = state.pins.map((pin) =>
        pin.id === id
          ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
          : pin
      );
      
      const updatedSelectedPin = state.selectedPin?.id === id
        ? { ...state.selectedPin, isLiked: !state.selectedPin.isLiked, likes: state.selectedPin.isLiked ? state.selectedPin.likes - 1 : state.selectedPin.likes + 1 }
        : state.selectedPin;

      return {
        pins: updatedPins,
        selectedPin: updatedSelectedPin
      };
    });

    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('User not authenticated');

      const response = await likeService.toggleLike(id, userId);
      if (!response.success) {
        throw new Error('API reported failure');
      }
    } catch (error) {
      console.error('Failed to toggle like on backend:', error);
      // Revert optimistic update on failure
      set((state) => {
        const updatedPins = state.pins.map((pin) =>
          pin.id === id
            ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
            : pin
        );
        
        const updatedSelectedPin = state.selectedPin?.id === id
          ? { ...state.selectedPin, isLiked: !state.selectedPin.isLiked, likes: state.selectedPin.isLiked ? state.selectedPin.likes - 1 : state.selectedPin.likes + 1 }
          : state.selectedPin;

        return {
          pins: updatedPins,
          selectedPin: updatedSelectedPin
        };
      });
    }
  },

  toggleSave: (id: string) =>
    set((state) => {
      const updatedPins = state.pins.map((pin) =>
        pin.id === id ? { ...pin, isSaved: !pin.isSaved } : pin
      );

      const updatedSelectedPin = state.selectedPin?.id === id
        ? { ...state.selectedPin, isSaved: !state.selectedPin.isSaved }
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
