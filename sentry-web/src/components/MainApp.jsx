import { useState } from 'react';
import CreateIncident from './CreateIncident';
import IncidentsList from './IncidentsList';
import './MainApp.css';

export default function MainApp({ onLogout }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const handleIncidentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Incident Management</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <CreateIncident onIncidentCreated={handleIncidentCreated} />
      <IncidentsList refreshTrigger={refreshTrigger} />
    </div>
  );
}