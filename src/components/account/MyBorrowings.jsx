import { formatDateVN } from '../../data/mockData';

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

export default function MyBorrowings({ borrows }) {
  return (
    <div className="card lab-card overflow-hidden mb-4">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <span className="fw-semibold">Lịch sử mượn của tôi</span>
        <span className="badge rounded-pill bg-light text-dark border">
          {borrows.length} phiếu
        </span>
      </div>
      {borrows.length === 0 ? (
        <div className="card-body text-center text-muted py-5">
          Bạn chưa có phiếu mượn nào.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table lab-table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Thiết bị</th>
                <th className="text-end">SL</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((item) => {
                const badge = STATUS_BADGE[item.status] || STATUS_BADGE.borrowing;
                return (
                  <tr key={item.id}>
                    <td>
                      <span className="lab-code-pill">{item.id}</span>
                    </td>
                    <td className="fw-semibold text-dark">{item.equipmentName}</td>
                    <td className="text-end fw-medium">{item.quantity}</td>
                    <td>{formatDateVN(item.borrowDate)}</td>
                    <td>{formatDateVN(item.dueDate)}</td>
                    <td>
                      <span className={`badge rounded-pill px-2 py-1 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
