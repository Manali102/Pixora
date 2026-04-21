/**
 * Axios API Client
 * Configured for cookie-based authentication with auto-refresh logic.
 * Includes interceptors for response unwrapping and centralized error handling.
 */

import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { ENDPOINTS } from './endpoints';

// custom request config to add retry flag
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// axios instance with interceptors for auth token injection,
// response unwrapping, and centralized error handling.
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If we are already on the login page or trying to refresh, don't retry to avoid loops
      if (window.location.pathname.includes('/login') || originalRequest.url === ENDPOINTS.AUTH.REFRESH) {
        localStorage.removeItem('pixora_auth');
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens via cookie-based refresh endpoint
        await axios.post(`${ENV.API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {}, { withCredentials: true });
        
        // Retry the original request with new cookies
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed – logout user
        localStorage.removeItem('pixora_auth');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
