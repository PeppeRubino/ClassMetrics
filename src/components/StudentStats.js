import React from "react";

const calculateMean = (grades) => {
  if (!grades.length) return 0;
  return (grades.reduce((acc, val) => acc + val, 0) / grades.length).toFixed(2);
};

const calculateMedian = (grades) => {
  if (!grades.length) return 0;
  const sorted = [...grades].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
};

const calculateStandardDeviation = (grades) => {
  if (!grades.length) return 0;
  const mean = calculateMean(grades);
  const variance = grades.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / grades.length;
  return Math.sqrt(variance).toFixed(2);
};

const calculateMode = (grades) => {
  if (!grades.length) return 0;
  const frequency = {};
  let maxFreq = 0;
  grades.forEach((grade) => {
    frequency[grade] = (frequency[grade] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[grade]);
  });
  const modes = Object.keys(frequency)
    .filter((key) => frequency[key] === maxFreq)
    .map(Number);
  return modes.length === grades.length ? 0 : modes;
};

function StatItem({ title, individualValue, classValue, tooltipText }) {
  return (
    <div
      title={tooltipText}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
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
        {title}
      </p>
      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
        {individualValue}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.25rem' }}>
        {classValue}
      </p>
    </div>
  );
}

export default function StudentStats({ studentGrades, classGrades }) {
  const studentScores = studentGrades.map((entry) => entry.Voto);
  const classScores = classGrades.map((entry) => entry.Voto);

  const mean = calculateMean(studentScores);
  const mode = calculateMode(studentScores);
  const median = calculateMedian(studentScores);
  const standardDeviation = calculateStandardDeviation(studentScores);

  const classMean = calculateMean(classScores);
  const classMode = calculateMode(classScores);
  const classMedian = calculateMedian(classScores);
  const classStandardDeviation = calculateStandardDeviation(classScores);

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{
        fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.25em', color: 'var(--text-faint)', marginBottom: '1rem',
      }}>
        Statistiche studente
      </p>
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          title="Media"
          individualValue={mean}
          classValue={`Classe: ${classMean}`}
          tooltipText="La media dei voti dello studente e la media della classe"
        />
        <StatItem
          title="Mediana"
          individualValue={median}
          classValue={`Classe: ${classMedian}`}
          tooltipText="Il voto centrale tra i voti ordinati dello studente e della classe"
        />
        <StatItem
          title="Dev. Standard"
          individualValue={standardDeviation}
          classValue={`Classe: ${classStandardDeviation}`}
          tooltipText="La variabilità dei voti dello studente e della classe"
        />
        <StatItem
          title="Moda"
          individualValue={Array.isArray(mode) ? mode.join(", ") : mode}
          classValue={`Classe: ${Array.isArray(classMode) ? classMode.join(", ") : classMode}`}
          tooltipText="Il voto che appare più frequentemente"
        />
      </div>
    </div>
  );
}
