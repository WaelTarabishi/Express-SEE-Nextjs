'use client';

import { useEffect, useMemo, useState } from 'react';

const EVENT_URL = 'http://localhost:4000/events';

export default function HomePage() {
  const [status, setStatus] = useState('connecting');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const source = new EventSource(EVENT_URL);

    source.onopen = () => {
      setStatus('connected');
    };

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setEvents((prev) => [parsed, ...prev].slice(0, 20));
      } catch {
        setEvents((prev) => [{ id: Date.now(), message: event.data, time: new Date().toISOString() }, ...prev].slice(0, 20));
      }
    };

    source.onerror = () => {
      setStatus('disconnected');
    };

    return () => {
      source.close();
      setStatus('closed');
    };
  }, []);

  const badgeColor = useMemo(() => {
    if (status === 'connected') return '#16a34a';
    if (status === 'connecting') return '#eab308';
    return '#dc2626';
  }, [status]);

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>Express SSE + Next.js Listener</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Listening to <code>{EVENT_URL}</code>
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span>Status:</span>
        <span
          style={{
            backgroundColor: badgeColor,
            color: 'white',
            borderRadius: 999,
            padding: '4px 12px',
            textTransform: 'capitalize',
            fontWeight: 700
          }}
        >
          {status}
        </span>
      </div>

      <p>
        Total events shown: <strong>{events.length}</strong>
      </p>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
        {events.map((item) => (
          <li
            key={`${item.id}-${item.time}`}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}
          >
            <div style={{ fontWeight: 700 }}>{item.message}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{item.time}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
