/**
 * Compact filter dropdown (the bare <select> inside `.filter-dropdowns`).
 * Built on the native <select> so keyboard, screen-reader and mobile pickers
 * all work for free.
 */
export default function Dropdown({ id, value, onChange, options, ariaLabel }) {
  return (
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
