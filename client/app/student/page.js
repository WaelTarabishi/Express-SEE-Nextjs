'use client';

import { useState } from 'react';

const API_BASE = 'http://localhost:4000';

export default function StudentPage() {
  const [studentName, setStudentName] = useState('Student-1');
  const [questionId, setQuestionId] = useState('Q1');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);
  const [status, setStatus] = useState('');

  const submitAnswer = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          questionId,
          answer,
          isCorrect,
        }),
      });

      if (!response.ok) {
        let msg = 'Submit failed';
        try {
          const data = await response.json();
          msg = (data && data.error) || msg;
        } catch {
          // ignore parse errors
        }
        throw new Error(msg);
      }

      setAnswer('');
      setStatus('Submitted');
    } catch (err) {
      setStatus((err && err.message) || 'Submit failed');
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
      <h1>Student Submit Form</h1>

      <p style={{ color: '#475569' }}>
        Backend: <code>{API_BASE}</code>
      </p>

      <form onSubmit={submitAnswer} style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student name"
          required
        />
        <input
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          placeholder="Question ID"
          required
        />
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" required />

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} />
          Mark answer as correct
        </label>

        <button type="submit" style={{ padding: '8px 12px', fontWeight: 700 }}>
          Submit answer
        </button>
      </form>

      {status && (
        <p style={{ marginTop: 12, color: status === 'Submitted' ? '#16a34a' : '#dc2626' }}>{status}</p>
      )}
    </main>
  );
}
