import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) setError(error.message);
      else setInfo('Controlla la tua email per il link di accesso.');
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setInfo('Registrazione avvenuta. Controlla la tua email per confermare.');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.07)]">
        <div className="mb-8 text-center">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-gray-400">Giuseppe Rubino</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-gray-900">ClassMetrics</p>
          <p className="mt-1 text-xs text-gray-400">
            {mode === 'login' ? 'Accedi al tuo account' : mode === 'register' ? 'Crea un account' : 'Accesso via email'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
          />
          {mode !== 'magic' && (
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '…' : mode === 'login' ? 'Accedi' : mode === 'register' ? 'Registrati' : 'Invia link'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-xs text-red-500">{error}</p>}
        {info && <p className="mt-4 text-center text-xs text-green-600">{info}</p>}

        <div className="mt-6 flex flex-col items-center gap-2">
          {mode !== 'login' && (
            <button onClick={() => setMode('login')} className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600">
              Hai già un account? Accedi
            </button>
          )}
          {mode !== 'register' && (
            <button onClick={() => setMode('register')} className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600">
              Crea account
            </button>
          )}
          {mode !== 'magic' && (
            <button onClick={() => setMode('magic')} className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600">
              Accedi via magic link
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-[0.55rem] uppercase tracking-[0.3em] text-gray-300">
        © Giuseppe Rubino · giusepperubino.eu · @giusepperubino.eu
      </p>
    </div>
  );
}
