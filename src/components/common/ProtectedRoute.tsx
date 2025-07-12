import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Debug: Log protected route info
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - isLoading:', isLoading);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);
  console.log('ProtectedRoute - Current location:', location.pathname);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not allowed, redirecting');
    // Redirect to appropriate dashboard based on user role
    const roleRoutes: Record<UserRole, string> = {
      'IR Admin': '/dashboard',
      'Analyst Manager': '/dashboard',
      'Investment Analyst': '/dashboard'
    };
    
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
}; 