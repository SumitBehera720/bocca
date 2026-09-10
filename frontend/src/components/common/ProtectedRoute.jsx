import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-text">Verifying security parameters...</p>
      </div>
    );
  }

  // --- ADMIN PATH AUTHORIZATION ---
  if (requireAdmin) {
    const isAdminUser = user && (user.role === 'admin' || user.email === 'admin@farmart.com');
    const hasAdminActiveSession = sessionStorage.getItem('farmart_admin_active_session') === 'true';

    // If not authenticated, or not an admin user, or didn't explicitly log in via sign-in page: REDIRECT TO /login IMMEDIATELY!
    if (!isAuthenticated || !isAdminUser || !hasAdminActiveSession) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  }

  // General user protection
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
