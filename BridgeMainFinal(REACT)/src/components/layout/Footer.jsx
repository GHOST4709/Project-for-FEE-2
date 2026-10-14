import { Link } from 'react-router-dom';

/**
 * One footer, three flavours (the original copy differs slightly per page):
 *   variant="landing"  © 2026 Bridge. Made for campus life.        | View Student Dashboard →
 *   variant="auth"     © 2026 Bridge. Made for campus life.        | ← Back to Main Site
 *   variant="app"      © 2026 Bridge Network. Connected Campus…    | ← Back to Dashboard / Main Site
 */
export default function Footer({ variant = 'app', backToMainSite = false }) {
  if (variant === 'landing') {
    return (
      <footer className="site-footer">
        <p>© 2026 Bridge. Made for campus life.</p>
        <p>
          <Link to="/dashboard">View Student Dashboard →</Link>
        </p>
      </footer>
    );
  }

  if (variant === 'auth') {
    return (
      <footer className="site-footer">
        <p>© 2026 Bridge. Made for campus life.</p>
        <p>
          <Link to="/">← Back to Main Site</Link>
        </p>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <p>© 2026 Bridge Network. Connected Campus Experience.</p>
      <p>
        {backToMainSite ? <Link to="/">← Back to Main Site</Link> : <Link to="/dashboard">← Back to Dashboard</Link>}
      </p>
    </footer>
  );
}
