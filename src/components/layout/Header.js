import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../data/logo.png';

export function Header({ onUpload, onSearch, search, setSearch, suggestions }) {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-strong)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
        {/* Top row: brand + controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={logo} style={{ width: '36px', height: '36px', opacity: 0.85, objectFit: 'contain' }} alt="ClassMetrics logo" />
            <div>
              <p style={{
                fontSize: '0.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--text-faint)',
                marginBottom: '1px',
              }}>
                {t('header.tagline', 'Grade statistical analysis')}
              </p>
              <h1 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                ClassMetrics
              </h1>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.5rem',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              marginRight: '0.25rem',
            }}>
              A Rubino Product
            </span>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom row: upload + search */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* File upload */}
          <label style={{ cursor: 'pointer', flexShrink: 0 }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={onUpload}
              style={{ display: 'none' }}
            />
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.875rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              userSelect: 'none',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {t('header.upload', 'Upload Excel')}
            </span>
          </label>

          {/* Search */}
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '180px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="search"
                list="classSuggestions"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('header.search', 'Search class or student…')}
                style={{
                  width: '100%',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.875rem',
                  color: 'var(--text)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <datalist id="classSuggestions">
                {(suggestions || []).map((s, i) => <option key={i} value={s} />)}
              </datalist>
            </div>
            <button
              type="submit"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.875rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              {t('header.searchBtn', 'Search')}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
