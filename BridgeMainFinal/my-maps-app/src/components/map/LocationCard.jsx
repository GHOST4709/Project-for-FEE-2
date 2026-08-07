/**
 * A single service listing. Purely presentational — every value it shows
 * comes from props, and the only behaviour is reporting a click upward.
 *
 * The whole card is the interactive target, but since a <button> may not
 * legally contain heading content, it's made keyboard-accessible directly
 * (role="button" + tabIndex + Enter/Space handling) rather than nesting an
 * <h3> inside a real <button>.
 */
function LocationCard({ location, isActive, onSelect }) {
  const { id, name, categoryLabel, categoryIcon: Icon, accent, description, address, walkMinutes, openNow } = location;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <article
      className={`location-card ${isActive ? 'is-active' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
    >
      <header className="location-card__header">
        <span className="location-card__icon" style={{ '--accent': accent }}>
          {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" />}
        </span>
        <div>
          <h3>{name}</h3>
          <p className="location-card__category">{categoryLabel}</p>
        </div>
        <span className={`location-card__status ${openNow ? 'is-open' : 'is-closed'}`}>
          {openNow ? 'Open now' : 'Closed'}
        </span>
      </header>

      <p className="location-card__desc">{description}</p>

      <footer className="location-card__footer">
        <span>{address}</span>
        <span className="location-card__walk">{walkMinutes} min walk</span>
      </footer>
    </article>
  );
}

export default LocationCard;
