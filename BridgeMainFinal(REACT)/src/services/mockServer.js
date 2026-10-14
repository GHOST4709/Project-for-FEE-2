import MockAdapter from 'axios-mock-adapter';
import { seedRides } from '../data/rides';
import { seedRooms } from '../data/rooms';
import { seedThrift } from '../data/thrift';
import { seedShops } from '../data/shops';

/**
 * A tiny in-browser REST API, so the app has real "network" behaviour
 * (latency, query params, pagination, 404s, optional random failures)
 * without needing a backend.
 *
 * It plugs into the shared axios instance as an *adapter*, so interceptors,
 * retries, timeouts and cancellation all behave exactly as they would against
 * a real server. State lives in memory only, so a page reload resets it, just
 * like the original prototype.
 *
 * Endpoints
 *   GET    /rides   ?from&to&page&limit
 *   POST   /rides
 *   PUT    /rides/:id
 *   DELETE /rides/:id
 *   GET    /rooms   ?q&price&gender&amenities&sort&page&limit
 *   GET    /thrift  ?q&category&condition&sort&page&limit
 *   POST/PUT/DELETE /thrift[/:id]
 *   GET    /shops   ?q&category
 */

export const PAGE_SIZE = 6;
const LATENCY_MS = 350;

const clone = (list) => JSON.parse(JSON.stringify(list));
const norm = (value) => String(value ?? '').toLowerCase().trim();

function paginate(list, page, limit) {
  const size = Math.max(1, Number(limit) || PAGE_SIZE);
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * size;
  return { data: list.slice(start, start + size), total, page: current, limit: size, totalPages };
}

function sortBy(list, sort) {
  const sorted = [...list];
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sort === 'rating-desc') sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}

export function setupMockApi(http) {
  const db = {
    rides: clone(seedRides),
    rooms: clone(seedRooms),
    thrift: clone(seedThrift),
    shops: clone(seedShops),
  };

  const failureRate = Number(import.meta.env.VITE_MOCK_FAILURE_RATE) || 0;
  const mock = new MockAdapter(http, { delayResponse: LATENCY_MS });

  // Wrap every handler so we can inject random 503s for demos/testing.
  const handle = (fn) => (config) => {
    if (failureRate > 0 && Math.random() < failureRate) {
      return [503, { message: 'Service temporarily unavailable. Please try again.' }];
    }
    return fn(config);
  };

  const idFromUrl = (url) => Number(url.split('/').pop());
  const body = (config) => (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) || {};

  // ---------- Rides ----------
  mock.onGet('/rides').reply(
    handle(({ params = {} }) => {
      const from = norm(params.from);
      const to = norm(params.to);
      const filtered = db.rides.filter(
        (ride) => (!from || norm(ride.from).includes(from)) && (!to || norm(ride.to).includes(to)),
      );
      return [200, paginate(filtered, params.page, params.limit)];
    }),
  );

  mock.onPost('/rides').reply(
    handle((config) => {
      const payload = body(config);
      if (!payload.from || !payload.to) {
        return [422, { message: 'Pickup and drop locations are required.' }];
      }
      const ride = { ...payload, id: Date.now() };
      db.rides.unshift(ride);
      return [201, ride];
    }),
  );

  mock.onPut(/\/rides\/\d+$/).reply(
    handle((config) => {
      const index = db.rides.findIndex((r) => r.id === idFromUrl(config.url));
      if (index === -1) return [404, { message: 'That ride no longer exists.' }];
      db.rides[index] = { ...db.rides[index], ...body(config), id: db.rides[index].id };
      return [200, db.rides[index]];
    }),
  );

  mock.onDelete(/\/rides\/\d+$/).reply(
    handle((config) => {
      const id = idFromUrl(config.url);
      if (!db.rides.some((r) => r.id === id)) return [404, { message: 'That ride no longer exists.' }];
      db.rides = db.rides.filter((r) => r.id !== id);
      return [200, { id }];
    }),
  );

  // ---------- Rooms (read-only) ----------
  mock.onGet('/rooms').reply(
    handle(({ params = {} }) => {
      const query = norm(params.q);
      const wanted = params.amenities ? String(params.amenities).split(',').filter(Boolean) : [];

      const filtered = db.rooms.filter((room) => {
        const matchesQuery = !query || norm(room.title).includes(query) || norm(room.distance).includes(query);
        const matchesGender = !params.gender || params.gender === 'all' || room.gender === params.gender;

        let matchesPrice = true;
        if (params.price === 'low') matchesPrice = room.price < 8000;
        else if (params.price === 'mid') matchesPrice = room.price >= 8000 && room.price <= 12000;
        else if (params.price === 'high') matchesPrice = room.price > 12000;

        const matchesAmenities = wanted.every((a) => room.amenities.includes(a));
        return matchesQuery && matchesGender && matchesPrice && matchesAmenities;
      });

      return [200, paginate(sortBy(filtered, params.sort), params.page, params.limit)];
    }),
  );

  // ---------- Thrift ----------
  mock.onGet('/thrift').reply(
    handle(({ params = {} }) => {
      const query = norm(params.q);
      const filtered = db.thrift.filter((item) => {
        const matchesQuery = !query || norm(item.title).includes(query) || norm(item.category).includes(query);
        const matchesCat = !params.category || params.category === 'all' || item.category === params.category;
        const matchesCond = !params.condition || params.condition === 'all' || item.condition === params.condition;
        return matchesQuery && matchesCat && matchesCond;
      });
      return [200, paginate(sortBy(filtered, params.sort), params.page, params.limit)];
    }),
  );

  mock.onPost('/thrift').reply(
    handle((config) => {
      const payload = body(config);
      if (!payload.title) return [422, { message: 'An item title is required.' }];
      const item = { ...payload, id: Date.now() };
      db.thrift.unshift(item);
      return [201, item];
    }),
  );

  mock.onPut(/\/thrift\/\d+$/).reply(
    handle((config) => {
      const index = db.thrift.findIndex((i) => i.id === idFromUrl(config.url));
      if (index === -1) return [404, { message: 'That listing no longer exists.' }];
      db.thrift[index] = { ...db.thrift[index], ...body(config), id: db.thrift[index].id };
      return [200, db.thrift[index]];
    }),
  );

  mock.onDelete(/\/thrift\/\d+$/).reply(
    handle((config) => {
      const id = idFromUrl(config.url);
      if (!db.thrift.some((i) => i.id === id)) return [404, { message: 'That listing no longer exists.' }];
      db.thrift = db.thrift.filter((i) => i.id !== id);
      return [200, { id }];
    }),
  );

  // ---------- Tech Fix shops (read-only) ----------
  mock.onGet('/shops').reply(
    handle(({ params = {} }) => {
      const query = norm(params.q);
      const filtered = db.shops.filter((shop) => {
        const matchesQuery =
          !query ||
          norm(shop.name).includes(query) ||
          shop.tags.some((t) => norm(t).includes(query)) ||
          norm(shop.location).includes(query);
        const matchesCat = !params.category || params.category === 'all' || shop.category.includes(params.category);
        return matchesQuery && matchesCat;
      });
      return [200, paginate(filtered, params.page, params.limit)];
    }),
  );

  return mock;
}
