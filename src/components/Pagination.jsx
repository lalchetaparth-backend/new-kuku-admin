function Pagination({
  className = "",
  currentPage = 1,
  onPageChange,
  rowsPerPage = 10,
  totalItems = 0,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleClick = (event, nextPage) => {
    event.preventDefault();

    if (nextPage < 1 || nextPage > totalPages || nextPage === safeCurrentPage) {
      return;
    }

    onPageChange?.(nextPage);
  };

  return (
    <nav className={className} aria-label="Table pagination">
      <ul className="pagination">
        <li className={`page-item${safeCurrentPage === 1 ? " disabled" : ""}`}>
          <a
            href="#"
            className="page-link"
            aria-disabled={safeCurrentPage === 1}
            onClick={(event) => handleClick(event, safeCurrentPage - 1)}
          >
            Previous
          </a>
        </li>
        {pages.map((page) => (
          <li
            className={`page-item${page === safeCurrentPage ? " active" : ""}`}
            key={`pagination-page-${page}`}
          >
            <a
              href="#"
              className="page-link"
              aria-current={page === safeCurrentPage ? "page" : undefined}
              onClick={(event) => handleClick(event, page)}
            >
              {page}
            </a>
          </li>
        ))}
        <li className={`page-item${safeCurrentPage === totalPages ? " disabled" : ""}`}>
          <a
            href="#"
            className="page-link"
            aria-disabled={safeCurrentPage === totalPages}
            onClick={(event) => handleClick(event, safeCurrentPage + 1)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
