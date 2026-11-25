const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả', activeClass: 'active bg-dark text-white' },
  { key: 'borrowing', label: 'Đang mượn', activeClass: 'active bg-primary text-white' },
  { key: 'overdue', label: 'Quá hạn', activeClass: 'active bg-danger text-white' },
  { key: 'returned', label: 'Đã trả', activeClass: 'active bg-success text-white' },
];

export default function BorrowFilter({ activeFilter, onFilterChange }) {
  return (
    <ul className="nav nav-pills gap-2 mb-3" role="tablist" aria-label="Lọc theo trạng thái">
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <li key={option.key} className="nav-item">
            <button
              type="button"
              className={`nav-link rounded-pill px-3 py-1 fw-medium border ${
                isActive
                  ? `${option.activeClass} border-transparent shadow-sm`
                  : 'bg-white text-secondary border-light-subtle'
              }`}
              aria-pressed={isActive}
              onClick={() => onFilterChange(option.key)}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
