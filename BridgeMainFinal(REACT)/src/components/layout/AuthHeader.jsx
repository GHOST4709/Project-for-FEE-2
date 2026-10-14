import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

/** Minimal header used on the login page (brand + theme toggle). */
export default function AuthHeader() {
  return (
    <header className="site-header">
      <Brand />
      <div className="user-menu">
        <ThemeToggle />
      </div>
    </header>
  );
}
