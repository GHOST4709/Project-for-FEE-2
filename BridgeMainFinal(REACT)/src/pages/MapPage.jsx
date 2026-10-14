import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import PillButton from '../components/ui/PillButton';
import SearchBar from '../components/ui/SearchBar';
import { EmptyCard } from '../components/ui/StateCards';
import { useTheme } from '../context/ThemeContext';
import {
  CAMPUS_CENTER,
  CATEGORY_META,
  MAP_STYLE_DARK,
  MAP_STYLE_LIGHT,
  campusLocations,
} from '../data/campus';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CATEGORY_PILLS = [
  { value: 'carpool', label: 'Carpool' },
  { value: 'rooms', label: 'Rooms & PG' },
  { value: 'thrift', label: 'Thrift Exchange' },
  { value: 'fix', label: 'Tech Fix' },
];

const LEGEND = [
  { color: 'var(--teal)', label: 'Carpool' },
  { color: 'var(--amber)', label: 'Rooms & PG' },
  { color: 'var(--rose)', label: 'Thrift Exchange' },
  { color: 'var(--violet)', label: 'Tech Fix' },
];

// Bounds used to place the to-scale fallback pins (computed once, the data is static).
const lats = campusLocations.map((l) => l.lat);
const lngs = campusLocations.map((l) => l.lng);
const BOUNDS = {
  minLat: Math.min(...lats),
  minLng: Math.min(...lngs),
  latSpan: Math.max(...lats) - Math.min(...lats) || 1,
  lngSpan: Math.max(...lngs) - Math.min(...lngs) || 1,
};

/**
 * Deep links: the dashboard cards and each service page's "View Details" button
 * link here with ?category=carpool, ?q=text and/or ?location=f1 (a pin id).
 * A specific location implies its own category, which takes priority.
 */
function readDeepLink(searchParams) {
  const category = searchParams.get('category');
  const locationId = searchParams.get('location');
  const target = locationId ? campusLocations.find((l) => l.id === locationId) : null;
  const resolved = target ? target.category : category;

  return {
    category: resolved && CATEGORY_META[resolved] ? resolved : 'all',
    q: searchParams.get('q') || '',
    locationId: target ? target.id : null,
  };
}

function infoWindowHtml(loc) {
  // Fixed, theme-independent colours on purpose: Google renders this inside its
  // own white InfoWindow chrome, so inheriting the site's theme colours would
  // make the text invisible in dark mode.
  return `
    <div style="font-family: 'Space Grotesk', -apple-system, sans-serif; min-width: 160px; padding: 2px 0;">
      <strong style="display: block; font-size: 13px; color: #0f172a; margin-bottom: 3px;">${loc.name}</strong>
      <span style="font-size: 12px; color: #64748b;">${loc.address}</span>
    </div>
  `;
}

