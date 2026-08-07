// A muted, warm map theme so the Google Map reads as part of the Bridge
// brand instead of the default blue-and-grey Google styling.
export const MAP_STYLE_LIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#efe7d6' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5b5749' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f6f2ea' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#cabf9f' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f6f2ea' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#e3e9e2' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dde8e2' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e1d8c3' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8571' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#efd9cc' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#e1d8c3' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c7d6ce' }],
  },
];

// Dark-mode counterpart, swapped in by MapContainer when the site theme
// is 'dark' so the live map doesn't glow like a cream rectangle at night.
export const MAP_STYLE_DARK = [
  { elementType: 'geometry', stylers: [{ color: '#16211c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a8b3a9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#16211c' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#33463b' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#1b2a23' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#213127' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1e3b2f' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#243329' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#33463b' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93927f' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3d4f43' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2b3a32' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f1a16' }],
  },
];
