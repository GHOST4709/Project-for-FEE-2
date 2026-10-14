import { useEffect } from 'react';

/** Sets <title> for the current page (what each original .html file did in <head>). */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
