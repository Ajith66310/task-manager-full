import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      toast.success(isSignup ? 'Account created!' : 'Welcome back!');
      onLogin(data.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', resetData);
      toast.success('Password reset successfully! Please sign in.');
      setIsForgotPassword(false);
      setResetData({ email: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass card" style={{ width: '100%', maxWidth: '400px' }}>
          <h1 className="logo" style={{ textAlign: 'center', marginBottom: '2rem' }}>TaskFlow</h1>
          <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Enter your email and a new password to reset.
          </p>

          <form onSubmit={handleResetPassword}>
            <input
              className="input"
              type="email"
              placeholder="Your registered email"
              value={resetData.email}
              onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="New Password (min 6 characters)"
              value={resetData.newPassword}
              onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
              required
              minLength={6}
            />
            <input
              className="input"
              type="password"
              placeholder="Confirm New Password"
              value={resetData.confirmPassword}
              onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Remember your password?{' '}
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer' }}
              onClick={() => setIsForgotPassword(false)}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="logo" style={{ textAlign: 'center', marginBottom: '2rem' }}>TaskFlow</h1>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{isSignup ? 'Create Account' : 'Sign In'}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              className="input"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {!isSignup && (
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </span>
          </p>
        )}

        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ color: 'var(--primary)', cursor: 'pointer' }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
