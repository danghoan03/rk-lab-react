export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = 'mục',
  onPageChange,
}) {
  if (totalItems === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3 px-1">
      <span className="text-muted small">
        Hiển thị trang <strong className="text-dark">{currentPage}</strong>/{totalPages} ·{' '}
        <span className="badge text-bg-light border">
          {totalItems} {itemLabel}
        </span>
      </span>
      <nav aria-label="Phân trang">
        <ul className="pagination pagination-sm mb-0 shadow-sm">
          <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Trước
            </button>
          </li>
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? 'active' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
