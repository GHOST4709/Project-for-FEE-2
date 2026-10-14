import { useNavigate } from 'react-router-dom';
import FavButton from '../ui/FavButton';

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <article className="room-card">
      <div className="room-media">
        <img src={room.image} alt={room.title} className="room-img" />
        <span className="room-rating-badge">★ {room.rating}</span>
        <FavButton label="Save Property" savedMessage="Saved to your favorites!" removedMessage="Removed from favorites" />
      </div>
      <div className="room-details">
        <div className="room-header-row">
          <div>
            <h3 className="room-title">{room.title}</h3>
            <p className="room-meta">
              📍 {room.distance} • <strong>{room.gender}</strong>
            </p>
          </div>
          <div className="room-price-wrap">
            <span className="room-price">₹{room.price.toLocaleString()}</span>
            <span className="room-period">/ month</span>
          </div>
        </div>

        <div className="room-tags">
          {room.amenities.map((amenity) => (
            <span key={amenity} className="room-tag">
              {amenity}
            </span>
          ))}
        </div>

        <div className="room-footer-row">
          <span className="badge badge-amber">{room.sharingTag}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/map?location=${room.mapId}`)}>
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
