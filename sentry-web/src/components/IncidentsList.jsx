import { useState, useEffect } from 'react';
import axios from 'axios';
import './IncidentsList.css';

export default function IncidentsList({ refreshTrigger }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [closingId, setClosingId] = useState(null); // Track which incident is being closed
  const API_URL = "sentry-production-3579.up.railway.app";
  
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/incidents');
      setIncidents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

   // Close an incident
  const handleCloseIncident = async (incidentId) => {
    setClosingId(incidentId); // Disable button immediately

    try {
      await axios.post(`http://localhost:8000/incidents/${incidentId}/close`);
      await fetchIncidents(); // Refetch incidents to update the list
    } catch (err) {
      console.error('Error closing incident:', err);
    } finally {
      setClosingId(null); // Re-enable button
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchIncidents();
    });
  }, [refreshTrigger]);

  if (loading) {
    return <div className="loading">Loading incidents...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchIncidents}>Retry</button>
      </div>
    );
  }

   if (incidents.length === 0) {
    return <div className="empty">No incidents yet</div>;
  }

  return (
    <table className="incidents-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Site</th>
          <th>Severity</th>
          <th>Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <tr key={incident.incident_id}>
            <td>{incident.incident_title}</td>
            <td>{incident.incident_site}</td>
            <td>
              <span className={`badge ${incident.incident_severity.toLowerCase()}`}>
                {incident.incident_severity}
              </span>
            </td>
            <td>{new Date(incident.incident_reported_at).toLocaleDateString()}</td>
            <td>{incident.incident_status}</td>
            <td>
              {incident.incident_status === 'Open' ? (
                <button
                  onClick={() => handleCloseIncident(incident.incident_id)}
                  disabled={closingId === incident.incident_id}
                  className="close-btn"
                >
                  {closingId === incident.incident_id ? 'Closing...' : 'Close'}
                </button>
              ) : (
                <span className="closed-badge">Closed</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}