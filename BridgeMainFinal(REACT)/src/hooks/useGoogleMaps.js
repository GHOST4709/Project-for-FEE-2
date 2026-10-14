import { useEffect, useState } from 'react';

/**
 * Loads the Google Maps JavaScript API once (third-party API integration).
 *
 *  status:
 *    'loading'   script is being fetched
 *    'ready'     window.google.maps is available
 *    'fallback'  no key, script failed to load, or Google rejected the key
 *                -> the page shows the to-scale static preview instead
 *
 * It is module-level (not per component) so React StrictMode's double-mount and
 * navigating away and back never inject the script twice.
 */
let loaderPromise = null;
let authFailed = false;
const authListeners = new Set();

function loadGoogleMaps(apiKey) {
  if (window.google?.maps?.Map) return Promise.resolve(window.google);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    // Google calls this when the key is invalid / restricted / billing is off.
    window.gm_authFailure = () => {
      authFailed = true;
      authListeners.forEach((listener) => listener());
    };

    // Google's loader calls this itself once the SDK has attached to `window.google`,
    // which avoids the "google.maps.Map is not a constructor" race.
    window.initBridgeMap = () => resolve(window.google);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initBridgeMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loaderPromise = null; // allow a retry on next mount
      script.remove();
      reject(new Error('Google Maps failed to load'));
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function useGoogleMaps(apiKey) {
  const [status, setStatus] = useState(() => (apiKey ? (authFailed ? 'fallback' : 'loading') : 'fallback'));

  useEffect(() => {
    if (!apiKey) {
      setStatus('fallback');
      return undefined;
    }

    let cancelled = false;
    const onAuthFailure = () => !cancelled && setStatus('fallback');
    authListeners.add(onAuthFailure);

    loadGoogleMaps(apiKey)
      .then(() => {
        if (!cancelled) setStatus(authFailed ? 'fallback' : 'ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback');
      });

    return () => {
      cancelled = true;
      authListeners.delete(onAuthFailure);
    };
  }, [apiKey]);

  return status;
}
