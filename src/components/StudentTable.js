import React from "react";

const parseDate = (date) => {
  if (typeof date === "number") {
    // Converti il numero in una data partendo dal 1 gennaio 1900 (epoca Excel)
    const excelEpoch = new Date(1900, 0, 1); // 1 gennaio 1900
    const convertedDate = new Date(excelEpoch.setDate(excelEpoch.getDate() + date - 2)); // -2 perché Excel considera il 1900 come anno bisestile

    const day = String(convertedDate.getDate()).padStart(2, "0");
    const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
    const year = convertedDate.getFullYear();
    return `${day}/${month}/${year}`;
  } else if (typeof date === "string") {
    // Se è una stringa "gg/mm/yyyy"
    return date; // La stringa è già nel formato corretto
  } else if (date instanceof Date) {
    // Se è un oggetto Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return ""; // Caso di errore
};


export default function StudentTable({ grades }) {
  return (
    <div className="mt-8">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-3">Registro voti</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400">Voto</th>
              <th className="px-4 py-3 text-left text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400">Data</th>
              <th className="px-4 py-3 text-left text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-400">Tipo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {Array.isArray(grades) ? (
              grades.map((grade, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{grade.Voto}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{parseDate(grade.Data)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{grade.Tipo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-sm text-gray-400 text-center">
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
