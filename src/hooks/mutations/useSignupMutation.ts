/**
 * useSignupMutation
 * TanStack Query mutation hook for the user registration flow.
 * Handles API call, Zustand state update.
 */

import { useMutation } from '@tanstack/react-query';
import { authService, SignupPayload } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { userMapper } from '@/api/mappers';

/**
 * Hook for signup mutation
 * @returns useMutation
 */
export const useSignupMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),

    onSuccess: (response) => {
      // We no longer automatically setAuth here! 
      // The SignupPage will handle it after the user selects their interests.
    },
  });
};
