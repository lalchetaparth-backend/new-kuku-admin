import { useEffect, useMemo, useState } from "react";

export const DEFAULT_ROWS_PER_PAGE = 10;

function getTotalPages(totalRows, rowsPerPage) {
  return Math.max(1, Math.ceil(totalRows / rowsPerPage));
}

function usePaginatedRows(rows = [], rowsPerPage = DEFAULT_ROWS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = getTotalPages(rows.length, rowsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;

    return rows.slice(startIndex, startIndex + rowsPerPage);
  }, [rows, rowsPerPage, safeCurrentPage]);

  return {
    currentPage: safeCurrentPage,
    paginatedRows,
    rowsPerPage,
    setCurrentPage,
    totalItems: rows.length,
    totalPages,
  };
}

export default usePaginatedRows;
