/**
 * Reusable labelled input (the `.field` block used by every form in the app).
 *
 * Works with useForm's getFieldProps():
 *   <InputField id="login-email" label="University Email" type="email" {...form.getFieldProps('email')} />
 *
 * `error` is only passed in once the field has been touched, so it's safe to
 * render whenever it's set. The error text is linked via aria-describedby and
 * announced with role="alert".
 */
export default function InputField({ id, label, error, className, ...inputProps }) {
  const errorId = `${id}-error`;
  const classes = [className, error ? 'is-invalid' : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={classes}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
