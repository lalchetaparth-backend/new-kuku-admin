import { useMemo } from "react";
import ReactDataTable from "react-data-table-component";
import StatusSwitch from "./StatusSwitch";

const defaultCustomStyles = {
  table: {
    style: {
      minWidth: "100%",
    },
  },
  tableWrapper: {
    style: {
      display: "block",
      width: "100%",
    },
  },
  responsiveWrapper: {
    style: {
      overflowX: "auto",
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
  { row, rowIndex, column, onAction, onStatusChange },
) {
  if (Array.isArray(value)) {
    return value.map((item, itemIndex) => (
      <p
        className="mb-0"
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
    </div>
  );
}

export default DataTable;
