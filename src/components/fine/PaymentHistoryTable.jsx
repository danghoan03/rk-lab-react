import { formatCurrencyVN, formatDateVN } from '../../data/mockData';
import { EmptyState } from '../common/StatusView';

const METHOD_BADGE = {
  CASH: {
    label: 'Tiền mặt',
    className: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
  BANK_TRANSFER: {
    label: 'Chuyển khoản',
    className: 'bg-info-subtle text-info-emphasis border border-info-subtle',
  },
};

export default function PaymentHistoryTable({
  payments,
  filteredTicket,
  onClearTicketFilter,
}) {
  return (
    <div className="card lab-card overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">Lịch sử giao dịch thu tiền phạt</span>
          {filteredTicket && (
            <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">
              Phiếu {filteredTicket.ticket_code}
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {filteredTicket && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={onClearTicketFilter}
            >
              Xem tất cả giao dịch
            </button>
          )}
          <span className="badge rounded-pill bg-light text-dark border">
            {payments.length} giao dịch
          </span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="p-3">
          <EmptyState message="Chưa có giao dịch thu tiền phạt nào." />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table lab-table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Mã phiếu</th>
                <th>Người mượn</th>
                <th>Nhân viên thu</th>
                <th className="text-end">Số tiền thu</th>
                <th>Hình thức</th>
                <th>Ghi chú</th>
                <th>Ngày thu</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const method =
                  METHOD_BADGE[payment.payment_method] || METHOD_BADGE.CASH;
                return (
                  <tr key={payment.id}>
                    <td>
                      <span className="lab-code-pill">
                        {`GD-${String(payment.id).padStart(3, '0')}`}
                      </span>
                    </td>
                    <td>
                      <span className="lab-code-pill">{payment.ticket_code}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{payment.borrower_name}</div>
                      <div className="small text-muted">{payment.equipment_name}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{payment.staff_name}</div>
                      <div className="small text-muted">{payment.staff_username}</div>
                    </td>
                    <td className="text-end fw-bold text-success">
                      {formatCurrencyVN(payment.amount_paid)}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-2 py-1 ${method.className}`}>
                        {method.label}
                      </span>
                    </td>
                    <td className="text-muted small">{payment.note || '—'}</td>
                    <td>{formatDateVN(payment.paid_at)}</td>
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

