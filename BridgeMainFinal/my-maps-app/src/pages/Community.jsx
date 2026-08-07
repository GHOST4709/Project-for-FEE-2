import { MessageCircle } from 'lucide-react';
import communityPosts from '../data/communityPosts.json';
import '../styles/pages.css';

const formatRelative = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

function Community() {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Community</p>
        <h1>Ask a senior, share notes, find a chess partner.</h1>
        <p className="section-lede">
          Threaded discussions tagged by topic — no more digging through a 400-member WhatsApp
          group for one PDF.
        </p>
      </section>

      <section className="feed" aria-label="Community threads">
        {communityPosts.map((thread) => (
          <article key={thread.id} className="feed-card thread-card">
            <header className="feed-card__header">
              <span className="feed-card__tag">{thread.tag}</span>
              <time dateTime={thread.lastActivity}>{formatRelative(thread.lastActivity)}</time>
            </header>
            <h2>{thread.title}</h2>
            <p>{thread.excerpt}</p>
            <footer className="feed-card__footer thread-card__footer">
              <span>{thread.author}</span>
              <span className="thread-card__replies">
                <MessageCircle size={14} strokeWidth={2} aria-hidden="true" />
                {thread.replies} replies
              </span>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Community;
