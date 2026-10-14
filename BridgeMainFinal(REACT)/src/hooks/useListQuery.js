import { useCallback, useMemo, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

const pick = (source, keys) => keys.reduce((acc, key) => ({ ...acc, [key]: source[key] }), {});

/**
 * Search / filter / sort / pagination state for a list page.
 *
 *   query   what the inputs show right now (updates on every keystroke)
 *   params  what we actually send to the API: identical to `query`, except the
 *           free-text fields (`debounceKeys`) lag behind by `delay` ms, so we
 *           don't fire a request per keystroke (debouncing).
 *
 * `params` keeps the same object identity until its content really changes,
 * which makes it safe to use as an effect dependency.
 *
 * setFilter(patch) -> changes filters/sort/search and resets to page 1
 * setPage(n)       -> only moves the page
 * reset()          -> back to the initial query
 */
export function useListQuery(initialQuery, { debounceKeys = [], delay = 300 } = {}) {
  const initialRef = useRef(initialQuery);
  const [query, setQuery] = useState(initialQuery);

  // Debounce the free-text part only. Dropdowns/pills/pages apply immediately.
  const settledText = useDebounce(JSON.stringify(pick(query, debounceKeys)), delay);

  const setFilter = useCallback((patch) => setQuery((q) => ({ ...q, ...patch, page: 1 })), []);
  const setPage = useCallback((page) => setQuery((q) => ({ ...q, page })), []);
  const reset = useCallback(() => setQuery(initialRef.current), []);

  const merged = { ...query, ...JSON.parse(settledText) };
  const key = JSON.stringify(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => merged, [key]);

  return { query, params, setFilter, setPage, reset };
}
