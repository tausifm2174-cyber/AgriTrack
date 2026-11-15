import { useState, useEffect, useCallback, useMemo } from 'react';
import { TOKEN_STORAGE_KEY } from '../services/api';
import authService from '../services/authService';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout handler
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          setUser(userData);
          setToken(storedToken);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          try {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          } catch {
            // ignore
          }
          setToken(null);
          setUser(null);
          setError(err.message || 'Session expired. Please log in again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen for 401 unauthorized events from api interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('agritrack:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('agritrack:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Login handler
  const login = useCallback(async (credentials) => {
    setError(null);
    const authData = await authService.login(credentials);
    const receivedToken = authData.accessToken;
    const receivedUser = authData.user;

    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    } catch {
      // ignore
    }

    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  }, []);

  // Register handler
  const register = useCallback(async (registrationData) => {
    setError(null);
    const registeredUser = await authService.register(registrationData);
    return registeredUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      setError,
    }),
    [user, token, isLoading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
