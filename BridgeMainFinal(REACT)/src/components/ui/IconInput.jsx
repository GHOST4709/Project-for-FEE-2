/** Input with a leading emoji icon, as used in the Carpool search card (`.field-group`). */
export default function IconInput({ id, label, icon, ...inputProps }) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-icon">
        <span className="icon">{icon}</span>
        <input id={id} {...inputProps} />
      </div>
    </div>
  );
}
