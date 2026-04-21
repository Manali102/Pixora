/**
 * useSignupMutation
 * TanStack Query mutation hook for the user registration flow.
 * Handles API call, Zustand state update, and navigation on success.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, SignupPayload } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { userMapper } from '@/api/mappers';

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
      const mappedUser = userMapper.toFrontend(apiUser);

      // Tell the router to redirect to /pricing once we are authenticated
      // We do this by updating the current route state before calling setAuth
      navigate('/pricing', { replace: true });

      // Persist auth state in Zustand store
      setAuth(mappedUser);
    },
  });
};
