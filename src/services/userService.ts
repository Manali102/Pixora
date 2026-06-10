import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface AddUserInterestPayload {
  userId: string;
  interests: string[];
}

export const userService = {
  getProfile: async (): Promise<{ success: boolean; data: { user: any } }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.PROFILE);
    return data;
  },

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

  addUserInterest: async (payload: AddUserInterestPayload): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(
      ENDPOINTS.USER.ADD_INTEREST,
      payload
    );
    return data;
  },

  followUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.USER.FOLLOW(userId));
    return data;
  },

  unfollowUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(ENDPOINTS.USER.UNFOLLOW(userId));
    return data;
  },

  getFollowers: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.FOLLOWERS(userId));
    return data;
  },

  getFollowing: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.FOLLOWING(userId));
    return data;
  },

  /**
   * Fetch any user's public profile.
   * @param userId - The ID of the user whose profile to fetch.
   * @returns User profile data.
   */
  getUserProfile: async (userId: string): Promise<any> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.GET_PROFILE(userId));
    return data;
  },

  getAllUsers: async (params?: { page?: number; limit?: number; search?: string; sortField?: string; sortOrder?: string; status?: string; plan?: string }): Promise<{ success: boolean; data: { users: any[], pagination: any } }> => {
    const { data } = await apiClient.get(ENDPOINTS.USER.GET_ALL, { params });
    return data;
  },
};
