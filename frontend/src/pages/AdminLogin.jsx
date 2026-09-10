import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Container from '../components/common/Container';
import { useAuth } from '../hooks/useAuth';
import { FaShieldAlt, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated as admin, redirect directly to /admin/dashboard
  if (!loading && isAuthenticated && user && (user.role === 'admin' || user.email === 'admin@farmart.com')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both Admin Email and Password.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser) {
        if (loggedUser.role === 'admin' || email === 'admin@farmart.com') {
          const from = location.state?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
        } else {
          setErrorMsg('Access Denied: Account does not have administrator privileges.');
        }
      } else {
        setErrorMsg('Invalid Admin Email or Password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center p-4 font-inter text-slate-100 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-emerald-500/10">
            <FaShieldAlt />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Pharmacist Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Sign in with administrator credentials to access management console
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2 font-medium animate-fadeIn">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Admin Email / ID
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@farmart.com"
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-10 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
              <FaEnvelope className="absolute left-3.5 top-4 text-slate-500 text-xs" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-10 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
              />
              <FaLock className="absolute left-3.5 top-4 text-slate-500 text-xs" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-2"
          >
            <FaLock className="text-xs" />
            {submitting ? 'Authenticating Credentials...' : 'Sign In to Admin Console'}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-800 text-center relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
