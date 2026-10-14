import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Accessible modal dialog.
 *  - Rendered in a portal on <body> so it can't be clipped by parent styles.
 *  - Closes on Escape and on backdrop click.
 *  - Locks page scroll while open and moves focus into the dialog.
 */
export default function Modal({ open, onClose, title, children, labelledBy = 'modal-title' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="modal-card" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
        <h3 id={labelledBy}>{title}</h3>
        {children}
      </div>
    </div>,
    document.body,
  );
}
