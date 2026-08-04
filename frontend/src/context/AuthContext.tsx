import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import AuthService from '../services/authService';
import type { LoginDto, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (loginDto: LoginDto) => Promise<User>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.hasStoredToken()) {
      setLoading(false);
      return;
    }

    AuthService.me()
      .then(setUser)
      .catch(() => {
        AuthService.clearStoredToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(loginDto: LoginDto): Promise<User> {
    setLoading(true);
    try {
      const response = await AuthService.login(loginDto);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    void AuthService.logout();
  }

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    hasRole: (role) => user?.roles.includes(role) ?? false,
    hasPermission: (permission) => user?.permissions.includes(permission) ?? false,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
