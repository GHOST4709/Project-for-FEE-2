import { Link } from 'react-router-dom';
import '../styles/pages.css';

function NotFound() {
  return (
    <main className="page-shell not-found">
      <p className="eyebrow">404</p>
      <h1>That page wandered off campus.</h1>
      <p className="section-lede">Maybe it's out getting Maggi. Try one of these instead:</p>
      <div className="hero__actions">
        <Link className="btn btn--primary" to="/">
          Back home
        </Link>
        <Link className="btn btn--ghost" to="/services">
          Browse services
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
