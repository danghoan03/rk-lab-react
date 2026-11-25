import { formatCurrencyVN, formatDateVN } from '../../data/mockData';
import { CheckCircleIcon } from '../common/Icons';
import { EmptyState } from '../common/StatusView';

export default function FineTable({ items, onOpenReturnModal }) {
  if (items.length === 0) {
    return <EmptyState message="Không có phiếu nào phát sinh tiền phạt." />;
  }

  return (
    <div className="card lab-card overflow-hidden mb-4">
      <div className="card-header bg-white border-bottom py-3 fw-semibold">
        Danh sách phiếu phát sinh tiền phạt
      </div>
      <div className="table-responsive">
        <table className="table lab-table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Thiết bị</th>
              <th>Người mượn</th>
              <th className="text-end">SL</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th className="text-end">Tiền phạt</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isOverdue = item.status === 'overdue';
              return (
                <tr key={item.id}>
                  <td>
                    <span className="lab-code-pill">{item.id}</span>
                  </td>
                  <td className="fw-semibold text-dark">{item.equipmentName}</td>
                  <td>{item.borrowerName}</td>
                  <td className="text-end fw-medium">{item.quantity}</td>
                  <td>{formatDateVN(item.dueDate)}</td>
                  <td>{formatDateVN(item.returnDate)}</td>
                  <td className={`text-end fw-semibold ${isOverdue ? 'text-danger' : 'text-dark'}`}>
                    {isOverdue
                      ? `tạm tính ${formatCurrencyVN(item.calculatedFine)}`
                      : formatCurrencyVN(item.finePaid)}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-2 py-1 ${
                        isOverdue
                          ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                          : 'bg-success-subtle text-success-emphasis border border-success-subtle'
                      }`}
                    >
                      {isOverdue ? 'Quá hạn' : 'Đã trả'}
                    </span>
                  </td>
                  <td className="text-end">
                    {isOverdue && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill px-3 d-inline-flex align-items-center gap-1"
                        onClick={() => onOpenReturnModal(item)}
                      >
                        <CheckCircleIcon size={14} />
                        <span>Trả</span>
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
