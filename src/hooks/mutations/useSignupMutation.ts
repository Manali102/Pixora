/**
 * useSignupMutation
 * TanStack Query mutation hook for the user registration flow.
 * Handles API call, Zustand state update, and navigation on success.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService, SignupPayload } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { userMapper } from '@/api/mappers';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Hook for signup mutation
 * @returns useMutation
 */
export const useSignupMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),

    onSuccess: (response) => {
      const { user: apiUser } = response.data;

      // Transform backend structure to frontend model
      const mappedUser = userMapper.toFrontend(apiUser);

      // Persist auth state in Zustand store
      setAuth(mappedUser);

      // Navigate to pricing or home
      navigate('/pricing', { replace: true });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (import.meta.env.DEV) {
        console.error('[Signup Error]', error.response?.data?.message || error.message);
      }
    },
  });
};
