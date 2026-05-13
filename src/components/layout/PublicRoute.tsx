import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader } from '../ui/Loader';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute
 * Redirects authenticated users away from public-only pages (like Login/Signup).
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isLoading = useAuthStore((store) => store.isLoading);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setRedirectPath("/");
    }
  }, [isAuthenticated]);
  
  // If we are still loading the auth state, don't redirect yet
  if (isLoading) {
    return <Loader fullPage size="xl" />;
  }

  if (isAuthenticated) {
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
    // Return null while waiting for useEffect to determine where to redirect
    return null;
  }

  return <>{children}</>;
};