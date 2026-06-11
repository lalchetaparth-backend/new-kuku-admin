import { useMemo, useState } from "react";
import ReactDataTable from "react-data-table-component";
import StatusSwitch from "./StatusSwitch";

const defaultCustomStyles = {
  table: {
    style: {
      minWidth: "100%",
      width: "max-content",
    },
  },
  tableWrapper: {
    style: {
      display: "table",
      width: "100%",
    },
  },
  responsiveWrapper: {
    style: {
      overflowX: "auto",
      width: "100%",
    },
  },
  headRow: {
    style: {
      minHeight: "auto",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "#dee2e6",
    },
  },
  headCells: {
    style: {
      padding: "0.4rem 0.5rem",
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#212529",
      whiteSpace: "nowrap",
    },
  },
  rows: {
    style: {
      minHeight: "auto",
      fontSize: "0.875rem",
      "&:not(:last-of-type)": {
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "#dee2e6",
      },
    },
    stripedStyle: {
      backgroundColor: "#f8f9fa",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f8f9fa",
    },
  },
  cells: {
    style: {
      padding: "0.4rem 0.5rem",
      alignItems: "center",
      minWidth: 0,
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      lineHeight: 1.4,
    },
  },
  noData: {
    style: {
      padding: "1rem",
    },
  },
  progress: {
    style: {
      padding: "1rem",
    },
  },
};

function buildClassName(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeObjects(baseValue, overrideValue) {
  if (overrideValue === undefined) {
    return baseValue;
  }

  if (!isPlainObject(baseValue) || !isPlainObject(overrideValue)) {
    return overrideValue;
  }

  const mergedValue = { ...baseValue };

  Object.keys(overrideValue).forEach((key) => {
    mergedValue[key] = mergeObjects(baseValue[key], overrideValue[key]);
  });

  return mergedValue;
}

function renderCellContent(
  value,
  { row, rowIndex, column, onAction, onStatusChange, onDeleteClick },
) {
  if (Array.isArray(value)) {
    return value.map((item, itemIndex) => (
      <p
        className={buildClassName("mb-0", itemIndex > 0 && "mt-1")}
        key={`${column.key ?? column.id ?? column.header}-${row.id ?? rowIndex}-${itemIndex}`}
      >
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

  if (value?.type === "tableImage") {
    return (
      <div className={value.frameClassName ?? "table-image-frame"}>
        <img
          src={value.src}
          alt={value.alt ?? column.header ?? "Table image"}
          className={value.imageClassName ?? "table-image"}
        />
      </div>
    );
  }

  if (value?.type === "iconLink") {
    return (
      <a href={value.href} onClick={(event) => event.preventDefault()}>
        <i className={value.iconClass} />
      </a>
    );
  }

  if (value?.type === "deleteLink") {
    return (
      <button
        type="button"
        className="delete-link"
        onClick={() => onDeleteClick?.(row, value.action)}
      >
        <i className="bi bi-trash" />
        <span>{value.label ?? "Delete"}</span>
      </button>
    );
  }

  if (value?.type === "action") {
    return (
      <button
        type="button"
        className={value.buttonClass}
        onClick={() => {
          if (value.action === "delete") {
            onDeleteClick?.(row, value.action);
            return;
          }

          onAction?.(value.action, row);
        }}
      >
        <i className={value.iconClass} />
      </button>
    );
  }

  return value;
}

function resolveCellValue(column, row, rowIndex) {
  if (typeof column.cell === "function") {
    return column.cell(row, rowIndex);
  }

  if (typeof column.selector === "function") {
    return column.selector(row, rowIndex);
  }

  return row[column.key];
}

function isIndexColumn(column) {
  const resolvedKey = String(column.key ?? column.id ?? "").trim().toLowerCase();
  const resolvedHeader = String(column.header ?? column.name ?? "").trim();

  return resolvedKey === "id" || resolvedHeader === "#";
}

function DataTable({
  columns = [],
  rows = [],
  onAction,
  onStatusChange,
  keyField = "id",
  wrapperClassName,
  className = "app-data-table",
  striped = true,
  responsive = true,
  dense = true,
  customStyles,
  ...tableProps
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (row, action = "delete") => {
    setDeleteConfirm({ row, action });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) {
      return;
    }

    onAction?.(deleteConfirm.action, deleteConfirm.row);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => setDeleteConfirm(null);

  const resolvedColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        id: column.id ?? column.key ?? `${column.header ?? column.name ?? "column"}-${index}`,
        name: column.header ?? column.name,
        width: column.width ?? (isIndexColumn(column) ? "4.5rem" : undefined),
        minWidth: column.minWidth ?? (isIndexColumn(column) ? "4.5rem" : undefined),
        maxWidth: column.maxWidth,
        grow: column.grow ?? (isIndexColumn(column) ? 0 : undefined),
        right: column.right,
        center: column.center,
        compact: column.compact,
        button: column.button,
        ignoreRowClick: column.ignoreRowClick,
        allowOverflow: column.allowOverflow,
        wrap: column.wrap ?? true,
        omit: column.omit,
        sortable: column.sortable,
        reorder: column.reorder,
        hide: column.hide,
        sortFunction: column.sortFunction,
        selector:
          typeof column.sortSelector === "function"
            ? (row) => column.sortSelector(row)
            : column.sortable
              ? (row) =>
                  typeof column.selector === "function"
                    ? column.selector(row)
                    : row[column.key]
              : undefined,
        cell: (row, rowIndex) =>
          renderCellContent(resolveCellValue(column, row, rowIndex), {
            row,
            rowIndex,
            column,
            onAction,
            onStatusChange,
            onDeleteClick: handleDeleteClick,
          }),
      })),
    [columns, onAction, onStatusChange],
  );

  const resolvedCustomStyles = useMemo(
    () => mergeObjects(defaultCustomStyles, customStyles ?? {}),
    [customStyles],
  );

  return (
    <div className={buildClassName("small", wrapperClassName)}>
      <ReactDataTable
        columns={resolvedColumns}
        data={rows}
        keyField={keyField}
        className={className}
        striped={striped}
        responsive={responsive}
        dense={dense}
        customStyles={resolvedCustomStyles}
        {...tableProps}
      />

      {deleteConfirm ? (
        <div className="app-confirm-backdrop" onClick={cancelDelete}>
          <div
            className="app-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete confirmation"
            onClick={(event) => event.stopPropagation()}
          >
            <h5 className="app-confirm-title">Delete item?</h5>
            <p className="app-confirm-text">Are you sure you want to delete this item?</p>
            <div className="app-confirm-actions">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelDelete}>
                No
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DataTable;
