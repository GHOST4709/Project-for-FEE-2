import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

/**
 * Light / dark theme.
 *  - Persisted in localStorage under the same "theme" key as the original site.
 *  - Applied as <html data-theme="..."> which is what styles.css keys off.
 *  - Stays in sync across browser tabs through the "storage" event.
 */
const ThemeContext = createContext(null);

function getPreferredTheme() {
  return localStorage.getItem('theme') || 'dark';
}

export function ThemeProvider({ children }) {
  const { showToast } = useToast();
  const [theme, setTheme] = useState(getPreferredTheme);

  // Reflect state -> DOM + storage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Another tab changed the theme.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'theme' && event.newValue) setTheme(event.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next} mode`);
  }, [theme, showToast]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
