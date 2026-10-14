import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RideCard from '../components/carpool/RideCard';
import RideForm from '../components/carpool/RideForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import IconInput from '../components/ui/IconInput';
import Pagination from '../components/ui/Pagination';
import ResourceState, { isRefreshing } from '../components/ui/ResourceState';
import { EmptyCard } from '../components/ui/StateCards';
import { TabList, TabPanel } from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useListQuery } from '../hooks/useListQuery';
import { useResourceFetch } from '../hooks/useResourceFetch';
import { createRide, deleteRide, fetchRides, updateRide } from '../store/ridesSlice';

const TABS = [
  { id: 'find', label: 'Find a Ride' },
  { id: 'offer', label: 'Offer a Ride' },
];

export default function CarpoolPage() {
  useDocumentTitle('Bridge — Campus Carpool');

  const dispatch = useDispatch();
  const { items, status, error, page, totalPages, mutation } = useSelector((state) => state.rides);
  const { user } = useAuth();
  const { showToast } = useToast();

  // ---- local UI state ----
  const [tab, setTab] = useState('find');
  const [editingRide, setEditingRide] = useState(null);
  const [rideToDelete, setRideToDelete] = useState(null);
  const [date, setDate] = useState('2026-08-18'); // search-card extras (display only, as before)
  const [time, setTime] = useState('08:30');
  const [reloadKey, setReloadKey] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ---- search + pagination state -> API request ----
  const { query, params, setFilter, setPage, reset } = useListQuery(
    { from: '', to: '', page: 1 },
    { debounceKeys: ['from', 'to'] },
  );
  useResourceFetch(fetchRides, params, reloadKey);
  const reload = () => setReloadKey((key) => key + 1);

  // ---- handlers ----
  const changeTab = (next) => {
    setTab(next);
    if (next === 'find') setEditingRide(null);
  };

  const resetSearch = () => reset();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    reload();
  };

  const startEdit = (ride) => {
    setEditingRide(ride);
    setTab('offer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** Create or update. Returns true on success so the form knows it can clear itself. */
  const handlePublish = async (values) => {
    const body = {
      from: values.pickup.trim(),
      to: values.drop.trim(),
      seats: parseInt(values.seats, 10),
      price: `₹${values.price}`,
      vehicle: values.vehicle === 'Scooter' ? '🛵 Scooter' : `🚗 ${values.vehicle}`,
    };

    try {
      if (editingRide) {
        await dispatch(updateRide({ id: editingRide.id, body })).unwrap();
        showToast('Ride updated successfully!');
        setEditingRide(null);
        setTab('find');
        reload();
      } else {
        await dispatch(
          createRide({
            ...body,
            driverName: user.name,
            driverDept: 'Your Dept',
            rating: '5.0',
            avatar: user.initials,
            depTime: '09:00 AM',
            arrTime: '09:35 AM',
            ownerEmail: user.email,
          }),
        ).unwrap();
        showToast('Ride offer published successfully!');

        // Brief pause (as before) so the toast is seen, then show the full board with the new ride on top.
        timerRef.current = setTimeout(() => {
          setTab('find');
          reset();
          reload();
        }, 1000);
      }
      return true;
    } catch (message) {
      showToast(typeof message === 'string' ? message : 'Could not save the ride. Please try again.');
      return false;
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteRide(rideToDelete.id)).unwrap();
      showToast('Ride deleted');
      reload();
    } catch (message) {
      showToast(typeof message === 'string' ? message : 'Could not delete the ride.');
    } finally {
      setRideToDelete(null);
    }
  };

  const refreshing = isRefreshing(status, items.length);

  return (
    <main className="carpool-container">
      {/* Page Title Header */}
      <section className="carpool-head">
        <p className="section-eyebrow">01 / CAMPUS RIDES</p>
        <h1>Find or Offer a Ride</h1>
        <TabList tabs={TABS} active={tab} onChange={changeTab} idPrefix="tab" />
      </section>

      {/* Find a Ride */}
      <TabPanel id="view-find" active={tab === 'find'}>
        <div className="carpool-search-card">
          <form id="carpool-search-form" className="search-grid" onSubmit={handleSearchSubmit}>
            <IconInput
              id="search-from"
              label="From"
              icon="📍"
              type="text"
              placeholder="e.g. Chandigarh"
              value={query.from}
              onChange={(event) => setFilter({ from: event.target.value })}
            />
            <IconInput
              id="search-to"
              label="To"
              icon="🎓"
              type="text"
              placeholder="e.g. Campus North Gate"
              value={query.to}
              onChange={(event) => setFilter({ to: event.target.value })}
            />
            <IconInput
              id="search-date"
              label="Date"
              icon="📅"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <IconInput
              id="search-time"
              label="Time"
              icon="🕒"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn" aria-label="Search Rides">
              <span>🔍</span>
            </button>
          </form>
        </div>

        <div id="rides-container" className={`rides-grid${refreshing ? ' is-refreshing' : ''}`}>
          <ResourceState
            status={status}
            error={error}
            count={items.length}
            onRetry={reload}
            loadingMessage="Finding rides…"
            empty={
              <EmptyCard
                icon="🚫"
                title="No Rides Available"
                message="No student drivers match your exact search location. Try clearing your filters or offering a ride yourself!"
                actionLabel="Show All Rides"
                onAction={resetSearch}
              />
            }
          >
            {items.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                isOwner={Boolean(ride.ownerEmail) && ride.ownerEmail === user.email}
                onEdit={startEdit}
                onDelete={setRideToDelete}
              />
            ))}
          </ResourceState>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </TabPanel>

      {/* Offer a Ride (also used to edit one of your own rides) */}
      <TabPanel id="view-offer" active={tab === 'offer'}>
        <RideForm
          key={editingRide ? editingRide.id : 'new'}
          ride={editingRide}
          onSubmit={handlePublish}
          onCancel={() => changeTab('find')}
        />
      </TabPanel>

      <ConfirmDialog
        open={Boolean(rideToDelete)}
        title="Delete this ride?"
        message={rideToDelete ? `Your ride from ${rideToDelete.from} to ${rideToDelete.to} will be removed from the board.` : ''}
        busy={mutation === 'loading'}
        onConfirm={confirmDelete}
        onCancel={() => setRideToDelete(null)}
      />
    </main>
  );
}
