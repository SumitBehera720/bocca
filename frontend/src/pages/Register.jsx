import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setSubmitting(true);
    const ok = await register(username, email, password);
    if (ok) {
      navigate('/');
    }
    setSubmitting(false);
  };

  return (
    <div className="py-16 bg-bgColor min-h-[75vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl border border-border shadow-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primaryLight text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
              💊
            </div>
            <h1 className="text-3xl font-extrabold text-heading">Create Patient Account</h1>
            <p className="text-xs text-text mt-1">Join Pharmart for prescription tracking & certified pharmacy discounts</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Full Name / Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-border rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="john@example.com"
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
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-text">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primaryDark underline">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
