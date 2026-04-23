function renderField(field) {
  if (field.type === "text" || field.type === "date") {
    return (
      <div className={field.colClass} key={field.name}>
        <div className="form-floating mb-3">
          <input
            type={field.type}
            className="form-control"
            id={field.name}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue ?? ""}
          />
          <label htmlFor={field.name}>{field.label}</label>
        </div>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={field.colClass} key={field.name}>
        <div className="form-floating mb-3">
          <select
            className="form-select"
            id={field.name}
            defaultValue={field.defaultValue ?? ""}
            aria-label={field.label}
          >
            {field.placeholderOption ? (
              <option value="">{field.placeholderOption}</option>
            ) : null}
            {field.options.map((option) => (
              <option key={`${field.name}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor={field.name}>{field.label}</label>
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={field.colClass} key={field.name}>
        <div className="form-floating">
          <textarea
            className="form-control"
            placeholder={field.placeholder}
            id={field.name}
            style={{ height: `${field.height ?? 100}px` }}
            defaultValue={field.defaultValue ?? ""}
          />
          <label htmlFor={field.name}>{field.label}</label>
        </div>
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div className={field.colClass} key={field.name}>
        <div>
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          <input className="form-control" id={field.name} type="file" />
        </div>
        {field.previewSrc ? (
          <img src={field.previewSrc} className="admin-pro-img" alt={field.label} />
        ) : null}
      </div>
    );
  }

  if (field.type === "submit") {
    return (
      <div className={field.colClass} key={field.label}>
        <input type="submit" className={field.inputClassName} value={field.label} />
      </div>
    );
  }

  if (field.type === "sectionLabel") {
    return (
      <div className={field.colClass} key={field.name}>
        <label>{field.label}</label>
      </div>
    );
  }

  if (field.type === "staticText") {
    return (
      <div className={field.colClass} key={field.name}>
        <div className="mb-3">{field.text}</div>
      </div>
    );
  }

  return null;
}

function FormFields({ fields }) {
  return <>{fields.map((field) => renderField(field))}</>;
}

export default FormFields;
