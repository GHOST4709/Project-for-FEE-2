import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="brand">CampusCare</p>
          <p className="site-footer__blurb">
            Bridge is a student project mapping every carpool, PG, café, stationery shop,
            tailor, and repair stall worth knowing about near campus — plus a place to report
            what still needs fixing.
          </p>
        </div>

        <nav aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/services">Services directory</Link>
            </li>
            <li>
              <Link to="/announcements">Announcements</Link>
            </li>
            <li>
              <Link to="/community">Community</Link>
            </li>
            <li>
              <Link to="/track-admin">Track &amp; Admin</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="About">
          <h4>Reach us</h4>
          <ul>
            <li>
              <Link to="/report-issue">Report an issue</Link>
            </li>
            <li>
              <a href="mailto:hello@campuscare.app">hello@campuscare.app</a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="site-footer__bottom">
        © 2026 CampusCare — a student project for campus services &amp; grievance management.
      </p>
    </footer>
  );
}

export default Footer;
