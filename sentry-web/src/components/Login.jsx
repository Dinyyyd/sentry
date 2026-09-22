import { useState } from 'react';
import { api } from '../api';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false); 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isRegister ? '/register' : '/login';
      const response = await api.post(endpoint, {
        email,
        password,
      });

      if (isRegister) {
        // Registration successful - show message and switch to login
        setSuccess('Registration successful! Now please login with your credentials.');
        setPassword('');
        setIsRegister(false);
      } else {
        // Login successful - save token and redirect
        localStorage.setItem('token', response.data.access_token);
        onLoginSuccess();
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.detail || 'That email is already registered');
      } else if (err.response?.status === 401) {
        setError('Incorrect email or password');
      } else if (!err.response) {
        setError('Unable to reach the server. Check the API deployment.');
      } else {
        setError(err.response.data.detail || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsRegister(!isRegister);
          setError(null);
          setSuccess(null);
        }}
        disabled={loading}
        className="toggle-btn"
      >
        {isRegister ? 'Already have account? Login' : 'Need account? Register'}
      </button>
    </form>
  );
}
