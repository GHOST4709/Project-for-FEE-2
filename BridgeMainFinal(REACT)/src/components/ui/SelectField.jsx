/** Reusable labelled <select> (same `.field` block as InputField). `options` is [{ value, label }]. */
export default function SelectField({ id, label, options, error, className, ...selectProps }) {
  const errorId = `${id}-error`;
  const classes = [className, error ? 'is-invalid' : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={classes}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
