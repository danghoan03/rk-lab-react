import { formatCurrencyVN, formatDateVN } from '../../data/mockData';
import { CoinsIcon, EyeIcon } from '../common/Icons';
import { EmptyState } from '../common/StatusView';

const PENALTY_STATUS_BADGE = {
  NONE: {
    label: 'Không phạt',
    className: 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle',
  },
  UNPAID: {
    label: 'Chưa thu',
    className: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
  },
  PARTIAL: {
    label: 'Thu 1 phần',
    className: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  },
  PAID: {
    label: 'Đã thu đủ',
    className: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
};

export default function BorrowTicketsPenaltyTable({
  tickets,
  onCollectClick,
  onViewHistoryClick,
}) {
  if (tickets.length === 0) {
    return <EmptyState message="Không có phiếu mượn nào thuộc trạng thái đã chọn." />;
  }

  return (
    <div className="card lab-card overflow-hidden mb-4">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <span className="fw-semibold">
          Danh sách phiếu mượn &amp; công nợ phạt quá hạn
        </span>
        <span className="badge rounded-pill bg-light text-dark border">
          {tickets.length} phiếu
        </span>
      </div>
      <div className="table-responsive">
        <table className="table lab-table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Người mượn &amp; Tài sản</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th className="text-end">Quá hạn</th>
              <th className="text-end">Đơn giá/ngày</th>
              <th className="text-end">Tổng phạt</th>
              <th className="text-end">Đã thu</th>
              <th className="text-end">Còn nợ</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const badge =
                PENALTY_STATUS_BADGE[ticket.penalty_status] || PENALTY_STATUS_BADGE.NONE;
              const canCollect = ticket.remaining_debt > 0;

              return (
                <tr key={ticket.id}>
                  <td>
                    <span className="lab-code-pill">{ticket.ticket_code}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{ticket.borrower_name}</div>
                    <div className="small text-muted">
                      {ticket.equipment_name} · SL: <strong>{ticket.quantity}</strong>
                    </div>
                  </td>
                  <td>{formatDateVN(ticket.due_date)}</td>
                  <td>
                    {ticket.returned_at ? (
                      formatDateVN(ticket.returned_at)
                    ) : (
                      <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">
                        Đang mượn
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    {ticket.overdue_days > 0 ? (
                      <span className="text-danger fw-semibold">
                        {ticket.overdue_days} ngày
                      </span>
                    ) : (
                      <span className="text-muted">0 ngày</span>
                    )}
                  </td>
                  <td className="text-end text-muted">
                    {formatCurrencyVN(ticket.penalty_rate_per_day)}
                  </td>
                  <td className="text-end fw-semibold text-dark">
                    {formatCurrencyVN(ticket.penalty_amount)}
                  </td>
                  <td className="text-end text-success fw-medium">
                    {formatCurrencyVN(ticket.penalty_paid_amount)}
                  </td>
                  <td
                    className={`text-end fw-bold ${
                      ticket.remaining_debt > 0 ? 'text-danger' : 'text-muted'
                    }`}
                  >
                    {formatCurrencyVN(ticket.remaining_debt)}
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-2 py-1 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <div className="btn-group btn-group-sm" role="group">
                      {canCollect && (
                        <button
                          type="button"
                          className="btn btn-outline-success d-inline-flex align-items-center gap-1"
                          onClick={() => onCollectClick(ticket)}
                        >
                          <CoinsIcon size={14} />
                          <span>Thu phạt</span>
                        </button>
                      )}
                      {ticket.penalty_amount > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
                          onClick={() => onViewHistoryClick(ticket)}
                        >
                          <EyeIcon size={14} />
                          <span>Lịch sử</span>
                        </button>
                      )}
                    </div>
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

