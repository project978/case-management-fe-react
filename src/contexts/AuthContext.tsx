import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('authToken');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.login(email, password);
      const { data } = res.data;
      if (data?.token) {
        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
        };
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please check your email and password.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(requiredRole)) return requiredRole.includes(user.role);
    return user.role === requiredRole || user.role === 'ADMIN';
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
