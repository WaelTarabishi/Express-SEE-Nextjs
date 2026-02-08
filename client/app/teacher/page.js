'use client';

import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';

export default function TeacherPage() {
  const [status, setStatus] = useState('connecting');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let source = null;

    const loadInitial = async () => {
      try {
        const response = await fetch(`${API_BASE}/results`);
        if (!response.ok) throw new Error('Bad response');
        const data = await response.json();
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      } catch {
        setError('Could not load initial results from backend.');
      }
    };

    loadInitial();

    source = new EventSource(`${API_BASE}/events`);

    source.onopen = () => setStatus('connected');

    source.addEventListener('submission', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setSubmissions((prev) => [parsed, ...prev]);
      } catch {
        // ignore broken event
      }
    });

    source.addEventListener('connected', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && parsed.message) {
          setError(parsed.message);
        }
      } catch {
        // ignore broken event
      }
    });

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setSubmissions((prev) => [parsed, ...prev]);
      } catch {
        // ignore non-JSON messages
      }
    };

    source.onerror = () => setStatus('disconnected');

    return () => {
      if (source) source.close();
      setStatus('closed');
    };
  }, []);

  const summary = useMemo(() => {
    const total = submissions.length;
    const correct = submissions.filter((s) => s && s.isCorrect).length;
    const wrong = total - correct;
    return { total, correct, wrong };
  }, [submissions]);

  const badgeColor = useMemo(() => {
    if (status === 'connected') return '#16a34a';
    if (status === 'connecting') return '#eab308';
    if (status === 'closed') return '#64748b';
    return '#dc2626';
  }, [status]);

  return (
    <main style={{ maxWidth: 980, margin: '24px auto', padding: 16 }}>
      <h1>Teacher Live Panel (SSE)</h1>

      <p style={{ color: '#475569' }}>
        Backend: <code>{API_BASE}</code>
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span>Status:</span>
        <span
          style={{
            backgroundColor: badgeColor,
            color: 'white',
            borderRadius: 999,
            padding: '4px 12px',
            textTransform: 'capitalize',
            fontWeight: 700,
          }}
        >
          {status}
        </span>
      </div>

      <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <h2>Live Results</h2>

        <p>
          Total: <strong>{summary.total}</strong> | Correct: <strong>{summary.correct}</strong> | Wrong:{' '}
          <strong>{summary.wrong}</strong>
        </p>

        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gap: 8,
            maxHeight: 520,
            overflow: 'auto',
          }}
        >
          {submissions.map((item) => (
            <li key={String(item.id)} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
              <div style={{ fontWeight: 700 }}>
                {item.studentName} -&gt; {item.questionId}
              </div>
              <div>Answer: {item.answer}</div>
              <div>
                Result:{' '}
                <strong style={{ color: item.isCorrect ? '#16a34a' : '#dc2626' }}>
                  {item.isCorrect ? 'Correct' : 'Wrong'}
                </strong>
              </div>
              {item.submittedAt && <div style={{ fontSize: 12, color: '#64748b' }}>{item.submittedAt}</div>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
