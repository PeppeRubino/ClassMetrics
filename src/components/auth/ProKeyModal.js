import { useState } from 'react';
import { useAuth } from './AuthGate';

export default function ProKeyModal({ onClose }) {
  const { redeemKey, isPro } = useAuth();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isPro) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await redeemKey(key.trim());
    if (result.success) {
      onClose?.();
    } else {
      setError(
        result.error === 'invalid_or_used_key'
          ? 'Chiave non valida o già utilizzata.'
          : 'Errore durante la verifica della chiave.'
      );
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-xl p-8 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.15)]">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-gray-400">Accesso Pro</p>
        <p className="mt-2 text-base font-semibold text-gray-900">Inserisci la tua chiave</p>
        <p className="mt-1 text-xs text-gray-400 leading-relaxed">
          La chiave viene salvata sul browser e non ti verrà richiesta di nuovo.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            required
            placeholder="XXXX-XXXX-XXXX"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm tracking-widest text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90 transition-all duration-200 disabled:opacity-40"
          >
            {loading ? '…' : 'Attiva Pro'}
          </button>
        </form>

        {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-gray-300 underline underline-offset-2 hover:text-gray-500 transition-colors duration-200"
        >
          Non ora
        </button>
      </div>
    </div>
  );
}
