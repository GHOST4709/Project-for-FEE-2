import { startTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

/**
 * Header for every signed-in page. Which nav link is highlighted depends on the
 * route (the original hard-coded `class="active"` in each HTML file):
 *   /dashboard             -> Dashboard
 *   /map                   -> Map
 *   /carpool, /rooms, ...  -> Explore + Services
 */
function getActiveSection(pathname) {
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/map') return 'map';
  return 'explore';
}

export default function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const active = getActiveSection(pathname);

  const exploreTo = { pathname: '/dashboard', hash: '#explore-campus' };
  const activeClass = (section) => (active === section ? 'active' : undefined);

  const handleLogout = () => {
    // React Router applies navigation inside a transition. Clear the session in the
    // same transition, otherwise the route guard sees "logged out" one render before
    // the URL changes and bounces the user to /login instead of the landing page.
    startTransition(() => {
      logout();
      navigate('/');
    });
  };

  const handleBell = () => {
    if (pathname === '/dashboard') {
      document.getElementById('campus-updates')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('You are all caught up — see Campus Updates below');
    } else {
      navigate({ pathname: '/dashboard', hash: '#campus-updates' });
    }
  };

  return (
    <header className="site-header dashboard-header">
      <Brand />
      <nav className="app-nav" aria-label="Primary">
        <Link to="/dashboard" className={activeClass('dashboard')}>
          Dashboard
        </Link>
        <Link to={exploreTo} className={activeClass('explore')}>
          Explore
        </Link>
        <Link to="/map" className={activeClass('map')}>
          Map
        </Link>
        <Link to={exploreTo} className={activeClass('explore')}>
          Services
        </Link>
      </nav>
      <div className="user-menu">
        <ThemeToggle />
        <button id="bell-btn" className="icon-btn" aria-label="Notifications" title="Notifications" onClick={handleBell}>
          🔔
        </button>
        <div className="user-badge" id="user-badge" title={user.name}>
          {user.initials}
        </div>
        <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
