import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
