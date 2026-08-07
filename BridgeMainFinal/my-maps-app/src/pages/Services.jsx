import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import LocationList from '../components/map/LocationList';
import MapContainer from '../components/map/MapContainer';
import { CATEGORIES, getCategory } from '../data/categories';
import rawLocations from '../data/locations.json';
import '../styles/App.css';
import '../styles/pages.css';

function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocationId, setActiveLocationId] = useState(null);

  // The active category is derived from the URL (?category=carpool) so a
  // link from Home's bucket cards lands pre-filtered, and the filter state
  // stays shareable/bookmarkable.
  const activeCategory = searchParams.get('category') ?? 'all';
  const setActiveCategory = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const locations = useMemo(
    () =>
      rawLocations.map((location) => {
        const category = getCategory(location.category);
        return {
          ...location,
          categoryLabel: category?.label ?? location.category,
          categoryIcon: category?.icon,
          accent: category?.accent,
        };
      }),
    []
  );

  const filteredLocations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesCategory = activeCategory === 'all' || location.category === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        location.name.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [locations, activeCategory, searchTerm]);

  const categoryCounts = useMemo(() => {
    const counts = { all: locations.length };
    CATEGORIES.forEach((category) => {
      counts[category.id] = locations.filter((location) => location.category === category.id).length;
    });
    return counts;
  }, [locations]);

  useEffect(() => {
    if (activeLocationId && !filteredLocations.some((location) => location.id === activeLocationId)) {
      setActiveLocationId(null);
    }
  }, [filteredLocations, activeLocationId]);

  return (
    <main className="app-shell">
      <section className="page-intro">
        <p className="eyebrow">Services directory</p>
        <h1>Every service near campus, on one map.</h1>
      </section>

      <nav className="category-nav" aria-label="Filter listings by category">
        <button
          type="button"
          className={`category-nav__chip ${activeCategory === 'all' ? 'is-active' : ''}`}
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          All
          <span className="count">{categoryCounts.all}</span>
        </button>

        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              className={`category-nav__chip ${isActive ? 'is-active' : ''}`}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category.id)}
            >
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              {category.label}
              <span className="count">{categoryCounts[category.id] ?? 0}</span>
            </button>
          );
        })}
      </nav>

      <div className="app-grid">
        <aside className="sidebar" aria-label="Search and results">
          <SearchBar value={searchTerm} onChange={setSearchTerm} resultCount={filteredLocations.length} />
          <LocationList
            locations={filteredLocations}
            activeId={activeLocationId}
            onSelect={setActiveLocationId}
          />
        </aside>

        <MapContainer
          locations={filteredLocations}
          activeLocationId={activeLocationId}
          onSelectLocation={setActiveLocationId}
        />
      </div>
    </main>
  );
}

export default Services;
