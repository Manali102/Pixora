/**
 * API Endpoint constants
 * Single source of truth for all API routes.
 * Organized by feature domain for scalability.
 */

// auth endpoints
const AUTH = {
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
} as const;

// user endpoints
const USER = {
  PROFILE: '/api/v1/users/profile',
} as const;

export const ENDPOINTS = {
  AUTH,
  USER,
} as const;
