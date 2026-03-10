import React from "react";

// Funzioni per calcolare le statistiche
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
    .map(Number); // Converte le chiavi in numeri

  return modes.length === grades.length ? 0 : modes; // Se ogni numero è unico, non c'è moda
};


function StatItem({ title, individualValue, classValue, tooltipText }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm" title={tooltipText}>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-2">{title}</p>
      <p className="text-xl font-semibold text-gray-900">{individualValue}</p>
      <p className="text-xs text-gray-400 mt-1">{classValue}</p>
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
    <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-6">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4">Statistiche studente</p>
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
