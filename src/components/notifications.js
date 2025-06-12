import React, { useEffect, useState, useRef } from 'react';

const NotificationBell = ({ panelData = [] }) => {
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Warning': return 'orange';
      case 'Critical': return 'red';
      case 'Info': return 'green';
      default: return 'gray';
    }
  };

    const panelIdToName = {
        1: 'SP1001',
        2: 'SP1002',
        3: 'SP1003',
    };
  
  const getPanelName = (panelId) => {
    return panelIdToName[panelId] || `Panel #${panelId}`;
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(prev => !prev)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <span role="img" aria-label="alerts" style={{ fontSize: 22 }}>🔔</span>
        {alerts.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -5,
            right: -5,
            background: 'red',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {alerts.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          width: 340,
          maxHeight: 420,
          overflowY: 'auto',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 8,
          zIndex: 1000,
          padding: 12
        }}>
          <h4 style={{ margin: '0 0 10px' }}>Alerts</h4>
          {alerts.length === 0 ? (
            <p style={{ margin: 0 }}>No active alerts.</p>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  padding: '10px 12px',
                  marginBottom: 10,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {alert.alert_type}
                </div>
                <div style={{ fontSize: 13, color: '#555' }}>
                  {alert.description}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 6,
                  fontSize: 12,
                  color: '#666'
                }}>
                  <span style={{ color: getSeverityColor(alert.severity), fontWeight: 'bold' }}>
                    {alert.severity}
                  </span>
                  <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>
                  Affected Panel: <strong>{getPanelName(alert.panel_id)}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
