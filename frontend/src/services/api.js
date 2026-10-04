import axios from 'axios';

/**
 * Core Axios HTTP Client for AgriTrack
 * Configured with base URL and timeout for future backend integration.
 * (Backend connection disabled during frontend development phases).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
