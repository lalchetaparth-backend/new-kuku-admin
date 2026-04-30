import StatusSwitch from "./StatusSwitch";

function renderCellContent(value, row, onAction, onStatusChange) {
  if (Array.isArray(value)) {
    return value.map((item) => (
      <p className="mb-0" key={item}>
        {item}
      </p>
    ));
  }

  if (value?.type === "statusSwitch") {
    return (
      <StatusSwitch
        {...value}
        onChange={(checked) => onStatusChange?.(row, value, checked)}
      />
    );
  }

  if (value?.type === "iconLink") {
    return (
      <a href={value.href} onClick={(event) => event.preventDefault()}>
        <i className={value.iconClass} />
      </a>
    );
  }

  if (value?.type === "action") {
    return (
      <button
        type="button"
        className={value.buttonClass}
        onClick={() => onAction?.(value.action, row)}
      >
        <i className={value.iconClass} />
      </button>
    );
  }

  return value;
}

function DataTable({ columns, rows, onAction, onStatusChange }) {
  return (
    <div className="table-responsive small">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td key={`${row.id ?? rowIndex}-${column.key}`}>
                  {renderCellContent(
                    row[column.key],
                    row,
                    onAction,
                    onStatusChange,
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
