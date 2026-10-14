import { useNavigate } from 'react-router-dom';

export default function ShopCard({ shop }) {
  const navigate = useNavigate();

  return (
    <article className="shop-card">
      <div className="shop-media">
        <img src={shop.image} alt={shop.name} />
        <span className={`status-pill ${shop.openNow ? 'status-open' : 'status-closed'}`}>
          <span className="status-dot" />
          {shop.openNow ? 'Open Now' : 'Closed'}
        </span>
        <span className="rating-badge">★ {shop.rating}</span>
      </div>
      <div className="shop-content">
        <h3 className="shop-name">{shop.name}</h3>
        <p className="shop-location">📍 {shop.location}</p>
        <div className="shop-tags">
          {shop.tags.map((tag) => (
            <span key={tag} className="badge badge-teal">
              {tag}
            </span>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-full btn-sm" onClick={() => navigate(`/map?location=${shop.mapId}`)}>
          View Details
        </button>
      </div>
    </article>
  );
}
