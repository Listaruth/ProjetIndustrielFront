import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const panelPositions = [
  { serial_number: 'SP1001', x: 50,  y: 100 },
  { serial_number: 'SP1002', x: 200, y: 100 },
  { serial_number: 'SP1003', x: 350, y: 100 },
];

const getColor = (status) => {
  switch (status) {
    case 'Active': return '#28a745';    // green
    case 'Warning': return '#ffc107';   // yellow / amber
    case 'Fault': return '#dc3545';     // red
    default: return '#6c757d'; // gray (unknown or inactive)
  }
};

function SolarView() {
  // Panel data
  const [panelData, setPanelData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Performance graph states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input and selected panelId for graph
  const [panelIdInput, setPanelIdInput] = useState('1'); // default as string "1"
  const [panelId, setPanelId] = useState(1); // default numeric 1

  // Fetch panel info list once
  useEffect(() => {
    fetch('http://localhost:3000/api/solarpanel')
      .then(res => res.json())
      .then(data => {
        setPanelData(data.info);
      })
      .catch(err => {
        console.error("API error:", err);
      });
  }, []);

  // Fetch performance data when panelId changes
  useEffect(() => {
    if (!panelId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/api/solarpanel/performance/${panelId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch performance data');
        return res.json();
      })
      .then(json => {
        if (json.info && json.info.length > 0) {
          setData(json.info);
        } else {
          setData([]);
          setError('No performance data available');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setData([]);
        setLoading(false);
      });
  }, [panelId]);

  const mergedPanels = panelData.map(panel => {
    const position = panelPositions.find(p => p.serial_number === panel.serial_number);
    if (!position) return null;
    return { ...panel, ...position };
  }).filter(Boolean);

  const handleInputChange = (e) => {
    setPanelIdInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(panelIdInput, 10);
    if (!isNaN(num)) {
      setPanelId(num);
      setError(null);
    } else {
      setError('Please enter a valid numeric Panel ID');
      setData([]);
    }
  };

  return (
    <>
      <div className='solar-view' style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
        <h2>Solar Panel Diagnostic Dashboard</h2>
        <svg width="800" height="400" style={{ border: '1px solid #ccc' }}>
          {mergedPanels.map(panel => (
            <React.Fragment key={panel.serial_number}>
              <rect
                x={panel.x - 3}
                y={panel.y - 3}
                width={126}
                height={66}
                rx={12}
                fill="none"
                stroke={getColor(panel.status)}
                strokeWidth={4}
                onMouseEnter={() => setHovered(panel)}
                onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              />
              <image
                href="/solarpan.svg"
                x={panel.x}
                y={panel.y}
                width={120}
                height={60}
                onMouseEnter={() => setHovered(panel)}
                onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              />
            </React.Fragment>
          ))}
        </svg>

        {hovered && (
          <div style={{
            position: 'fixed',
            top: pos.y + 10,
            left: pos.x + 10,
            background: '#333',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            fontSize: '13px',
            maxWidth: 250
          }}>
            <strong>{hovered.model} ({hovered.serial_number})</strong><br />
            Orientation: {hovered.orientation}°, Inclination: {hovered.inclination}°<br />
            Voc: {hovered.voltage_voc} V, Vmp: {hovered.voltage_vmp} V<br />
            Isc: {hovered.current_isc} A, Imp: {hovered.current_imp} A<br />
            Installed: {new Date(hovered.installation_date).toLocaleDateString()}<br />
            Status: <span style={{ color: getColor(hovered.status) }}>{hovered.status}</span>
          </div>
        )}


        {/* Panel ID input + 2x2 graph grid */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 40 }}>
            <form onSubmit={handleSubmit} style={{ flexShrink: 0 }}>
                <label htmlFor="panelIdInput" style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                Enter Panel ID:
                </label>
                <input
                id="panelIdInput"
                type="number"
                value={panelIdInput}
                onChange={handleInputChange}
                placeholder="e.g. 1"
                style={{ padding: '6px 10px', fontSize: 16, width: 120 }}
                />
                <button
                type="submit"
                style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    fontSize: 16,
                    cursor: 'pointer',
                    width: '100%',
                }}
                >
                Show Graph
                </button>
                {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            </form>
            <div className='graphs-container' style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, height: 620 /* 2 rows x ~310 height each */, maxWidth: 850 /*restrict max width to control overall size */ }}>
                {loading && <p>Loading data for panel {panelId}...</p>}
                {!loading && !error && data.length === 0 && (
                <p>No data found for panel {panelId}.</p>
                )}
                {!loading && !error && data.length > 0 && (
                <>
                    {/* Voltage */}
                    <div style={{ width: 400, height: 300 }}>
                        <h4>Voltage (V)</h4>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="avg_voltage" stroke="#8884d8" name="Avg Voltage" />
                            <Line type="monotone" dataKey="max_voltage" stroke="#0000ff" name="Max Voltage" />
                            <Line type="monotone" dataKey="min_voltage" stroke="#aaaaaa" name="Min Voltage" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Current */}
                    <div style={{ width: 400, height: 300 }}>
                        <h4>Current (A)</h4>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="avg_current" stroke="#82ca9d" name="Avg Current" />
                            <Line type="monotone" dataKey="max_current" stroke="#008000" name="Max Current" />
                            <Line type="monotone" dataKey="min_current" stroke="#004d00" name="Min Current" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Temperature */}
                    <div style={{ width: 400, height: 300 }}>
                        <h4>Temperature (°C)</h4>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="avg_temperature" stroke="#ff7300" name="Avg Temperature" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Performance Ratio */}
                    <div style={{ width: 400, height: 300 }}>
                        <h4>Performance Ratio</h4>
                        <ResponsiveContainer>
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{ value: 'Performance Ratio', angle: -90, position: 'insideLeft' }} domain={[0, 1]} tickFormatter={val => val.toFixed(2)} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="avg_performance_ratio" stroke="#ff0000" name="Avg Performance Ratio" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
                )}
            </div>
        </div>   
    </div>
    </>
  );
}

export default SolarView;
