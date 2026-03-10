import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const FLAG_LABELS = {
  it: 'IT', en: 'EN', es: 'ES', fr: 'FR', de: 'DE',
  ru: 'RU', zh: '中', ja: '日', hi: 'हि', ar: 'AR',
};

export function LanguageSelector() {
  const { lang, setLang, SUPPORTED } = useLanguage();

  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value)}
      aria-label="Select language"
      style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-strong)',
        borderRadius: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.6rem',
        fontWeight: 600,
        padding: '4px 6px',
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'inherit',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        height: '28px',
      }}
    >
      {SUPPORTED.map(l => (
        <option key={l} value={l}>{FLAG_LABELS[l]}</option>
      ))}
    </select>
  );
}
