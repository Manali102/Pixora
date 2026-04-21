/**
 * Auth Service
 * Encapsulates all auth-related API calls.
 * Each function maps to a single API endpoint.
 */

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

// Login Payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Signup Payload
export interface SignupPayload {
  email: string;
  password: string;
  name: string;
}

// User Profile
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  is_email_verified: boolean;
  plan_type: string;
  storage_used: number;
  role: string;
  last_logged_in: string | null;
  is_active: boolean;
  profile_url: string | null;
  created_at: string;
  updated_at: string;
}

// Login Response
export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: UserProfile;
  };
}

/**
 * Auth Service
 * Encapsulates all auth-related API calls.
 * Each function maps to a single API endpoint.
 */
export const authService = {
  /**
   * Authenticate a user with email and password.
   * @param payload - Email and password of the user.
   * @returns Login response.
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return data;
  },

  /**
   * Register a new user.
   * @param payload - Email, password and name of the user.
   * @returns Signup response.
   */
  signup: async (payload: SignupPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.SIGNUP,
      payload
    );
    return data;
  },
};
