import axios from 'axios';

/**
 * One shared axios instance for the whole app.
 *
 *  - baseURL / timeout come from env, so swapping the mock for a real backend
 *    is a config change, not a code change.
 *  - A response interceptor retries *idempotent* (GET) requests that failed
 *    because of a network problem or a 5xx, with exponential back-off.
 *  - getErrorMessage() turns any axios error into a friendly string for the UI.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 300;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error) {
  if (axios.isCancel(error)) return false; // user/aborted -> never retry
  const method = (error.config?.method || 'get').toLowerCase();
  if (method !== 'get') return false; // never blindly repeat POST/PUT/DELETE
  if (!error.response) return true; // network error or timeout
  return error.response.status >= 500; // server hiccup
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config || !isRetryable(error)) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= MAX_RETRIES) return Promise.reject(error);

    config.__retryCount += 1;
    await wait(BASE_DELAY_MS * 2 ** (config.__retryCount - 1)); // 300ms, 600ms

    // The component may have unmounted / changed its query while we waited.
    if (config.signal?.aborted) return Promise.reject(error);
    return http(config);
  },
);

export function getErrorMessage(error) {
  if (axios.isCancel(error)) return 'Request cancelled.';
  if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error.response) return 'Network error. Check your connection and try again.';
  return error.response.data?.message || 'Something went wrong. Please try again.';
}
