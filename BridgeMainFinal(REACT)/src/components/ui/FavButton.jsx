import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

/** ❤️ / 🤍 save button shared by the Rooms and Thrift cards. Local state: each card remembers its own. */
export default function FavButton({ label, savedMessage, removedMessage }) {
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const toggle = () => {
    setSaved((current) => !current);
    showToast(saved ? removedMessage : savedMessage);
  };

  return (
    <button type="button" className="fav-btn" onClick={toggle} aria-label={label} aria-pressed={saved}>
      {saved ? '❤️' : '🤍'}
    </button>
  );
}
