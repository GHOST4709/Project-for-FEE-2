import { EmptyCard, ErrorCard, LoadingCard } from './StateCards';

/**
 * Decides what a list should show based on the Redux resource status:
 *
 *   failed                          -> error card with a "Try again" button
 *   idle/loading and nothing cached -> loading card
 *   succeeded and no items          -> the page's own empty state
 *   otherwise                       -> children (the list itself)
 *
 * While re-fetching with items already on screen (e.g. typing in search) the
 * list stays visible; the page dims it with `.is-refreshing`.
 */
export default function ResourceState({ status, error, count, onRetry, loadingMessage, empty, children }) {
  if (status === 'failed') return <ErrorCard message={error} onRetry={onRetry} />;
  if ((status === 'idle' || status === 'loading') && count === 0) return <LoadingCard message={loadingMessage} />;
  if (count === 0) return empty ?? <EmptyCard icon="📭" title="Nothing here yet" message="No results." />;
  return children;
}

export const isRefreshing = (status, count) => (status === 'idle' || status === 'loading') && count > 0;
