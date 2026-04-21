import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

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
      const postAuthRedirect = sessionStorage.getItem('postAuthRedirect');
      if (postAuthRedirect) {
        setRedirectPath(postAuthRedirect);
        sessionStorage.removeItem('postAuthRedirect');
      } else {
        setRedirectPath(location.state?.from?.pathname || "/");
      }
    }
  }, [isAuthenticated, location.state]);
  
  // If we are still loading the auth state, don't redirect yet
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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