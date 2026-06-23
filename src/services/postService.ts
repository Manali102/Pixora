
import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface CreatePostResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const postService = {
  /**
   * Fetch all posts from the server.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @returns List of posts.
   */
  getAllPosts: async (page: number = 1, limit: number = 20, search?: string): Promise<CreatePostResponse> => {
    let url = `${ENDPOINTS.POSTS.GET_ALL}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const { data } = await apiClient.get<CreatePostResponse>(url);
    return data;
  },

  /**
   * Create a new pin/post.
   * @param file - The image or video file to upload.
   * @param title - The title of the pin.
   * @param description - Optional description.
   * @param onProgress - Optional callback for upload progress.
   * @returns The created post data.
   */
  createPost: async (file: File, title: string, description: string = '', category: string = 'General', onProgress?: (progress: number) => void): Promise<CreatePostResponse> => {
    const formData = new FormData();
    formData.append('postMedia', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    
    const { data } = await apiClient.post<CreatePostResponse>(
      ENDPOINTS.POSTS.CREATE,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );
    
    return data;
  },

  /**
   * Suggest metadata using AI.
   * @param file - The image or video file.
   * @returns The suggestion task ID.
   */
  suggestMetadata: async (file: File): Promise<CreatePostResponse> => {
    const formData = new FormData();
    formData.append('postMedia', file);
    
    const { data } = await apiClient.post<CreatePostResponse>(
      ENDPOINTS.POSTS.SUGGEST_METADATA,
      formData
    );
    
    return data;
  },

  /**
   * Get AI suggestion status/results.
   * @param id - The suggestion task ID.
   * @returns The suggestion status and data if completed.
   */
  getSuggestionStatus: async (id: string): Promise<CreatePostResponse> => {
    const { data } = await apiClient.get<CreatePostResponse>(
      ENDPOINTS.POSTS.SUGGESTION_STATUS(id)
    );
    
    return data;
  },

  /**
   * Fetch posts from users being followed.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @returns List of posts.
   */
  getFollowingPosts: async (page: number = 1, limit: number = 20): Promise<CreatePostResponse> => {
    const { data } = await apiClient.get<CreatePostResponse>(
      `${ENDPOINTS.POSTS.GET_FOLLOWING}?page=${page}&limit=${limit}`
    );
    return data;
  },

  /**
   * Fetch posts created by a specific user.
   * @param userId - The user ID.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @returns List of posts.
   */
  getUserPosts: async (userId: string, page: number = 1, limit: number = 20): Promise<CreatePostResponse> => {
    const { data } = await apiClient.get<CreatePostResponse>(
      `${ENDPOINTS.POSTS.GET_USER_POSTS(userId)}?page=${page}&limit=${limit}`
    );
    return data;
  },

  /**
   * Fetch a single post by ID.
   * @param id - The post ID.
   * @returns The post data.
   */
  getPost: async (id: string): Promise<CreatePostResponse> => {
    const { data } = await apiClient.get<CreatePostResponse>(
      ENDPOINTS.POSTS.GET_POST(id)
    );
    return data;
  },

  /**
   * Delete a post by ID.
   * @param id - The post ID.
   * @returns Success response.
   */
  deletePost: async (id: string): Promise<CreatePostResponse> => {
    const { data } = await apiClient.delete<CreatePostResponse>(
      ENDPOINTS.POSTS.DELETE(id)
    );
    return data;
  },

  /**
   * Update a post by ID.
   * @param id - The post ID.
   * @param updateData - The data to update (e.g. title, description).
   * @returns The updated post data.
   */
  updatePost: async (id: string, updateData: { title?: string; description?: string }): Promise<CreatePostResponse> => {
    const { data } = await apiClient.patch<CreatePostResponse>(
      ENDPOINTS.POSTS.UPDATE(id),
      updateData
    );
    return data;
  },
};
