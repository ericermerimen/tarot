'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{
        background: 'linear-gradient(135deg, #0a0612 0%, #1a0a2e 50%, #0a0612 100%)',
        color: '#f0e6ff',
        fontFamily: 'sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(20, 10, 40, 0.9)',
          borderRadius: '16px',
          border: '1px solid rgba(156, 124, 244, 0.3)',
          maxWidth: '400px',
        }}>
          <h2 style={{ fontFamily: 'serif', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#b8a8d4', marginBottom: '1.5rem' }}>
            The mystical energies got a little tangled.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: 'linear-gradient(135deg, #9c7cf4 0%, #7c5ce0 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
