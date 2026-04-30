import { useId } from "react";

function StatusSwitch({
  current,
  options,
  activeValue,
  disabled = false,
  interactive = false,
  onChange,
  showCurrentOnly = false,
}) {
  const inputId = useId();
  const activeIndex = options.findIndex((option) => option.value === current);
  const currentOption = activeIndex >= 0 ? options[activeIndex] : options[0];
  const badgeOptions = showCurrentOnly && currentOption ? [currentOption] : options;
  const resolvedActiveValue = activeValue ?? options[0]?.value;

  return (
    <div className="form-check form-switch status-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={inputId}
        checked={current === resolvedActiveValue}
        disabled={disabled}
        onChange={interactive ? (event) => onChange?.(event.target.checked) : undefined}
        readOnly={!interactive}
      />
      {badgeOptions.map((option) => (
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
