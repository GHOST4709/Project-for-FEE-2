import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import '../styles/pages.css';

const TICKER_ITEMS = [
  'Physics Wing',
  'Cafeteria 2',
  'Sports Complex',
  'Shuttle Route 7',
  'IT Help Desk',
  'Health Centre',
  'Admin Office',
  'Hostel Block A',
  'Central Library',
];

const STEPS = [
  {
    title: 'Search or filter',
    body: 'Type what you need, or tap a category — carpool, PG, food, stationery, clothing, or tech repair.',
  },
  {
    title: 'Compare on the map',
    body: 'Every result drops a pin. Click a card to pan the map to it, or click a pin to open its card.',
  },
  {
    title: 'Reach out directly',
    body: "Each listing keeps its own contact — a WhatsApp number or phone — no middleman booking flow.",
  },
];

function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <p className="eyebrow">Campus services &amp; grievances, mapped</p>
          <h1 id="hero-heading" className="hero__title">
            Stop asking your group chat where to get <em className="accent">anything</em>.
          </h1>
          <p className="hero__subtitle">
            CampusCare maps every hostel, café, carpool, and repair shop worth knowing about —
            and gives you one honest place to flag what still needs fixing.
          </p>

          <div className="hero__actions">
            <Link className="btn btn--primary" to="/services">
              Browse services
            </Link>
            <Link className="btn btn--ghost" to="/report-issue">
              Report an issue &rarr;
            </Link>
          </div>

          <dl className="hero__stats">
            <div className="hero__stat">
              <dt>{CATEGORIES.length}</dt>
              <dd>Service categories</dd>
            </div>
            <div className="hero__stat">
              <dt>24+</dt>
              <dd>Listings mapped</dd>
            </div>
            <div className="hero__stat">
              <dt>48hr</dt>
              <dd>Avg. issue response</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <ul className="ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <section className="section-block" aria-labelledby="buckets-heading">
        <p className="eyebrow">01 — What can we help with</p>
        <h2 id="buckets-heading" className="section-heading">
          Six things you&rsquo;ll search for by week three.
        </h2>
        <p className="section-lede">
          Pick the corner of campus life that needs attention — each card jumps straight to that
          filter on the map.
        </p>

        <div className="buckets-grid">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <article key={category.id} className="bucket-card">
                <Link to={`/services?category=${category.id}`}>
                  <span className="bucket-card__icon" style={{ '--accent': category.accent }}>
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3>{category.label}</h3>
                  <span className="bucket-card__link">Browse &rarr;</span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="how-it-works" id="how-it-works" aria-labelledby="how-heading">
        <div className="how-it-works__inner">
          <p className="eyebrow">02 — How it works</p>
          <h2 id="how-heading">No forms in triplicate. Just find what&rsquo;s near you.</h2>
          <ol className="how-it-works__steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="how-it-works__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="community-banner" aria-labelledby="community-heading">
        <div className="community-banner__inner">
          <p className="eyebrow">03 — Community</p>
          <h2 id="community-heading">A campus that talks back.</h2>
          <p>
            Study groups, lost-and-found threads, honest reviews of the PG down the road —
            fifteen thousand quiet questions finally have somewhere to go.
          </p>
          <Link className="btn btn--primary" to="/community">
            Visit the community &rarr;
          </Link>
        </div>
      </section>

      <section className="list-cta" aria-labelledby="list-cta-heading">
        <div className="list-cta__inner">
          <h2 id="list-cta-heading">Something broken, missing, or just plain annoying?</h2>
          <p>
            File it in under a minute — category, location, a sentence or two — and track it
            through to resolved.
          </p>
          <Link className="btn btn--primary" to="/report-issue">
            Report an issue
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
