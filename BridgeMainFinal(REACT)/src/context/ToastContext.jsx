import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Toast notifications. Any component can call `showToast('message')`.
 * One <div id="toast"> is rendered at the app root (same element + classes
 * as the original site), so it looks and animates exactly the same.
 */
const ToastContext = createContext(null);
const TOAST_DURATION_MS = 2200;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: 'Theme updated!', visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div id="toast" className={`toast${toast.visible ? ' show' : ''}`} role="status" aria-live="polite">
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
