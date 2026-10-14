import { useState } from 'react';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { THRIFT_CATEGORIES, THRIFT_CONDITIONS } from '../../data/thrift';
import { useForm } from '../../hooks/useForm';
import { createValidator, minLength, numberBetween, required, url } from '../../utils/validators';

const toOptions = (values) => values.map((v) => ({ value: v, label: v }));

const validateItem = createValidator({
  title: [required('Item title'), minLength(3, 'Item title')],
  category: [required('Category')],
  condition: [required('Condition')],
  price: [required('Price'), numberBetween(0, 1000000, 'Price')],
  image: [url()], // optional, but must be a real link when provided
});

const NEW_ITEM = { title: '', category: 'Textbooks', condition: 'Like New', price: '', image: '' };

/** "List an Item" form. Pass `item` to edit an existing listing instead of creating one. */
export default function ThriftForm({ item, onSubmit, onCancel }) {
  const isEditing = Boolean(item);
  const [initialValues] = useState(() =>
    item
      ? { title: item.title, category: item.category, condition: item.condition, price: String(item.price), image: item.image }
      : NEW_ITEM,
  );

  const form = useForm({
    initialValues,
    validate: validateItem,
    onSubmit: async (values) => {
      const ok = await onSubmit(values);
      if (ok && !isEditing) form.reset();
    },
  });

  return (
    <div className="ticket offer-ticket">
      <h2>{isEditing ? 'Edit Your Listing' : 'List an Item for Sale'}</h2>
      <p className="ticket-sub">Pass along unused books, gear, or electronics to students on campus.</p>
      <form id="sell-item-form" ref={form.formRef} onSubmit={form.handleSubmit} noValidate>
        <InputField
          id="item-title"
          label="Item Title"
          type="text"
          placeholder="e.g. Calculus 8th Edition - Stewart"
          required
          {...form.getFieldProps('title')}
        />
        <div className="offer-row">
          <SelectField
            id="item-category"
            label="Category"
            options={toOptions(THRIFT_CATEGORIES)}
            required
            {...form.getFieldProps('category')}
          />
          <SelectField
            id="item-condition"
            label="Condition"
            options={toOptions(THRIFT_CONDITIONS)}
            required
            {...form.getFieldProps('condition')}
          />
        </div>
        <div className="offer-row">
          <InputField
            id="item-price"
            label="Price (₹)"
            type="number"
            min="0"
            placeholder="e.g. 500"
            required
            {...form.getFieldProps('price')}
          />
          <InputField
            id="item-image"
            label="Image URL (Optional)"
            type="url"
            placeholder="https://..."
            {...form.getFieldProps('image')}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={form.submitting}>
          {isEditing ? 'Save Changes' : 'Publish Listing'}
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
