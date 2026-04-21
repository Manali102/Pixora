import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * GuestRoute
 * Redirects authenticated users away from public-only pages (like Login/Signup).
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isLoading = useAuthStore((store) => store.isLoading);
  const location = useLocation();
  
  // If we are still loading the auth state, don't redirect yet
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If the user came from another page, send them back. Otherwise, go home.
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
