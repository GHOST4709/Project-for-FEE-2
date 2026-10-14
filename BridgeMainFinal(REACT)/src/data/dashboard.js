// Static content for the Dashboard (copied 1:1 from the original dashboard.html).
export const AROUND_ME = [
  { to: '/map?category=carpool', badge: 'orange', icon: '🚗', title: 'Carpool', meta: '4 nearby • 200m' },
  { to: '/map?category=fix', badge: 'cyan', icon: '🔧', title: 'Tech Fix', meta: '2 nearby • 450m' },
  { to: '/map?category=thrift', badge: 'maroon', icon: '🛍️', title: 'Thrift Exchange', meta: '3 nearby • 300m' },
  { to: '/map?category=rooms', badge: 'peach', icon: '🛏️', title: 'PG / Rooms', meta: '8 listings • 600m' },
];

export const UPCOMING_EVENTS = [
  { day: '24', mon: 'Aug', title: 'AI & ML Hackathon', time: '10:00 AM', place: 'Innovation Lab', featured: true },
  { day: '28', mon: 'Aug', title: 'Cultural Night', time: '6:30 PM', place: 'Main Auditorium' },
  { day: '30', mon: 'Aug', title: 'Frontend Workshop', time: '2:00 PM', place: 'Computer Block' },
];

export const CAMPUS_UPDATES = [
  { icon: '📣', text: 'Hackathon registrations open' },
  { icon: '🗓️', text: 'Mid-semester schedule released' },
  { icon: '👥', text: 'New student club registrations' },
  { icon: '🚌', text: 'Updated campus shuttle timings' },
];
