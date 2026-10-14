import { useState } from 'react';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { useForm } from '../../hooks/useForm';
import { createValidator, differentFrom, integer, minLength, numberBetween, required } from '../../utils/validators';

const VEHICLE_OPTIONS = [
  { value: 'Hatchback', label: 'Car (Hatchback)' },
  { value: 'Sedan', label: 'Car (Sedan/SUV)' },
  { value: 'Scooter', label: 'Scooter / Bike' },
];

const validateRide = createValidator({
  pickup: [required('Pickup location'), minLength(3, 'Pickup location')],
  drop: [
    required('Drop location'),
    minLength(3, 'Drop location'),
    differentFrom('pickup', 'Drop must be different from the pickup'),
  ],
  seats: [required('Seats'), integer('Seats'), numberBetween(1, 6, 'Seats')],
  price: [required('Price'), numberBetween(0, 5000, 'Price')],
  vehicle: [required('Vehicle type')],
});

const NEW_RIDE = { pickup: '', drop: '', seats: '2', price: '40', vehicle: 'Hatchback' };

// An existing ride stores display strings ("₹40", "🚗 Sedan"); turn them back into form values.
const toFormValues = (ride) => ({
  pickup: ride.from,
  drop: ride.to,
  seats: String(ride.seats),
  price: String(ride.price).replace(/[^\d.]/g, ''),
  vehicle: ride.vehicle.replace(/^\S+\s/, ''),
});

/**
 * "Offer a Ride" form. The same component creates a new ride or edits one:
 * pass `ride` to edit. It owns its own form state (local), and reports a valid
 * submission through `onSubmit(values)`, which returns true on success.
 */
export default function RideForm({ ride, onSubmit, onCancel }) {
  const isEditing = Boolean(ride);
  const [initialValues] = useState(() => (ride ? toFormValues(ride) : NEW_RIDE));

  const form = useForm({
    initialValues,
    validate: validateRide,
    onSubmit: async (values) => {
      const ok = await onSubmit(values);
      if (ok && !isEditing) form.reset();
    },
  });

  return (
    <div className="ticket offer-ticket">
      <h2>{isEditing ? 'Edit Your Ride Offer' : 'Post a Ride Offer'}</h2>
      <p className="ticket-sub">Help peers commute while sharing fuel costs</p>
      <form id="offer-ride-form" ref={form.formRef} onSubmit={form.handleSubmit} noValidate>
        <InputField
          id="offer-pickup"
          label="Pickup Location"
          type="text"
          placeholder="e.g. Sector 17, Chandigarh"
          required
          {...form.getFieldProps('pickup')}
        />
        <InputField
          id="offer-drop"
          label="Drop Location"
          type="text"
          placeholder="e.g. Campus North Gate"
          required
          {...form.getFieldProps('drop')}
        />
        <div className="offer-row">
          <InputField
            id="offer-seats"
            label="Available Seats"
            type="number"
            min="1"
            max="6"
            required
            {...form.getFieldProps('seats')}
          />
          <InputField
            id="offer-price"
            label="Price per Seat (₹)"
            type="number"
            min="0"
            required
            {...form.getFieldProps('price')}
          />
        </div>
        <SelectField
          id="offer-vehicle"
          label="Vehicle Type"
          options={VEHICLE_OPTIONS}
          required
          {...form.getFieldProps('vehicle')}
        />
        <button type="submit" className="btn btn-primary btn-full" disabled={form.submitting}>
          {isEditing ? 'Save Changes' : 'Publish Ride Offer'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-ghost btn-full" style={{ marginTop: '10px' }} onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
