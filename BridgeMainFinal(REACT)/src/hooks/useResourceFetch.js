import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Dispatches a "fetch list" thunk whenever `params` (or `reloadKey`) changes.
 *
 * The cleanup cancels the in-flight request, so a slow response for an *old*
 * query can never overwrite the results of a newer one (classic race condition
 * when typing in a search box).
 */
export function useResourceFetch(fetchThunk, params, reloadKey = 0) {
  const dispatch = useDispatch();

  useEffect(() => {
    const request = dispatch(fetchThunk(params));
    return () => request.abort();
  }, [dispatch, fetchThunk, params, reloadKey]);
}
