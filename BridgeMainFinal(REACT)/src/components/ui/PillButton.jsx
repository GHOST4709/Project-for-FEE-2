/** Filter pill (`.pill-btn`), highlighted when `active`. */
export default function PillButton({ active, onClick, children }) {
  return (
    <button type="button" className={`pill-btn${active ? ' active' : ''}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}
