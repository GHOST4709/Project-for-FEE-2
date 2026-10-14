import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThriftCard from '../components/thrift/ThriftCard';
import ThriftForm from '../components/thrift/ThriftForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Dropdown from '../components/ui/Dropdown';
import PillButton from '../components/ui/PillButton';
import ResourceState, { isRefreshing } from '../components/ui/ResourceState';
import SearchBar from '../components/ui/SearchBar';
import { EmptyCard } from '../components/ui/StateCards';
import { TabList, TabPanel } from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  DEFAULT_THRIFT_IMAGE,
  THRIFT_CATEGORY_OPTIONS,
  THRIFT_CONDITION_OPTIONS,
  THRIFT_PILLS,
  THRIFT_SORT_OPTIONS,
} from '../data/thrift';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useListQuery } from '../hooks/useListQuery';
import { useResourceFetch } from '../hooks/useResourceFetch';
import { createThriftItem, deleteThriftItem, fetchThrift, updateThriftItem } from '../store/thriftSlice';

const TABS = [
  { id: 'browse', label: 'Browse Items' },
  { id: 'sell', label: 'Post an Item' },
];

const INITIAL_QUERY = { q: '', category: 'all', condition: 'all', sort: 'default', page: 1 };

export default function ThriftPage() {
  useDocumentTitle('Bridge — Campus Thrift');

  const dispatch = useDispatch();
  const { items, status, error, page, totalPages, mutation } = useSelector((state) => state.thrift);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState('browse');
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const { query, params, setFilter, setPage, reset } = useListQuery(INITIAL_QUERY, { debounceKeys: ['q'] });
  useResourceFetch(fetchThrift, params, reloadKey);
  const reload = () => setReloadKey((k) => k + 1);

  // ---- infinite scroll: the sentinel below the grid loads the next page when it becomes visible ----
  const hasMore = page < totalPages;
  const isLoading = status === 'loading';
  const sentinelRef = useInfiniteScroll(() => setPage(page + 1), { enabled: hasMore && !isLoading && tab === 'browse' });

  // A category pill is just a shortcut for the category dropdown (clicking it again clears it).
  const togglePill = (category) => setFilter({ category: query.category === category ? 'all' : category });

  const changeTab = (next) => {
    setTab(next);
    if (next === 'browse') setEditingItem(null);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setTab('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = async (values) => {
    const body = {
      title: values.title.trim(),
      category: values.category,
      condition: values.condition,
      price: parseInt(values.price, 10),
      image: values.image.trim() !== '' ? values.image.trim() : DEFAULT_THRIFT_IMAGE,
    };

    try {
      if (editingItem) {
        await dispatch(updateThriftItem({ id: editingItem.id, body })).unwrap();
        showToast('Listing updated!');
        setEditingItem(null);
        setTab('browse');
        reload();
      } else {
        await dispatch(
          createThriftItem({
            ...body,
            seller: user.name,
            dept: 'Student',
            avatar: user.initials,
            ownerEmail: user.email,
          }),
        ).unwrap();
        showToast('Item listed on Campus Thrift!');

        timerRef.current = setTimeout(() => {
          setTab('browse');
          reset();
          reload();
        }, 1000);
      }
      return true;
    } catch (message) {
      showToast(typeof message === 'string' ? message : 'Could not save the listing. Please try again.');
      return false;
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteThriftItem(itemToDelete.id)).unwrap();
      showToast('Listing deleted');
      reload();
    } catch (message) {
      showToast(typeof message === 'string' ? message : 'Could not delete the listing.');
    } finally {
      setItemToDelete(null);
    }
  };

  const refreshing = isRefreshing(status, items.length) && page === 1;

  return (
    <main className="thrift-container">
      <section className="thrift-head">
        <p className="section-eyebrow">03 / CAMPUS MARKETPLACE</p>
        <h1>Campus Thrift &amp; Trade</h1>
        <p className="thrift-sub">
          Buy, sell, or swap textbooks, tech, lab gear, and dorm essentials directly with peers.
        </p>
        <TabList tabs={TABS} active={tab} onChange={changeTab} idPrefix="tab" />
      </section>

      {/* Browse */}
      <TabPanel id="view-browse" active={tab === 'browse'}>
        <div className="rooms-filter-section">
          <div className="rooms-search-card">
            <SearchBar
              className="rooms-search-bar"
              id="thrift-search"
              placeholder="Search textbooks, laptops, dorm gear..."
              value={query.q}
              onChange={(q) => setFilter({ q })}
            />
            <div className="filter-dropdowns">
              <Dropdown
                id="filter-category"
                ariaLabel="Category"
                value={query.category}
                options={THRIFT_CATEGORY_OPTIONS}
                onChange={(category) => setFilter({ category })}
              />
              <Dropdown
                id="filter-condition"
                ariaLabel="Condition"
                value={query.condition}
                options={THRIFT_CONDITION_OPTIONS}
                onChange={(condition) => setFilter({ condition })}
              />
              <Dropdown
                id="sort-thrift"
                ariaLabel="Sort items"
                value={query.sort}
                options={THRIFT_SORT_OPTIONS}
                onChange={(sort) => setFilter({ sort })}
              />
            </div>
          </div>

          <div className="pill-filters">
            {THRIFT_PILLS.map((pill) => (
              <PillButton key={pill.value} active={query.category === pill.value} onClick={() => togglePill(pill.value)}>
                {pill.label}
              </PillButton>
            ))}
          </div>
        </div>

        <div id="thrift-grid-container" className={`thrift-grid${refreshing ? ' is-refreshing' : ''}`}>
          <ResourceState
            status={status}
            error={error}
            count={items.length}
            onRetry={reload}
            loadingMessage="Loading marketplace…"
            empty={
              <EmptyCard
                icon="📦"
                title="No Marketplace Items Found"
                message="No listings match your search keywords or filters. Try adjusting your query or list your own item!"
                actionLabel="Reset Filters"
                onAction={reset}
              />
            }
          >
            {items.map((item) => (
              <ThriftCard
                key={item.id}
                item={item}
                isOwner={Boolean(item.ownerEmail) && item.ownerEmail === user.email}
                onEdit={startEdit}
                onDelete={setItemToDelete}
              />
            ))}
          </ResourceState>
        </div>

        {/* Invisible trigger for infinite scroll (only rendered when there is another page). */}
        {hasMore && <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />}
        {hasMore && isLoading && <p className="load-more-note">Loading more…</p>}
      </TabPanel>

      {/* Sell / edit */}
      <TabPanel id="view-sell" active={tab === 'sell'}>
        <ThriftForm
          key={editingItem ? editingItem.id : 'new'}
          item={editingItem}
          onSubmit={handlePublish}
          onCancel={() => changeTab('browse')}
        />
      </TabPanel>

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Delete this listing?"
        message={itemToDelete ? `"${itemToDelete.title}" will be removed from Campus Thrift.` : ''}
        busy={mutation === 'loading'}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </main>
  );
}
