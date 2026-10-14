import { useEffect, useRef } from 'react';

/**
 * Infinite scroll with IntersectionObserver.
 * Attach the returned ref to an (invisible) sentinel element placed after the list;
 * when it scrolls into view, `onLoadMore` is called.
 */
export function useInfiniteScroll(onLoadMore, { enabled = true, rootMargin = '200px' } = {}) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
