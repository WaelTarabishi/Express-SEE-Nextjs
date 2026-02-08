'use client';

import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';

export default function HomePage() {
  const [studentName, setStudentName] = useState('Student-1');
  const [questionId, setQuestionId] = useState('Q1');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);

  const [status, setStatus] = useState('connecting');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const response = await fetch(`${API_BASE}/results`);
        const data = await response.json();
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      } catch {
        setError('Could not load initial results from backend.');
      }
    };

    loadInitial();

    const source = new EventSource(`${API_BASE}/events`);

    source.onopen = () => setStatus('connected');

    source.addEventListener('submission', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setSubmissions((prev) => [parsed, ...prev]);
      } catch {
        // ignore broken event
      }
    });

    source.onerror = () => setStatus('disconnected');
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

  const submitAnswer = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          questionId,
          answer,
          isCorrect
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submit failed');
      }

      setAnswer('');
    } catch (err) {
      setError(err.message || 'Submit failed');
    }
  };

  const summary = useMemo(() => {
    const total = submissions.length;
    const correct = submissions.filter((item) => item.isCorrect).length;
    const wrong = total - correct;
    return { total, correct, wrong };
  }, [submissions]);

  return (
    <main style={{ maxWidth: 980, margin: '24px auto', padding: 16 }}>
      <h1>Student / Teacher Live Results (SSE)</h1>
      <p style={{ color: '#475569' }}>
        Backend: <code>{API_BASE}</code>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <h2>Student Submit Form</h2>
          <form onSubmit={submitAnswer} style={{ display: 'grid', gap: 10 }}>
            <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" required />
            <input value={questionId} onChange={(e) => setQuestionId(e.target.value)} placeholder="Question ID" required />
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" required />

            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} />
              Mark answer as correct
            </label>

            <button type="submit" style={{ padding: '8px 12px', fontWeight: 700 }}>
              Submit answer
            </button>
          </form>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        </section>

        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
          <h2>Teacher Live Panel</h2>
          <p>
            SSE status: <strong style={{ textTransform: 'capitalize' }}>{status}</strong>
          </p>
          <p>
            Total: <strong>{summary.total}</strong> | Correct: <strong>{summary.correct}</strong> | Wrong: <strong>{summary.wrong}</strong>
          </p>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, maxHeight: 420, overflow: 'auto' }}>
            {submissions.map((item) => (
              <li key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  {item.studentName} → {item.questionId}
                </div>
                <div>Answer: {item.answer}</div>
                <div>
                  Result:{' '}
                  <strong style={{ color: item.isCorrect ? '#16a34a' : '#dc2626' }}>
                    {item.isCorrect ? 'Correct' : 'Wrong'}
                  </strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{item.submittedAt}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
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
