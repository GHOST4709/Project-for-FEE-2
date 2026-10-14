import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores what the browser did for free on multi-page sites:
 *   - new route            -> scroll to top
 *   - URL has a #hash      -> jump to that element (retrying briefly, because
 *                             lazy-loaded pages may not have rendered it yet)
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    let frame;
    let tries = 0;

    const tryScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      } else if (tries < 40) {
        tries += 1;
        frame = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}
