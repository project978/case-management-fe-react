import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRoles && !hasPermission(requiredRoles)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
