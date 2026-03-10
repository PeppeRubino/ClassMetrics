import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icone di successo e errore

export default function FileUploader({ handleFileUpload }) {
  const [fileStatus, setFileStatus] = useState(null); // Stato per monitorare il file

  // Gestore per il cambio file (file scelto dall'utente)
  const handleFileChange = (e) => {
    const file = e.target?.files?.[0]; // Protezione per evitare errori

    if (file) {
      const isValid = file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".ods");

      if (isValid) {
        setFileStatus(true); // Successo
        handleFileUpload(e); // Passa l'evento alla funzione di upload
      } else {
        setFileStatus(false); // Errore
      }
    } else {
      setFileStatus(null); // Nessun file caricato
    }
  };

  // Funzione per caricare automaticamente un file di test
  const handleTestFileUpload = () => {
    const testFilePath = '/file_test.xlsx'; // Percorso al file di test nel progetto

    // Crea un oggetto FileReader per caricare il file
    fetch(testFilePath)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'file_test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Crea un oggetto FormData per simulare un cambio file
        const fakeEvent = {
          target: {
            files: [file],
          },
        };

        handleFileChange(fakeEvent); // Passa l'evento al gestore di cambio file
      })
      .catch((error) => {
        console.error("Errore nel caricamento del file di test:", error);
      });
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept=".xlsx, .xls, .ods"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-medium tracking-wide px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Carica file Excel
        {fileStatus === true && <FaCheckCircle className="text-green-400 text-sm" />}
        {fileStatus === false && <FaTimesCircle className="text-red-400 text-sm" />}
      </label>
      <button
        onClick={handleTestFileUpload}
        className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
      >
        Usa file di test
      </button>
    </div>
  );
}
