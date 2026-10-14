import { useTheme } from '../../context/ThemeContext';

/** Same ids / classes as the original toggle button; label flips with the theme. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button id="theme-toggle" className="theme-toggle-btn" aria-label="Toggle dark mode" onClick={toggleTheme}>
      <span id="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span id="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
