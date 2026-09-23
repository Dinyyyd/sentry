import { useState } from 'react';
import { api } from '../api';
import './CreateIncident.css';

const emptyForm = {
  incident_title: '',
  incident_description: '',
  incident_site: '',
  incident_severity: '', // '' means "Not decided yet"
};

export default function CreateIncident({ onIncidentCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // One handler for every input, using each input's "name"
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare the data right before sending
    const body = {
      ...form,
      incident_severity: form.incident_severity === '' ? null : form.incident_severity,
      incident_reported_at: new Date().toISOString(), // includes timezone ("Z" = UTC)
    };

    try {
      await api.post('/incidents', body);
      setForm(emptyForm);
      if (onIncidentCreated) onIncidentCreated();
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (err.response?.status === 401) {
        setError(`Not authorized: ${detail}`);
      } else if (Array.isArray(detail)) {
        const validationErrors = detail.map((item) => {
          const field = item.loc?.at(-1);
          return field ? `${field}: ${item.msg}` : item.msg;
        });
        setError(validationErrors.join(' '));
      } else if (!err.response) {
        setError('Unable to reach the server. Check that the API is running.');
      } else {
        setError(typeof detail === 'string' ? detail : 'Could not create incident. Check the fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-incident">
      <h2>Create New Incident</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="incident_title"
          placeholder="Title"
          value={form.incident_title}
          onChange={handleChange}
          required
        />
        <textarea
          name="incident_description"
          placeholder="Description"
          value={form.incident_description}
          onChange={handleChange}
          required
        />
        <input
          name="incident_site"
          placeholder="Site"
          value={form.incident_site}
          onChange={handleChange}
          required
        />
        <select
          name="incident_severity"
          value={form.incident_severity}
          onChange={handleChange}
        >
          <option value="">Not decided yet</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Incident'}
        </button>
      </form>
    </div>
  );
}
