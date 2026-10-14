import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

/** Header of the public landing page. The CTA reflects the session state. */
export default function LandingHeader() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="site-header">
      <Brand />
      <nav className="site-nav">
        <Link to={{ pathname: '/', hash: '#services' }}>Services</Link>
        <Link to={{ pathname: '/', hash: '#how' }}>How it works</Link>
        <ThemeToggle />
        {isLoggedIn ? (
          <Link to="/dashboard" className="nav-cta" id="nav-auth-cta">
            Dashboard →
          </Link>
        ) : (
          <Link to="/login?tab=signup" className="nav-cta" id="nav-auth-cta">
            Join Free
          </Link>
        )}
      </nav>
    </header>
  );
}
