import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AROUND_ME, CAMPUS_UPDATES, UPCOMING_EVENTS } from '../data/dashboard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

export default function DashboardPage() {
  useDocumentTitle('Bridge — Dashboard');

  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Same behaviour as before: search jumps to the map with the query pre-filled.
  const handleSearch = (event) => {
    event.preventDefault();
    const q = search.trim();
    navigate(q ? `/map?q=${encodeURIComponent(q)}` : '/map');
  };

  return (
    <main>
      <section className="greeting-hero">
        <h1 id="greeting-heading">
          {getGreeting()}, <em id="user-name">{user.firstName}</em> 👋
        </h1>
        <p className="hero-sub">Everything you need around campus, in one place.</p>
      </section>

      <section id="explore-campus" className="dash-section">
        <p className="eyebrow">STUDENT SERVICES</p>
        <h2>Explore Campus</h2>

        <div className="explore-grid">
          <Link to="/carpool" className="explore-card explore-card--large">
            <span className="explore-card__pill">12 rides nearby</span>
            <div className="explore-card__bg" aria-hidden="true">
              <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M-20 210 C 60 170, 100 230, 180 180 S 320 120, 440 150"
                  stroke="var(--teal)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M-20 90 C 80 60, 140 130, 240 80 S 360 20, 440 60"
                  stroke="var(--ink-soft)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.4"
                />
                <circle cx="80" cy="190" r="5" fill="var(--teal)" />
                <circle cx="220" cy="150" r="5" fill="var(--teal)" />
                <circle cx="340" cy="90" r="5" fill="var(--ink-soft)" />
              </svg>
            </div>
            <span className="icon-badge icon-badge--orange">🚗</span>
            <h3>Carpool</h3>
            <p>Find a ride or share your journey with students.</p>
            <span className="btn btn-primary btn-sm">Find a Ride</span>
          </Link>

          <Link to="/map" className="explore-card explore-card--map">
            <span className="icon-badge icon-badge--indigo">🗺️</span>
            <h3>Campus Map</h3>
            <p>Find classrooms, cafes, hostels and services.</p>
            <div className="explore-card__map-thumb" aria-hidden="true">
              <svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="140" fill="var(--alt-bg)" />
                <rect x="0" y="95" width="300" height="10" fill="var(--line)" />
                <rect x="140" y="0" width="10" height="140" fill="var(--line)" />
                <rect x="30" y="25" width="55" height="45" rx="4" fill="var(--icon-peach)" opacity="0.85" />
                <rect x="100" y="15" width="35" height="65" rx="4" fill="var(--teal)" opacity="0.8" />
                <rect x="175" y="30" width="50" height="55" rx="4" fill="var(--icon-cyan)" opacity="0.8" />
                <rect x="240" y="15" width="40" height="70" rx="4" fill="var(--icon-indigo)" opacity="0.75" />
                <circle cx="55" cy="118" r="10" fill="var(--icon-lavender)" opacity="0.6" />
                <circle cx="255" cy="115" r="14" fill="var(--icon-lavender)" opacity="0.5" />
              </svg>
            </div>
            <span className="btn btn-ghost btn-sm">Open Map</span>
          </Link>

          <Link to="/fix" className="explore-card">
            <span className="explore-card__pill">5 nearby</span>
            <span className="icon-badge icon-badge--cyan">🔧</span>
            <h3>Tech Fix</h3>
            <p>Find trusted tech repair and support near campus.</p>
            <span className="btn btn-ghost btn-sm">Find a Technician</span>
          </Link>

          <Link to="/rooms" className="explore-card">
            <span className="explore-card__pill">24 listings</span>
            <span className="icon-badge icon-badge--peach">🛏️</span>
            <h3>PG &amp; Rooms</h3>
            <p>Discover student-friendly rooms and PGs.</p>
            <span className="btn btn-ghost btn-sm">Explore Rooms</span>
          </Link>

          <Link to="/thrift" className="explore-card">
            <span className="explore-card__pill">18 listings</span>
            <span className="icon-badge icon-badge--lavender">🛍️</span>
            <h3>Campus Thrift</h3>
            <p>Buy and sell textbooks, gear, and student favourites.</p>
            <span className="btn btn-ghost btn-sm">Explore Thrift</span>
          </Link>
        </div>
      </section>

      <section className="dash-section alt-bg">
        <div className="around-me-head">
          <h2 style={{ margin: 0 }}>Around Me</h2>
          <Link to="/map">View All on Map →</Link>
        </div>
        <div className="around-me-grid">
          {AROUND_ME.map((item) => (
            <Link key={item.title} to={item.to} className="around-me-card">
              <span className={`icon-badge icon-badge--sm icon-badge--${item.badge}`}>{item.icon}</span>
              <div>
                <h4>{item.title}</h4>
                <p className="meta">{item.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dash-section">
        <div className="dash-columns">
          <div className="panel">
            <div className="panel-head">
              <h2>Upcoming Events</h2>
              <Link to={{ pathname: '/dashboard', hash: '#upcoming-events' }}>View All Events →</Link>
            </div>
            <div id="upcoming-events">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.title} className="event-list-item">
                  <div className={`event-date-badge${event.featured ? ' is-featured' : ''}`}>
                    <span className="day">{event.day}</span>
                    <span className="mon">{event.mon}</span>
                  </div>
                  <div>
                    <h4>{event.title}</h4>
                    <p className="meta">
                      <span>🕐 {event.time}</span>
                      <span>📍 {event.place}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Campus Updates</h2>
              <Link to={{ pathname: '/dashboard', hash: '#campus-updates' }}>View All →</Link>
            </div>
            <div id="campus-updates">
              {CAMPUS_UPDATES.map((update) => (
                <div key={update.text} className="update-list-item">
                  <span className="icon">{update.icon}</span>
                  <span>{update.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
