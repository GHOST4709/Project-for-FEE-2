// Seed data for Tech Fix (copied 1:1 from the original fix.html).
export const seedShops = [
  {
    id: 1,
    mapId: 'f1',
    name: 'The Digital Doctor',
    rating: '4.9',
    openNow: true,
    location: '0.2 miles from North Campus',
    category: ['Laptop Repair', 'Software & Recovery'],
    tags: ['Laptops', 'Data Recovery', 'Apple Certified'],
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    mapId: 'f2',
    name: 'FixIt Fast',
    rating: '4.7',
    openNow: false,
    location: '0.5 miles from West Gate',
    category: ['Phone Repair'],
    tags: ['Phones', 'Screen Repair', 'Batteries'],
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    mapId: 'f3',
    name: 'Campus Tech Hub',
    rating: '4.8',
    openNow: true,
    location: 'On Campus (Student Union)',
    category: ['Laptop Repair', 'Phone Repair', 'Accessories', 'Software & Recovery'],
    tags: ['All Devices', 'Software Help', 'Accessories'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
  },
];

export const SHOP_CATEGORIES = [
  { value: 'all', label: 'All Shops' },
  { value: 'Laptop Repair', label: 'Laptop Repair' },
  { value: 'Phone Repair', label: 'Phone Repair' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Software & Recovery', label: 'Software & Recovery' },
];
