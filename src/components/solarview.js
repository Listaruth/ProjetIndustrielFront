import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const getColor = (status) => {
  switch (status) {
    case 'Active': return '#28a745';
    case 'Warning': return '#ffc107';
    case 'Faulty': return '#dc3545';
    default: return '#6c757d';
  }
};

function SolarView() {
  const [panelData, setPanelData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [measurements, setMeasurements] = useState([]);
  const [graphView, setGraphView] = useState('performance & Wattage');

  // Effect 1: Poll panels every 60 seconds, update panelData only
  useEffect(() => {
    const fetchPanels = () => {
      fetch('http://localhost:3000/api/solarpanel')
        .then(res => res.json())
        .then(data => {
          setPanelData(data.info);
        })
        .catch(err => console.error("API error:", err));
    };

    fetchPanels();
    const intervalId = setInterval(fetchPanels, 60000);
    return () => clearInterval(intervalId);
  }, []); // no dependencies needed here

  // Effect 2: Update selected when panelData changes
  useEffect(() => {
    if (panelData.length === 0) return;

    if (!selected) {
      setSelected(panelData[0]);
    } else {
      const updatedSelected = panelData.find(p => p.id === selected.id);
      if (updatedSelected) {
        setSelected(updatedSelected);
      }
    }
  }, [panelData, selected]);


  // Fetch measurement data every 15 minutes (900000 ms)
  useEffect(() => {
    if (!selected) return;
    const fetchMeasurements = () => {
      fetch(`http://localhost:3000/api/solarpanel/measure/${selected.id}`)
        .then(res => res.json())
        .then(data => {
          setMeasurements(data.info || []);
        })
        .catch(err => console.error("Measurement fetch error:", err));
    };
    fetchMeasurements();
    const intervalId = setInterval(fetchMeasurements, 900000); // 15 minutes
    return () => clearInterval(intervalId);
  }, [selected]);

  const displayedPanel = selected || panelData[0];

  const getEfficiency = (panel) => {
    const pr = (panel.voltage_vmp * panel.current_imp) / (panel.voltage_voc * panel.current_isc || 1);
    const efficiency = pr * 25;
    return Math.max(15, efficiency); // Clamp minimum to 15%
  };

  
  return (
    <div className='solar-view' style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <h2>Solar Panel Dashboard</h2>
      <p style={{ color: '#808080', marginTop: -20, marginBottom: 60 }}>
        Monitor and analyze your solar panel performance in real-time.
      </p>
      {/* Summary Cards Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: 20,
        margin: '40px auto',
        maxWidth: 1200,
      }}>
        {/* Card 1: Total Power Output */}
        <div style={{
          flex: 1,
          backgroundColor: '#fffbea',
          borderRadius: 10,
          padding: 20,
          border: '1px solid #f9e79f',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        }}>
          <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#ffc107' }}>
            ⚡ Total Power Output
          </h4>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#333' }}>
            {Math.round(panelData.reduce((sum, p) => sum + (p.voltage_vmp * p.current_imp), 0))} W
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            {(panelData.reduce((sum, p) => sum + (p.voltage_vmp * p.current_imp), 0) / 1000).toFixed(2)} kW
          </div>
        </div>

        {/* Card 2: Active Panels */}
        <div style={{
          flex: 1,
          backgroundColor: '#e9f7ef',
          borderRadius: 10,
          padding: 20,
          border: '1px solid #d4efdf',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        }}>
          <h4 style={{ marginBottom: 12, color: '#28a745' }}>
            Active Panels
          </h4>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#333' }}>
            {panelData.filter(p => p.status === 'Active').length} / {panelData.length}
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            {((panelData.filter(p => p.status === 'Active').length / panelData.length) * 100).toFixed(0)}% operational
          </div>
        </div>

        {/* Card 3: Avg. Efficiency */}
        <div style={{
          flex: 1,
          backgroundColor: '#eafaf1',
          borderRadius: 10,
          padding: 20,
          border: '1px solid #d1f2eb',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        }}>
          <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#28a745' }}>
            🔋 Avg. Efficiency
          </h4>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#333' }}>
            {panelData.length > 0
              ? `${(
                  panelData.reduce((sum, p) => sum + getEfficiency(p), 0) / panelData.length).toFixed(1)}%`
              : 'N/A'}
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            Good Performance
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid #D3D3D3', borderRadius: 7, padding: 20 }}>
        <h3 style={{ marginTop: -10, marginBottom: 50 }}>Solar Panel Array</h3>

        <div
          className='panel-grid'
          style={{
            border: '1px solid #D3D3D3',
            borderRadius: 7,
            padding: 20,
            backgroundColor: '#f9f9f9',
            maxWidth: 990,
            margin: 'auto',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', gap: 24, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            {panelData.length === 0 && <p>Loading panels...</p>}
            {panelData.map(panel => (
              <div
                key={panel.serial_number}
                style={{
                  position: 'relative',
                  width: 150,
                  padding: 12,
                  boxShadow: '0 4px 8px rgb(0 0 0 / 0.1)',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'transform 0.2s',
                  border: `2px solid ${selected?.serial_number === panel.serial_number ? getColor(panel.status) : 'transparent'}`,
                }}
                onMouseEnter={(e) => {
                  setHovered(panel);
                  setPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(panel)}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: getColor(panel.status),
                    boxShadow: `0 0 8px ${getColor(panel.status)}`,
                    border: '2px solid white',
                  }}
                />
                <img
                  src="/solarpan.svg"
                  alt={`Solar panel ${panel.serial_number}`}
                  style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 12 }}
                  draggable={false}
                />
                <div style={{ textAlign: 'center', fontWeight: '600', fontSize: 16, color: '#333', userSelect: 'text' }}>
                  {panel.serial_number}
                </div>
              </div>
            ))}
          </div>

          {hovered && (
            <div
              style={{
                position: 'fixed',
                top: pos.y + 10,
                left: pos.x + 10,
                background: '#333',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '6px',
                pointerEvents: 'none',
                fontSize: 13,
                maxWidth: 270,
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                zIndex: 9999,
                whiteSpace: 'normal',
              }}
            >
              <strong>{hovered.model} ({hovered.serial_number})</strong><br />
              Orientation: {hovered.orientation}°, Inclination: {hovered.inclination}°<br />
              Voc: {hovered.voltage_voc} V, Vmp: {hovered.voltage_vmp} V<br />
              Isc: {hovered.current_isc} A, Imp: {hovered.current_imp} A<br />
              <strong>Wattage:</strong> {Math.round(hovered.voltage_vmp * hovered.current_imp)} W<br />
              <strong>Wattage:</strong> {Math.round(hovered.voltage_vmp * hovered.current_imp)} W<br />
              <strong>Efficiency:</strong> { getEfficiency(hovered).toFixed(1) }%<br />
              Installed: {new Date(hovered.installation_date).toLocaleDateString()}<br />
              Status: <span style={{ color: getColor(hovered.status), fontWeight: '600' }}>{hovered.status}</span>
            </div>
          )}
        </div>

        <p style={{ color: '#808080', maxWidth: '50%', margin: 'auto' }}>
          Click on any panel to view detailed performance data • Hover for quick stats
        </p>
      </div>

      <h3 style={{ marginTop: 40 }}>Panel Details</h3>
      {displayedPanel && (
        <div style={{ border: '1px solid #D3D3D3', borderRadius: 7, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, lineHeight: 1.8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              >
                <circle cx="12" cy="12" r="10" stroke="#007bff" fill="#ffffff" /> {/* Blue outline, white fill */}
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              {displayedPanel.serial_number} - {displayedPanel.model}
            </h1>
            <p
              style={{
                margin: 0,
                padding: '4px 12px',
                borderRadius: 20,
                border: `2px solid ${getColor(displayedPanel.status)}`,
                backgroundColor: getColor(displayedPanel.status),
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {displayedPanel.status}
            </p>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.8 }}>
            <p style={{ color: '#808080', marginTop: -40 }}>Detailed information and specifications</p>
            <strong>Orientation:</strong> {displayedPanel.orientation}°<br />
            <strong>Inclination:</strong> {displayedPanel.inclination}°<br />
            <strong>Voc:</strong> {displayedPanel.voltage_voc} V<br />
            <strong>Vmp:</strong> {displayedPanel.voltage_vmp} V<br />
            <strong>Wattage:</strong> {Math.round(displayedPanel.voltage_vmp * displayedPanel.current_imp)} W<br />

            {/* Need to add efficiency rating of panel in the details section */}

            <strong>Isc:</strong> {displayedPanel.current_isc} A<br />
            <strong>Imp:</strong> {displayedPanel.current_imp} A<br />
            <strong>Installation Date:</strong> {new Date(displayedPanel.installation_date).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* GRAPH CONTROLS */}
      <div style={{
        backgroundColor: '#f1f1f1',
        borderRadius: 6,
        display: 'flex',
        marginTop: 40,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        {['performance & Wattage', 'voltage and current', 'temperature'].map(type => (
          <button
            key={type}
            onClick={() => setGraphView(type)}
            style={{
              flex: 1,
              border: 'none',
              padding: '12px 0',
              backgroundColor: graphView === type ? '#007bff' : '#f1f1f1',
              color: graphView === type ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* GRAPH DISPLAY */}
      <div style={{ marginTop: -30, maxWidth: '100%' }}>
        {measurements.length > 0 && (
          <div style={{ marginTop: 20 }}>           
            {graphView === 'performance & Wattage' && (
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingBottom: 60 }}>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                  <h4 style={{ marginBottom: 10 }}>Performance Ratio</h4>
                  <div style={{ height: 300, marginBottom: 40 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={measurements}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="performance_ratio" stroke="#28a745" name="Performance Ratio" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                  <h4 style={{ marginBottom: 10 }}>Wattage</h4>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={measurements.map(m => ({ ...m, wattage: m.voltage * m.current }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="wattage" stroke="#ffc107" name="Wattage (W)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {graphView === 'voltage and current' && (
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingBottom: 60 }}>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                  <h4 style={{ marginBottom: 10 }}>Voltage</h4>
                  <div style={{ height: 300, marginBottom: 40 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={measurements}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="voltage" stroke="#007bff" name="Voltage (V)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                  <h4 style={{ marginBottom: 10 }}>Current</h4>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={measurements}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="current" stroke="#dc3545" name="Current (A)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {graphView === 'temperature' && (
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingBottom: 60 }}>
                <div style={{ flex: 1, minWidth: 300, height: 300 }}>
                  <h4 style={{ marginBottom: 10 }}>Temperature</h4>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={measurements}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#fd7e14" name="Temperature (°C)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SolarView;