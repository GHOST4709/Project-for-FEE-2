// Campus Map data (copied 1:1 from the original map.html).
// Fictional "Bridge University" campus placed near the real Chandigarh / Mohali
// locations the Carpool page references, so the whole app shares one geography.
export const CAMPUS_CENTER = { lat: 30.72, lng: 76.75 };

export const CATEGORY_META = {
  carpool: { label: 'Carpool', hex: '#0d9488' },
  rooms: { label: 'Rooms & PG', hex: '#d97706' },
  thrift: { label: 'Thrift Exchange', hex: '#be5b6d' },
  fix: { label: 'Tech Fix', hex: '#6d5ba3' },
};

export const campusLocations = [
  { id: 'c1', category: 'carpool', name: 'Sector 17, Chandigarh', description: 'Common carpool pickup point, matches the ride board on the Carpool page.', address: 'Sector 17, Chandigarh', lat: 30.741, lng: 76.7828 },
  { id: 'c2', category: 'carpool', name: 'Mohali Phase 7', description: 'Morning pickup spot for the Mohali route.', address: 'Phase 7, Mohali', lat: 30.7046, lng: 76.7179 },
  { id: 'c3', category: 'carpool', name: 'Zirakpur Square', description: 'Evening drop point, 15 minutes from South Campus.', address: 'Zirakpur Square', lat: 30.6425, lng: 76.8173 },
  { id: 'c4', category: 'carpool', name: 'Campus North Gate Pickup', description: 'On-campus meeting point for rides heading into the city.', address: 'North Gate, Bridge University', lat: 30.7235, lng: 76.751 },

  { id: 'r1', category: 'rooms', name: 'Student Haven PG', description: 'Boys-only PG, double sharing, Wi-Fi and meals included.', address: '1.2 km from North Campus', lat: 30.728, lng: 76.753 },
  { id: 'r2', category: 'rooms', name: 'Elite Scholars Residence', description: 'Co-ed private rooms with gym and laundry.', address: '0.5 km from Main Gate', lat: 30.7175, lng: 76.748 },
  { id: 'r3', category: 'rooms', name: 'Campus View Hostel', description: 'Girls-only hostel, triple sharing, budget-friendly.', address: '2.5 km from South Campus', lat: 30.7, lng: 76.745 },
  { id: 'r4', category: 'rooms', name: 'Budget Rooms Near West Gate', description: 'No-frills sharing rooms, cheapest option within walking distance.', address: 'Near West Gate', lat: 30.7192, lng: 76.742 },

  { id: 't1', category: 'thrift', name: 'Student Center Swap Table', description: 'Drop-off and pickup point for textbook and gear swaps posted on Campus Thrift.', address: 'Student Center, ground floor', lat: 30.7206, lng: 76.7503 },
  { id: 't2', category: 'thrift', name: 'Library Book Exchange Shelf', description: 'Take a book, leave a book — informal exchange shelf by the entrance.', address: 'Central Library entrance', lat: 30.7211, lng: 76.7516 },
  { id: 't3', category: 'thrift', name: 'Hostel Common Room Donation Box', description: 'For lab coats, chargers, and anything else worth a second life.', address: 'Hostel Block, common room', lat: 30.7275, lng: 76.7525 },

  { id: 'f1', category: 'fix', name: 'The Digital Doctor', description: 'Laptop and data recovery specialists, Apple certified.', address: '0.2 miles from North Campus', lat: 30.725, lng: 76.7515 },
  { id: 'f2', category: 'fix', name: 'FixIt Fast', description: 'Phone screen and battery repairs, quick turnaround.', address: '0.5 miles from West Gate', lat: 30.7185, lng: 76.7415 },
  { id: 'f3', category: 'fix', name: 'Campus Tech Hub', description: 'All-devices repair and software help, right in the Student Union.', address: 'On Campus (Student Union)', lat: 30.7205, lng: 76.75 },
];

// Light/dark map styling that matches the site's own theme.
export const MAP_STYLE_LIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#ccfbf1' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fef3c7' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a7d8d1' }] },
];

export const MAP_STYLE_DARK = [
  { elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0f19' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0b0f19' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#134e4a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c2b28' }] },
];
