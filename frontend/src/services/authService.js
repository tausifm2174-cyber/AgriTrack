import api from './api';

/**
 * Authentication Service
 * Communicates with backend endpoints:
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 *   GET  /api/v1/users/me
 */
export const authService = {
  /**
   * Register a new user account.
   * @param {Object} data { fullName, email, phone, password }
   * @returns {Promise<Object>} Created UserResponse
   */
  async register(data) {
    return api.post('/auth/register', data);
  },

  /**
   * Authenticate with email and password.
   * @param {Object} credentials { email, password }
   * @returns {Promise<Object>} AuthResponse { accessToken, tokenType, expiresIn, user }
   */
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  /**
   * Get currently authenticated user profile.
   * Requires Bearer token via api interceptor.
   * @returns {Promise<Object>} UserResponse
   */
  async getCurrentUser() {
    return api.get('/users/me');
  },
};

export default authService;
