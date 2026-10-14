import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SERVICES = [
  { code: '01 / RIDES', title: 'Carpool', text: 'Find or offer rides across campus and into the city.' },
  { code: '02 / HOUSING', title: 'Rooms & PG', text: 'University housing hub with verified listings.' },
  { code: '03 / FOOD', title: 'Campus Bites', text: 'Food deals, canteen menus, and late-night finds.' },
  { code: '04 / REPAIRS', title: 'Tech Fix', text: 'Laptop and phone repairs, right on campus.' },
];

const STEPS = [
  { title: 'Verify with college email', text: 'One tap sign-up. Only real students from your campus get access.' },
  { title: 'Pick what you need', text: 'Rides, rooms, food, prints, or study groups — all from one dashboard.' },
  { title: 'Connect and get it done', text: 'Chat, confirm, and track in-app safely with peer ratings.' },
];

export default function LandingPage() {
  useDocumentTitle('Bridge — Your Campus, Connected');

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-content">
          <p className="section-eyebrow">BUILT BY STUDENTS, FOR STUDENTS</p>
          <h1>
            Your campus, <em>connected</em>
          </h1>
          <p className="hero-sub">
            Study groups, carpools, campus events, and announcements — everything student life runs on, in a single
            app.
          </p>
          <div className="hero-actions">
            <Link to="/login?tab=signup" className="btn btn-primary">
              Get Started Free
            </Link>
          </div>
        </div>
        <div className="hero-map">
          <svg className="line-svg" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              id="line-path"
              d="M 30 250 C 120 250, 150 80, 250 150 C 350 220, 380 50, 470 50"
              stroke="var(--teal)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <g className="stop">
              <circle className="stop-dot start" cx="30" cy="250" r="9" />
            </g>
            <g className="stop">
              <circle className="stop-dot" cx="165" cy="155" r="8" />
            </g>
            <g className="stop">
              <circle className="stop-dot" cx="250" cy="150" r="8" />
            </g>
            <g className="stop">
              <circle className="stop-dot" cx="365" cy="120" r="8" />
            </g>
            <g className="stop">
              <circle className="stop-dot end" cx="470" cy="50" r="9" />
            </g>
          </svg>
        </div>
      </section>

      <section id="services" className="stations">
        <p className="eyebrow">EVERYTHING IN ONE PLACE</p>
        <h2>Campus services, unbundled</h2>
        <div className="stop-list">
          {SERVICES.map((service) => (
            <article key={service.code} className="stop-card in-view">
              <span className="stop-code">{service.code}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="how">
        <p className="eyebrow">GET GOING IN THREE STEPS</p>
        <h2>Simple, fast, and verified</h2>
        <ol className="how-steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="how-num">{index + 1}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="join" className="join">
        <div className="ticket">
          <div className="ticket-top">
            <h2>Bridge Access Pass</h2>
            <p className="ticket-sub">Claim your free student account</p>
          </div>
          <p className="hero-sub" style={{ marginBottom: '24px' }}>
            One verified account gets you into carpools, rooms, campus thrift, tech fix, and the live campus map — all
            from a single dashboard.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginBottom: 0 }}>
            <Link to="/login?tab=signup" className="btn btn-primary btn-full">
              Get Instant Access
            </Link>
          </div>
          <p className="form-note">
            Already have a pass?{' '}
            <Link to="/login" className="auth-header-link">
              Log in
            </Link>{' '}
            · Free forever for verified students
          </p>
        </div>
      </section>
    </main>
  );
}
