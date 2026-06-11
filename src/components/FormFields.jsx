import { useEffect, useMemo, useRef, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

function handleFieldInput(field, event) {
  if (field.transform === "uppercaseAlphaNumeric") {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }
}

function createInitialFieldValues(fields) {
  return fields.reduce((values, field) => {
    if (field.name) {
      values[field.name] = field.defaultValue ?? "";
    }

    return values;
  }, {});
}

function shouldRenderField(field, fieldValues) {
  if (!field.showWhen) {
    return true;
  }

  const currentValue = fieldValues[field.showWhen.field];
  const expectedValue = field.showWhen.value;

  if (Array.isArray(expectedValue)) {
    return expectedValue.includes(currentValue);
  }

  return currentValue === expectedValue;
}

function renderField(field, setFieldValues, fieldValues, resetKey) {
  if (field.type === "text" || field.type === "date" || field.type === "number") {
    return (
      <div className={field.colClass} key={field.name}>
        <div className="form-floating mb-3">
          <input
            type={field.type}
            className="form-control"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue ?? ""}
            required={field.required ?? false}
            disabled={field.disabled ?? false}
            pattern={field.pattern}
            title={field.title}
            maxLength={field.maxLength}
            inputMode={field.inputMode}
            min={field.min}
            max={field.max}
            step={field.step}
            autoComplete={field.autoComplete}
            onInput={(event) => {
              handleFieldInput(field, event);
              setFieldValues((currentValues) => ({
                ...currentValues,
                [field.name]: event.target.value,
              }));
            }}
            style={field.inputStyle}
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
            name={field.name}
            defaultValue={field.defaultValue ?? ""}
            aria-label={field.label}
            required={field.required ?? false}
            disabled={field.disabled ?? false}
            onChange={(event) =>
              setFieldValues((currentValues) => ({
                ...currentValues,
                [field.name]: event.target.value,
              }))
            }
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
            name={field.name}
            style={{ height: `${field.height ?? 100}px` }}
            defaultValue={field.defaultValue ?? ""}
            required={field.required ?? false}
            disabled={field.disabled ?? false}
          />
          <label htmlFor={field.name}>{field.label}</label>
        </div>
      </div>
    );
  }

  if (field.type === "richtext") {
    const fieldValue = fieldValues[field.name] ?? "";

    return (
      <div className={field.colClass} key={field.name}>
        <div className="mb-3">
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          <input
            type="hidden"
            id={field.name}
            name={field.name}
            value={fieldValue}
            required={field.required ?? false}
            readOnly
          />
          <div className="bg-white">
            <CKEditor
              key={`${field.name}-${resetKey}`}
              editor={ClassicEditor}
              data={fieldValue}
              disabled={field.disabled ?? false}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "undo",
                  "redo",
                ],
                ...field.editorConfig,
              }}
              onChange={(_event, editor) => {
                const nextValue = editor.getData();

                setFieldValues((currentValues) => ({
                  ...currentValues,
                  [field.name]: nextValue,
                }));
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (field.type === "file") {
    const maxFiles = Number(field.maxFiles);

    return (
      <div className={field.colClass} key={field.name}>
        <div>
          <label htmlFor={field.name} className="form-label">
            {field.label}
          </label>
          <input
            className="form-control"
            id={field.name}
            name={field.name}
            type="file"
            accept={field.accept}
            multiple={field.multiple ?? false}
            required={field.required ?? false}
            disabled={field.disabled ?? false}
            onChange={(event) => {
              if (!Number.isFinite(maxFiles) || maxFiles <= 0) {
                return;
              }

              if (event.target.files.length > maxFiles) {
                event.target.value = "";
                event.target.setCustomValidity(`Select maximum ${maxFiles} files.`);
                event.target.reportValidity();
                return;
              }

              event.target.setCustomValidity("");
            }}
          />
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
  const initialFieldValues = useMemo(() => createInitialFieldValues(fields), [fields]);
  const [fieldValues, setFieldValues] = useState(initialFieldValues);
  const [resetKey, setResetKey] = useState(0);
  const anchorRef = useRef(null);

  useEffect(() => {
    const form = anchorRef.current?.closest("form");

    if (!form) {
      return undefined;
    }

    const handleReset = () => {
      window.setTimeout(() => {
        setFieldValues(createInitialFieldValues(fields));
        setResetKey((currentResetKey) => currentResetKey + 1);
      }, 0);
    };

    form.addEventListener("reset", handleReset);

    return () => {
      form.removeEventListener("reset", handleReset);
    };
  }, [fields]);

  return (
    <>
      <span ref={anchorRef} hidden />
      {fields
        .filter((field) => shouldRenderField(field, fieldValues))
        .map((field) => renderField(field, setFieldValues, fieldValues, resetKey))}
    </>
  );
}

export default FormFields;
