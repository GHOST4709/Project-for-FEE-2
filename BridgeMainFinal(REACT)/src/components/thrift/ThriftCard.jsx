import { useToast } from '../../context/ToastContext';
import FavButton from '../ui/FavButton';

export default function ThriftCard({ item, isOwner, onEdit, onDelete }) {
  const { showToast } = useToast();

  return (
    <article className="thrift-card">
      <div className="thrift-media">
        <img src={item.image} alt={item.title} className="thrift-img" />
        <span className="condition-badge">{item.condition}</span>
        <FavButton label="Bookmark item" savedMessage="Saved to your wishlist!" removedMessage="Removed from wishlist" />
      </div>
      <div className="thrift-content">
        <div className="thrift-meta-row">
          <span className="badge badge-teal">{item.category}</span>
          <span className="thrift-price">₹{item.price.toLocaleString()}</span>
        </div>
        <h3 className="thrift-title">{item.title}</h3>
        <div className="thrift-seller-info">
          <div className="seller-avatar">{item.avatar}</div>
          <span className="seller-name">
            {item.seller} • {item.dept}
          </span>
        </div>
        <div className="thrift-footer-row">
          <button
            type="button"
            className="btn btn-primary btn-full btn-sm"
            onClick={() => showToast(`Contact request sent to ${item.seller}!`)}
          >
            Contact Seller →
          </button>
        </div>
        {isOwner && (
          <div className="owner-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(item)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
