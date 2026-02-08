'use client';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Choose a view</h1>

      <p style={{ color: '#475569' }}>
        Open the student form or the teacher live panel in separate tabs.
      </p>

      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <a
          href="/student"
          style={{
            display: 'block',
            padding: 16,
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            textDecoration: 'none',
            color: '#0f172a',
            background: 'white',
            fontWeight: 700,
          }}
        >
          Student UI
        </a>
        <a
          href="/teacher"
          style={{
            display: 'block',
            padding: 16,
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            textDecoration: 'none',
            color: '#0f172a',
            background: 'white',
            fontWeight: 700,
          }}
        >
          Teacher UI (Live)
        </a>
      </div>
    </main>
  );
}
