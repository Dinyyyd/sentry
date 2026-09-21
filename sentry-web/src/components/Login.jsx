import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? '/register' : '/login';
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        email,
        password,
      });

      // Save token
      localStorage.setItem('token', response.data.access_token);
      
      // Call callback
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
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

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
      </button>

      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        disabled={loading}
        className="toggle-btn"
      >
        {isRegister ? 'Already have account? Login' : 'Need account? Register'}
      </button>
    </form>
  );
}