/**
 * The three non-happy-path states every list needs. They reuse the original
 * dashed `.no-rides-card`, so loading / error / empty all feel native.
 */
export function LoadingCard({ message = 'Loading…' }) {
  return (
    <div className="no-rides-card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function ErrorCard({ message, onRetry }) {
  return (
    <div className="no-rides-card" role="alert">
      <span className="no-rides-icon">⚠️</span>
      <h3>Couldn&apos;t load this</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyCard({ icon, title, message, actionLabel, onAction, style }) {
  return (
    <div className="no-rides-card" style={style}>
      <span className="no-rides-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
