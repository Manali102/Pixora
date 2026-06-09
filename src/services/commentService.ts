import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface CommentPayload {
  user_id?: string;
  post_id?: string;
  comment_text: string;
}

export interface CommentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const commentService = {
  /**
   * Create a new comment
   */
  createComment: async (payload: CommentPayload): Promise<CommentResponse> => {
    const { data } = await apiClient.post<CommentResponse>(
      ENDPOINTS.COMMENTS.CREATE,
      payload
    );
    return data;
  },

  /**
   * Get comments for a post
   */
  getCommentsByPostId: async (postId: string, page = 1, limit = 20): Promise<CommentResponse> => {
    const { data } = await apiClient.get<CommentResponse>(
      `${ENDPOINTS.COMMENTS.GET_BY_POST(postId)}?page=${page}&limit=${limit}`
    );
    return data;
  },

  /**
   * Update a comment
   */
  updateComment: async (commentId: string, payload: { comment_text: string, user_id?: string }): Promise<CommentResponse> => {
    const { data } = await apiClient.put<CommentResponse>(
      ENDPOINTS.COMMENTS.UPDATE(commentId),
      payload
    );
    return data;
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: string): Promise<CommentResponse> => {
    const { data } = await apiClient.delete<CommentResponse>(
      ENDPOINTS.COMMENTS.DELETE(commentId)
    );
    return data;
  },
};
