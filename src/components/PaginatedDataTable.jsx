import DataTable from "./DataTable";
import Pagination from "./Pagination";
import usePaginatedRows, { DEFAULT_ROWS_PER_PAGE } from "../hooks/usePaginatedRows";

function PaginatedDataTable({
  rows = [],
  paginationClassName,
  pagination = true,
  rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  ...tableProps
}) {
  const { currentPage, paginatedRows, setCurrentPage, totalItems } = usePaginatedRows(
    rows,
    rowsPerPage,
  );

  return (
    <>
      <DataTable {...tableProps} rows={pagination ? paginatedRows : rows} />
      {pagination ? (
        <Pagination
          className={paginationClassName}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
        />
      ) : null}
    </>
  );
}

export default PaginatedDataTable;
