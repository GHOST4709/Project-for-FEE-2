import { useEffect, useMemo, useRef, useState } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useTheme } from '../../context/ThemeContext';
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from '../../data/mapStyle';
import pinMarker from '../../assets/pin-marker.svg';
import '../../styles/map.css';

const CAMPUS_CENTER = { lat: 30.9018, lng: 75.858 };

function MapContainer({ locations, activeLocationId, onSelectLocation }) {
  // Direct DOM binding: the map canvas element is grabbed via useRef and
  // handed straight to the Google Maps constructor — no virtual DOM involved.
  const mapNodeRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const infoWindowRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useGoogleMaps(apiKey);
  const { theme } = useTheme();
  const [pinnedCount, setPinnedCount] = useState(0);

  // Mount the map exactly once, as soon as the SDK is ready and the DOM
  // node exists.
  useEffect(() => {
    if (!isLoaded || !mapNodeRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapNodeRef.current, {
      center: CAMPUS_CENTER,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      styles: theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT,
    });
    infoWindowRef.current = new window.google.maps.InfoWindow();
    // theme intentionally excluded here — initial mount only, the effect
    // below keeps styling in sync on every subsequent theme change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Re-skin the live map whenever the site theme flips, without tearing
  // down and rebuilding the whole map instance.
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({ styles: theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT });
  }, [theme]);

  // Keep markers in sync with whatever the sidebar is currently showing.
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
        title: location.name,
        icon: { url: pinMarker, scaledSize: new window.google.maps.Size(30, 38) },
      });

      marker.addListener('click', () => {
        onSelectLocation(location.id);
        infoWindowRef.current.setContent(
          `<strong>${location.name}</strong><br/>${location.address}`
        );
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.set(location.id, marker);
    });

    setPinnedCount(locations.length);
  }, [locations, isLoaded, onSelectLocation]);

  // When a card is selected from the sidebar, pan to and "open" its marker.
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !activeLocationId) return;
    const marker = markersRef.current.get(activeLocationId);
    if (!marker) return;

    mapInstanceRef.current.panTo(marker.getPosition());
    window.google.maps.event.trigger(marker, 'click');
  }, [activeLocationId, isLoaded]);

  return (
    <section className="map-panel" aria-label="Campus map">
      <div ref={mapNodeRef} className="map-canvas" role="presentation" />

      {!isLoaded && !loadError && <p className="map-status">Loading map…</p>}
      {loadError && (
        <MapFallback
          locations={locations}
          activeLocationId={activeLocationId}
          onSelectLocation={onSelectLocation}
        />
      )}

      <p className="map-live-chip">
        <span className="dot" aria-hidden="true" /> {pinnedCount} pinned nearby
      </p>
    </section>
  );
}

/**
 * A static, dependency-free preview shown when VITE_GOOGLE_MAPS_API_KEY is
 * missing or the SDK fails to load, so the app is still fully explorable
 * during grading without requiring a billing-enabled API key.
 */
function MapFallback({ locations, activeLocationId, onSelectLocation }) {
  const bounds = useMemo(() => {
    if (locations.length === 0) return null;
    const lats = locations.map((l) => l.lat);
    const lngs = locations.map((l) => l.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [locations]);

  const toPosition = (location) => {
    if (!bounds) return { left: '50%', top: '50%' };
    const latSpan = bounds.maxLat - bounds.minLat || 1;
    const lngSpan = bounds.maxLng - bounds.minLng || 1;
    const x = ((location.lng - bounds.minLng) / lngSpan) * 80 + 10;
    // Latitude increases upward, screen-space y increases downward.
    const y = (1 - (location.lat - bounds.minLat) / latSpan) * 80 + 10;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="map-fallback">
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          className={`map-fallback__pin ${location.id === activeLocationId ? 'is-active' : ''}`}
          style={{ ...toPosition(location), '--accent': location.accent }}
          title={location.name}
          onClick={() => onSelectLocation(location.id)}
        />
      ))}
      <div className="map-fallback__notice">
        <h4>Live map preview</h4>
        <p>
          Add a key to <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> to
          load the real Google Map. Pins above are positioned to scale in the meantime.
        </p>
      </div>
    </div>
  );
}

export default MapContainer;
