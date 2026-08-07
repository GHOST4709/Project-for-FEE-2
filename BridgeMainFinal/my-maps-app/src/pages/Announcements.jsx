import announcements from '../data/announcements.json';
import '../styles/pages.css';

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function Announcements() {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Announcements</p>
        <h1>Fest schedules, exam updates, hostel notices.</h1>
        <p className="section-lede">
          All in a scrollable feed instead of a noticeboard that's three layers deep in tape.
        </p>
      </section>

      <section className="feed" aria-label="Announcement feed">
        {announcements.map((item) => (
          <article key={item.id} className="feed-card">
            <header className="feed-card__header">
              <span className="feed-card__tag">{item.category}</span>
              <time dateTime={item.postedAt}>{formatDate(item.postedAt)}</time>
            </header>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <footer className="feed-card__footer">Posted by {item.postedBy}</footer>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Announcements;
