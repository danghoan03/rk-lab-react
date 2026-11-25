const FILTER_ITEMS = [
  { key: 'ALL', label: 'Tất cả', activeClass: 'bg-dark text-white' },
  { key: 'UNPAID', label: 'Chưa thu', activeClass: 'bg-danger text-white' },
  { key: 'PARTIAL', label: 'Thu 1 phần', activeClass: 'bg-warning text-dark' },
  { key: 'PAID', label: 'Đã thu đủ', activeClass: 'bg-success text-white' },
];

export default function PenaltyFilter({ activeStatus, counts, onChange }) {
  return (
    <ul
      className="nav nav-pills gap-2 mb-3"
      role="tablist"
      aria-label="Lọc theo trạng thái thu phạt"
    >
      {FILTER_ITEMS.map((item) => {
        const isActive = activeStatus === item.key;
        const count =
          item.key === 'ALL' ? counts?.total_tickets : counts?.counts_by_status?.[item.key];

        return (
          <li key={item.key} className="nav-item">
            <button
              type="button"
              className={`nav-link rounded-pill px-3 py-1 fw-medium border d-inline-flex align-items-center gap-2 ${
                isActive
                  ? `${item.activeClass} border-transparent shadow-sm`
                  : 'bg-white text-secondary border-light-subtle'
              }`}
              aria-pressed={isActive}
              onClick={() => onChange(item.key)}
            >
              <span>{item.label}</span>
              {count !== undefined && (
                <span
                  className={`badge rounded-pill ${
                    isActive
                      ? 'bg-white bg-opacity-25 text-reset'
                      : 'bg-light text-secondary border'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

