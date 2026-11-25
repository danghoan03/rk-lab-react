import { formatCurrencyVN } from '../../data/mockData';
import { AlertIcon, CheckCircleIcon, ClockIcon, CoinsIcon } from '../common/Icons';

export default function PenaltyStatsCards({ summary }) {
  if (!summary) return null;

  const recoveryRate =
    summary.total_penalty_amount > 0
      ? Math.round((summary.total_paid_amount / summary.total_penalty_amount) * 100)
      : 0;

  return (
    <div className="row g-3 mb-4">
      <div className="col-sm-6 col-xl-3">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-primary">
          <div className="card-body d-flex justify-content-between align-items-center gap-2">
            <div>
              <div className="text-muted small fw-medium">Tổng tiền phạt phát sinh</div>
              <div className="fs-4 fw-bold text-dark">
                {formatCurrencyVN(summary.total_penalty_amount)}
              </div>
              <div className="small text-muted">
                {summary.overdue_tickets_count} phiếu quá hạn / {summary.total_tickets} phiếu
              </div>
            </div>
            <span className="lab-icon-box bg-primary-subtle text-primary">
              <CoinsIcon size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-3">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-success">
          <div className="card-body d-flex justify-content-between align-items-center gap-2">
            <div>
              <div className="text-muted small fw-medium">Tổng tiền phạt đã thu</div>
              <div className="fs-4 fw-bold text-success">
                {formatCurrencyVN(summary.total_paid_amount)}
              </div>
              <div className="small text-muted">
                Tiền mặt: {formatCurrencyVN(summary.cash_total)} · CK:{' '}
                {formatCurrencyVN(summary.bank_transfer_total)}
              </div>
            </div>
            <span className="lab-icon-box bg-success-subtle text-success">
              <CheckCircleIcon size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-3">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-danger">
          <div className="card-body d-flex justify-content-between align-items-center gap-2">
            <div>
              <div className="text-muted small fw-medium">Công nợ phạt còn lại</div>
              <div className="fs-4 fw-bold text-danger">
                {formatCurrencyVN(summary.total_debt_amount)}
              </div>
              <div className="small text-muted">
                Chưa thu: {summary.counts_by_status?.UNPAID || 0} · Thu 1 phần:{' '}
                {summary.counts_by_status?.PARTIAL || 0}
              </div>
            </div>
            <span className="lab-icon-box bg-danger-subtle text-danger">
              <AlertIcon size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-3">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-info">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="text-muted small fw-medium">Tỷ lệ thu hồi phạt</div>
                <div className="fs-4 fw-bold text-info-emphasis">{recoveryRate}%</div>
              </div>
              <span className="lab-icon-box bg-info-subtle text-info-emphasis">
                <ClockIcon size={20} />
              </span>
            </div>
            <div className="progress rounded-pill" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-info rounded-pill"
                style={{ width: `${recoveryRate}%` }}
              />
            </div>
            <div className="small text-muted mt-1">
              {summary.payments_count} giao dịch · Đã thu đủ:{' '}
              {summary.counts_by_status?.PAID || 0} phiếu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

