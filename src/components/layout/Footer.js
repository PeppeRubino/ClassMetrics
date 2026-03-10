import React from 'react';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-subtle)',
      borderTop: '1px solid var(--border)',
      padding: '1.5rem 1rem',
      textAlign: 'center',
      marginTop: 'auto',
    }}>
      <p style={{
        fontSize: '0.5rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        margin: 0,
      }}>
        © Giuseppe Rubino — giusepperubino.eu — @giusepperubino.eu
      </p>
    </footer>
  );
}
