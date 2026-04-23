import { useId } from "react";

function StatusSwitch({ current, options }) {
  const inputId = useId();
  const activeIndex = options.findIndex((option) => option.value === current);

  return (
    <div className="form-check form-switch status-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={inputId}
        checked={activeIndex > 0}
        readOnly
      />
      {options.map((option) => (
        <label
          key={`${inputId}-${option.value}`}
          className={`form-check-label badge ${option.badgeClass}`}
          htmlFor={inputId}
        >
          {option.label}
        </label>
      ))}
    </div>
  );
}

export default StatusSwitch;
