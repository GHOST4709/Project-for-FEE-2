import {
  Car,
  Home,
  UtensilsCrossed,
  PencilRuler,
  Shirt,
  Wrench,
  Wifi,
  Presentation,
  ShieldAlert,
  HeartPulse,
  Search,
} from 'lucide-react';

// Central source of truth for the six map/service categories that power
// the Services directory and the Google Map (per the Plan.MD spec).
// Each entry pairs an id (used everywhere for matching/filtering) with the
// display label, an icon component, and the accent color used on chips/cards.
export const CATEGORIES = [
  { id: 'carpool', label: 'Carpool', icon: Car, accent: 'var(--accent-carpool)' },
  { id: 'pg', label: 'PG & Rooms', icon: Home, accent: 'var(--accent-pg)' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, accent: 'var(--accent-food)' },
  { id: 'stationery', label: 'Stationery', icon: PencilRuler, accent: 'var(--accent-stationery)' },
  { id: 'clothing', label: 'Clothing', icon: Shirt, accent: 'var(--accent-clothing)' },
  { id: 'tech', label: 'Tech Repair', icon: Wrench, accent: 'var(--accent-tech)' },
];

export const getCategory = (id) => CATEGORIES.find((category) => category.id === id);

// A separate taxonomy for the campus grievance/report flow (Report Issue +
// Track & Admin). Kept distinct from CATEGORIES above since a broken
// projector and a missing carpool seat aren't the same kind of "listing".
export const ISSUE_CATEGORIES = [
  { id: 'hostel', label: 'Hostel', icon: Home },
  { id: 'wifi-it', label: 'Wi-Fi & IT', icon: Wifi },
  { id: 'mess-cafe', label: 'Mess & Cafe', icon: UtensilsCrossed },
  { id: 'classrooms', label: 'Classrooms', icon: Presentation },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'safety', label: 'Safety', icon: ShieldAlert },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'lost-found', label: 'Lost & Found', icon: Search },
];

export const getIssueCategory = (id) => ISSUE_CATEGORIES.find((category) => category.id === id);

export const ISSUE_STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
];
