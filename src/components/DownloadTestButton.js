// DownloadFileButton.jsx
import React, { useState } from "react";

export default function DownloadFileButton({
  file = null,       // File object (es. uploadedFile)
  src = null,        // URL (es. "/data/file_test.xlsx")
  filename = null,   // nome file per il download (fallback: file.name o estratto da src)
  label = "Scarica file",
  className = "",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerDownload = async () => {
    if (disabled || loading) return;
    setError(null);
    setLoading(true);

    let blob;
    let suggestedName = filename;

    try {
      if (file instanceof File) {
        // abbiamo già l'oggetto File in memoria
        blob = file;
        suggestedName = suggestedName || file.name || "download";
      } else if (typeof src === "string") {
        // fetchiamo la risorsa e creiamo un blob
        const res = await fetch(src, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        blob = await res.blob();

        // prova a ricavare il nome dal Content-Disposition o dall'URL
        if (!suggestedName) {
          const cd = res.headers.get("content-disposition");
          if (cd) {
            const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
            if (m) suggestedName = decodeURIComponent(m[1]);
          }
          if (!suggestedName) {
            // fallback: estrai il segmento finale della src
            try {
              const url = new URL(src, window.location.href);
              suggestedName = url.pathname.split("/").pop() || "download";
            } catch {
              suggestedName = "download";
            }
          }
        }
      } else {
        throw new Error("Nessun file o sorgente fornita");
      }

      // crea objectURL e forzi il download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // revoca l'URL dopo breve delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
    } catch (err) {
      console.error("DownloadFileButton error:", err);
      setError("Impossibile scaricare il file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={triggerDownload}
        disabled={disabled || loading}
        className={`px-3 py-2 rounded-md font-medium transition ${
          disabled || loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-blue-600 hover:brightness-95"
        }`}
        aria-disabled={disabled || loading}
        title={label}
      >
        {loading ? "Preparazione..." : label}
      </button>

      {error && (
        <span className="ml-2 text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
