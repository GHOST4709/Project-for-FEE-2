import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { useIssues } from '../context/IssuesContext';
import { ISSUE_CATEGORIES } from '../data/categories';
import '../styles/pages.css';

const EMPTY_FORM = {
  title: '',
  category: ISSUE_CATEGORIES[0].id,
  location: '',
  description: '',
  reportedBy: '',
};

function ReportIssue() {
  const { addIssue } = useIssues();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newIssue = addIssue({
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      reportedBy: form.reportedBy.trim() || 'Anonymous student',
    });
    setSubmittedIssue(newIssue);
    setForm(EMPTY_FORM);
  };

  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Report an issue</p>
        <h1>Tell us what needs fixing.</h1>
        <p className="section-lede">
          Category, location, a sentence or two — it reaches the right desk and shows up on{' '}
          <Link to="/track-admin">Track &amp; Admin</Link> right away.
        </p>
      </section>

      <div className="report-layout">
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">What&rsquo;s the issue?</label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={updateField('title')}
              placeholder="e.g. Broken tap in Block C washroom"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={updateField('category')}>
                {ISSUE_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                required
                value={form.location}
                onChange={updateField('location')}
                placeholder="e.g. Hostel Block C, 2nd floor"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              required
              value={form.description}
              onChange={updateField('description')}
              placeholder="A sentence or two is enough — what's wrong, and since when?"
            />
          </div>

          <div className="form-field">
            <label htmlFor="reportedBy">Your name &amp; year (optional)</label>
            <input
              id="reportedBy"
              type="text"
              value={form.reportedBy}
              onChange={updateField('reportedBy')}
              placeholder="e.g. Aarav · CSE 3rd year"
            />
          </div>

          <button type="submit" className="btn btn--primary">
            Submit report
          </button>
        </form>

        <aside className="report-status" aria-live="polite">
          {submittedIssue ? (
            <div className="report-status__success">
              <CircleCheck size={22} strokeWidth={2} aria-hidden="true" />
              <h2>Report filed</h2>
              <p>
                <strong>{submittedIssue.title}</strong> was logged as{' '}
                <span className="status-pill status-pill--pending">Pending</span>. You can follow
                its progress any time.
              </p>
              <Link className="btn btn--ghost" to="/track-admin">
                View on Track &amp; Admin &rarr;
              </Link>
            </div>
          ) : (
            <div className="report-status__hint">
              <h2>What happens next</h2>
              <ol>
                <li>Your report is timestamped and tagged by category.</li>
                <li>It routes to the matching desk — hostel warden, IT, mess committee, and so on.</li>
                <li>
                  Status moves Pending &rarr; In Progress &rarr; Resolved on the{' '}
                  <Link to="/track-admin">public tracker</Link>.
                </li>
              </ol>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

export default ReportIssue;
