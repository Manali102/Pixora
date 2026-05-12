import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface CheckoutSessionPayload {
  email: string;
  plan_type: string;
  period: string;
  userId: string;
}

export const paymentService = {
  createCheckoutSession: async (payload: CheckoutSessionPayload): Promise<{ success: boolean; data: { url: string; upgraded?: boolean } }> => {
    const { data } = await apiClient.post(ENDPOINTS.PAYMENTS.CREATE_CHECKOUT, payload);
    return data;
  },

  manageSubscription: async (email: string): Promise<{ success: boolean; data: { url: string } }> => {
    const { data } = await apiClient.post(ENDPOINTS.PAYMENTS.MANAGE_SUBSCRIPTION, { email });
    return data;
  },
};
