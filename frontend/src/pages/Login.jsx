import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/common/Container';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_PATH } from '../config/adminConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const loggedUser = await login(email, password);
    if (loggedUser) {
      if (loggedUser.role === 'admin' || email === 'admin@farmart.com') {
        sessionStorage.setItem('farmart_admin_active_session', 'true');
        navigate(`${ADMIN_PATH}/dashboard`, { replace: true });
      } else {
        const targetPath = location.state?.from?.pathname || '/';
        navigate(targetPath, { replace: true });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="py-16 bg-bgColor min-h-[75vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl border border-border shadow-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primaryLight text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
              🔑
            </div>
            <h1 className="text-3xl font-extrabold text-heading">Sign In</h1>
            <p className="text-xs text-text mt-1">Welcome back to Pharmart Online Pharmacy</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="user@pharmart.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-xs active:scale-98"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-text">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primaryDark underline">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
