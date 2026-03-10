import React from "react";

const determineProfile = (mean, median, standardDeviation, mode, profiles) => {
  const compareCategory = (value, category) => {
    switch (category) {
      case "high":   return value >= 7;
      case "medium": return value >= 4 && value < 7;
      case "low":    return value < 4;
      default:       return false;
    }
  };

  for (const profileKey in profiles) {
    const profile = profiles[profileKey];
    const isMeanMatch   = compareCategory(mean, profile.criteria.mean);
    const isMedianMatch = compareCategory(median, profile.criteria.median);
    const isStdDevMatch = compareCategory(standardDeviation, profile.criteria.std_dev);
    const isModeMatch   = compareCategory(mode, profile.criteria.mode);
    if (isMeanMatch && isMedianMatch && isStdDevMatch && isModeMatch) {
      return profile.description;
    }
  }

  return "Descrizione non disponibile per questo profilo.";
};

const StudentProfile = ({ mean, median, standardDeviation, mode, profiles }) => {
  const studentProfileDescription = determineProfile(mean, median, standardDeviation, mode, profiles);

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
        Profilo studente
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {studentProfileDescription}
      </p>
    </div>
  );
};

export default StudentProfile;
