import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

// ─── Forgot Password ──
export const ForgotPassword = () => {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card shadow-xl border-slate-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{sent ? '✉️' : '🔒'}</div>
            <h1 className="font-display text-3xl text-dark mb-1">
              {sent ? 'Check your email' : 'Forgot password?'}
            </h1>
            <p className="text-muted text-sm">
              {sent ? `We sent a reset link to ${email}` : "Enter your email and we'll send a reset link"}
            </p>
          </div>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <button onClick={() => setSent(false)} className="btn-secondary w-full py-3">
              Send again
            </button>
          )}
          <p className="text-center text-muted text-sm mt-6">
            <Link to="/login" className="text-primary hover:text-secondary transition-colors">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Reset Password ─────
export const ResetPassword = () => {
  const { token }             = useParams();
  const navigate              = useNavigate();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card shadow-xl border-slate-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔑</div>
            <h1 className="font-display text-3xl text-dark mb-1">New Password</h1>
            <p className="text-muted text-sm">Enter your new password below</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters" className="input-field" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
