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
};
