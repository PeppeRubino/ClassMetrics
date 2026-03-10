import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';

const inputStyle = {
  width: '100%',
  background: 'var(--bg-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const btnLinkStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.75rem',
  color: 'var(--text-faint)',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  transition: 'color 0.2s',
  fontFamily: 'inherit',
  padding: 0,
};

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { t } = useLanguage();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) setError(error.message);
      else setInfo(t('login.checkEmail', 'Check your email for the access link.'));
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setInfo(t('login.registered', 'Registration complete. Check your email to confirm.'));
    }
    setLoading(false);
  }

  const subtitle = mode === 'login'
    ? t('login.subtitle.login', 'Sign in to your account')
    : mode === 'register'
    ? t('login.subtitle.register', 'Create an account')
    : t('login.subtitle.magic', 'Passwordless access');

  const submitLabel = loading ? '…'
    : mode === 'login' ? t('login.signin', 'Sign In')
    : mode === 'register' ? t('login.register', 'Sign Up')
    : t('login.sendLink', 'Send Link');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '1rem',
    }}>
      {/* Top-right theme/lang controls */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 50,
      }}>
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '22rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-strong)',
        borderRadius: '1.5rem',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
        boxSizing: 'border-box',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.5rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            color: 'var(--text-faint)',
            marginBottom: '0.25rem',
          }}>
            Giuseppe Rubino
          </p>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '-0.01em',
            marginBottom: '0.25rem',
          }}>
            ClassMetrics
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="email"
            required
            placeholder={t('login.email', 'Email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
          {mode !== 'magic' && (
            <input
              type="password"
              required
              placeholder={t('login.password', 'Password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.625rem 1rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {submitLabel}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#ef4444' }}>
            {error}
          </p>
        )}
        {info && (
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#22c55e' }}>
            {info}
          </p>
        )}

        {/* Mode switches */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          {mode !== 'login' && (
            <button onClick={() => setMode('login')} style={btnLinkStyle}>
              {t('login.hasAccount', 'Already have an account? Sign in')}
            </button>
          )}
          {mode !== 'register' && (
            <button onClick={() => setMode('register')} style={btnLinkStyle}>
              {t('login.createAccount', 'Create account')}
            </button>
          )}
          {mode !== 'magic' && (
            <button onClick={() => setMode('magic')} style={btnLinkStyle}>
              {t('login.magicLink', 'Sign in with magic link')}
            </button>
          )}
        </div>
      </div>

      {/* Brand signature */}
      <p style={{
        marginTop: '1.5rem',
        fontSize: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        color: 'var(--text-faint)',
      }}>
        © Giuseppe Rubino · giusepperubino.eu · @giusepperubino.eu
      </p>
    </div>
  );
}
