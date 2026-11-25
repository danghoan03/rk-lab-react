import { formatDateVN } from '../../data/mockData';
import { CheckCircleIcon } from '../common/Icons';
import { EmptyState } from '../common/StatusView';

const STATUS_BADGE = {
  overdue: {
    label: 'Quá hạn',
    className: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
  },
  borrowing: {
    label: 'Đang mượn',
    className: 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
  },
  returned: {
    label: 'Đã trả',
    className: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
};

export default function BorrowTable({ borrows, returningId, onReturn }) {
  if (borrows.length === 0) {
    return <EmptyState message="Chưa có phiếu mượn nào ở trạng thái này." />;
  }

  return (
    <div className="card lab-card overflow-hidden">
      <div className="table-responsive">
        <table className="table lab-table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Thiết bị</th>
              <th>Người mượn</th>
              <th className="text-end">SL</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((item) => {
              const badge = STATUS_BADGE[item.status] || STATUS_BADGE.borrowing;
              const codeLabel = item.code_label || item.id;
              const equipmentName = item.equipment_name || item.equipmentName;
              const borrowerName = item.borrower_name || item.borrowerName;
              const borrowDate = item.borrowed_at || item.borrowDate;
              const dueDate = item.due_date || item.dueDate;
              const returnDate = item.returned_at ?? item.returnDate;
              const isReturning = returningId === item.id;

              return (
                <tr key={item.id}>
                  <td>
                    <span className="lab-code-pill">{codeLabel}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{equipmentName}</div>
                    {item.note && (
                      <div className="text-muted small">{item.note}</div>
                    )}
                  </td>
                  <td className="fw-medium">{borrowerName}</td>
                  <td className="text-end fw-medium">{item.quantity}</td>
                  <td>{formatDateVN(borrowDate)}</td>
                  <td>{formatDateVN(dueDate)}</td>
                  <td>{formatDateVN(returnDate)}</td>
                  <td>
                    <span className={`badge rounded-pill px-2 py-1 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="text-end">
                    {item.status !== 'returned' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill px-3 d-inline-flex align-items-center gap-1"
                        disabled={isReturning}
                        onClick={() => onReturn(item.id)}
                      >
                        <CheckCircleIcon size={14} />
                        <span>{isReturning ? 'Đang trả...' : 'Trả'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
