import axios from 'axios';

/**
 * Core Axios HTTP Client for AgriTrack.
 * Configured with baseURL, Authorization interceptor, standardized response unwrapping,
 * error normalization, and 401 handling.
 */
export const TOKEN_STORAGE_KEY = 'agritrack_jwt_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor: Attach JWT Bearer token if present in localStorage.
 */
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * - Unwraps backend ApiResponse envelope (`response.data.data` as primary payload).
 * - Normalizes backend error objects and validation errors.
 * - Handles 401 by evicting stale tokens and broadcasting logout.
 */
api.interceptors.response.use(
  (response) => {
    // If backend returns standard ApiResponse structure, unwrap payload cleanly
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    let status = 0;
    let message = 'An unexpected error occurred. Please try again.';
    let validationErrors = [];

    if (error.response) {
      status = error.response.status;
      const respData = error.response.data;

      if (respData && typeof respData === 'object') {
        if (respData.message) {
          message = respData.message;
        }
        if (Array.isArray(respData.errors)) {
          validationErrors = respData.errors;
        } else if (Array.isArray(respData.data)) {
          validationErrors = respData.data;
        }
      }

      // Handle 401 Unauthorized for non-auth requests (prevent redirect loops on /auth/login)
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (status === 401 && !isAuthEndpoint) {
        try {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch {
          // ignore
        }
        window.dispatchEvent(new CustomEvent('agritrack:unauthorized'));
      }
    } else if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      message = 'Request timed out. Please try again.';
    } else if (error.request) {
      message = 'Server is unreachable. Please check your network connection.';
    } else if (error.message) {
      message = error.message;
    }

    const normalizedError = new Error(message);
    normalizedError.status = status;
    normalizedError.validationErrors = validationErrors;
    normalizedError.originalError = error;

    return Promise.reject(normalizedError);
  }
);

export default api;
