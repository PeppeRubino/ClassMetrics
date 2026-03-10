import React from "react";

// Funzione per determinare il profilo basato sulle statistiche calcolate
const determineProfile = (mean, median, standardDeviation, mode, profiles) => {
  const compareCategory = (value, category) => {
    switch (category) {
      case "high":
        return value >= 7;
      case "medium":
        return value >= 4 && value < 7;
      case "low":
        return value < 4;
      default:
        return false;
    }
  };

  for (const profileKey in profiles) {
    const profile = profiles[profileKey];

    const isMeanMatch = compareCategory(mean, profile.criteria.mean);
    const isMedianMatch = compareCategory(median, profile.criteria.median);
    const isStdDevMatch = compareCategory(standardDeviation, profile.criteria.std_dev);
    const isModeMatch = compareCategory(mode, profile.criteria.mode);

    if (isMeanMatch && isMedianMatch && isStdDevMatch && isModeMatch) {
      return profile.description;
    }
  }

  return "Descrizione non disponibile per questo profilo.";
};

const StudentProfile = ({ mean, median, standardDeviation, mode, profiles }) => {
  const studentProfileDescription = determineProfile(mean, median, standardDeviation, mode, profiles);

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200/60 rounded-2xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4">Profilo studente</p>
      <p className="text-sm text-gray-700 leading-relaxed">{studentProfileDescription}</p>
    </div>
  );
};

export default StudentProfile;
