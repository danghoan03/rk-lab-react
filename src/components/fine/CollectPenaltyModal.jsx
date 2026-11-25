import { useEffect, useState } from 'react';
import { formatCurrencyVN, formatDateVN } from '../../data/mockData';
import { parseApiError } from '../../services/api';
import { CoinsIcon } from '../common/Icons';

export default function CollectPenaltyModal({
  show,
  ticket,
  staffs,
  onClose,
  onSubmit,
}) {
  const [staffId, setStaffId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [note, setNote] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show && ticket) {
      setStaffId(staffs[0]?.id ? String(staffs[0].id) : '');
      setAmountPaid(String(ticket.remaining_debt || 0));
      setPaymentMethod('CASH');
      setNote('');
      setFieldErrors({});
      setFormError('');
      setSubmitting(false);
    }
  }, [show, ticket, staffs]);

  if (!show || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError('');
    setSubmitting(true);

    try {
      await onSubmit(ticket.id, {
        staff_id: staffId,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        note,
      });
      onClose();
    } catch (err) {
      const parsed = parseApiError(err, 'Không thể ghi nhận giao dịch thu tiền phạt.');
      setFormError(parsed.message);
      setFieldErrors(parsed.details || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <form
            className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="modal-header bg-light border-bottom px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="lab-icon-box bg-success-subtle text-success"
                  style={{ width: 34, height: 34 }}
                >
                  <CoinsIcon size={17} />
                </span>
                <h5 className="modal-title fw-semibold mb-0">
                  Ghi nhận thu tiền phạt
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                disabled={submitting}
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4">
              <div className="p-3 rounded-3 bg-light border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="lab-code-pill">{ticket.ticket_code}</span>
                  <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis">
                    Quá hạn {ticket.overdue_days} ngày
                  </span>
                </div>
                <div className="fw-semibold text-dark">{ticket.borrower_name}</div>
                <div className="small text-muted mb-2">
                  {ticket.equipment_name} (SL: {ticket.quantity}) · Hạn trả:{' '}
                  {formatDateVN(ticket.due_date)}
                </div>
                <div className="d-flex justify-content-between small border-top pt-2">
                  <span>
                    Tổng phạt: <strong>{formatCurrencyVN(ticket.penalty_amount)}</strong>
                  </span>
                  <span>
                    Đã thu: <strong className="text-success">{formatCurrencyVN(ticket.penalty_paid_amount)}</strong>
                  </span>
                  <span>
                    Còn nợ: <strong className="text-danger">{formatCurrencyVN(ticket.remaining_debt)}</strong>
                  </span>
                </div>
              </div>

              {formError && (
                <div className="alert alert-danger border-0 py-2" role="alert">
                  {formError}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="ppStaff">
                  Nhân viên thực hiện thu <span className="text-danger">*</span>
                </label>
                <select
                  id="ppStaff"
                  className={`form-select ${fieldErrors.staff_id ? 'is-invalid' : ''}`}
                  value={staffId}
                  onChange={(e) => {
                    setStaffId(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, staff_id: '' }));
                  }}
                >
                  <option value="">Chọn nhân viên...</option>
                  {staffs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.username})
                    </option>
                  ))}
                </select>
                {fieldErrors.staff_id && (
                  <div className="invalid-feedback d-block">{fieldErrors.staff_id}</div>
                )}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="ppAmount">
                    Số tiền thu (đ) <span className="text-danger">*</span>
                  </label>
                  <input
                    id="ppAmount"
                    type="number"
                    min="1"
                    max={ticket.remaining_debt}
                    step="1000"
                    className={`form-control ${fieldErrors.amount_paid ? 'is-invalid' : ''}`}
                    value={amountPaid}
                    onChange={(e) => {
                      setAmountPaid(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, amount_paid: '' }));
                    }}
                  />
                  <div className="d-flex gap-2 mt-1">
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() =>
                        setAmountPaid(String(Math.max(1000, Math.floor(ticket.remaining_debt / 2))))
                      }
                    >
                      Thu 50%
                    </button>
                    <span className="text-muted">·</span>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() => setAmountPaid(String(ticket.remaining_debt))}
                    >
                      Thu đủ ({formatCurrencyVN(ticket.remaining_debt)})
                    </button>
                  </div>
                  {fieldErrors.amount_paid && (
                    <div className="invalid-feedback d-block">{fieldErrors.amount_paid}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="ppMethod">
                    Hình thức giao dịch <span className="text-danger">*</span>
                  </label>
                  <select
                    id="ppMethod"
                    className={`form-select ${fieldErrors.payment_method ? 'is-invalid' : ''}`}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CASH">Tiền mặt (CASH)</option>
                    <option value="BANK_TRANSFER">Chuyển khoản (BANK_TRANSFER)</option>
                  </select>
                  {fieldErrors.payment_method && (
                    <div className="invalid-feedback d-block">
                      {fieldErrors.payment_method}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-1">
                <label className="form-label fw-medium" htmlFor="ppNote">
                  Ghi chú giao dịch
                </label>
                <input
                  id="ppNote"
                  className="form-control"
                  placeholder="Không bắt buộc (VD: Thu đợt 1 tại quầy Lab)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={submitting}
                onClick={onClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-success px-4" disabled={submitting}>
                {submitting ? 'Đang lưu...' : 'Xác nhận thu tiền'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

