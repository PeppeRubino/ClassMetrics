import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, APP_SLUG } from '../../lib/supabase';
import LoginPage from './LoginPage';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

const PRO_KEY_STORAGE = `${APP_SLUG}_pro_key`;

function AuthGateInner({ children }) {
  const [session, setSession] = useState(undefined);
  const [isPro, setIsPro] = useState(false);
  const [proChecked, setProChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setIsPro(false);
        setProChecked(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    checkProStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function checkProStatus() {
    setProChecked(false);
    const { data, error } = await supabase.rpc('check_license', { p_app_slug: APP_SLUG });
    if (!error && data?.pro) {
      setIsPro(true);
      localStorage.setItem(PRO_KEY_STORAGE, data.license_key || '');
    } else {
      setIsPro(false);
    }
    setProChecked(true);
  }

  async function redeemKey(key) {
    const { data, error } = await supabase.rpc('redeem_license_key', {
      p_key: key,
      p_app_slug: APP_SLUG,
    });
    if (error || data?.error) {
      return { success: false, error: data?.error || error?.message };
    }
    localStorage.setItem(PRO_KEY_STORAGE, key);
    setIsPro(true);
    return { success: true };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <p style={{
          fontSize: '0.6rem',
          color: 'var(--text-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
        }}>
          Caricamento…
        </p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <AuthContext.Provider value={{ session, user: session.user, isPro, proChecked, redeemKey, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthGate({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthGateInner>
          {children}
        </AuthGateInner>
      </LanguageProvider>
    </ThemeProvider>
  );
}
