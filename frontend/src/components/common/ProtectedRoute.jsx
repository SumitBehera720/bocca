import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaLock, FaArrowLeft } from 'react-icons/fa';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, login } = useAuth();
  const location = useLocation();

  // Admin lock state: ALWAYS requires Admin ID & Password authentication when accessing /admin
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-text">Verifying security parameters...</p>
      </div>
    );
  }

  // --- GENERAL NON-ADMIN PROTECTED ROUTES ---
  if (!requireAdmin) {
    if (!isAuthenticated || !user) {
      return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor px-4 text-center py-16">
          <h2 className="text-2xl font-extrabold text-heading mb-2">Sign In Required</h2>
          <p className="text-xs text-text max-w-md mb-6">Please sign in to access your account details.</p>
          <Link to="/login" className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl">
            Go to Login
          </Link>
        </div>
      );
    }
    return children;
  }

  // --- ADMIN PATH SECURITY ---

  // 1. If a user is already signed in as a non-admin customer, block access explicitly
  if (user && user.role !== 'admin' && user.email !== 'admin@farmart.com') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-bgColor px-4 text-center py-16">
        <div className="w-16 h-16 bg-red-100 text-coral rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
          🚫
        </div>
        <h2 className="text-2xl font-extrabold text-heading mb-2">Access Denied</h2>
        <p className="text-xs text-text max-w-md mb-6">
          You are currently signed in as a patient/customer. You do not have administrative privileges to view the Pharmacist Portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-primary hover:bg-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Back to Home
          </Link>
          <button
            onClick={() => {
              setAdminUnlocked(false);
            }}
            className="px-5 py-2.5 bg-white border border-border text-heading hover:bg-primaryLight text-xs font-semibold rounded-xl transition-all"
          >
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  // 2. Handler to authenticate Admin ID & Password
  const handleAdminVerify = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAuthError('Please enter Administrator ID and Password.');
      return;
    }
    setVerifying(true);
    setAuthError('');

    try {
      const loggedUser = await login(adminEmail, adminPassword);
      if (loggedUser) {
        if (loggedUser.role === 'admin' || adminEmail === 'admin@farmart.com') {
          setAdminUnlocked(true);
          toast.success('Admin Identity Verified! Accessing Dashboard.');
        } else {
          setAuthError('This account does not have Administrator privileges.');
          toast.error('Access Denied: Not an admin account');
        }
      } else {
        setAuthError('Invalid Admin ID or Password. Access denied.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setVerifying(false);
    }
  };

  // 3. MANDATORY SECURITY GATE: If not explicitly unlocked in this view, ALWAYS show Admin ID & Password Login!
  if (!adminUnlocked) {
    return (
      <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center p-4 font-inter text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-emerald-500/10">
              <FaShieldAlt />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Pharmacist Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              Security Clearance Required. Enter Admin ID & Password to access <span className="text-emerald-400 font-mono font-bold">/admin</span>
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2 font-medium animate-fadeIn">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminVerify} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Administrator ID / Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@farmart.com"
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <FaLock className="text-xs" />
              {verifying ? 'Verifying Admin Credentials...' : 'Authenticate & Unlock Admin Panel'}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-slate-800 text-center relative z-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
            >
              <FaArrowLeft className="text-[10px]" /> Return to Customer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin identity verified -> Render Admin Dashboard
  return children;
};

export default ProtectedRoute;
