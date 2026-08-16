import { useEffect, useState } from 'react';

const SCRIPT_ID = 'google-maps-sdk';

/**
 * Loads the Google Maps JavaScript SDK on demand and reports its status.
 * The script tag is only ever injected once per page, even if several
 * components call this hook (StrictMode double-renders included).
 *
 * @param {string | undefined} apiKey - VITE_GOOGLE_MAPS_API_KEY
 * @returns {{ isLoaded: boolean, loadError: 'missing-key' | 'load-failed' | null }}
 */
export function useGoogleMaps(apiKey) {
  const [isLoaded, setIsLoaded] = useState(Boolean(window.google?.maps));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return undefined;
    }

    if (!apiKey) {
      setLoadError('missing-key');
      return undefined;
    }

    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      existingScript.addEventListener('error', () => setLoadError('load-failed'));
      return undefined;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError('load-failed');
    document.head.appendChild(script);

    return undefined;
  }, [apiKey]);

  return { isLoaded, loadError };
}
