import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_PATH } from '../../config/adminConfig';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-slate-950 py-16 text-slate-100">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-slate-400">Verifying security credentials...</p>
      </div>
    );
  }

  // --- ADMIN PATH AUTHORIZATION & PROTECTION ---
  if (requireAdmin) {
    // 1. Not authenticated -> Redirect to secret admin login
    if (!isAuthenticated || !user) {
      return <Navigate to={`${ADMIN_PATH}/login`} state={{ from: location }} replace />;
    }

    // 2. Authenticated as non-admin customer -> Return 403 Access Denied Response View
    const isAdmin = user.role === 'admin' || user.email === 'admin@farmart.com';
    if (!isAdmin) {
      return (
        <div className="min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center px-4 text-center py-16 font-inter text-slate-100">
          <div className="w-20 h-20 bg-red-950/80 border border-red-800 text-red-400 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-2xl">
            🚫
          </div>
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block mb-1">
            HTTP 403 FORBIDDEN
          </span>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Access Denied</h1>
          <p className="text-xs text-slate-400 max-w-md mb-8 leading-relaxed font-medium">
            You are signed in as <strong className="text-slate-200">{user.email}</strong>. This account does not possess administrator credentials or permissions to view the Pharmacist Management Portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                logout();
              }}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Sign Out & Login as Admin
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all"
            >
              Return to Store
            </Link>
          </div>
        </div>
      );
    }

    // 3. Authenticated as Admin -> Render Protected Admin View
    return children;
  }

  // General user authentication check
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
