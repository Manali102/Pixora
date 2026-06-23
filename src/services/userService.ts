import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface AddUserInterestPayload {
  userId: string;
  interests: string[];
}

export const userService = {
  /**
   * Get profile service which handles the retrieval of the user's profile
   * @returns Promise<{ success: boolean; data: { user: any } }>
   */
  getProfile: async (): Promise<{ success: boolean; data: { user: any } }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.PROFILE);
    return data;
  },

  /**
   * Update profile service which handles the update of the user's profile
   * @param userId User ID
   * @param formData Form data containing the user's profile information
   * @returns Promise<{ success: boolean; data: { user: any } }>
   */
  updateProfile: async (userId:string,formData: FormData): Promise<{ success: boolean; data: { user: any } }> => {
    const { data } = await apiClient.put(
      `${ENDPOINTS.USER.UPDATE}/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  /**
   * Add user interest service which handles the addition of user interests
   * @param payload Payload containing user ID and interests
   * @returns Promise<{ success: boolean; message: string }>
   */
  addUserInterest: async (payload: AddUserInterestPayload): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(
      ENDPOINTS.USER.ADD_INTEREST,
      payload
    );
    return data;
  },

  /**
   * Follow user service which handles the following of a user
   * @param userId User ID
   * @returns Promise<{ success: boolean; message: string }>
   */
  followUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.USER.FOLLOW(userId));
    return data;
  },

  /**
   * Unfollow user service which handles the unfollowing of a user
   * @param userId User ID
   * @returns Promise<{ success: boolean; message: string }>
   */
  unfollowUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(ENDPOINTS.USER.UNFOLLOW(userId));
    return data;
  },

  /**
   * Get followers service which handles the retrieval of followers
   * @param userId User ID
   * @returns Promise<{ success: boolean; data: any[] }>
   */
  getFollowers: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.FOLLOWERS(userId));
    return data;
  },

  /**
   * Get following service which handles the retrieval of following
   * @param userId User ID
   * @returns Promise<{ success: boolean; data: any[] }>
   */
  getFollowing: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.FOLLOWING(userId));
    return data;
  },

  /**
   * Fetch any user's public profile.
   * @param userId - The ID of the user whose profile to fetch.
   * @returns User profile data.
   */
  /**
   * Get user profile service which handles the retrieval of user's profile
   * @param userId User ID
   * @returns Promise<{ success: boolean; data: any }>
   */
  getUserProfile: async (userId: string): Promise<any> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.GET_PROFILE(userId));
    return data;
  },

  /**
   * Get all users service which handles the retrieval of all users
   * @param params Parameters for pagination and filtering
   * @returns Promise<{ success: boolean; data: { users: any[], pagination: any } }>
   */
  getAllUsers: async (params?: { page?: number; limit?: number; search?: string; sortField?: string; sortOrder?: string; status?: string; plan?: string }): Promise<{ success: boolean; data: { users: any[], pagination: any } }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.GET_ALL, { params });
    return data;
  },
};
