import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading }    = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      if      (user.role === 'admin')  navigate('/admin/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else                             navigate(from === '/' ? '/patient/dashboard' : from);
    } catch { /* toast shown in context */ }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">

        {/* Card */}
        <div className="card shadow-xl border-slate-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h3l2-7 4 14 3-9 2 2h4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-dark mb-1">Welcome back</h1>
            <p className="text-muted text-sm">Sign in to your MedSync account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} name="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors text-sm">
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-secondary font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white text-center">
          <p className="text-muted text-xs">Demo admin: <span className="text-dark font-mono">admin@dabms.com</span> / <span className="text-dark font-mono">Admin@123456</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
