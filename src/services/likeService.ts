import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

interface ToggleLikeResponse {
  success: boolean;
  message?: string;
  isLiked?: boolean;
}

export const likeService = {
  /**
   * Toggles a like for a post
   * @param postId - ID of the post to like/unlike
   * @param userId - ID of the user toggling the like
   * @returns Response indicating success and current like status
   */
  toggleLike: async (postId: string, userId: string): Promise<ToggleLikeResponse> => {
    const { data } = await apiClient.post<ToggleLikeResponse>(
      ENDPOINTS.LIKES.CREATE,
      { post_id: postId, user_id: userId }
    );
    return data;
  },
};
