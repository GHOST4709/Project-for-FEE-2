// Seed data for Rooms & PG (copied 1:1 from the original rooms.html).
export const seedRooms = [
  {
    id: 1,
    mapId: 'r1',
    title: 'Student Haven PG',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    price: 8500,
    distance: '1.2 km from North Campus',
    gender: 'Boys Only',
    sharingTag: 'Double Sharing',
    amenities: ['Wi-Fi', 'Meals', 'AC'],
  },
  {
    id: 2,
    mapId: 'r2',
    title: 'Elite Scholars Residence',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    price: 14000,
    distance: '0.5 km from Main Gate',
    gender: 'Co-ed',
    sharingTag: 'Private Room',
    amenities: ['Wi-Fi', 'Gym', 'Laundry'],
  },
  {
    id: 3,
    mapId: 'r3',
    title: 'Campus View Hostel',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
    rating: 4.2,
    price: 6000,
    distance: '2.5 km from South Campus',
    gender: 'Girls Only',
    sharingTag: 'Triple Sharing',
    amenities: ['Wi-Fi', 'Meals'],
  },
];

// Option lists used by the filter dropdowns / amenity pills.
export const PRICE_OPTIONS = [
  { value: 'all', label: 'Price Range' },
  { value: 'low', label: 'Under ₹8,000' },
  { value: 'mid', label: '₹8,000 - ₹12,000' },
  { value: 'high', label: 'Above ₹12,000' },
];

export const ROOM_TYPE_OPTIONS = [
  { value: 'all', label: 'Room Type' },
  { value: 'Boys Only', label: 'Boys Only' },
  { value: 'Girls Only', label: 'Girls Only' },
  { value: 'Co-ed', label: 'Co-ed' },
];

export const ROOM_SORT_OPTIONS = [
  { value: 'default', label: 'Sort By' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
];

export const AMENITY_PILLS = [
  { value: 'Wi-Fi', label: '📶 Wi-Fi' },
  { value: 'AC', label: '❄️ AC Rooms' },
  { value: 'Meals', label: '🍱 Food Included' },
  { value: 'Laundry', label: '🧺 Laundry' },
];
