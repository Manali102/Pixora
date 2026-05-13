import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader } from '../ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  excludeAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  excludeAdmin = false 
}) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isLoading = useAuthStore((store) => store.isLoading);
  const user = useAuthStore((store) => store.user);
  const location = useLocation();

  if (isLoading) {
    return <Loader fullPage size="xl" text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (excludeAdmin && user?.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
