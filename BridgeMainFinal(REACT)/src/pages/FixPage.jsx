import { useState } from 'react';
import { useSelector } from 'react-redux';
import ShopCard from '../components/fix/ShopCard';
import PillButton from '../components/ui/PillButton';
import ResourceState, { isRefreshing } from '../components/ui/ResourceState';
import SearchBar from '../components/ui/SearchBar';
import { EmptyCard } from '../components/ui/StateCards';
import { SHOP_CATEGORIES } from '../data/shops';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useListQuery } from '../hooks/useListQuery';
import { useResourceFetch } from '../hooks/useResourceFetch';
import { fetchShops } from '../store/shopsSlice';

export default function FixPage() {
  useDocumentTitle('Bridge — Express Tech Fix');

  const { items, status, error } = useSelector((state) => state.shops);
  const [reloadKey, setReloadKey] = useState(0);
  const { query, params, setFilter } = useListQuery({ q: '', category: 'all', page: 1 }, { debounceKeys: ['q'] });

  useResourceFetch(fetchShops, params, reloadKey);
  const reload = () => setReloadKey((k) => k + 1);

  return (
    <main className="fix-container">
      <section className="fix-hero-grid">
        <div className="fix-hero-text">
          <p className="section-eyebrow">04 / SUPPORT</p>
          <h1>Fix Your Tech Fast</h1>
          <p className="fix-hero-sub">
            Smashed screen? Dead battery? Software glitch? Don&apos;t panic. Find reliable, student-approved laptop,
            phone, and gadget repair services right near campus. Get back to your studies without the stress.
          </p>

          <SearchBar
            className="fix-search-bar"
            id="fix-search"
            placeholder="Search shop name or service (e.g., screen repair, battery)..."
            value={query.q}
            onChange={(q) => setFilter({ q })}
          >
            <button type="button" className="btn btn-primary btn-sm" onClick={reload}>
              Search
            </button>
          </SearchBar>
        </div>
        <div className="fix-hero-media">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
            alt="Tech Repair Desk"
            className="fix-hero-img"
          />
        </div>
      </section>

      <section className="fix-categories-section">
        <div className="pill-filters" id="category-pills">
          {SHOP_CATEGORIES.map((category) => (
            <PillButton
              key={category.value}
              active={query.category === category.value}
              onClick={() => setFilter({ category: category.value })}
            >
              {category.label}
            </PillButton>
          ))}
        </div>
      </section>

      <section className="fix-shops-section">
        <div id="shops-grid" className={`shops-grid${isRefreshing(status, items.length) ? ' is-refreshing' : ''}`}>
          <ResourceState
            status={status}
            error={error}
            count={items.length}
            onRetry={reload}
            loadingMessage="Finding repair shops…"
            empty={
              <EmptyCard
                icon="🛠️"
                title="No Tech Repair Shops Found"
                message="No repair centers matched your filter. Try adjusting your search query."
                style={{ gridColumn: '1 / -1' }}
              />
            }
          >
            {items.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </ResourceState>
        </div>
      </section>
    </main>
  );
}
