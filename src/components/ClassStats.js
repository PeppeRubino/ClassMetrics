export default function ClassStats({ stats }) {
  const items = [
    { label: "Media", value: stats.avg.toFixed(2) },
    { label: "Mediana", value: stats.median },
    { label: "Dev. Standard", value: stats.stdDev.toFixed(2) },
    { label: "Moda", value: stats.mode },
    {
      label: "Miglior Studente",
      value: (stats.bestStudents ?? []).length > 0
        ? `${stats.bestStudents[0][0]} (${stats.bestStudents[0][1].toFixed(2)})`
        : "—"
    },
    {
      label: "Peggior Studente",
      value: (stats.worstStudents ?? []).length > 0
        ? `${stats.worstStudents[0][0]} (${stats.worstStudents[0][1].toFixed(2)})`
        : "—"
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
      {items.map(({ label, value }) => (
        <div
          key={label}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <p style={{
            fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.25em', color: 'var(--text-faint)', marginBottom: '0.5rem',
          }}>
            {label}
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
