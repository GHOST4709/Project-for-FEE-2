/**
 * Search box with the 🔍 icon. `className` selects the page-specific wrapper
 * style (rooms-search-bar, map-search-bar, fix-search-bar, ...). Children render
 * after the input (e.g. the "Search" button on the Tech Fix page).
 */
export default function SearchBar({ className, id, value, onChange, placeholder, children }) {
  return (
    <div className={className}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {children}
    </div>
  );
}
