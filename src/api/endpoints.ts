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
  ADD_INTEREST: '/api/v1/users/add-user-interest',
  UPDATE: '/api/v1/users/me/update',
  FOLLOW: (id: string) => `/api/v1/users/${id}/follow`,
  UNFOLLOW: (id: string) => `/api/v1/users/${id}/unfollow`,
  FOLLOWERS: (id: string) => `/api/v1/users/${id}/followers`,
  FOLLOWING: (id: string) => `/api/v1/users/${id}/following`,
  GET_PROFILE: (id: string) => `/api/v1/users/${id}/profile`,
} as const;

// post endpoints
const POSTS = {
  GET_ALL: '/api/v1/posts',
  CREATE: '/api/v1/posts/create',
  SUGGEST_METADATA: '/api/v1/posts/suggest-metadata',
  SUGGESTION_STATUS: (id: string) => `/api/v1/posts/suggestions/${id}`,
  GET_FOLLOWING: '/api/v1/posts/following',
  GET_USER_POSTS: (id: string) => `/api/v1/posts/user/${id}`,
  GET_POST: (id: string) => `/api/v1/posts/${id}`,
  DELETE: (id: string) => `/api/v1/posts/${id}`,
} as const;

// payment endpoints
const PAYMENTS = {
  CREATE_CHECKOUT: '/api/v1/payments/create-checkout-session',
  MANAGE_SUBSCRIPTION: '/api/v1/payments/manage-subscription',
} as const;

export const ENDPOINTS = {
  AUTH,
  USER,
  POSTS,
  PAYMENTS,
} as const;
