import { useState, useRef } from "react";
import { AuthGate } from "./components/auth/AuthGate";
import ClassIndex from "./components/ClassIndex";
import StudentChart from "./components/StudentChart";
import StudentProfile from "./components/StudentProfile";
import StudentStats from "./components/StudentStats";
import StudentTable from "./components/StudentTable";
import profiles from "./data/StudentProfiles.json";
import DownloadPDFButton from "./components/DownloadPDFButton";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { useLanguage } from "./context/LanguageContext";

import * as XLSX from "xlsx";

function App() {
  const [grades, setGrades] = useState({});
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const tableRef = useRef(null);
  const { t } = useLanguage();

  const calculateMean = (grades) => {
    if (!grades.length) return 0;
    return (grades.reduce((acc, val) => acc + val, 0) / grades.length).toFixed(2);
  };

  const calculateMedian = (grades) => {
    if (!grades.length) return 0;
    const sorted = [...grades].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
  };

  const calculateStandardDeviation = (grades) => {
    if (!grades.length) return 0;
    const mean = calculateMean(grades);
    const variance =
      grades.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / grades.length;
    return Math.sqrt(variance).toFixed(2);
  };

  const calculateMode = (grades) => {
    if (!grades.length) return 0;
    const frequency = {};
    let maxFreq = 0;
    let mode = null;
    grades.forEach((grade) => {
      frequency[grade] = (frequency[grade] || 0) + 1;
      if (frequency[grade] > maxFreq) {
        maxFreq = frequency[grade];
        mode = grade;
      }
    });
    return mode;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      const newGrades = {};
      parsedData.forEach((row) => {
        const { Classe, Nome, ...rest } = row;
        if (!Nome || !Classe) return;
        const fullName = Nome.trim();
        if (!newGrades[Classe]) newGrades[Classe] = {};
        if (!newGrades[Classe][fullName]) newGrades[Classe][fullName] = [];
        for (let key in rest) {
          if (key.startsWith("Voto")) {
            const index = key.replace("Voto", "");
            const voto = rest[key];
            const data = rest[`Data${index}`];
            const tipo = rest[`Tipo${index}`];
            if (voto && data && tipo) {
              newGrades[Classe][fullName].push({
                Nome: fullName,
                Voto: Number(voto),
                Data: data,
                Tipo: tipo,
              });
            }
          }
        }
      });
      setGrades(newGrades);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSearch = () => {
    const searchLower = search.trim().toLowerCase();
    let foundStudent = null;
    let foundClass = null;
    Object.entries(grades).forEach(([classe, studenti]) => {
      if (classe.toLowerCase().includes(searchLower)) {
        foundClass = classe;
      }
      Object.keys(studenti).forEach((studente) => {
        if (studente.toLowerCase().includes(searchLower)) {
          foundStudent = studente;
          foundClass = classe;
        }
      });
    });
    if (foundStudent) {
      setSelectedStudent(foundStudent);
      setSelectedClass(foundClass);
    } else if (foundClass) {
      setSelectedClass(foundClass);
      setSelectedStudent(null);
    } else {
      setSelectedClass(null);
      setSelectedStudent(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header
        onUpload={handleFileUpload}
        onSearch={handleSearch}
        search={search}
        setSearch={setSearch}
        suggestions={[
          ...Object.keys(grades),
          ...Object.values(grades).flatMap((cls) => Object.keys(cls)),
        ]}
      />

      <main style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div ref={tableRef}>
          {selectedClass && !selectedStudent && (
            <ClassIndex grades={grades[selectedClass]} className={selectedClass} />
          )}

          {selectedStudent && (
            <>
              <DownloadPDFButton
                targetRef={tableRef}
                fileName={`Statistiche_${selectedStudent}_${selectedClass}`}
              />
              <StudentChart
                grades={grades[selectedClass][selectedStudent]}
                studentName={selectedStudent}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <StudentStats
                  studentGrades={grades[selectedClass][selectedStudent]}
                  classGrades={Object.values(grades[selectedClass]).flat()}
                />
                <StudentProfile
                  mean={calculateMean(grades[selectedClass][selectedStudent].map((e) => e.Voto))}
                  median={calculateMedian(grades[selectedClass][selectedStudent].map((e) => e.Voto))}
                  standardDeviation={calculateStandardDeviation(grades[selectedClass][selectedStudent].map((e) => e.Voto))}
                  mode={calculateMode(grades[selectedClass][selectedStudent].map((e) => e.Voto))}
                  profiles={profiles}
                />
              </div>
              <StudentTable grades={grades[selectedClass][selectedStudent]} />
            </>
          )}

          {!selectedClass && !selectedStudent && search !== "" && (
            <p style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '1rem' }}>
              {t('app.noResults', 'No results found.')}
            </p>
          )}

          {!selectedClass && !selectedStudent && search === "" && Object.keys(grades).length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
              <p style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--text-faint)',
                marginBottom: '0.5rem',
              }}>
                {t('app.empty.title', 'Get started')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {t('app.empty.desc', 'Upload an Excel file to view class statistics')}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AppWithAuth() {
  return (
    <AuthGate>
      <App />
    </AuthGate>
  );
}
