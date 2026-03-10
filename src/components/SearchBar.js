import React from "react";

export default function SearchBar({ search, setSearch, handleSearch }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Attiva la ricerca quando si preme Invio
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        placeholder="Classe (1A) o studente..."
      />
      <button
        onClick={handleSearch}
        className="bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Cerca
      </button>
    </div>
  );
}
