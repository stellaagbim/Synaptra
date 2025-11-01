import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.post('/api/agent', form);
        setAnalytics(res.data.sessions.map(s => ({ time: s.time.slice(11,16), latency: s.latency })));
      } catch (e) {}
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const run = async () => {
    const form = new FormData();
    form.append('text', text);
    if (image) form.append('image', image);
    if (audio) form.append('audio', audio);

    try {
      const res = await axios.post('http://localhost:8000/agent', form);
      setResponse(res.data.response);
      setHistory([...history, { input: text, output: res.data.response }]);
    } catch (e) {
      setResponse('Error: ' + e.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{ color: '#1a73e8' }}>Synaptra v2.0</h1>
      <p>Multimodal Embodied AI Agent</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter command..."
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
          />
          <div style={{ margin: '10px 0' }}>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} style={{ marginLeft: '10px' }} />
          </div>
          <button onClick={run} style={{ padding: '12px 24px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px' }}>
            Run Agent
          </button>
        </div>

        <div>
          <h3>Live Latency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="latency" stroke="#1a73e8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {response && (
        <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Agent Output:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
        </div>
      )}

      <h3>Session History</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {history.map((h, i) => (
          <div key={i} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <strong>You:</strong> {h.input}<br/>
            <strong>Synaptra:</strong> {h.output}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;