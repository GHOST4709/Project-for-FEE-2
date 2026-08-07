import { useMemo } from 'react';
import { useIssues } from '../context/IssuesContext';
import { getIssueCategory, ISSUE_STATUSES } from '../data/categories';
import '../styles/pages.css';

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

function TrackAdmin() {
  const { issues } = useIssues();

  const counts = useMemo(() => {
    const base = { pending: 0, 'in-progress': 0, resolved: 0 };
    issues.forEach((issue) => {
      base[issue.status] = (base[issue.status] ?? 0) + 1;
    });
    return base;
  }, [issues]);

  const sortedIssues = useMemo(
    () => [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [issues]
  );

  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Track &amp; Admin</p>
        <h1>The live ledger.</h1>
        <p className="section-lede">Every issue moves through Pending → In Progress → Resolved, in public.</p>
      </section>

      <dl className="ledger-stats">
        <div className="ledger-stats__item">
          <dt>{issues.length}</dt>
          <dd>Logged this semester</dd>
        </div>
        <div className="ledger-stats__item">
          <dt>{counts.pending}</dt>
          <dd>Pending</dd>
        </div>
        <div className="ledger-stats__item">
          <dt>{counts['in-progress']}</dt>
          <dd>In progress</dd>
        </div>
        <div className="ledger-stats__item">
          <dt>{counts.resolved}</dt>
          <dd>Resolved</dd>
        </div>
      </dl>

      <section className="tracker-table-wrap" aria-label="Issue tracker">
        <table className="tracker-table">
          <thead>
            <tr>
              <th scope="col">Issue</th>
              <th scope="col">Category</th>
              <th scope="col">Location</th>
              <th scope="col">Reported by</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map((issue) => {
              const category = getIssueCategory(issue.category);
              const status = ISSUE_STATUSES.find((s) => s.id === issue.status);
              return (
                <tr key={issue.id}>
                  <td>
                    <span className="tracker-table__title">{issue.title}</span>
                    <span className="tracker-table__date">{formatDate(issue.createdAt)}</span>
                  </td>
                  <td>{category?.label ?? issue.category}</td>
                  <td>{issue.location}</td>
                  <td>{issue.reportedBy}</td>
                  <td>
                    <span className={`status-pill status-pill--${issue.status}`}>{status?.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default TrackAdmin;
