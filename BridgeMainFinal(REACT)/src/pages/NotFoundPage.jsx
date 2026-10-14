import { Link, Navigate, useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// The old multi-page site used URLs like /html/carpool.html. Keep those bookmarks alive.
const LEGACY_PAGES = {
  index: '/',
  login: '/login',
  dashboard: '/dashboard',
  carpool: '/carpool',
  rooms: '/rooms',
  thrift: '/thrift',
  fix: '/fix',
  map: '/map',
};

export default function NotFoundPage() {
  useDocumentTitle('Bridge — Page not found');
  const { pathname, search, hash } = useLocation();

  const legacy = pathname.match(/\/([\w-]+)\.html$/);
  if (legacy && LEGACY_PAGES[legacy[1]]) {
    return <Navigate to={{ pathname: LEGACY_PAGES[legacy[1]], search, hash }} replace />;
  }

  return (
    <main className="auth-shell">
      <div className="ticket auth-card" style={{ textAlign: 'center' }}>
        <div className="ticket-top">
          <p className="section-eyebrow">ERROR 404</p>
          <h2>Wrong stop</h2>
          <p className="ticket-sub">We couldn&apos;t find the page you were looking for.</p>
        </div>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Back to Main Site
          </Link>
        </div>
      </div>
    </main>
  );
}
