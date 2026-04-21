/**
 * useLoginMutation
 * TanStack Query mutation hook for the login flow.
 * Handles API call, Zustand state update, and navigation on success.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService, LoginPayload } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { userMapper } from '@/api/mappers';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Hook for login mutation
 * @returns useMutation
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (response) => {
      const { user: apiUser } = response.data;

      // Transform backend structure to frontend model using centralized mapper
      const mappedUser = userMapper.toFrontend(apiUser);

      // Persist auth state in Zustand store
      setAuth(mappedUser); 
      
      // Navigate to home
      navigate('/', { replace: true });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      // Error is propagated to the component via mutation.error
      // Additional side effects (e.g., logging) can be handled here
      if (import.meta.env.DEV) {
        console.error('[Login Error]', error.response?.data?.message || error.message);
      }
    },
  });
};
