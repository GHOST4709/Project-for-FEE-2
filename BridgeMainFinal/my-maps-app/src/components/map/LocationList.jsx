import LocationCard from './LocationCard';

function LocationList({ locations, activeId, onSelect }) {
  if (locations.length === 0) {
    return (
      <section className="location-list location-list--empty" aria-live="polite">
        <p>No listings match that search yet.</p>
        <p className="hint">Try a different category, or clear the search box.</p>
      </section>
    );
  }

  return (
    <section className="location-list" aria-label="Nearby services" aria-live="polite">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          isActive={location.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

export default LocationList;
