import { Search } from 'lucide-react';

/**
 * A fully controlled input: App owns the value, this component only
 * renders it and forwards change events upward.
 */
function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search-bar">
      <Search size={16} aria-hidden="true" />
      <label className="visually-hidden" htmlFor="service-search">
        Search services
      </label>
      <input
        id="service-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search hostels, food, repairs…"
      />
      <span className="search-bar__count">{resultCount}</span>
    </div>
  );
}

export default SearchBar;
