import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import {
  clearAuthSession,
  getToken,
  setAuthSession,
} from '../utils/auth';
import { STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.getMe();

        if (data.success && data.user) {
          setUser(data.user);
          setAuthSession(token, data.user);
        } else {
          clearAuthSession();
        }
      } catch {
        clearAuthSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login(email, password);

    if (!data.success || !data.token || !data.user) {
      throw new Error(data.message || 'Login failed');
    }

    setAuthSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authApi.register(name, email, password);

    if (!data.success || !data.token || !data.user) {
      throw new Error(data.message || 'Registration failed');
    }

    setAuthSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    localStorage.removeItem(STORAGE_KEYS.HEALTH_PROFILE);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await authApi.getMe();

    if (data.success && data.user) {
      setUser(data.user);
      setAuthSession(getToken(), data.user);
      return data.user;
    }

    throw new Error(data.message || 'Unable to refresh user profile');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