function MapView() {
  useDocumentTitle('Bridge — Campus Map');

  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const status = useGoogleMaps(MAPS_API_KEY);

  // Initial UI state comes from the URL (read once).
  const [initial] = useState(() => readDeepLink(searchParams));
  const [activeCategory, setActiveCategory] = useState(initial.category);
  const [search, setSearch] = useState(initial.q);
  const [activeId, setActiveId] = useState(initial.locationId);
  const [mapReady, setMapReady] = useState(false);

  // Imperative Google objects live in refs (they aren't React state).
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef(new Map());
  const pendingLocationRef = useRef(initial.locationId);

  const visibleLocations = useMemo(() => {
    const query = search.toLowerCase().trim();
    return campusLocations.filter((loc) => {
      const matchesCat = activeCategory === 'all' || loc.category === activeCategory;
      const matchesQuery = !query || loc.name.toLowerCase().includes(query) || loc.description.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, search]);

  const selectLocation = useCallback((id) => {
    setActiveId(id);
    const loc = campusLocations.find((l) => l.id === id);
    const marker = markersRef.current.get(id);
    const map = mapRef.current;
    if (map && marker && loc) {
      map.panTo(marker.getPosition());
      map.setZoom(16);
      infoWindowRef.current.setContent(infoWindowHtml(loc));
      infoWindowRef.current.open(map, marker);
    }
  }, []);

  const selectCategory = (category) => {
    setActiveCategory(category);
    setActiveId(null);
  };

  // 1) Create the map + markers once the SDK is ready.
  useEffect(() => {
    if (status !== 'ready' || !mapNodeRef.current) return undefined;
    const { google } = window;
    const markers = markersRef.current;

    const map = new google.maps.Map(mapNodeRef.current, {
      center: CAMPUS_CENTER,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: document.documentElement.getAttribute('data-theme') === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT,
    });
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    campusLocations.forEach((loc) => {
      const meta = CATEGORY_META[loc.category];
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        title: loc.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: meta.hex,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      marker.addListener('click', () => selectLocation(loc.id));
      markers.set(loc.id, marker);
    });

    setMapReady(true);

    // A ?location= deep link needs the real marker to exist before we can pan to it.
    if (pendingLocationRef.current) {
      selectLocation(pendingLocationRef.current);
      pendingLocationRef.current = null;
    }

    return () => {
      markers.forEach((marker) => {
        window.google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
      markers.clear();
      mapRef.current = null;
      infoWindowRef.current = null;
      setMapReady(false);
    };
  }, [status, selectLocation]);

  // 2) Re-skin the live map when the theme toggles.
  useEffect(() => {
    mapRef.current?.setOptions({ styles: theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT });
  }, [theme, mapReady]);

  // 3) Show only the pins that match the current filters.
  useEffect(() => {
    if (!mapReady) return;
    const visibleIds = new Set(visibleLocations.map((l) => l.id));
    markersRef.current.forEach((marker, id) => marker.setMap(visibleIds.has(id) ? mapRef.current : null));
  }, [mapReady, visibleLocations]);

  // 4) Arriving via ?location=: bring that (already highlighted) card into view.
  useEffect(() => {
    if (initial.locationId) {
      document.querySelector('.map-list-card.is-active')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [initial.locationId]);

  const isFallback = status === 'fallback';

  return (
    <main className="map-shell">
      <section className="map-head">
        <p className="section-eyebrow">00 / LIVE MAP</p>
        <h1>Every service, on one map.</h1>
        <p className="hero-sub">Carpool pickups, PGs, thrift exchange points, and repair shops — pinned and searchable.</p>
      </section>

      <div className="map-toolbar">
        <SearchBar
          className="map-search-bar"
          id="map-search"
          placeholder="Search by name or description..."
          value={search}
          onChange={setSearch}
        />
        <div className="pill-filters" id="map-category-pills">
          <PillButton active={activeCategory === 'all'} onClick={() => selectCategory('all')}>
            All (<span id="count-all">{campusLocations.length}</span>)
          </PillButton>
          {CATEGORY_PILLS.map((pill) => (
            <PillButton key={pill.value} active={activeCategory === pill.value} onClick={() => selectCategory(pill.value)}>
              {pill.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div className="map-legend">
        {LEGEND.map((item) => (
          <span key={item.label} className="map-legend-item">
            <span className="map-legend-dot" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="map-layout">
        <div id="map-list" className="map-list" aria-label="Nearby services">
          {visibleLocations.length === 0 ? (
            <EmptyCard icon="🗺️" title="No matches" message="Try a different category or clear your search." />
          ) : (
            visibleLocations.map((loc) => {
              const meta = CATEGORY_META[loc.category];
              return (
                <article
                  key={loc.id}
                  className={`map-list-card${loc.id === activeId ? ' is-active' : ''}`}
                  tabIndex={0}
                  onClick={() => selectLocation(loc.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectLocation(loc.id);
                    }
                  }}
                >
                  <div className="map-list-card__top">
                    <span className="map-list-card__dot" style={{ background: meta.hex }} />
                    <div>
                      <h3>{loc.name}</h3>
                      <p className="map-list-card__cat">{meta.label}</p>
                    </div>
                  </div>
                  <p className="map-list-card__desc">{loc.description}</p>
                  <p className="map-list-card__addr">📍 {loc.address}</p>
                </article>
              );
            })
          )}
        </div>

        <div className="map-canvas-wrap">
          <div id="map-canvas" ref={mapNodeRef} className="map-canvas" role="presentation" />
          {status === 'loading' && (
            <p id="map-loading" className="map-loading-state">
              Loading map…
            </p>
          )}

          <div id="map-fallback" className="map-fallback" style={isFallback ? { display: 'block' } : undefined}>
            {isFallback && (
              <>
                <div className="map-fallback-notice">
                  <strong>Live map preview</strong>
                  {MAPS_API_KEY ? (
                    <>The live Google Map couldn&apos;t be loaded (check the API key restrictions and your connection). </>
                  ) : (
                    <>
                      Add a key to <code>VITE_GOOGLE_MAPS_API_KEY</code> in your <code>.env</code> file to load the real
                      Google Map.{' '}
                    </>
                  )}
                  Pins are positioned to scale in the meantime.
                </div>
                {visibleLocations.map((loc) => {
                  const x = ((loc.lng - BOUNDS.minLng) / BOUNDS.lngSpan) * 80 + 10;
                  const y = (1 - (loc.lat - BOUNDS.minLat) / BOUNDS.latSpan) * 80 + 10;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      className="map-fallback-pin"
                      title={loc.name}
                      style={{ left: `${x}%`, top: `${y}%`, background: CATEGORY_META[loc.category].hex }}
                      onClick={() => selectLocation(loc.id)}
                    />
                  );
                })}
              </>
            )}
          </div>

          <div className="map-live-chip">
            <span className="map-live-dot" />
            <span id="map-live-count">{visibleLocations.length}</span> pinned nearby
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Remount the whole view when the query string changes (e.g. following another
 * "?location=" link while already on the map) so deep-link state is re-read.
 */
export default function MapPage() {
  const { search } = useLocation();
  return <MapView key={search} />;
}
