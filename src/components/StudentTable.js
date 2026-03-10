import React from "react";

const parseDate = (date) => {
  if (typeof date === "number") {
    const excelEpoch = new Date(1900, 0, 1);
    const convertedDate = new Date(excelEpoch.setDate(excelEpoch.getDate() + date - 2));
    const day = String(convertedDate.getDate()).padStart(2, "0");
    const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
    const year = convertedDate.getFullYear();
    return `${day}/${month}/${year}`;
  } else if (typeof date === "string") {
    return date;
  } else if (date instanceof Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "";
};

export default function StudentTable({ grades }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <p style={{
        fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.25em', color: 'var(--text-faint)', marginBottom: '0.75rem',
      }}>
        Registro voti
      </p>
      <div style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
              {['Voto', 'Data', 'Tipo'].map(col => (
                <th key={col} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'var(--text-faint)',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: 'var(--bg-card)' }}>
            {Array.isArray(grades) ? (
              grades.map((grade, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                >
                  <td style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
                    {grade.Voto}
                  </td>
                  <td style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {parseDate(grade.Data)}
                  </td>
                  <td style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {grade.Tipo}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-faint)', textAlign: 'center' }}>
                  Nessun voto disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
