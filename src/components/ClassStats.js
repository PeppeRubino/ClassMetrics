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
        <div key={label} className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-200">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-2">{label}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
