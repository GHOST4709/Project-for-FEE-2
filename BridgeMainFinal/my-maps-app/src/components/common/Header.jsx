import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/report-issue', label: 'Report Issue' },
  { to: '/services', label: 'Services' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/community', label: 'Community' },
  { to: '/track-admin', label: 'Track & Admin' },
];

/**
 * Site header: brand mark, primary nav (each item a real route), a
 * theme toggle, and the report CTA — stateless, driven entirely by the
 * current route via NavLink's built-in active matching.
 */
function Header() {
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link className="brand" to="/">
          <BrandMark />
          <span>
            CampusCare
            <span className="brand__subtitle">Bridge Student Services</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <Link className="btn btn--primary" to="/report-issue">
            Report an Issue
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Small inline brand mark: a graduation-cap roundel matching the reference design. */
function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill="#1E3B2F" />
      <path d="M14 8l8 3.6-8 3.6-8-3.6L14 8z" fill="#F6F2EA" />
      <path d="M9 13.8v3.4c0 1.3 2.2 2.4 5 2.4s5-1.1 5-2.4v-3.4" stroke="#F6F2EA" strokeWidth="1.3" fill="none" />
      <path d="M21 12v4.2" stroke="#B75B37" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default Header;
