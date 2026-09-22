import { useState } from 'react';
import { api } from '../api';
import './CreateIncident.css';

export default function CreateIncident({ onIncidentCreated }) {
  const [formData, setFormData] = useState({
    incident_title: '',
    incident_description: '',
    incident_site: '',
    incident_severity: 'Low',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await api.post(endpoint, {
        email,
        password,
    })

    if (isRegister) {
        setIsRegister(false);
        setPassword('');
        setError('Registration successful! Please log in with your credentials.');
        return;
    }

    localStorage.setItem('token', response.data.access_token);
    onLoginSuccess();
    
    // IMPORTANT: Disable button immediately
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await api.post('/incidents', {
        incident_title: formData.incident_title,
        incident_description: formData.incident_description,
        incident_site: formData.incident_site,
        incident_severity: formData.incident_severity,
        incident_reported_at: new Date().toISOString(),
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Reset form
      setFormData({
        incident_title: '',
        incident_description: '',
        incident_site: '',
        incident_severity: 'Low',
      });

      // Refetch the list
      onIncidentCreated();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Your session expired. Please log in again.');
      } else if (!err.response) {
        setError('Unable to reach the server. Check the API deployment.');
      } else {
        setError(err.response.data?.detail || 'Failed to create incident');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-incident-form">
      <h2>Create New Incident</h2>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="incident_title"
          value={formData.incident_title}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="incident_description"
          value={formData.incident_description}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Site *</label>
        <input
          type="text"
          name="incident_site"
          value={formData.incident_site}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Severity *</label>
        <select
          name="incident_severity"
          value={formData.incident_severity}
          onChange={handleChange}
          disabled={loading}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Incident'}
      </button>
    </form>
  );
}