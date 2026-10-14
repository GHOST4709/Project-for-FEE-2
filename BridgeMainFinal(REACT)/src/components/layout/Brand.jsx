import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">⚡</span>
      <span className="brand-word">
        BRIDGE<em>.</em>
      </span>
    </Link>
  );
}
