import React, { useEffect, useState } from 'react';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Warning': return 'orange';
    case 'Critical': return 'red';
    case 'Info': return 'green';
    default: return 'gray';
  }
};

const panelIdToName = {
  1: 'SP1001', 2: 'SP1002', 3: 'SP1003', 4: 'SP1004',
  5: 'SP1005', 6: 'SP1006', 7: 'SP1007',
};

const getPanelName = (id) => panelIdToName[id] || `Panel #${id}`;

const AlertCreationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    alert_type: '',
    description: '',
    severity: 'Info',
    panel_id: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!formData.alert_type || !formData.description || !formData.panel_id) {
    setError('Please fill in all fields.');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/newAlert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        panel_id: Number(formData.panel_id),
        status: 'Active',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Alert created successfully!');
      setFormData({
        alert_type: '',
        description: '',
        severity: 'Info',
        panel_id: ''
      });
      if (onSuccess) onSuccess();
    } else {
      setError(data.message || 'Failed to create alert.');
    }
  } catch (error) {
    setError('Network error.');
    console.error(error);
  }
  setLoading(false);
};


  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 450,
      margin: '40px auto 20px',
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h3 style={{ marginBottom: '20px', color: '#222' }}>Create New Alert</h3>

      {error && (
        <div style={{
          backgroundColor: '#ffdddd',
          border: '1px solid #ff5c5c',
          padding: '10px 15px',
          marginBottom: '15px',
          borderRadius: '6px',
          color: '#b30000',
        }}>
          {error}
        </div>
      )}

      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#444' }}>
        Alert Type
        <input
          type="text"
          name="alert_type"
          value={formData.alert_type}
          onChange={handleChange}
          required
          placeholder="Enter alert type"
          style={{
            width: '93%',
            padding: '10px 14px',
            marginTop: '6px',
            borderRadius: '8px',
            border: '1.5px solid #ccc',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#444' }}>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe the alert"
          style={{
            width: '93%',
            padding: '10px 14px',
            marginTop: '6px',
            borderRadius: '8px',
            border: '1.5px solid #ccc',
            fontSize: '15px',
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#444' }}>
        Severity
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 14px',
            marginTop: '6px',
            borderRadius: '8px',
            border: '1.5px solid #ccc',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.3s',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        >
          {['Info', 'Warning', 'Critical'].map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: '20px', fontWeight: '600', color: '#444' }}>
        Panel :
        <select
          name="panel_id"
          value={formData.panel_id}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px 14px',
            marginTop: '6px',
            borderRadius: '8px',
            border: '1.5px solid #ccc',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.3s',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        >
          <option value="" disabled>-- Select Panel --</option>
          {Object.entries(panelIdToName).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </label>

      <p style={{ fontSize: 13, color: '#666', marginBottom: '20px' }}>
        Status will be set to <strong>Active</strong> automatically.
      </p>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '600',
          borderRadius: '10px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#007bff')}
      >
        {loading ? 'Submitting...' : 'Create Alert'}
      </button>
    </form>
  );
};

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = () => {
    fetch('http://localhost:3000/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/alerts/${id}`, { method: 'DELETE' })
      .then(() => fetchAlerts())
      .catch(console.error);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>All Alerts</h2>

      {alerts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No alerts found.</p>
      ) : (
        alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              width: '30%',
              margin: '0 auto 20px auto',
              borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
              padding: '12px 16px',
              backgroundColor: '#fefefe',
              borderRadius: 6,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>{alert.alert_type}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{alert.description}</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginTop: 8,
                fontSize: 12,
                color: '#555',
                gap: 8,
              }}
            >
              <span style={{ color: getSeverityColor(alert.severity), fontWeight: 600 }}>{alert.severity}</span>
              <span>{new Date(alert.created_at).toLocaleDateString()}</span>
              <span>
                Affected: <strong>{getPanelName(alert.panel_id)}</strong>
              </span>
              <button
                onClick={() => handleDelete(alert.id)}
                style={{
                  background: '#FFA500',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        ))
      )}

      {/* Alert creation form below alerts list */}
      <AlertCreationForm onSuccess={fetchAlerts} />
    </div>
  );
}

export default AlertsPage;
