import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-text">Verifying authentication status...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin' && user.email !== 'admin@farmart.com') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor px-4 text-center py-16">
        <div className="w-16 h-16 bg-red-100 text-coral rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
          🚫
        </div>
        <h2 className="text-2xl font-extrabold text-heading mb-2">Access Denied</h2>
        <p className="text-xs text-text max-w-md mb-6">
          You do not have administrative privileges to view the Pharmacist Portal. Please sign in with an administrator account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-primary hover:bg-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Back to Home
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-white border border-border text-heading hover:bg-primaryLight text-xs font-semibold rounded-xl transition-all"
          >
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
