import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface CheckoutSessionPayload {
  email: string;
  plan_type: string;
  period: string;
  userId: string;
}

export const paymentService = {
  /**
   * Create checkout session service which handles the creation of a checkout session
   * @param payload Checkout session payload including email, plan_type, period, and userId
   * @returns Promise<{ success: boolean; data: { url: string; upgraded?: boolean } }>
   */
  createCheckoutSession: async (payload: CheckoutSessionPayload): Promise<{ success: boolean; data: { url: string; upgraded?: boolean } }> => {
    const { data } = await apiClient.post(ENDPOINTS.PAYMENTS.CREATE_CHECKOUT, payload);
    return data;
  },

  /**
   * Manage subscription service which handles the management of a subscription
   * @param email Email of the user
   * @returns Promise<{ success: boolean; data: { url: string } }>
   */
  manageSubscription: async (email: string): Promise<{ success: boolean; data: { url: string } }> => {
    const { data } = await apiClient.post(ENDPOINTS.PAYMENTS.MANAGE_SUBSCRIPTION, { email });
    return data;
  },

  /**
   * Get billing analytics service which handles the retrieval of billing analytics
   * @param startDate Start date for the billing analytics
   * @param endDate End date for the billing analytics
   * @returns Promise<{ success: boolean; data: any }>
   */
  getBillingAnalytics: async (startDate: string, endDate: string): Promise<{ success: boolean; data: any }> => {
    const { data } = await apiClient.get(ENDPOINTS.PAYMENTS.BILLING_ANALYTICS, { params: { startDate, endDate } });
    return data;
  },

  /**
   * Get subscribers payments graph service which handles the retrieval of subscribers payments graph
   * @param startDate Start date for the subscribers payments graph
   * @param endDate End date for the subscribers payments graph
   * @returns Promise<{ success: boolean; data: any }>
   */
  getSubscribersPaymentsGraph: async (startDate: string, endDate: string): Promise<{ success: boolean; data: any }> => {
    const { data } = await apiClient.get(ENDPOINTS.PAYMENTS.SUBSCRIBERS_PAYMENTS_GRAPH, { params: { startDate, endDate } });
    return data;
  },
};
