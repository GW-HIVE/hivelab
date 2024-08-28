import React from "react";

const Paginator = ({ rowsPerPage, totalRows, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  let startPage, endPage;

  if (totalPages <= 3) {
    // Less than 3 total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than 3 total pages so calculate start and end pages
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage + 1 >= totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="paginator-container">
      <ul className="pagination">
        <li className="page-item">
          <button
            onClick={() => paginate(1)}
            className="page-link"
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
        </li>
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link"
            disabled={currentPage === 1}
          >
            &lt;
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link"
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </li>
        <li className="page-item">
          <button
            onClick={() => paginate(totalPages)}
            className="page-link"
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </li>
      </ul>
      <div className="records-info">
        <span>
          Records per page: {rowsPerPage} | Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows} Results
        </span>
      </div>
    </nav>
  );
};

export default Paginator;
