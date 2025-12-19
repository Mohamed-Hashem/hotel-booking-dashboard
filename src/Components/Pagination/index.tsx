import { memo, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo<PaginationProps>(
  ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const goFirst = useCallback(() => onPageChange(1), [onPageChange]);
    const goPrev = useCallback(
      () => onPageChange(currentPage - 1),
      [onPageChange, currentPage]
    );
    const goNext = useCallback(
      () => onPageChange(currentPage + 1),
      [onPageChange, currentPage]
    );
    const goLast = useCallback(
      () => onPageChange(totalPages),
      [onPageChange, totalPages]
    );

    return (
      <nav className="pagination" aria-label="Results pagination">
        <div className="pagination-info">
          Showing {startItem}-{endItem} of {totalItems} hotels
        </div>
        <div className="pagination-controls">
          <button
            onClick={goFirst}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            ««
          </button>
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="page-indicator" aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
          <button
            onClick={goLast}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »»
          </button>
        </div>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
