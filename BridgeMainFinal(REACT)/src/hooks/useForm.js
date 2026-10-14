import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Controlled-form hook.
 *
 * Validation strategy ("reward early, punish late"):
 *   - Nothing is flagged while the user is still typing in a fresh field.
 *   - A field is validated when it loses focus (blur) -> becomes "touched".
 *   - Once touched, it re-validates on every keystroke so the error clears the
 *     moment it's fixed.
 *   - On submit every field is validated, all are marked touched, and focus
 *     jumps to the first invalid input.
 *
 * `getFieldProps(name)` returns everything a reusable <InputField/> needs:
 *   { name, value, onChange, onBlur, error }
 */
export function useForm({ initialValues, validate = () => ({}), onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  // Derived, never stored: errors are always in sync with the current values.
  const errors = useMemo(() => validate(values), [validate, values]);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((current) => (current[name] ? current : { ...current, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);

      if (Object.keys(errors).length > 0) {
        // Move focus to the first invalid field after React paints the error state.
        requestAnimationFrame(() => {
          formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
        });
        return;
      }

      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [errors, onSubmit, values],
  );

  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: touched[name] ? errors[name] : undefined,
    }),
    [values, touched, errors, handleChange, handleBlur],
  );

  return {
    formRef,
    values,
    errors,
    touched,
    submitting,
    isValid: Object.keys(errors).length === 0,
    setValue,
    setValues,
    reset,
    handleSubmit,
    getFieldProps,
  };
}
