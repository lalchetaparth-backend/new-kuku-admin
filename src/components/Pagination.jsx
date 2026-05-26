function Pagination({ className = "" }) {
  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <nav className={className} aria-label="...">
      <ul className="pagination">
        <li className="page-item">
          <a href="#" className="page-link" onClick={handleClick}>
            Previous
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link" onClick={handleClick}>
            1
          </a>
        </li>
        <li className="page-item active">
          <a href="#" className="page-link" aria-current="page" onClick={handleClick}>
            2
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link" onClick={handleClick}>
            3
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link" onClick={handleClick}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
