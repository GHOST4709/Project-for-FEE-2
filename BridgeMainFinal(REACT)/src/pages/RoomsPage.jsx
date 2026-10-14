import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import RoomCard from '../components/rooms/RoomCard';
import Dropdown from '../components/ui/Dropdown';
import Pagination from '../components/ui/Pagination';
import PillButton from '../components/ui/PillButton';
import ResourceState, { isRefreshing } from '../components/ui/ResourceState';
import SearchBar from '../components/ui/SearchBar';
import { EmptyCard } from '../components/ui/StateCards';
import { AMENITY_PILLS, PRICE_OPTIONS, ROOM_SORT_OPTIONS, ROOM_TYPE_OPTIONS } from '../data/rooms';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useListQuery } from '../hooks/useListQuery';
import { useResourceFetch } from '../hooks/useResourceFetch';
import { fetchRooms } from '../store/roomsSlice';

const INITIAL_QUERY = { q: '', price: 'all', gender: 'all', sort: 'default', amenities: [], page: 1 };

export default function RoomsPage() {
  useDocumentTitle('Bridge — Rooms & PG');

  const { items, status, error, page, totalPages } = useSelector((state) => state.rooms);
  const [reloadKey, setReloadKey] = useState(0);

  // search + filter + sort + pagination all live in one query object
  const { query, params, setFilter, setPage, reset } = useListQuery(INITIAL_QUERY, { debounceKeys: ['q'] });

  // The API takes amenities as a comma-separated string. Memoised so the request
  // only fires when the query really changes (a new object each render would loop).
  const requestParams = useMemo(() => ({ ...params, amenities: params.amenities.join(',') }), [params]);
  useResourceFetch(fetchRooms, requestParams, reloadKey);

  const toggleAmenity = (amenity) => {
    const next = query.amenities.includes(amenity)
      ? query.amenities.filter((a) => a !== amenity)
      : [...query.amenities, amenity];
    setFilter({ amenities: next });
  };

  const refreshing = isRefreshing(status, items.length);

  return (
    <main className="rooms-container">
      <section className="rooms-head">
        <p className="section-eyebrow">02 / CAMPUS HOUSING</p>
        <h1>Find Your Perfect Space</h1>
        <p className="rooms-sub">Discover top-rated PGs, shared rooms, and private apartments near your campus.</p>
      </section>

      <div className="rooms-filter-section">
        <div className="rooms-search-card">
          <SearchBar
            className="rooms-search-bar"
            id="housing-search"
            placeholder="Search by location or name..."
            value={query.q}
            onChange={(q) => setFilter({ q })}
          />
          <div className="filter-dropdowns">
            <Dropdown
              id="filter-price"
              ariaLabel="Price range"
              value={query.price}
              options={PRICE_OPTIONS}
              onChange={(price) => setFilter({ price })}
            />
            <Dropdown
              id="filter-type"
              ariaLabel="Room type"
              value={query.gender}
              options={ROOM_TYPE_OPTIONS}
              onChange={(gender) => setFilter({ gender })}
            />
            <Dropdown
              id="sort-rooms"
              ariaLabel="Sort rooms"
              value={query.sort}
              options={ROOM_SORT_OPTIONS}
              onChange={(sort) => setFilter({ sort })}
            />
          </div>
        </div>

        <div className="pill-filters">
          {AMENITY_PILLS.map((pill) => (
            <PillButton key={pill.value} active={query.amenities.includes(pill.value)} onClick={() => toggleAmenity(pill.value)}>
              {pill.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div id="rooms-list-container" className={`rooms-list${refreshing ? ' is-refreshing' : ''}`}>
        <ResourceState
          status={status}
          error={error}
          count={items.length}
          onRetry={() => setReloadKey((k) => k + 1)}
          loadingMessage="Finding rooms…"
          empty={
            <EmptyCard
              icon="🏠"
              title="No Properties Found"
              message="No listings match your current filters. Try resetting your search terms."
              actionLabel="Reset Filters"
              onAction={reset}
            />
          }
        >
          {items.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </ResourceState>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
