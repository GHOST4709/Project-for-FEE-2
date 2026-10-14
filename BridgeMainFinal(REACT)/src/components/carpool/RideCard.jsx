import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

/**
 * One ride on the board. "Requested" is local state: it only matters to this
 * card, so there's no reason to put it in Redux or Context.
 */
export default function RideCard({ ride, isOwner, onEdit, onDelete }) {
  const [requested, setRequested] = useState(false);
  const { showToast } = useToast();

  const handleRequest = () => {
    if (requested) {
      setRequested(false);
      showToast(`Request to ${ride.driverName} cancelled`);
    } else {
      setRequested(true);
      showToast(`Ride requested with ${ride.driverName}!`);
    }
  };

  return (
    <article className="ride-card">
      <div className="ride-card-header">
        <div className="driver-info">
          <div className={`driver-avatar ${ride.id % 2 === 0 ? 'alt-avatar' : ''}`}>{ride.avatar}</div>
          <div>
            <h3 className="driver-name">{ride.driverName}</h3>
            <p className="driver-meta">
              ⭐ {ride.rating} • {ride.driverDept}
            </p>
          </div>
        </div>
        <span className="vehicle-badge">{ride.vehicle}</span>
      </div>

      <div className="route-timeline">
        <div className="stop-point start">
          <div className="point-dot" />
          <div className="point-details">
            <span className="location-name">{ride.from}</span>
            <span className="location-time">{ride.depTime}</span>
          </div>
        </div>
        <div className="timeline-line" />
        <div className="stop-point end">
          <div className="point-dot" />
          <div className="point-details">
            <span className="location-name">{ride.to}</span>
            <span className="location-time">{ride.arrTime}</span>
          </div>
        </div>
      </div>

      <div className="ride-card-footer">
        <div className="ride-details-row">
          <span className="detail-item">
            💺{' '}
            <strong>
              {ride.seats} seat{ride.seats > 1 ? 's' : ''}
            </strong>{' '}
            left
          </span>
          <span className="detail-item price-tag">
            💵 <strong>{ride.price}</strong>
          </span>
        </div>
        <button type="button" className={`btn btn-primary rsvp-ride-btn${requested ? ' requested' : ''}`} onClick={handleRequest}>
          {requested ? 'Requested ✓' : 'Request Ride →'}
        </button>
      </div>

      {isOwner && (
        <div className="ride-owner-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(ride)}>
            Edit
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(ride)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
