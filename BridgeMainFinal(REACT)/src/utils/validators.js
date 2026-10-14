/**
 * Composable validation rules.
 *
 * A rule is `(value, allValues) => string | undefined` (a message means "invalid").
 * `createValidator({ field: [rule, rule, ...] })` builds a single `validate(values)`
 * function that returns `{ field: firstErrorMessage }` for every invalid field.
 *
 * Rules run in order and stop at the first failure per field, so each input
 * shows one clear message at a time.
 */
const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

export const required = (label = 'This field') => (value) =>
  isBlank(value) ? `${label} is required` : undefined;

export const minLength = (min, label = 'This field') => (value) =>
  !isBlank(value) && String(value).trim().length < min ? `${label} must be at least ${min} characters` : undefined;

export const email = () => (value) =>
  !isBlank(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
    ? 'Enter a valid email address'
    : undefined;

export const url = () => (value) => {
  if (isBlank(value)) return undefined; // optional unless combined with required()
  try {
    const parsed = new URL(String(value).trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? undefined : 'Enter a valid http(s) link';
  } catch {
    return 'Enter a valid link, e.g. https://…';
  }
};

export const numberBetween = (min, max, label = 'Value') => (value) => {
  if (isBlank(value)) return undefined;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label} must be a number`;
  if (min !== undefined && n < min) return `${label} must be at least ${min}`;
  if (max !== undefined && n > max) return `${label} must be at most ${max}`;
  return undefined;
};

/** Cross-field rule, e.g. "pickup and drop can't be the same". */
export const differentFrom = (otherField, message) => (value, all) =>
  !isBlank(value) && String(value).trim().toLowerCase() === String(all[otherField] ?? '').trim().toLowerCase()
    ? message
    : undefined;

export function createValidator(schema) {
  return (values) => {
    const errors = {};
    Object.entries(schema).forEach(([field, rules]) => {
      for (const rule of rules) {
        const message = rule(values[field], values);
        if (message) {
          errors[field] = message;
          break;
        }
      }
    });
    return errors;
  };
}

export const integer = (label = 'Value') => (value) =>
  !isBlank(value) && !Number.isInteger(Number(value)) ? `${label} must be a whole number` : undefined;
