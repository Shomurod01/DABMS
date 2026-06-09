import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', phone: '', gender: '' });
  const [showPwd, setShowPwd] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/patient/dashboard');
    } catch { /* toast shown in context */ }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card shadow-xl border-slate-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold text-2xl">+</span>
            </div>
            <h1 className="font-display text-3xl text-dark mb-1">Create account</h1>
            <p className="text-muted text-sm">Join DABMS — it's free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="name" required minLength={2}
                value={form.name} onChange={handleChange}
                placeholder="John Smith" className="input-field" />
            </div>

            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} name="password" required minLength={6}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark text-sm">
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  placeholder="+1 234 567 890" className="input-field" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-secondary font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
