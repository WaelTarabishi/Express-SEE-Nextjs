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
    </main>
  );
}
