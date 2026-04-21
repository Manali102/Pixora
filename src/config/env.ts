/**
 * Environment configuration
 * Centralizes all environment variables with type safety and defaults.
 */

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:3003',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
