// Seed data for Campus Thrift (copied 1:1 from the original thrift.html).
export const seedThrift = [
  {
    id: 1,
    title: 'Calculus: Early Transcendentals (8th Ed)',
    category: 'Textbooks',
    condition: 'Like New',
    price: 650,
    seller: 'Aarav M.',
    dept: 'Engineering',
    avatar: 'AM',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Electronics',
    condition: 'Like New',
    price: 3200,
    seller: 'Priya S.',
    dept: 'Design',
    avatar: 'PS',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Chemistry Lab Coat (Size M) + Goggles',
    category: 'Lab & Supplies',
    condition: 'Good',
    price: 350,
    seller: 'Rohan K.',
    dept: 'CS Dept',
    avatar: 'RK',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Adjustable LED Desk Lamp with Wireless Charging',
    category: 'Dorm Essentials',
    condition: 'Good',
    price: 890,
    seller: 'Neha P.',
    dept: 'Architecture',
    avatar: 'NP',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=600&q=80',
  },
];

export const DEFAULT_THRIFT_IMAGE =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

export const THRIFT_CATEGORIES = ['Textbooks', 'Electronics', 'Lab & Supplies', 'Dorm Essentials'];
export const THRIFT_CONDITIONS = ['Like New', 'Good', 'Fair'];

export const THRIFT_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...THRIFT_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export const THRIFT_CONDITION_OPTIONS = [
  { value: 'all', label: 'Any Condition' },
  ...THRIFT_CONDITIONS.map((c) => ({ value: c, label: c })),
];

export const THRIFT_SORT_OPTIONS = [
  { value: 'default', label: 'Sort By' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const THRIFT_PILLS = [
  { value: 'Textbooks', label: '📚 Textbooks' },
  { value: 'Electronics', label: '💻 Electronics' },
  { value: 'Lab & Supplies', label: '🥼 Lab Gear' },
  { value: 'Dorm Essentials', label: '🛋️ Dorm Setup' },
];
