import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetch('http://localhost:3000/api/solarpanel')
      .then(res => res.json())
      .then(data => {
        setPanelData(data.info);
        if (data.info.length > 0) {
          setSelected(data.info[0]); // Default to first panel
        }
      })
      .catch(err => console.error("API error:", err));
  }, []);

  const displayedPanel = selected || panelData[0];

  return (
    <div className='solar-view' style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <h2>Solar Panel Dashboard</h2>
      <p style={{ color: '#808080', marginTop: -20, marginBottom: 60 }}>
        Monitor and analyze your solar panel performance in real-time.
      </p>

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
          <div
            style={{
              display: 'flex',
              gap: 24,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
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
                  border: `2px solid ${selected?.serial_number === panel.serial_number ? getColor(panel.status) : 'transparent'}`, // ✅ fixed here
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
                  aria-label={`Status: ${panel.status}`}
                  title={`Status: ${panel.status}`}
                />
                <img
                  src="/solarpan.svg"
                  alt={`Solar panel ${panel.serial_number}`}
                  style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 12 }}
                  draggable={false}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 16,
                    color: '#333',
                    userSelect: 'text',
                  }}
                >
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
            <h1 style={{ fontSize: 20, lineHeight: 1.8 }}>
              {displayedPanel.serial_number} - {displayedPanel.model}<br />
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
            <strong>Wattage:</strong> {Math.round(selected.voltage_vmp * selected.current_imp)} W<br />
            <strong>Isc:</strong> {displayedPanel.current_isc} A<br />
            <strong>Imp:</strong> {displayedPanel.current_imp} A<br />
            <strong>Installation Date:</strong> {new Date(displayedPanel.installation_date).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default SolarView;
