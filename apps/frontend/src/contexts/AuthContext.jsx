import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('auth_session');
      if (stored) {
        try {
          const { accessToken } = JSON.parse(stored);
          if (accessToken) {
            apiClient.setToken(accessToken);
            setAccessToken(accessToken);
            // Rehydrate real user data from backend
            const userData = await apiClient.get('/users/profile');
            setUser(userData);
            
            // Sync safe user data back to localStorage for fallback
            localStorage.setItem('auth_session', JSON.stringify({ accessToken, user: userData }));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setIsLoadingAuth(false);
    };

    initAuth();
  }, []);

  const login = (sessionData) => {
    const { accessToken, user } = sessionData;
    apiClient.setToken(accessToken);
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem('auth_session', JSON.stringify({ accessToken, user }));
  };

  const logout = () => {
    apiClient.setToken(null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('auth_session');
    
    // Cleanup old keys to avoid conflicts
    localStorage.removeItem('fedev_user');
    localStorage.removeItem('currentUser');
  };

  const refreshCurrentUser = async () => {
    try {
      const userData = await apiClient.get('/users/profile');
      setUser(userData);
      localStorage.setItem('auth_session', JSON.stringify({ accessToken, user: userData }));
    } catch (err) {
      console.error('Failed to refresh user:', err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isLoadingAuth,
      login,
      logout,
      refreshCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
